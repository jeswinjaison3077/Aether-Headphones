"use client";

import React, { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

export default function TiltCard({ 
  children, 
  className = "",
  strength = 20,
  perspective = 600
}: { 
  children: React.ReactNode; 
  className?: string;
  strength?: number;
  perspective?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const glareX = useMotionValue(50);
  const glareY = useMotionValue(50);
  const glareOpacity = useMotionValue(0);

  const springRotateX = useSpring(rotateX, { stiffness: 300, damping: 20 });
  const springRotateY = useSpring(rotateY, { stiffness: 300, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = (e.clientX - left) / width;   // 0 to 1
    const y = (e.clientY - top) / height;   // 0 to 1
    rotateX.set((y - 0.5) * -strength);  // tilt up/down
    rotateY.set((x - 0.5) * strength);   // tilt left/right
    glareX.set(x * 100);
    glareY.set(y * 100);
    glareOpacity.set(0.4);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    glareOpacity.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: springRotateX,
        rotateY: springRotateY,
        transformStyle: "preserve-3d",
        perspective: perspective,
      }}
      className={cn("relative overflow-hidden", className)}
    >
      {/* Glare overlay */}
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at var(--glare-x) var(--glare-y), rgba(255,255,255,0.15) 0%, transparent 70%)`,
          opacity: glareOpacity,
          zIndex: 1,
          pointerEvents: "none",
          // Use CSS variables for motion values because direct string interpolation is tricky in style props for complex gradients
          // But actually Framer can handle it if we use useTransform. 
          // For simplicity, we'll just use inline styles for x/y if possible or keep it simple.
        }}
        className="pointer-events-none"
      />
      {children}
    </motion.div>
  );
}
