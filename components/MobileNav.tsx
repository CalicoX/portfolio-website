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
      // Add Blog to navigation if not present
      if (!data.find(item => item.path === '/blog')) {
        data.push({ id: 'blog', label: 'Blog', path: '/blog', icon: 'pen-tool', order: 4 });
      }
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

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-surface/90 backdrop-blur-md border-t border-white/10 p-4 md:hidden z-50">
      <nav className="flex justify-around items-center">
        {navItems
          .filter((item) => item.path.trim().toLowerCase() !== '/contact')
          .map((item) => {
            // Trim whitespace from both paths for comparison
            const isActive = getCurrentPath() === item.path.trim();
            const Icon = getIcon(item.icon);

            return (
              <Link
                key={item.id}
                to={item.path.trim()}
                className={`flex flex-col items-center gap-1 transition-colors duration-200 ${
                  isActive ? 'text-accent' : 'text-zinc-500'
                }`}
              >
                <Icon size={20} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
      </nav>
    </div>
  );
};

export default MobileNav;
