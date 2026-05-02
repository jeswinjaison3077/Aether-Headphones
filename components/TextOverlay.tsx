"use client";

import React from "react";
import { motion, useTransform, MotionValue } from "framer-motion";
import { cn } from "@/lib/utils";

interface TextOverlayProps {
  title: string;
  subtitle: string;
<<<<<<< HEAD
  align?: "left" | "center" | "right" | "top-left" | "bottom-right" | "center-top";

  startRange: number; // 0 to 1
  endRange: number; // 0 to 1
  scrollYProgress: MotionValue<number>;
  maxOpacity?: number;
  titleClass?: string;
  subtitleClass?: string;
  variant?: "default" | "aether";
  premiumFadeIn?: boolean; // Enable blur dissolve on entry only
  className?: string;
=======
  align?: "left" | "center" | "right";
  startRange: number; // 0 to 1
  endRange: number; // 0 to 1
  scrollYProgress: MotionValue<number>;
>>>>>>> b65688a6b4da83c578a44bdae3be623940d3f4cc
}

export default function TextOverlay({
  title,
  subtitle,
  align = "center",
  startRange,
  endRange,
  scrollYProgress,
<<<<<<< HEAD
  maxOpacity = 1,
  titleClass = "text-5xl md:text-7xl lg:text-8xl",
  subtitleClass = "text-lg md:text-2xl text-black/60",
  variant = "default",
  premiumFadeIn = false,
  freeze = false,
  className,
}: TextOverlayProps & { freeze?: boolean }) {
  const rangeLength = endRange - startRange;
  const fadeInRange = rangeLength * (premiumFadeIn ? 0.25 : 0.15);
  const fadeOutRange = rangeLength * 0.15;

  // Opacity: fade in → hold (→ optional fade out if not frozen)
  const opacity = useTransform(
    scrollYProgress,
    freeze 
      ? [startRange, startRange + fadeInRange]
      : [startRange, startRange + fadeInRange, endRange - fadeOutRange, endRange],
    freeze
      ? [0, maxOpacity]
      : [0, maxOpacity, maxOpacity, 0]
  );

  // Vertical movement: slide in (→ optional slide out if not frozen)
  const y = useTransform(
    scrollYProgress,
    freeze
      ? [startRange, startRange + fadeInRange]
      : [startRange, startRange + fadeInRange, endRange - fadeOutRange, endRange],
    freeze
      ? [premiumFadeIn ? 30 : 40, 0]
      : [premiumFadeIn ? 30 : 40, 0, 0, -80]
  );

  // Always call hooks (React rules), but only apply if premiumFadeIn
  const scale = useTransform(
    scrollYProgress,
    [startRange, startRange + fadeInRange],
    [premiumFadeIn ? 0.97 : 1, 1]
  );

  const blurIn = useTransform(
    scrollYProgress,
    [startRange, startRange + fadeInRange],
    [premiumFadeIn ? 8 : 0, 0]
  );

  const filter = useTransform(blurIn, (b: number) => 
    b > 0.1 ? `blur(${b}px)` : "none"
  );

  // Progress within the entry range (0 to 1) for aether variant
  const entryProgress = useTransform(
    scrollYProgress,
    [startRange, startRange + fadeInRange],
    [0, 1]
  );

  const alignmentClasses = {
    "left": "top-1/2 -translate-y-1/2 items-start text-left pl-4 md:pl-16",
    "center": "top-1/2 -translate-y-1/2 items-center text-center",
    "right": "top-1/2 -translate-y-1/2 items-end text-right pr-4 md:pr-16",
    "top-left": "top-16 md:top-32 items-start text-left pl-4 md:pl-16",
    "bottom-right": "bottom-16 md:bottom-32 items-end text-right pr-4 md:pr-16",
    "center-top": "top-[15%] items-center text-center",
  };

  const characters = title.split("");

  return (
    <motion.div
      style={{ opacity, y, scale, filter }}
      className={cn(
        "fixed w-full flex flex-col pointer-events-none px-6 z-10",
        alignmentClasses[align],
        className
      )}
    >
      <div className={cn("max-w-2xl", (align === "center" || align === "center-top") && "flex flex-col items-center")}>
        
        {variant === "aether" ? (
          <div className="flex overflow-hidden py-4">
            {characters.map((char, i) => {
              const totalChars = characters.length;
              const charStart = (i / totalChars) * 0.4;
              const charEnd = charStart + 0.6;

              const charOpacity = useTransform(
                entryProgress,
                [charStart, charEnd],
                [0, 1]
              );

              const charY = useTransform(
                entryProgress,
                [charStart, charEnd],
                [12, 0]
              );

              const charBlur = useTransform(
                entryProgress,
                [charStart, charEnd],
                [6, 0]
              );

              const charFilter = useTransform(
                charBlur,
                (b: number) => b > 0.1 ? `blur(${b}px)` : "none"
              );

              return (
                <motion.span
                  key={i}
                  whileHover={{ scale: 1.1, y: -8, color: "#444" }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  style={{ 
                    y: charY, 
                    opacity: charOpacity,
                    filter: charFilter,
                    display: "inline-block"
                  }}
                  className={cn("tracking-[-0.02em] leading-none cursor-default", titleClass)}
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              );
            })}
          </div>
        ) : (
          <motion.h2 
            whileHover={{ scale: 1.05, color: "#333" }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            className={cn("text-black font-bold tracking-tighter leading-none mb-4 md:mb-6 cursor-default", titleClass)}
          >
            {title}
          </motion.h2>
        )}

        <motion.p 
          whileHover={{ x: 10, color: "#000" }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          style={{ opacity: variant === "aether" ? entryProgress : 1 }}
          className={cn("font-light tracking-wide max-w-xl leading-relaxed cursor-default", subtitleClass)}
        >
          {subtitle}
        </motion.p>
=======
}: TextOverlayProps) {
  const rangeLength = endRange - startRange;
  const fadeRange = rangeLength * 0.1; // 10% of this block's range

  // Opacity: fade in → visible → fade out
  const opacity = useTransform(
    scrollYProgress,
    [startRange, startRange + fadeRange, endRange - fadeRange, endRange],
    [0, 1, 1, 0]
  );

  // Subtle vertical parallax: enter y:40→0, exit 0→-40
  const y = useTransform(
    scrollYProgress,
    [startRange, startRange + fadeRange, endRange - fadeRange, endRange],
    [40, 0, 0, -40]
  );

  const alignmentClasses = {
    left: "items-start text-left ml-8 md:ml-24",
    center: "items-center text-center mx-auto",
    right: "items-end text-right mr-8 md:mr-24 ml-auto",
  };

  return (
    <motion.div
      style={{ opacity, y }}
      className={cn(
        "fixed top-1/2 -translate-y-1/2 w-full flex flex-col pointer-events-none px-6 z-10",
        alignmentClasses[align]
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "flex flex-col items-center")}>
        <h2
          className="text-black font-bold tracking-tighter leading-none mb-6 text-5xl md:text-7xl lg:text-8xl"
        >
          {title}
        </h2>

        <p className="text-black/60 text-lg md:text-2xl font-light tracking-wide max-w-xl leading-relaxed">
          {subtitle}
        </p>
>>>>>>> b65688a6b4da83c578a44bdae3be623940d3f4cc
      </div>
    </motion.div>
  );
}
