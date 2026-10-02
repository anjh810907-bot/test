import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  rotation: number;
  rotationSpeed: number;
  emoji?: string;
  color?: string;
  type: 'emoji' | 'circle';
}

interface ParticleEffectProps {
  triggerCount: number;
  origin?: { x: number; y: number };
}

export default function ParticleEffect({ triggerCount, origin }: ParticleEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (triggerCount <= 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const startX = origin ? origin.x : width / 2;
    const startY = origin ? origin.y : height / 2;

    const emojis = ['🌰', '✨', '💖', '⭐', '🍓', '🍰'];
    const colors = ['#a855f7', '#ec4899', '#f59e0b', '#3b82f6', '#10b981', '#f43f5e'];

    // Spawn 32 particles
    for (let i = 0; i < 35; i++) {
      const angle = (Math.PI * 2 * i) / 35 + (Math.random() - 0.5) * 0.4;
      const speed = Math.random() * 8 + 4;
      const isEmoji = Math.random() > 0.45;

      particlesRef.current.push({
        x: startX,
        y: startY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2.5, // slight upward kick
        size: isEmoji ? Math.random() * 12 + 18 : Math.random() * 8 + 4,
        alpha: 1,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.2,
        emoji: isEmoji ? emojis[Math.floor(Math.random() * emojis.length)] : undefined,
        color: colors[Math.floor(Math.random() * colors.length)],
        type: isEmoji ? 'emoji' : 'circle',
      });
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.22; // gravity
        p.vx *= 0.98;
        p.alpha -= 0.016;
        p.rotation += p.rotationSpeed;

        if (p.alpha <= 0) return;

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        if (p.type === 'emoji' && p.emoji) {
          ctx.font = `${p.size}px sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(p.emoji, 0, 0);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color || '#a855f7';
          ctx.fill();
        }

        ctx.restore();
      });

      // Filter out dead particles
      particlesRef.current = particlesRef.current.filter((p) => p.alpha > 0);

      if (particlesRef.current.length > 0) {
        animFrameRef.current = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    if (!animFrameRef.current || particlesRef.current.length === 35) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = requestAnimationFrame(render);
    }

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [triggerCount, origin]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-50 h-full w-full"
    />
  );
}
