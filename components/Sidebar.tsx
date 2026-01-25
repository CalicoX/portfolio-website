import React, { useEffect, useState, useMemo } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { getNavigation } from '../lib/contentful';
import { NavItem, getIcon } from '../types';
import { PenTool } from 'lucide-react';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNav = async () => {
      const data = await getNavigation();
      // Add Blog to navigation if not present
      if (!data.find(item => item.path === '/blog')) {
        data.push({ id: 'blog', label: 'Blog', path: '/blog', icon: 'pen-tool', order: 4 });
      }
      setNavItems(data);
      setLoading(false);
    };
    fetchNav();
  }, []);

  // Get current path - with HashRouter, use location.key to force re-render on navigation
  const currentPath = useMemo(() => {
    const hash = location.hash || window.location.hash || '#/';
    let path = hash.replace('#', '') || '/';

    // Ensure path starts with / for consistency
    if (!path.startsWith('/')) {
      path = '/' + path;
    }

    console.log('Sidebar location:', { hash: location.hash, windowHash: window.location.hash, path, locationKey: location.key });
    return path;
  }, [location.hash, location.key]);

  if (loading) {
    return (
      <aside className="fixed left-0 top-0 h-full w-64 bg-surface border-r border-white/5 hidden md:flex flex-col p-8 justify-between z-20">
        <div>
          <div className="mb-10">
            <h1 className="text-2xl font-bold tracking-tight text-white">Portfolio</h1>
            <p className="text-sm text-secondary mt-1">Loading...</p>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-surface border-r border-white/5 hidden md:flex flex-col p-6 z-20">
      {/* Header / Brand */}
      <div className="mb-10">
        <h1 className="text-xl font-bold tracking-tight text-white">PORTFOLIO</h1>
        <p className="text-xs text-secondary mt-1">CREATIVE DEVELOPER</p>
      </div>

      {/* Navigation */}
      <nav className="space-y-1">
        {navItems.map((item) => {
          // Trim whitespace from both paths for comparison
          const isActive = currentPath === item.path.trim();
          const Icon = getIcon(item.icon);

          return (
            <Link
              key={item.id}
              to={item.path.trim()}
              className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-accent text-black'
                  : 'text-secondary hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon size={16} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="mt-auto">
        <p className="text-xs text-zinc-600">
          © 2025-2026 All Rights Reserved
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
