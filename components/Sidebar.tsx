import React, { useEffect, useState, useMemo } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { getNavigation } from '../lib/contentful';
import { NavItem, getIcon } from '../types';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try to get preloaded nav items from sessionStorage first
    const preloadedNav = sessionStorage.getItem('navItems');
    if (preloadedNav) {
      try {
        setNavItems(JSON.parse(preloadedNav));
        setLoading(false);
        return;
      } catch (e) {
        console.error('Failed to parse preloaded nav items:', e);
      }
    }

    // Fallback to fetching
    const fetchNav = async () => {
      const data = await getNavigation();
      setNavItems(data);
      setLoading(false);
    };
    fetchNav();

    // Keyboard shortcut: Ctrl+Shift+A (or Cmd+Shift+A on Mac) to open admin
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        window.open('https://calicox.github.io/portfolio-admin/', '_blank');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
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
      <aside className="fixed left-0 top-0 h-full w-64 bg-surface border-r border-white/5 hidden md:flex flex-col p-6 z-20">
        {/* Header skeleton */}
        <div className="mb-10">
          <div className="h-6 w-28 bg-zinc-800 rounded animate-pulse" />
          <div className="h-3 w-36 bg-zinc-800/60 rounded mt-2 animate-pulse" />
        </div>

        {/* Navigation skeleton */}
        <nav className="space-y-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-3 px-3 py-2.5">
              <div className="w-4 h-4 bg-zinc-800 rounded animate-pulse" />
              <div className="h-4 bg-zinc-800 rounded animate-pulse" style={{ width: `${60 + i * 10}px` }} />
            </div>
          ))}
        </nav>

        {/* Footer skeleton */}
        <div className="mt-auto">
          <div className="h-3 w-40 bg-zinc-800/40 rounded animate-pulse" />
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
              className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-all duration-200 ${isActive
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
