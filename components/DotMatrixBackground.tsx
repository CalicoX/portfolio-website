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

    // Configuration
    const DOT_SPACING = 20;
    const DOT_RADIUS = 1;
    const MAX_SCALE = 2.5; // 减小放大倍数，更微妙
    const ACTIVATION_RADIUS = 100;
    const SPRING_STIFFNESS = 0.08; // 降低刚度，更慢更平滑
    const SPRING_DAMPING = 0.88; // 增加阻尼，减少回弹
    const COLOR = 'rgba(255, 255, 255, 0.05)'; // 更暗的圆点

    // State with velocity for spring physics
    interface Dot {
      x: number;
      y: number;
      scale: number;
      velocity: number; // For spring animation
    }
    let dots: Dot[] = [];
    let animationFrameId: number;
    let mouseX = -1000;
    let mouseY = -1000;
    let canvasRect = { left: 0, top: 0 };

    // Initialize dots
    const initDots = (width: number, height: number) => {
      dots = [];
      for (let x = DOT_SPACING / 2; x < width + DOT_SPACING; x += DOT_SPACING) {
        for (let y = DOT_SPACING / 2; y < height + DOT_SPACING; y += DOT_SPACING) {
          dots.push({ x, y, scale: 1, velocity: 0 });
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
      initDots(width, height);
      canvasRect = canvas.getBoundingClientRect();
    };

    // Scroll handler
    const handleScroll = () => {
      canvasRect = canvas.getBoundingClientRect();
    };

    // Setup listeners
    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('resize', updateCanvasSize);
    window.addEventListener('scroll', handleScroll, { capture: true, passive: true });
    updateCanvasSize();

    // Render loop with spring physics
    const render = () => {
      const width = canvas.width / (window.devicePixelRatio || 1);
      const height = canvas.height / (window.devicePixelRatio || 1);

      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = COLOR;

      const relMouseX = mouseX - canvasRect.left;
      const relMouseY = mouseY - canvasRect.top;

      dots.forEach(dot => {
        // Calculate distance to mouse
        const dx = dot.x - relMouseX;
        const dy = dot.y - relMouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Target scale based on mouse distance
        let targetScale = 1;
        if (dist < ACTIVATION_RADIUS) {
          // Smooth ease-in curve
          const factor = 1 - dist / ACTIVATION_RADIUS;
          targetScale = 1 + (MAX_SCALE - 1) * Math.pow(factor, 2);
        }

        // Spring physics: acceleration = stiffness * (target - current) - damping * velocity
        const acceleration = SPRING_STIFFNESS * (targetScale - dot.scale) - SPRING_DAMPING * dot.velocity;
        dot.velocity += acceleration;
        dot.scale += dot.velocity;

        // Draw dot
        const radius = DOT_RADIUS * Math.max(0.5, dot.scale);
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

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
