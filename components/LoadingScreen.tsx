import React, { useState, useEffect } from 'react';

const LoadingScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [blocks, setBlocks] = useState<boolean[]>([]);

  // Create a grid of blocks (8x8 = 64 blocks)
  const TOTAL_BLOCKS = 64;
  const GRID_SIZE = 8;

  useEffect(() => {
    // Initialize all blocks as off
    setBlocks(new Array(TOTAL_BLOCKS).fill(false));

    const duration = 1500;
    const interval = 16;
    const increment = 100 / (duration / interval);
    const blocksPerUpdate = Math.ceil(TOTAL_BLOCKS / (duration / interval));

    let currentProgress = 0;
    let litBlocks = 0;

    const timer = setInterval(() => {
      currentProgress += increment;

      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(timer);
        setTimeout(onComplete, 300);
      }

      setProgress(currentProgress);

      // Light up blocks progressively
      const targetLit = Math.floor((currentProgress / 100) * TOTAL_BLOCKS);
      if (targetLit > litBlocks) {
        setBlocks(prev => {
          const newBlocks = [...prev];
          for (let i = litBlocks; i < targetLit && i < TOTAL_BLOCKS; i++) {
            newBlocks[i] = true;
          }
          return newBlocks;
        });
        litBlocks = targetLit;
      }
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-12">
        {/* Pixel Grid */}
        <div
          className="grid gap-1 p-4 bg-zinc-900 border-2 border-zinc-800"
          style={{
            gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
          }}
        >
          {blocks.map((lit, index) => (
            <div
              key={index}
              className="w-3 h-3 transition-all duration-150"
              style={{
                backgroundColor: lit ? '#22c55e' : '#27272a',
                boxShadow: lit ? '0 0 8px #22c55e, 0 0 4px #22c55e' : 'none',
              }}
            />
          ))}
        </div>

        {/* Progress Bar - Pixel Style */}
        <div className="w-64">
          <div className="flex items-center justify-between text-xs mb-2 text-zinc-500">
            <span>LOADING</span>
            <span className="text-accent">{Math.round(progress)}%</span>
          </div>
          <div className="h-3 bg-zinc-900 border border-zinc-800">
            <div
              className="h-full bg-accent transition-all duration-100 ease-out"
              style={{
                width: `${progress}%`,
                boxShadow: progress > 0 ? '0 0 10px #22c55e' : 'none',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
