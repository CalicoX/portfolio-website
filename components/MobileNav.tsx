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

  // Filter out Contact and Blog pages for mobile
  const mobileNavItems = navItems.filter(item => !item.path.includes('/contact') && !item.path.includes('/blog'));

  return (
    <div className="fixed bottom-4 left-6 right-6 md:hidden z-50">
      <nav className="relative flex items-center px-1.5 py-1.5 bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-full shadow-lg shadow-black/50 overflow-hidden">
        {/* Sliding Active Background */}
        <div
          className="absolute inset-y-1 bg-white/10 rounded-full transition-all duration-300 cubic-bezier(0.4, 0, 0.2, 1)"
          style={{
            left: '6px', // matches px-1.5
            width: `calc((100% - 12px) / ${mobileNavItems.length})`,
            transform: `translateX(calc(100% * ${mobileNavItems.findIndex(item => getCurrentPath() === item.path.trim()) === -1 ? 0 : mobileNavItems.findIndex(item => getCurrentPath() === item.path.trim())}))`,
            opacity: mobileNavItems.findIndex(item => getCurrentPath() === item.path.trim()) === -1 ? 0 : 1
          }}
        />

        {mobileNavItems.map((item) => {
          const isActive = getCurrentPath() === item.path.trim();
          const Icon = getIcon(item.icon);
          const displayLabel = item.mobile || item.label;

          return (
            <Link
              key={item.id}
              to={item.path.trim()}
              className={`relative flex-1 flex flex-col items-center justify-center gap-0.5 py-1 rounded-full transition-all duration-300 z-10 ${isActive
                ? 'text-white'
                : 'text-zinc-500 hover:text-zinc-300'
                }`}
            >
              <div className={`relative p-0.5 rounded-full transition-all duration-300 ${isActive ? 'scale-105' : 'scale-100'}`}>
                <Icon
                  size={18}
                  className={`transition-all duration-300 ${isActive ? 'stroke-accent drop-shadow-[0_0_8px_rgba(129,140,248,0.6)]' : ''}`}
                  strokeWidth={isActive ? 2.5 : 2}
                />
              </div>
              <span className="text-[9px] font-medium transition-all duration-300 leading-none pb-0.5">
                {displayLabel}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default MobileNav;
