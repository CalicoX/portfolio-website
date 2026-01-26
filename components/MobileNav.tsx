import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { getNavigation } from '../lib/contentful';
import { NavItem, getIcon } from '../types';

const MobileNav: React.FC = () => {
  const location = useLocation();
  const [navItems, setNavItems] = useState<NavItem[]>([]);

  useEffect(() => {
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
    <div className="fixed bottom-0 left-0 right-0 bg-surface/90 backdrop-blur-md border-t border-white/10 px-2 py-3 md:hidden z-50">
      <nav className="grid grid-cols-5 gap-1">
        {mobileNavItems.map((item) => {
          const isActive = getCurrentPath() === item.path.trim();
          const Icon = getIcon(item.icon);
          const displayLabel = item.mobile || item.label;

          return (
            <Link
              key={item.id}
              to={item.path.trim()}
              className={`flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-full transition-all duration-200 ${
                isActive
                  ? 'bg-white/10 text-white'
                  : 'text-zinc-500'
              }`}
            >
              <Icon size={20} />
              <span className="text-[10px] font-medium">{displayLabel}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default MobileNav;
