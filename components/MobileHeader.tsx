import React, { useState, useEffect } from 'react';

interface MobileHeaderProps {
  onSecretTrigger?: () => void;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({ onSecretTrigger }) => {
  const [taps, setTaps] = useState(0);

  useEffect(() => {
    if (taps === 0) return;

    // Reset taps if no click for 1 second
    const timer = setTimeout(() => {
      setTaps(0);
    }, 1000);

    return () => clearTimeout(timer);
  }, [taps]);

  const handleTap = () => {
    if (!onSecretTrigger) return;

    // Provide visual feedback if needed, currently just silent
    const newCount = taps + 1;
    setTaps(newCount);

    if (newCount >= 7) {
      onSecretTrigger();
      setTaps(0);
    }
  };

  return (
    <header className="md:hidden fixed top-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-sm z-40 flex items-center justify-between px-6 border-b border-white/5 select-none">
      <div
        onClick={handleTap}
        className="active:opacity-70 transition-opacity cursor-pointer"
        aria-label="Site Logo"
      >
        <h1 className="text-lg font-bold text-white tracking-tight">Sam's Portfolio</h1>
      </div>
      <div className="h-2 w-2 rounded-full bg-accent animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
    </header>
  );
};

export default MobileHeader;