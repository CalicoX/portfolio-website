import { createClient } from 'contentful';
import { Project, ProjectDetail, SiteProfile, Stat, NavItem, Photo } from '../types';

const client = createClient({
  space: import.meta.env.VITE_CONTENTFUL_SPACE_ID || '',
  accessToken: import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN || '',
});

export interface ContentfulProject {
  sys: { id: string };
  fields: {
    title: string;
    category: string;
    description?: string;
    content?: any;
    tags?: string | string[];
    year?: string;
    client?: string;
    tools?: string | string[];
    image?: any;
    gallery?: any[];
  };
}

const getImageUrl = (image: any): string => {
  if (!image) return 'https://picsum.photos/800/600';
  if (image.fields?.file?.url) return `https:${image.fields.file.url}`;
  if (image.sys?.type === 'Link') return 'https://picsum.photos/800/600'; // Unresolved link
  return 'https://picsum.photos/800/600';
};

const toStringArray = (value: string | string[] | undefined): string[] => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  return value.split(',').map(v => v.trim()).filter(Boolean);
};

const toProject = (item: any): Project => ({
  id: item.sys.id,
  title: item.fields.title,
  category: item.fields.category,
  imageUrl: getImageUrl(item.fields.image),
});

const toProjectDetail = (item: any): ProjectDetail => {
  const fields = item.fields;
  return {
    id: item.sys.id,
    title: fields.title,
    category: fields.category,
    description: fields.description || '',
    content: fields.content?.content?.map((node: any) => {
      if (node.nodeType === 'paragraph' && node.content) {
        return node.content.map((textNode: any) => textNode.value || '').join('');
      }
      return '';
    }).join('\n\n') || '',
    tags: toStringArray(fields.tags),
    year: fields.year,
    client: fields.client,
    tools: toStringArray(fields.tools),
    imageUrl: getImageUrl(fields.image),
    gallery: fields.gallery?.map((g: any) => getImageUrl(g)) || [],
  };
};

export const getProjects = async (): Promise<Project[]> => {
  try {
    const response = await client.getEntries({
      content_type: 'portfolio',
      include: 2, // Resolve linked assets
    });
    return response.items.map(toProject);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
};

export const getProjectById = async (id: string): Promise<ProjectDetail | null> => {
  try {
    const response = await client.getEntry(id, { include: 2 });
    return toProjectDetail(response);
  } catch (error) {
    console.error('Error fetching project:', error);
    return null;
  }
};

export const getGraphicDesignProjects = async (): Promise<Project[]> => {
  try {
    const response = await client.getEntries({
      content_type: 'portfolio',
      include: 2,
    });
    return response.items.map(toProject);
  } catch (error) {
    console.error('Error fetching graphic design projects:', error);
    return [];
  }
};

// Site Profile
export const getSiteProfile = async (): Promise<SiteProfile | null> => {
  try {
    const response = await client.getEntries({
      content_type: 'index',
      include: 2,
      limit: 1,
    });
    if (response.items.length === 0) return null;
    const item = response.items[0];
    return {
      id: item.sys.id,
      heroTitle: item.fields.heroTitle || '',
      heroSubtitle: item.fields.heroSubtitle || '',
      name: item.fields.name || '',
      description: item.fields.description || '',
      profileImageUrl: getImageUrl(item.fields.profileImage),
      cvLink: item.fields.cvLink || '',
    };
  } catch (error) {
    console.error('Error fetching site profile:', error);
    return null;
  }
};

// Stats
export const getStats = async (): Promise<Stat[]> => {
  try {
    const response = await client.getEntries({
      content_type: 'stat',
      order: ['fields.order'],
    });
    return response.items.map((item: any) => ({
      id: item.sys.id,
      value: item.fields.value || '',
      label: item.fields.label || '',
      order: item.fields.order || 0,
    }));
  } catch (error) {
    console.error('Error fetching stats:', error);
    return [];
  }
};

// Photos
export const getPhotos = async (): Promise<Photo[]> => {
  try {
    const response = await client.getEntries({
      content_type: 'photo',
      include: 10,
      order: ['-fields.date', '-sys.createdAt'],
    });
    // Build asset lookup map from includes
    const assetMap = new Map<string, any>();
    if (response.includes?.Asset) {
      response.includes.Asset.forEach((asset: any) => {
        assetMap.set(asset.sys.id, asset);
      });
    }
    // Custom image URL resolver that uses the asset map
    const resolveImageUrl = (image: any): string => {
      if (!image) return 'https://picsum.photos/800/600';
      if (image.fields?.file?.url) return `https:${image.fields.file.url}`;
      if (image.sys?.type === 'Link' && image.sys.id) {
        const asset = assetMap.get(image.sys.id);
        if (asset?.fields?.file?.url) {
          return `https:${asset.fields.file.url}`;
        }
      }
      return 'https://picsum.photos/800/600';
    };
    return response.items.map((item: any) => ({
      id: item.sys.id,
      title: item.fields.title || '',
      location: item.fields.location || '',
      imageUrl: resolveImageUrl(item.fields.image),
      aspectRatio: item.fields.aspectRatio || 'aspect-[3/4]',
      date: item.fields.date || '',
    }));
  } catch (error) {
    console.error('Error fetching photos:', error);
    return [];
  }
};

// Navigation
export const getNavigation = async (): Promise<NavItem[]> => {
  try {
    const response = await client.getEntries({
      content_type: 'navigation',
      order: ['fields.order'],
    });
    return response.items.map((item: any) => ({
      id: item.sys.id,
      label: item.fields.label || '',
      path: item.fields.path || '',
      icon: item.fields.icon || 'home',
      order: item.fields.order || 0,
    }));
  } catch (error) {
    console.error('Error fetching navigation:', error);
    // Return default navigation on error
    return [
      { id: '1', label: 'Home', path: '/', icon: 'home', order: 0 },
      { id: '2', label: 'UI Design', path: '/ui-design', icon: 'layout-template', order: 1 },
      { id: '3', label: 'Graphic Design', path: '/graphic-design', icon: 'pen-tool', order: 2 },
      { id: '4', label: 'Photos', path: '/photos', icon: 'camera', order: 3 },
    ];
  }
};
