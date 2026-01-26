import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { getNavigation } from '../lib/contentful';
import { NavItem, getIcon } from '../types';

const MobileNav: React.FC = () => {
  const location = useLocation();
  const [navItems, setNavItems] = useState<NavItem[]>([]);

  useEffect(() => {
    // Try to get preloaded nav items from sessionStorage first
    const preloadedNav = sessionStorage.getItem('navItems');
    if (preloadedNav) {
      try {
        setNavItems(JSON.parse(preloadedNav));
        return;
      } catch (e) {
        console.error('Failed to parse preloaded nav items:', e);
      }
    }

    // Fallback to fetching
    const fetchNav = async () => {
      const data = await getNavigation();
      setNavItems(data);
    };
    fetchNav();
  }, []);

  // Get current path from hash (for HashRouter)
  const getCurrentPath = () => {
    const hash = location.hash || window.location.hash || '#/';
    let path = hash.replace('#', '') || '/';

    // Ensure path starts with / for consistency
    if (!path.startsWith('/')) {
      path = '/' + path;
    }

    console.log('MobileNav - Current location:', { hash, path });
    return path;
  };

  // Filter out Contact page for mobile
  const mobileNavItems = navItems.filter(item => !item.path.includes('/contact'));

  return (
    <div className="fixed bottom-4 left-6 right-6 md:hidden z-50">
      <nav className="flex items-center px-2 py-2 bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-lg shadow-black/50">
        {mobileNavItems.map((item) => {
          const isActive = getCurrentPath() === item.path.trim();
          const Icon = getIcon(item.icon);
          const displayLabel = item.mobile || item.label;

          return (
            <Link
              key={item.id}
              to={item.path.trim()}
              className={`relative flex-1 flex flex-col items-center justify-center gap-1 py-2 rounded-xl transition-all duration-300 ease-out ${
                isActive
                  ? 'bg-white/10 text-white scale-105'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Icon size={20} className="transition-transform duration-300" />
              <span className="text-[9px] font-medium">{displayLabel}</span>
              {isActive && (
                <span className="w-1.5 h-1.5 bg-accent rounded-full shadow-[0_0_10px_rgba(34,197,94,0.8),0_0_20px_rgba(34,197,94,0.5),0_0_30px_rgba(34,197,94,0.3)] animate-in zoom-in-50 duration-300" />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default MobileNav;
