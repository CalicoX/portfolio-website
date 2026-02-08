// Cloudflare Worker - Notion API Proxy for Blog
// Deploy: npx wrangler deploy
// Secrets: wrangler secret put NOTION_API_KEY
//          wrangler secret put NOTION_DATABASE_ID
//          wrangler secret put NOTION_COMMENTS_DB_ID

const NOTION_API = 'https://api.notion.com/v1';
const NOTION_VERSION = '2022-06-28';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default {
  async fetch(request, env) {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);
    const path = url.pathname;

    try {
      // GET /posts - List all published blog posts
      if (path === '/posts' && request.method === 'GET') {
        return await handleGetPosts(env);
      }

      // GET/POST /posts/:slug/comments
      const commentsMatch = path.match(/^\/posts\/(.+)\/comments$/);
      if (commentsMatch) {
        if (request.method === 'GET') {
          return await handleGetComments(commentsMatch[1], env);
        }
        if (request.method === 'POST') {
          return await handlePostComment(commentsMatch[1], request, env);
        }
      }

      // GET /posts/:slug - Get single post with content
      if (path.startsWith('/posts/') && request.method === 'GET') {
        const slug = path.replace('/posts/', '');
        return await handleGetPost(slug, env);
      }

      return jsonResponse({ error: 'Not found' }, 404);
    } catch (error) {
      return jsonResponse({ error: error.message }, 500);
    }
  },
};

async function handleGetPosts(env) {
  const response = await notionFetch(`${NOTION_API}/databases/${env.NOTION_DATABASE_ID}/query`, {
    method: 'POST',
    body: JSON.stringify({
      filter: {
        property: 'Published',
        checkbox: { equals: true },
      },
      sorts: [
        { property: 'Publish Date', direction: 'descending' },
      ],
    }),
  }, env);

  const data = await response.json();
  const posts = data.results.map(pageToPost);

  return jsonResponse(posts);
}

async function handleGetPost(slug, env) {
  // First find the page by slug
  const dbResponse = await notionFetch(`${NOTION_API}/databases/${env.NOTION_DATABASE_ID}/query`, {
    method: 'POST',
    body: JSON.stringify({
      filter: {
        and: [
          { property: 'Slug', rich_text: { equals: slug } },
          { property: 'Published', checkbox: { equals: true } },
        ],
      },
      page_size: 1,
    }),
  }, env);

  const dbData = await dbResponse.json();
  if (!dbData.results || dbData.results.length === 0) {
    return jsonResponse({ error: 'Post not found' }, 404);
  }

  const page = dbData.results[0];
  const post = pageToPost(page);

  // Fetch page content (blocks)
  const blocks = await getAllBlocks(page.id, env);
  post.content = blocksToMarkdown(blocks);

  return jsonResponse(post);
}

async function handleGetComments(slug, env) {
  const response = await notionFetch(`${NOTION_API}/databases/${env.NOTION_COMMENTS_DB_ID}/query`, {
    method: 'POST',
    body: JSON.stringify({
      filter: {
        property: 'PostSlug',
        rich_text: { equals: slug },
      },
      sorts: [
        { property: 'CreatedAt', direction: 'descending' },
      ],
    }),
  }, env);

  const data = await response.json();
  const comments = (data.results || []).map(page => ({
    id: page.id,
    createdTime: getDate(page.properties.CreatedAt) || page.created_time,
    author: getTitle(page.properties.Author),
    avatarUrl: '',
    content: getRichText(page.properties.Content),
  }));

  return jsonResponse(comments);
}

async function handlePostComment(slug, request, env) {
  const body = await request.json();
  const { author, content } = body;

  if (!author || !content) {
    return jsonResponse({ error: 'Author and content are required' }, 400);
  }

  if (author.length > 50 || content.length > 2000) {
    return jsonResponse({ error: 'Author max 50 chars, content max 2000 chars' }, 400);
  }

  const response = await notionFetch(`${NOTION_API}/pages`, {
    method: 'POST',
    body: JSON.stringify({
      parent: { database_id: env.NOTION_COMMENTS_DB_ID },
      properties: {
        Author: { title: [{ text: { content: author } }] },
        Content: { rich_text: [{ text: { content: content } }] },
        PostSlug: { rich_text: [{ text: { content: slug } }] },
        CreatedAt: { date: { start: new Date().toISOString() } },
      },
    }),
  }, env);

  if (!response.ok) {
    const err = await response.json();
    return jsonResponse({ error: 'Failed to post comment', detail: err }, 500);
  }

  return jsonResponse({ success: true }, 201);
}

// Fetch all blocks (handles pagination)
async function getAllBlocks(blockId, env) {
  let blocks = [];
  let cursor = undefined;

  do {
    const url = `${NOTION_API}/blocks/${blockId}/children?page_size=100${cursor ? `&start_cursor=${cursor}` : ''}`;
    const response = await notionFetch(url, { method: 'GET' }, env);
    const data = await response.json();
    blocks = blocks.concat(data.results || []);
    cursor = data.has_more ? data.next_cursor : undefined;
  } while (cursor);

  return blocks;
}

