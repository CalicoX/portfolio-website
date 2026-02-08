import { LucideIcon } from 'lucide-react';
import { Home, LayoutTemplate, PenTool, Camera, Github, Linkedin, Twitter, Mail } from 'lucide-react';

export interface NavItem {
  id: string;
  label: string;
  path: string;
  icon: string; // Icon name from lucide-react
  order: number;
  mobile?: string; // Short text for mobile navigation
}

export interface Project {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
}

export interface Photo {
  id: string;
  title: string;
  location: string;
  imageUrl: string;
  aspectRatio: string;
  date?: string;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
}

export interface ProjectDetail extends Project {
  description: string;
  content?: string;
  tags?: string[];
  year?: string;
  client?: string;
  tools?: string[];
  gallery?: string[];
}

export interface SiteProfile {
  id: string;
  heroTitle: string;
  heroSubtitle: string;
  name: string;
  description: string;
  profileImageUrl: string;
  cvLink?: string;
}

export interface Stat {
  id: string;
  value: string;
  label: string;
  order?: number;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: string;
  publishDate: string;
  readTime: string;
  tags: string[];
  category: string;
}

export interface BlogComment {
  id: string;
  createdTime: string;
  author: string;
  avatarUrl: string;
  content: string;
}

// Icon name to component mapping
export const ICON_MAP: Record<string, LucideIcon> = {
  home: Home,
  'layout-template': LayoutTemplate,
  'pen-tool': PenTool,
  camera: Camera,
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  mail: Mail,
};

export const getIcon = (iconName: string): LucideIcon => {
  return ICON_MAP[iconName] || Home;
};