import { Home, LayoutTemplate, PenTool, Camera, Linkedin, Twitter, Github, Mail } from 'lucide-react';
import { NavItem, Project, Photo, Experience } from './types';

export const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Home', path: '/', icon: Home },
  { id: 'ui-design', label: 'UI Design', path: '/ui-design', icon: LayoutTemplate },
  { id: 'graphic-design', label: 'Graphic Design', path: '/graphic-design', icon: PenTool },
  { id: 'photos', label: 'Photos', path: '/photos', icon: Camera },
  { id: 'contact', label: 'Contact', path: '/contact', icon: Mail },
];

export const SOCIAL_LINKS = [
  { id: 'twitter', icon: Twitter, href: '#' },
  { id: 'linkedin', icon: Linkedin, href: '#' },
  { id: 'github', icon: Github, href: '#' },
  { id: 'mail', icon: Mail, href: 'mailto:hello@example.com' },
];

export const UI_PROJECTS: Project[] = [
  { id: '1', title: 'Finance Dashboard', category: 'Web App', imageUrl: 'https://picsum.photos/800/600?random=1' },
  { id: '2', title: 'E-commerce Mobile', category: 'Mobile App', imageUrl: 'https://picsum.photos/800/600?random=2' },
  { id: '3', title: 'Travel Booking', category: 'Web Platform', imageUrl: 'https://picsum.photos/800/600?random=3' },
  { id: '4', title: 'Fitness Tracker', category: 'Mobile App', imageUrl: 'https://picsum.photos/800/600?random=4' },
  { id: '5', title: 'Smart Home Control', category: 'IoT Interface', imageUrl: 'https://picsum.photos/800/600?random=5' },
  { id: '6', title: 'Crypto Exchange', category: 'Web App', imageUrl: 'https://picsum.photos/800/600?random=6' },
];

export const GRAPHIC_PROJECTS: Project[] = [
  { id: '1', title: 'Neon Festival', category: 'Poster Design', imageUrl: 'https://picsum.photos/600/800?random=7' },
  { id: '2', title: 'Eco Brand Identity', category: 'Branding', imageUrl: 'https://picsum.photos/800/600?random=8' },
  { id: '3', title: 'Abstract Shapes', category: 'Illustration', imageUrl: 'https://picsum.photos/800/800?random=9' },
  { id: '4', title: 'Coffee Shop Menu', category: 'Print Design', imageUrl: 'https://picsum.photos/600/800?random=10' },
  { id: '5', title: 'Tech Conference', category: 'Merchandise', imageUrl: 'https://picsum.photos/800/600?random=11' },
  { id: '6', title: 'Vinyl Cover Art', category: 'Album Art', imageUrl: 'https://picsum.photos/800/800?random=12' },
];

export const PHOTOS: Photo[] = [
  { id: '1', title: 'Urban Solitude', location: 'Tokyo, Japan', imageUrl: 'https://picsum.photos/800/1200?random=13', aspectRatio: 'aspect-[3/4]' },
  { id: '2', title: 'Misty Mountains', location: 'Swiss Alps', imageUrl: 'https://picsum.photos/800/1200?random=14', aspectRatio: 'aspect-[3/4]' },
  { id: '3', title: 'Neon Nights', location: 'Hong Kong', imageUrl: 'https://picsum.photos/800/1200?random=15', aspectRatio: 'aspect-[3/4]' },
  { id: '4', title: 'Desert Dunes', location: 'Sahara', imageUrl: 'https://picsum.photos/800/1200?random=16', aspectRatio: 'aspect-[3/4]' },
  { id: '5', title: 'Ocean Waves', location: 'Pacific Coast', imageUrl: 'https://picsum.photos/800/1200?random=17', aspectRatio: 'aspect-[3/4]' },
  { id: '6', title: 'Street Corner', location: 'New York, USA', imageUrl: 'https://picsum.photos/800/1200?random=18', aspectRatio: 'aspect-[3/4]' },
  { id: '7', title: 'Golden Hour', location: 'Santorini, Greece', imageUrl: 'https://picsum.photos/800/1200?random=19', aspectRatio: 'aspect-[3/4]' },
  { id: '8', title: 'Forest Path', location: 'Black Forest, Germany', imageUrl: 'https://picsum.photos/800/1200?random=20', aspectRatio: 'aspect-[3/4]' },
  { id: '9', title: 'City Lights', location: 'Shanghai, China', imageUrl: 'https://picsum.photos/800/1200?random=21', aspectRatio: 'aspect-[3/4]' },
  { id: '10', title: 'Ancient Ruins', location: 'Rome, Italy', imageUrl: 'https://picsum.photos/800/1200?random=22', aspectRatio: 'aspect-[3/4]' },
  { id: '11', title: 'Northern Lights', location: 'Iceland', imageUrl: 'https://picsum.photos/800/1200?random=23', aspectRatio: 'aspect-[3/4]' },
  { id: '12', title: 'Cherry Blossoms', location: 'Kyoto, Japan', imageUrl: 'https://picsum.photos/800/1200?random=24', aspectRatio: 'aspect-[3/4]' },
  { id: '13', title: 'Rainy Streets', location: 'London, UK', imageUrl: 'https://picsum.photos/800/1200?random=25', aspectRatio: 'aspect-[3/4]' },
  { id: '14', title: 'Sunset Beach', location: 'Bali, Indonesia', imageUrl: 'https://picsum.photos/800/1200?random=26', aspectRatio: 'aspect-[3/4]' },
  { id: '15', title: 'Mountain Peak', location: 'Nepal', imageUrl: 'https://picsum.photos/800/1200?random=27', aspectRatio: 'aspect-[3/4]' },
  { id: '16', title: 'Old Town', location: 'Prague, Czech', imageUrl: 'https://picsum.photos/800/1200?random=28', aspectRatio: 'aspect-[3/4]' },
  { id: '17', title: 'Autumn Leaves', location: 'Vermont, USA', imageUrl: 'https://picsum.photos/800/1200?random=29', aspectRatio: 'aspect-[3/4]' },
  { id: '18', title: 'Night Market', location: 'Bangkok, Thailand', imageUrl: 'https://picsum.photos/800/1200?random=30', aspectRatio: 'aspect-[3/4]' },
  { id: '19', title: 'Snowy Village', location: 'Norway', imageUrl: 'https://picsum.photos/800/1200?random=31', aspectRatio: 'aspect-[3/4]' },
  { id: '20', title: 'Coastal Cliffs', location: 'Ireland', imageUrl: 'https://picsum.photos/800/1200?random=32', aspectRatio: 'aspect-[3/4]' },
];

export const EXPERIENCES: Experience[] = [
  {
    id: '1',
    role: 'Senior Product Designer',
    company: 'TechFlow',
    period: '2022 - Present',
    description: 'Leading the design system initiative and overseeing core product features.'
  },
  {
    id: '2',
    role: 'UI/UX Designer',
    company: 'CreativePulse',
    period: '2020 - 2022',
    description: 'Designed mobile-first experiences for fintech clients and startups.'
  },
  {
    id: '3',
    role: 'Visual Designer',
    company: 'Studio X',
    period: '2018 - 2020',
    description: 'Specialized in brand identity and marketing assets for global brands.'
  }
];