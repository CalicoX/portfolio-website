import React from 'react';

const MobileHeader: React.FC = () => {
  return (
    <header className="md:hidden fixed top-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-sm z-40 flex items-center justify-between px-6 border-b border-white/5">
      <div>
        <h1 className="text-lg font-bold text-white tracking-tight">Sam's Portfolio</h1>
      </div>
      <div className="h-2 w-2 rounded-full bg-accent animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
    </header>
  );
};

export default MobileHeader;