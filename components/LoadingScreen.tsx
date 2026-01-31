import React, { useState, useEffect, useRef } from 'react';
import MatrixBackground from './MatrixBackground';

// Module-level state to persist across remounts
// Check sessionStorage to persist across page refreshes
const isLoadingComplete = typeof window !== 'undefined' && sessionStorage.getItem('loadingComplete') === 'true';

let loadingState = {
  complete: isLoadingComplete,
  progress: isLoadingComplete ? 100 : 0,
  blocks: [] as boolean[],
  blockColors: [] as string[],
  shuffledIndices: [] as number[],
  currentIndex: 0,
  initialized: isLoadingComplete
};

const LoadingScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [progress, setProgress] = useState(loadingState.progress);
  const [blocks, setBlocks] = useState<boolean[]>(loadingState.blocks);
  const [glitchIndex, setGlitchIndex] = useState<number[]>([]);
  const [titleGlitch, setTitleGlitch] = useState(false);
  const [completionFlash, setCompletionFlash] = useState(false);
  const blockColors = useRef<string[]>(loadingState.blockColors);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const titleGlitchTimerRef = useRef<NodeJS.Timeout | null>(null);

  const TOTAL_BLOCKS = 144;
  const GRID_SIZE = 12;
  const COLORS = ['#22c55e', '#16a34a', '#15803d', '#14532d', '#a3e635', '#84cc16'];

  useEffect(() => {
    // If already completed, finish immediately
    if (loadingState.complete) {
      setProgress(100);
      setBlocks(new Array(TOTAL_BLOCKS).fill(true));
      setTimeout(() => onComplete(), 100);
      return;
    }

    // Initialize on first mount
    if (!loadingState.initialized) {
      loadingState.initialized = true;
      loadingState.blocks = new Array(TOTAL_BLOCKS).fill(false);
      loadingState.blockColors = new Array(TOTAL_BLOCKS).fill('');
      loadingState.shuffledIndices = Array.from({ length: TOTAL_BLOCKS }, (_, i) => i)
        .sort(() => Math.random() - 0.5);
      loadingState.currentIndex = 0;

      setBlocks(loadingState.blocks);
      blockColors.current = loadingState.blockColors;
      setProgress(loadingState.progress);
    }

    // Resume from current progress
    const duration = 2500;
    const interval = 20;
    const increment = 100 / (duration / interval);
    let currentProgress = loadingState.progress;
    let currentIndex = loadingState.currentIndex;

    const titleGlitchInterval = setInterval(() => {
      if (Math.random() > 0.85) {
        setTitleGlitch(true);
        setTimeout(() => setTitleGlitch(false), 50 + Math.random() * 100);
      }
    }, 200);
    titleGlitchTimerRef.current = titleGlitchInterval;

    const timer = setInterval(() => {
      currentProgress += increment;

      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(timer);
        clearInterval(titleGlitchInterval);
        loadingState.complete = true;
        loadingState.progress = 100;
        // Save to sessionStorage so page refresh skips loading screen
        sessionStorage.setItem('loadingComplete', 'true');

        setProgress(100);
        setCompletionFlash(true);
        setBlocks(new Array(TOTAL_BLOCKS).fill(true));
        setGlitchIndex(Array.from({ length: TOTAL_BLOCKS }, (_, i) => i));

        setTimeout(() => {
          setCompletionFlash(false);
          setTimeout(() => {
            onComplete();
          }, 300);
        }, 400);
        return;
      }

      loadingState.progress = currentProgress;
      setProgress(currentProgress);

      const targetLit = Math.floor((currentProgress / 100) * TOTAL_BLOCKS);
      while (currentIndex < targetLit && currentIndex < TOTAL_BLOCKS) {
        const indexToLight = loadingState.shuffledIndices[currentIndex];
        loadingState.blocks[indexToLight] = true;
        loadingState.blockColors[indexToLight] = COLORS[Math.floor(Math.random() * COLORS.length)];
        loadingState.currentIndex = currentIndex + 1;

        setBlocks([...loadingState.blocks]);
        blockColors.current = loadingState.blockColors;
        currentIndex++;
      }

      if (Math.random() > 0.65) {
        setGlitchIndex(Array.from({ length: Math.floor(Math.random() * 8) },
          () => Math.floor(Math.random() * TOTAL_BLOCKS)));
      }
    }, interval);
    timerRef.current = timer;

    return () => {
      clearInterval(timer);
      clearInterval(titleGlitchInterval);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black overflow-hidden">
      {/* CRT Screen Curvature Effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 60%, rgba(0, 0, 0, 0.4) 100%)',
        }}
      />

      {/* CRT Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 70%, rgba(0, 0, 0, 0.8) 100%)',
        }}
      />

      {/* Fish-eye barrel distortion effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 50%, rgba(34, 197, 94, 0.03) 90%, rgba(34, 197, 94, 0.08) 100%)',
        }}
      />

      <MatrixBackground opacity={0.15} />

      {/* Multi-layer scanlines */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Primary bright scanline */}
        <div
          className="w-full h-0.5 bg-white/10 absolute left-0 animate-[scanline_2.5s_linear_infinite]"
          style={{
            boxShadow: '0 0 30px rgba(34, 197, 94, 0.5), 0 0 60px rgba(34, 197, 94, 0.3)',
          }}
        />
        {/* Secondary dim scanline */}
        <div
          className="w-full h-0.5 bg-white/5 absolute left-0 animate-[scanline_4s_linear_infinite]"
          style={{
            animationDelay: '1.25s',
            boxShadow: '0 0 20px rgba(34, 197, 94, 0.3)',
          }}
        />
        {/* Horizontal scanlines overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(34, 197, 94, 0.03) 2px, rgba(34, 197, 94, 0.03) 4px)',
            backgroundSize: '100% 4px',
          }}
        />
        {/* CRT lines */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
            backgroundSize: '100% 2px, 3px 100%',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* Chromatic aberration on edges */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          boxShadow: 'inset 0 0 100px rgba(34, 197, 94, 0.1), inset 0 0 50px rgba(139, 92, 246, 0.05)',
        }}
      />

      {completionFlash && (
        <div className="absolute inset-0 bg-accent/30 z-30 animate-flash" />
      )}

      {/* Content with slight barrel distortion */}
      <div
        className="flex flex-col items-center gap-6 md:gap-10 px-4 relative z-10"
        style={{
          transform: 'perspective(1000px) scale(0.98)',
        }}
      >
        {/* PORTFOLIO Title with pixel font style */}
        <div className="relative animate-[flicker_3s_infinite]">
          {titleGlitch ? (
            <h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-wider select-none text-center"
              style={{
                fontFamily: '"Press Start 2P", "Courier New", monospace',
                color: '#22c55e',
                textShadow: '3px 0 #ff0000, -3px 0 #00ffff, 0 0 30px #22c55e, 0 0 50px rgba(34,197,94,0.8)',
                transform: `translate(${Math.random() * 8 - 4}px, ${Math.random() * 4 - 2}px) scale(${1 + Math.random() * 0.1})`,
                filter: 'brightness(1.5) contrast(1.2) saturate(1.5)',
                letterSpacing: '4px',
                imageRendering: 'pixelated',
              }}
            >
              ▓▓░PORTFOLIO░▓▓
            </h1>
          ) : (
            <>
              <h1
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-wider select-none text-center"
                style={{
                  fontFamily: '"Press Start 2P", "Courier New", monospace',
                  textShadow: '0 0 20px rgba(255,255,255,0.5), 0 0 40px rgba(34,197,94,0.3), 2px 2px 4px rgba(0,0,0,0.8)',
                  letterSpacing: '4px',
                  imageRendering: 'pixelated',
                  filter: 'drop-shadow(0 0 10px rgba(34,197,94,0.5))',
                }}
              >
                ▓▓░PORTFOLIO░▓▓
              </h1>
              {/* RGB split effect layers */}
              <div
                className="absolute inset-0 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-wider select-none"
                style={{
                  fontFamily: '"Press Start 2P", "Courier New", monospace',
                  color: '#ff0000',
                  opacity: 0.25,
                  transform: 'translate(-2px, 0)',
                  letterSpacing: '4px',
                  imageRendering: 'pixelated',
                  mixBlendMode: 'screen',
                }}
              >
                ▓▓░PORTFOLIO░▓▓
              </div>
              <div
                className="absolute inset-0 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-wider select-none"
                style={{
                  fontFamily: '"Press Start 2P", "Courier New", monospace',
                  color: '#00ffff',
                  opacity: 0.25,
                  transform: 'translate(2px, 0)',
                  letterSpacing: '4px',
                  imageRendering: 'pixelated',
                  mixBlendMode: 'screen',
                }}
              >
                ▓▓░PORTFOLIO░▓▓
              </div>
            </>
          )}
        </div>

        <div
          className="grid gap-1 p-3 md:p-4 bg-zinc-900/90 border-2 border-accent/40 rounded backdrop-blur-sm relative"
          style={{
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
            gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
            width: 'min(320px, calc(100vw - 40px))',
            height: 'min(320px, calc(100vw - 40px))',
            boxShadow: '0 0 30px rgba(34, 197, 94, 0.2), inset 0 0 30px rgba(0, 0, 0, 0.5)',
          }}
        >
          <div className="absolute -top-1 -left-1 w-3 h-3 md:w-4 md:h-4 border-t-2 border-l-2 border-accent" />
          <div className="absolute -top-1 -right-1 w-3 h-3 md:w-4 md:h-4 border-t-2 border-r-2 border-accent" />
          <div className="absolute -bottom-1 -left-1 w-3 h-3 md:w-4 md:h-4 border-b-2 border-l-2 border-accent" />
          <div className="absolute -bottom-1 -right-1 w-3 h-3 md:w-4 md:h-4 border-b-2 border-r-2 border-accent" />

          {blocks.map((lit, index) => {
            const isGlitch = glitchIndex.includes(index);
            const color = blockColors.current[index] || '#22c55e';
            return (
              <div
                key={index}
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: lit ? (isGlitch ? '#a3e635' : color) : '#18181b',
                  boxShadow: lit
                    ? (isGlitch
                      ? `0 0 15px ${color}, 0 0 25px ${color}, 0 0 35px #22c55e`
                      : `0 0 8px ${color}, 0 0 15px rgba(34,197,94,0.5)`)
                    : 'inset 0 0 5px rgba(0,0,0,0.5)',
                }}
              />
            );
          })}
        </div>

        <div className="w-full max-w-[320px] md:w-96">
          <div className="flex items-center justify-between text-[10px] md:text-xs mb-2 md:mb-3 text-zinc-400">
            <span className="font-mono tracking-wider animate-pulse text-[10px] md:text-xs">
              <span className="text-accent">▶</span> <span className="hidden sm:inline">LOADING</span>SYSTEM
            </span>
            <span
              className="text-accent font-mono text-lg md:text-xl font-bold"
              style={{
                textShadow: '0 0 10px #22c55e, 0 0 20px rgba(34,197,94,0.6)',
              }}
            >
              {Math.round(progress)}%
            </span>
          </div>
          <div
            className="h-4 md:h-5 bg-zinc-900 border-2 border-zinc-700 rounded overflow-hidden relative"
            style={{
              boxShadow: 'inset 0 0 10px rgba(0,0,0,0.8)',
            }}
          >
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: 'linear-gradient(90deg, transparent 19px, #22c55e 20px)',
                backgroundSize: '20px 100%',
              }}
            />
            <div
              className="h-full bg-gradient-to-r from-accent via-green-400 to-lime-400 transition-all duration-75 ease-out relative"
              style={{
                width: `${progress}%`,
              }}
            >
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                style={{
                  animation: 'shimmer 1s ease-in-out infinite',
                  backgroundSize: '200% 100%',
                }}
              />
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/30 to-transparent"
                style={{
                  animation: 'shimmer 1.5s ease-in-out infinite reverse',
                  backgroundSize: '150% 100%',
                }}
              />
            </div>
          </div>
          <div className="mt-3 md:mt-4 text-center">
            <p className="text-[10px] sm:text-xs md:text-sm text-zinc-500 font-mono tracking-wide">
              {progress < 15 ? '█ INITIALIZING...' :
                progress < 30 ? '█ LOADING MODULES...' :
                  progress < 45 ? '█ CONNECTING...' :
                    progress < 60 ? '█ DECRYPTING...' :
                      progress < 75 ? '█ RENDERING...' :
                        progress < 90 ? '█ OPTIMIZING...' :
                          '█ SYSTEM READY'}
            </p>
          </div>

          <div className="flex justify-between mt-3 md:mt-4 opacity-30">
            <span className="text-[8px] md:text-[10px] font-mono text-accent">
              {Array.from({ length: 8 }, () => Math.random() > 0.5 ? '1' : '0').join('')}
            </span>
            <span className="text-[8px] md:text-[10px] font-mono text-accent">
              {Array.from({ length: 8 }, () => Math.random() > 0.5 ? '1' : '0').join('')}
            </span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scanline {
          0% { top: -5%; opacity: 0; }
          5% { opacity: 0.8; }
          10% { opacity: 0.4; }
          95% { opacity: 0.4; }
          100% { top: 105%; opacity: 0; }
        }
        @keyframes flash {
          0% { opacity: 0; }
          10% { opacity: 0.8; }
          20% { opacity: 0.2; }
          30% { opacity: 0.9; }
          40% { opacity: 0.1; }
          50% { opacity: 0.7; }
          100% { opacity: 0; }
        }
        @keyframes flicker {
          0%, 100% { opacity: 1; }
          41% { opacity: 0.98; }
          42% { opacity: 0.92; }
          43% { opacity: 0.96; }
          45% { opacity: 0.99; }
          46% { opacity: 0.94; }
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;
