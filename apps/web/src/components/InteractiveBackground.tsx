"use client";

import { useEffect, useRef, useCallback } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface Particle {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  size: number;
}

const PARTICLE_COUNT = 80;
const CONNECT_DIST = 140;
const MOUSE_RADIUS = 220;

export function InteractiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const particlesRef = useRef<Particle[]>([]);
  const animRef = useRef<number>(0);

  const mouseX = useMotionValue(typeof window !== "undefined" ? window.innerWidth / 2 : 0);
  const mouseY = useMotionValue(typeof window !== "undefined" ? window.innerHeight / 2 : 0);
  const glowX = useSpring(mouseX, { stiffness: 80, damping: 20 });
  const glowY = useSpring(mouseY, { stiffness: 80, damping: 20 });
  const ringX = useSpring(mouseX, { stiffness: 120, damping: 18 });
  const ringY = useSpring(mouseY, { stiffness: 120, damping: 18 });

  const initParticles = useCallback((w: number, h: number) => {
    particlesRef.current = Array.from({ length: PARTICLE_COUNT }, () => {
      const x = Math.random() * w;
      const y = Math.random() * h;
      return { x, y, baseX: x, baseY: y, size: Math.random() * 2 + 1 };
    });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (particlesRef.current.length === 0) {
        initParticles(canvas.width, canvas.height);
      }
    };

    const handleMove = (x: number, y: number) => {
      mouseRef.current = { x, y };
      mouseX.set(x);
      mouseY.set(y);
    };

    resize();
    handleMove(window.innerWidth / 2, window.innerHeight / 2);

    const draw = () => {
      const { width, height } = canvas;
      const { x: mx, y: my } = mouseRef.current;
      ctx.clearRect(0, 0, width, height);

      for (const p of particlesRef.current) {
        const dx = mx - p.baseX;
        const dy = my - p.baseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE_RADIUS) {
          const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS;
          p.x = p.baseX + dx * force * 0.18;
          p.y = p.baseY + dy * force * 0.18;
        } else {
          p.x += (p.baseX - p.x) * 0.06;
          p.y += (p.baseY - p.y) * 0.06;
        }

        const mouseDist = Math.sqrt((mx - p.x) ** 2 + (my - p.y) ** 2);
        const alpha = mouseDist < MOUSE_RADIUS ? 0.9 - mouseDist / MOUSE_RADIUS * 0.5 : 0.25;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(168, 85, 247, ${alpha})`;
        ctx.fill();

        if (mouseDist < CONNECT_DIST) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mx, my);
          ctx.strokeStyle = `rgba(59, 130, 246, ${0.35 * (1 - mouseDist / CONNECT_DIST)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      animRef.current = requestAnimationFrame(draw);
    };

    draw();

    const onMouseMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY);
    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) handleMove(t.clientX, t.clientY);
    };

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchmove", onTouchMove, { passive: true });

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, [mouseX, mouseY, initParticles]);

  return (
    <div
      aria-hidden
      className="fixed inset-0 z-0 overflow-hidden pointer-events-none"
    >
      {/* Base gradient */}
      <div className="absolute inset-0 bg-[#0a0a12]" />

      {/* Canvas particle network */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Floating blobs */}
      <motion.div
        className="absolute -top-32 -left-32 w-[30rem] h-[30rem] rounded-full bg-primary/25 blur-[100px]"
        animate={{ x: [0, 50, 0], y: [0, -40, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/4 -right-32 w-96 h-96 rounded-full bg-secondary/20 blur-[90px]"
        animate={{ x: [0, -40, 0], y: [0, 50, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 left-1/3 w-80 h-80 rounded-full bg-accent/15 blur-[80px]"
        animate={{ x: [0, 30, 0], y: [0, -25, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Mouse spotlight */}
      <motion.div
        className="absolute w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full mix-blend-screen"
        style={{
          left: glowX,
          top: glowY,
          background:
            "radial-gradient(circle, rgba(168, 85, 247, 0.35) 0%, rgba(59, 130, 246, 0.15) 35%, transparent 65%)",
        }}
      />

      {/* Cursor ring */}
      <motion.div
        className="absolute w-10 h-10 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-primary/50 shadow-[0_0_20px_rgba(168,85,247,0.4)]"
        style={{ left: ringX, top: ringY }}
      />

      {/* Inner dot */}
      <motion.div
        className="absolute w-2 h-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary shadow-[0_0_12px_rgba(168,85,247,0.8)]"
        style={{ left: ringX, top: ringY }}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a0a12]/90" />
    </div>
  );
}
