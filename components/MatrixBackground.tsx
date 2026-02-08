import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface MatrixBackgroundProps {
  opacity?: number;
}

const MatrixBackground: React.FC<MatrixBackgroundProps> = ({ opacity = 0.15 }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(
      width / -2, width / 2,
      height / 2, height / -2,
      0.1, 1000
    );
    camera.position.z = 100;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Matrix characters
    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    const fontSize = 14;
    const columns = Math.ceil(width / fontSize);

    // Create canvas texture for characters
    const createCharTexture = (char: string, color: string) => {
      const canvas = document.createElement('canvas');
      canvas.width = fontSize;
      canvas.height = fontSize;
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = color;
      ctx.font = `${fontSize}px monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(char, fontSize / 2, fontSize / 2);
      return new THREE.CanvasTexture(canvas);
    };

    // Particle system for falling characters
    const particles: {
      mesh: THREE.Sprite;
      speed: number;
      char: string;
    }[] = [];

    const particleCount = columns * 2;

    for (let i = 0; i < particleCount; i++) {
      const char = chars[Math.floor(Math.random() * chars.length)];
      const brightness = Math.random() * 0.5 + 0.1;
      const color = `rgba(99, 102, 241, ${brightness})`;

      const texture = createCharTexture(char, color);
      const material = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        opacity: brightness * opacity * 2
      });

      const sprite = new THREE.Sprite(material);
      sprite.scale.set(fontSize, fontSize, 1);

      // Random position
      sprite.position.x = (Math.random() - 0.5) * width;
      sprite.position.y = (Math.random() - 0.5) * height;
      sprite.position.z = 0;

      scene.add(sprite);

      particles.push({
        mesh: sprite,
        speed: Math.random() * 30 + 10,
        char
      });
    }

    // Grid lines
    const gridMaterial = new THREE.LineBasicMaterial({
      color: 0x6366f1,
      transparent: true,
      opacity: 0.03
    });

    const gridSize = 20;
    const gridLines = new THREE.Group();

    // Vertical lines
    for (let x = -width / 2; x <= width / 2; x += gridSize) {
      const geometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(x, -height / 2, 0),
        new THREE.Vector3(x, height / 2, 0)
      ]);
      const line = new THREE.Line(geometry, gridMaterial);
      gridLines.add(line);
    }

    // Horizontal lines
    for (let y = -height / 2; y <= height / 2; y += gridSize) {
      const geometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-width / 2, y, 0),
        new THREE.Vector3(width / 2, y, 0)
      ]);
      const line = new THREE.Line(geometry, gridMaterial);
      gridLines.add(line);
    }

    scene.add(gridLines);

    // Animation
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      // Update particles
      particles.forEach((particle) => {
        particle.mesh.position.y -= particle.speed * 0.016;

        // Reset position when off screen
        if (particle.mesh.position.y < -height / 2 - fontSize) {
          particle.mesh.position.y = height / 2 + fontSize;
          particle.mesh.position.x = (Math.random() - 0.5) * width;

          // Occasionally change character
          if (Math.random() > 0.7) {
            const newChar = chars[Math.floor(Math.random() * chars.length)];
            const brightness = Math.random() * 0.5 + 0.1;
            const color = `rgba(99, 102, 241, ${brightness})`;
            const texture = createCharTexture(newChar, color);
            (particle.mesh.material as THREE.SpriteMaterial).map = texture;
            (particle.mesh.material as THREE.SpriteMaterial).opacity = brightness * opacity * 2;
          }
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;

      camera.left = newWidth / -2;
      camera.right = newWidth / 2;
      camera.top = newHeight / 2;
      camera.bottom = newHeight / -2;
      camera.updateProjectionMatrix();

      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);

      particles.forEach((particle) => {
        scene.remove(particle.mesh);
        particle.mesh.material.dispose();
        (particle.mesh.material as THREE.SpriteMaterial).map?.dispose();
      });

      gridLines.children.forEach((line) => {
        (line as THREE.Line).geometry.dispose();
      });
      gridMaterial.dispose();

      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [opacity]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 0 }}
    />
  );
};

export default MatrixBackground;