// Convert Notion page properties to blog post object
function pageToPost(page) {
  const props = page.properties;
  return {
    id: page.id,
    title: getTitle(props.Title || props.Name),
    slug: getRichText(props.Slug),
    excerpt: getRichText(props.Excerpt),
    category: getRichText(props.Category) || getSelect(props.Category),
    tags: getMultiSelect(props.Tags),
    author: getRichText(props.Author) || 'Alex',
    publishDate: getDate(props['Publish Date']),
    readTime: getRichText(props['Read Time']) || '5 min read',
    coverImage: getFiles(props['Cover Image']),
    content: '', // Filled in single post endpoint
  };
}

// Property extractors
function getTitle(prop) {
  if (!prop || !prop.title) return '';
  return prop.title.map(t => t.plain_text).join('');
}

function getRichText(prop) {
  if (!prop || !prop.rich_text) return '';
  return prop.rich_text.map(t => t.plain_text).join('');
}

function getSelect(prop) {
  if (!prop || !prop.select) return '';
  return prop.select.name || '';
}

function getMultiSelect(prop) {
  if (!prop || !prop.multi_select) return [];
  return prop.multi_select.map(s => s.name);
}

function getDate(prop) {
  if (!prop || !prop.date) return '';
  return prop.date.start || '';
}

function getFiles(prop) {
  if (!prop || !prop.files || prop.files.length === 0) return '';
  const file = prop.files[0];
  if (file.type === 'file') return file.file.url;
  if (file.type === 'external') return file.external.url;
  return '';
}

// Convert Notion blocks to Markdown
function blocksToMarkdown(blocks) {
  return blocks.map(block => blockToMd(block)).join('\n');
}

function blockToMd(block) {
  const type = block.type;

  switch (type) {
    case 'paragraph':
      return richTextToMd(block.paragraph.rich_text) + '\n';

    case 'heading_1':
      return `# ${richTextToMd(block.heading_1.rich_text)}\n`;

    case 'heading_2':
      return `## ${richTextToMd(block.heading_2.rich_text)}\n`;

    case 'heading_3':
      return `### ${richTextToMd(block.heading_3.rich_text)}\n`;

    case 'bulleted_list_item':
      return `- ${richTextToMd(block.bulleted_list_item.rich_text)}`;

    case 'numbered_list_item':
      return `1. ${richTextToMd(block.numbered_list_item.rich_text)}`;

    case 'to_do':
      const checked = block.to_do.checked ? 'x' : ' ';
      return `- [${checked}] ${richTextToMd(block.to_do.rich_text)}`;

    case 'toggle':
      return `<details><summary>${richTextToMd(block.toggle.rich_text)}</summary></details>\n`;

    case 'quote':
      return `> ${richTextToMd(block.quote.rich_text)}\n`;

    case 'callout':
      const icon = block.callout.icon?.emoji || '';
      return `> ${icon} ${richTextToMd(block.callout.rich_text)}\n`;

    case 'code':
      const lang = block.code.language || '';
      return `\`\`\`${lang}\n${richTextToMd(block.code.rich_text)}\n\`\`\`\n`;

    case 'divider':
      return '---\n';

    case 'image':
      const imgUrl = block.image.type === 'file'
        ? block.image.file.url
        : block.image.external?.url || '';
      const caption = block.image.caption?.map(c => c.plain_text).join('') || '';
      return `![${caption}](${imgUrl})\n`;

    case 'video':
      const videoUrl = block.video.type === 'file'
        ? block.video.file.url
        : block.video.external?.url || '';
      return `<video src="${videoUrl}" controls></video>\n`;

    case 'bookmark':
      return `[${block.bookmark.url}](${block.bookmark.url})\n`;

    case 'embed':
      return `<iframe src="${block.embed.url}" frameborder="0"></iframe>\n`;

    case 'table':
      return ''; // Tables need child block fetching, skip for now

    default:
      return '';
  }
}

// Convert Notion rich text array to Markdown
function richTextToMd(richTextArray) {
  if (!richTextArray || richTextArray.length === 0) return '';

  return richTextArray.map(rt => {
    let text = rt.plain_text;
    const annotations = rt.annotations || {};

    if (annotations.code) text = `\`${text}\``;
    if (annotations.bold) text = `**${text}**`;
    if (annotations.italic) text = `*${text}*`;
    if (annotations.strikethrough) text = `~~${text}~~`;
    if (annotations.underline) text = `<u>${text}</u>`;

    if (rt.href) text = `[${text}](${rt.href})`;

    return text;
  }).join('');
}

// Helpers
function notionFetch(url, options, env) {
  return fetch(url, {
    ...options,
    headers: {
      'Authorization': `Bearer ${env.NOTION_API_KEY}`,
      'Notion-Version': NOTION_VERSION,
      'Content-Type': 'application/json',
    },
  });
}

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders,
    },
  });
}
