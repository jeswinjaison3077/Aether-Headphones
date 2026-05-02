"use client";

import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface DepthParallaxImageProps {
  src: string;
  alt?: string;
  className?: string;
  objectFit?: "contain" | "cover";
}

export default function DepthParallaxImage({ src, alt = "", className = "", objectFit = "contain" }: DepthParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Raw mouse position values (-0.5 to 0.5 relative to element center)
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  // Spring config: very slow, heavy spring — smooth entry AND smooth exit back to zero
  const springConfig = { stiffness: 60, damping: 20, mass: 1.2 };

  const springX = useSpring(rawX, springConfig);
  const springY = useSpring(rawY, springConfig);

  // Image moves more than the container (parallax depth illusion)
  // Container tilts subtly (rotateX/Y), image translates more aggressively inside
  const rotateX = useTransform(springY, [-0.5, 0.5], [6, -6]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-6, 6]);
  const imgX = useTransform(springX, [-0.5, 0.5], ["-4%", "4%"]);
  const imgY = useTransform(springY, [-0.5, 0.5], ["-4%", "4%"]);
  const imgScale = useSpring(1, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    rawX.set(x);
    rawY.set(y);
  };

  const handleMouseEnter = () => {
    imgScale.set(1.06);
  };

  const handleMouseLeave = () => {
    // Spring back to rest — the spring config ensures this is slow and smooth
    rawX.set(0);
    rawY.set(0);
    imgScale.set(1);
  };

  return (
    <div
      ref={ref}
      className={`${className} overflow-hidden rounded-3xl`}
      style={{ perspective: "1000px" }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          width: "100%",
          height: "100%",
        }}
        transition={{ type: "spring", stiffness: 60, damping: 20 }}
      >
        <motion.div
          style={{
            x: imgX,
            y: imgY,
            scale: imgScale,
            width: "108%",
            height: "108%",
            marginLeft: "-4%",
            marginTop: "-4%",
          }}
        >
          <img
            src={src}
            alt={alt}
            style={{
              width: "100%",
              height: "100%",
              objectFit: objectFit,
              display: "block",
            }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
