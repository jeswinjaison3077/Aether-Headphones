"use client";

import React, { useRef, useEffect } from "react";

interface InteractiveParticlesProps {
  intensity?: number;
  className?: string;
}

export default function InteractiveParticles({ intensity = 1, className = "fixed inset-0 pointer-events-none z-0" }: InteractiveParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: Array<{x: number, y: number, size: number, vx: number, vy: number, baseVx: number, baseVy: number}> = [];
    let mouse = { x: -1000, y: -1000 };
    let animationFrameId: number;
    
    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles = [];
      const numParticles = window.innerWidth < 768 ? 80 : 250;
      for (let i = 0; i < numParticles; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 1,
          vx: (Math.random() - 0.5) * 1.0,
          vy: (Math.random() - 0.5) * 1.0,
          baseVx: (Math.random() - 0.5) * 1.0,
          baseVy: (Math.random() - 0.5) * 1.0,
        });
      }
    };

    init();
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        
        // Wrap around edges
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        
        // Mouse repel interaction
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 200; // Increased radius
        
        if (distance < maxDist) {
          const force = (maxDist - distance) / maxDist;
          // Push particles away
          p.x -= (dx / distance) * force * 4;
          p.y -= (dy / distance) * force * 4;
          
          // Draw connection lines to mouse
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(0, 0, 0, ${0.25 * intensity * (1 - distance/maxDist)})`; // Made lines darker
          ctx.lineWidth = 1;
          ctx.stroke();
        } else {
          p.vx = p.vx * 0.95 + p.baseVx * 0.05;
          p.vy = p.vy * 0.95 + p.baseVy * 0.05;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 0, 0, ${0.4 * intensity})`; // Made particles darker
        ctx.fill();
      });
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    
    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };
    
    const handleResize = () => {
      init();
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className={className}
    />
  );
}
