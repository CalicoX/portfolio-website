import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';
import MobileHeader from './MobileHeader';
import DotMatrixBackground from './DotMatrixBackground';
import LoadingScreen from './LoadingScreen';
import { useAdminShortcut } from '../hooks/useKonamiCode';

const Layout: React.FC = () => {
  const { pathname } = useLocation();
  // Check sessionStorage to skip loading screen on refresh
  const loadingAlreadyComplete = typeof window !== 'undefined' && sessionStorage.getItem('loadingComplete') === 'true';
  const [isLoading, setIsLoading] = useState(!loadingAlreadyComplete);
  const [isReady, setIsReady] = useState(loadingAlreadyComplete);
  const cursorStyleRef = useRef<HTMLStyleElement | null>(null);

  // Redirect to standalone admin panel
  const handleSecretTrigger = () => {
    window.location.href = 'https://calicox.github.io/portfolio-admin/';
  };

  // Admin shortcut - redirects to standalone admin
  useAdminShortcut(handleSecretTrigger);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // Setup global dot cursor with contrast inversion (desktop only via CSS media query)
  useEffect(() => {
    // Add global cursor style to hide default cursor
    const styleTag = document.createElement('style');
    styleTag.id = 'global-cursor-style';
    styleTag.innerHTML = `
      /* Hide default cursor - desktop only */
      @media (hover: hover) and (pointer: fine) {
        * {
          cursor: none !important;
        }
        html, body {
          cursor: none !important;
        }
        a, button, input, textarea, select, [role="button"] {
          cursor: none !important;
        }
        /* Custom cursor with contrast inversion effect */
        .cursor-overlay {
          position: fixed;
          width: 16px;
          height: 16px;
          background: white;
          border-radius: 50%;
          pointer-events: none;
          mix-blend-mode: difference;
          z-index: 99999;
          transform: translate(-50%, -50%);
          transition: transform 0.1s ease-out;
        }
      }
      /* Hide cursor overlay on touch devices */
      @media (hover: none), (pointer: coarse) {
        .cursor-overlay {
          display: none !important;
        }
      }
    `;
    document.head.appendChild(styleTag);
    cursorStyleRef.current = styleTag;

    // Create custom cursor overlay for contrast inversion effect
    const cursorOverlay = document.createElement('div');
    cursorOverlay.className = 'cursor-overlay';
    cursorOverlay.id = 'custom-cursor-overlay';
    document.body.appendChild(cursorOverlay);

    // Track mouse movement
    const handleMouseMove = (e: MouseEvent) => {
      cursorOverlay.style.left = e.clientX + 'px';
      cursorOverlay.style.top = e.clientY + 'px';
    };

    // Handle hover states (scale up on interactive elements)
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.getAttribute('role') === 'button' ||
        target.classList.contains('cursor-pointer')
      ) {
        cursorOverlay.style.transform = 'translate(-50%, -50%) scale(1.5)';
      }
    };

    const handleMouseOut = () => {
      cursorOverlay.style.transform = 'translate(-50%, -50%) scale(1)';
    };

    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseover', handleMouseOver, { passive: true });
    document.addEventListener('mouseout', handleMouseOut, { passive: true });

    return () => {
      // Clean up
      if (cursorStyleRef.current) {
        document.head.removeChild(cursorStyleRef.current);
      }
      const overlay = document.getElementById('custom-cursor-overlay');
      if (overlay) {
        document.body.removeChild(overlay);
      }
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, []);

  const handleLoadingComplete = useCallback(() => {
    setIsLoading(false);
    // Small delay to ensure smooth transition
    setTimeout(() => {
      setIsReady(true);
      // Mark root as ready for CSS
      const root = document.getElementById('root');
      if (root) {
        root.classList.add('ready');
      }
    }, 100);
  }, []);

  return (
    <div className="min-h-screen bg-background text-primary flex flex-col md:flex-row">
      {isLoading ? (
        <LoadingScreen onComplete={handleLoadingComplete} />
      ) : (
        <>
          {isReady && (
            <>
              <Sidebar />
              <MobileHeader onSecretTrigger={handleSecretTrigger} />

              {/* Main Content Area */}
              <main className={`flex-1 md:ml-64 w-full relative min-h-screen ${pathname === '/contact' ? '!p-0 !pt-0 !pb-0' : ''}`}>
                {/* Render background only on Home page */}
                {pathname === '/' && <DotMatrixBackground />}

                <div className={`w-full h-full p-6 pt-24 md:p-12 md:pt-12 pb-24 md:pb-12 animate-fade-in relative z-10 ${pathname === '/contact' ? '!p-0 !pt-0 !pb-0' : ''}`}>
                  <Outlet />
                </div>
              </main>

              <MobileNav />
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Layout;
