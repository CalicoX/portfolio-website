import type { BlogPost, BlogComment } from '../types';

const API_BASE = import.meta.env.VITE_NOTION_API_URL || '';

export const getNotionBlogPosts = async (): Promise<BlogPost[]> => {
  if (!API_BASE) {
    console.warn('VITE_NOTION_API_URL not set, using fallback data');
    return [];
  }

  try {
    const response = await fetch(`${API_BASE}/posts`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching Notion blog posts:', error);
    return [];
  }
};

export const getNotionBlogPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  if (!API_BASE) return null;

  try {
    const response = await fetch(`${API_BASE}/posts/${slug}`);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error('Error fetching Notion blog post:', error);
    return null;
  }
};

export const getNotionBlogComments = async (slug: string): Promise<BlogComment[]> => {
  if (!API_BASE) return [];

  try {
    const response = await fetch(`${API_BASE}/posts/${slug}/comments`);
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    console.error('Error fetching blog comments:', error);
    return [];
  }
};

export const postNotionBlogComment = async (slug: string, author: string, content: string): Promise<boolean> => {
  if (!API_BASE) return false;

  try {
    const response = await fetch(`${API_BASE}/posts/${slug}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ author, content }),
    });
    return response.ok;
  } catch (error) {
    console.error('Error posting comment:', error);
    return false;
  }
};
