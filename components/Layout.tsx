import React, { useEffect, useState, useCallback } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';
import MobileHeader from './MobileHeader';
import DotMatrixBackground from './DotMatrixBackground';
import LoadingScreen from './LoadingScreen';

const Layout: React.FC = () => {
  const { pathname } = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const handleLoadingComplete = useCallback(() => {
    setIsLoading(false);
  }, []);

  // Check if initial data is loaded from Home component
  useEffect(() => {
    const checkDataReady = () => {
      const homeDataReady = sessionStorage.getItem('homeDataLoaded');
      if (homeDataReady === 'true') {
        setDataLoaded(true);
      }
    };

    // Initial check
    checkDataReady();

    // Poll for data ready (but timeout after 5 seconds)
    const interval = setInterval(checkDataReady, 100);
    const timeout = setTimeout(() => {
      clearInterval(interval);
      setDataLoaded(true); // Force show content after timeout
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  // Show loading screen until both animation and data are ready
  const showLoading = isLoading || !dataLoaded;

  return (
    <div className="min-h-screen bg-background text-primary flex flex-col md:flex-row">
      {showLoading ? (
        <LoadingScreen onComplete={handleLoadingComplete} />
      ) : (
        <>
          <Sidebar />
          <MobileHeader />

          {/* Main Content Area */}
          <main className={`flex-1 md:ml-64 w-full relative min-h-screen isolate ${pathname === '/contact' ? '!h-screen !p-0 !pt-0 !pb-0' : ''}`}>
            {/* Render background only on Home page */}
            {pathname === '/' && <DotMatrixBackground />}

            <div className={`w-full h-full p-6 pt-24 md:p-12 md:pt-12 pb-24 md:pb-12 max-w-7xl mx-auto animate-fade-in relative z-10 ${pathname === '/contact' ? '!p-0 !pt-0 !pb-0 !h-screen' : ''}`}>
              <Outlet />
            </div>
          </main>

          <MobileNav />
        </>
      )}
    </div>
  );
};

export default Layout;
