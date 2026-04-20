"use client";

import React from "react";
import { motion, useTransform, MotionValue } from "framer-motion";
import { cn } from "@/lib/utils";

interface TextOverlayProps {
  title: string;
  subtitle: string;
  align?: "left" | "center" | "right";
  startRange: number; // 0 to 1
  endRange: number; // 0 to 1
  scrollYProgress: MotionValue<number>;
}

export default function TextOverlay({
  title,
  subtitle,
  align = "center",
  startRange,
  endRange,
  scrollYProgress,
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
      </div>
    </motion.div>
  );
}
