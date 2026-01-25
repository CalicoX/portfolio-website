import React, { useEffect, useRef } from 'react';

const DotMatrixBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Configuration - Pixel style
    const DOT_SIZE = 3; // Square size for pixel look
    const DOT_SPACING = 24;
    const MAX_SCALE = 1.8; // More subtle scaling
    const ACTIVATION_RADIUS = 150; // Larger radius for smoother proximity
    const BASE_COLOR = { r: 34, g: 197, b: 94 }; // Accent green
    const BASE_ALPHA = 0.08;

    // State
    interface Pixel {
      x: number;
      y: number;
      scale: number;
      targetScale: number;
      alpha: number;
      targetAlpha: number;
    }
    let pixels: Pixel[] = [];
    let animationFrameId: number;
    let mouseX = -1000;
    let mouseY = -1000;
    let canvasRect = { left: 0, top: 0 };

    // Initialize pixel grid
    const initPixels = (width: number, height: number) => {
      pixels = [];
      for (let x = DOT_SPACING / 2; x < width + DOT_SPACING; x += DOT_SPACING) {
        for (let y = DOT_SPACING / 2; y < height + DOT_SPACING; y += DOT_SPACING) {
          pixels.push({
            x,
            y,
            scale: 1,
            targetScale: 1,
            alpha: BASE_ALPHA,
            targetAlpha: BASE_ALPHA
          });
        }
      }
    };

    // Update mouse position
    const updateMousePosition = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    // Update canvas size
    const updateCanvasSize = () => {
      const { width, height } = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
      initPixels(width, height);
      canvasRect = canvas.getBoundingClientRect();
    };

    // Scroll handler
    const handleScroll = () => {
      canvasRect = canvas.getBoundingClientRect();
    };

    // Linear interpolation
    const lerp = (start: number, end: number, factor: number) => {
      return start + (end - start) * factor;
    };

    // Render loop
    const render = () => {
      const width = canvas.width / (window.devicePixelRatio || 1);
      const height = canvas.height / (window.devicePixelRatio || 1);

      ctx.clearRect(0, 0, width, height);

      const relMouseX = mouseX - canvasRect.left;
      const relMouseY = mouseY - canvasRect.top;

      // Update and draw pixels
      pixels.forEach(pixel => {
        const dx = pixel.x - relMouseX;
        const dy = pixel.y - relMouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Calculate proximity effect
        if (dist < ACTIVATION_RADIUS) {
          const factor = 1 - dist / ACTIVATION_RADIUS;
          // Smooth curve for more subtle effect
          const smoothFactor = factor * factor * (3 - 2 * factor); // Smoothstep
          pixel.targetScale = 1 + (MAX_SCALE - 1) * smoothFactor;
          pixel.targetAlpha = BASE_ALPHA + (0.25 - BASE_ALPHA) * smoothFactor;
        } else {
          pixel.targetScale = 1;
          pixel.targetAlpha = BASE_ALPHA;
        }

        // Smooth interpolation
        pixel.scale = lerp(pixel.scale, pixel.targetScale, 0.12);
        pixel.alpha = lerp(pixel.alpha, pixel.targetAlpha, 0.12);

        // Draw pixel (square for retro look)
        const size = DOT_SIZE * pixel.scale;
        const halfSize = size / 2;

        ctx.fillStyle = `rgba(${BASE_COLOR.r}, ${BASE_COLOR.g}, ${BASE_COLOR.b}, ${pixel.alpha})`;
        ctx.fillRect(
          pixel.x - halfSize,
          pixel.y - halfSize,
          size,
          size
        );
      });

      animationFrameId = requestAnimationFrame(render);
    };

    // Setup listeners
    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('resize', updateCanvasSize);
    window.addEventListener('scroll', handleScroll, { capture: true, passive: true });
    updateCanvasSize();

    render();

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('resize', updateCanvasSize);
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
};

export default DotMatrixBackground;
