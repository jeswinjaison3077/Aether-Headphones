"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";

// Reusable animated SVG path that draws itself in
function DrawPath({
  d,
  delay = 0,
  className = "",
}: {
  d: string;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.path
      d={d}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ pathLength: 0, opacity: 0 }}
      whileInView={{ pathLength: reduce ? 1 : 1, opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 2.4, delay, ease: "easeInOut" as const }}
      className={className}
    />
  );
}

// Left-side doodle panel
export function LeftDoodle({ delay = 0 }: { delay?: number }) {
  return (
    <div className="absolute left-0 top-0 w-28 md:w-40 h-full pointer-events-none overflow-hidden">
      <svg
        viewBox="0 0 120 600"
        fill="none"
        className="absolute top-0 left-0 w-full h-full"
        aria-hidden
      >
        {/* Vertical wavy line */}
        <DrawPath
          d="M60 20 C45 80, 75 140, 60 200 C45 260, 75 320, 60 380 C45 440, 75 500, 60 580"
          delay={delay}
          className="stroke-black/8 stroke-[1.5]"
        />
        {/* Small circle accent */}
        <motion.circle
          cx="60" cy="120" r="4"
          fill="none"
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: delay + 0.8, duration: 0.6, ease: "easeOut" as const }}
          className="stroke-black/10 stroke-[1.5]"
        />
        {/* Tiny cross */}
        <motion.g
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: delay + 1.2, duration: 0.5 }}
        >
          <line x1="40" y1="280" x2="56" y2="296" stroke="currentColor" strokeWidth="1.5" className="text-black/8" />
          <line x1="56" y1="280" x2="40" y2="296" stroke="currentColor" strokeWidth="1.5" className="text-black/8" />
        </motion.g>
        {/* Bracket */}
        <DrawPath
          d="M70 380 L50 380 L50 420 L70 420"
          delay={delay + 0.5}
          className="stroke-black/8 stroke-[1.5]"
        />
        {/* Dotted vertical */}
        {[440, 460, 480, 500, 520].map((y, i) => (
          <motion.circle
            key={y}
            cx="60" cy={y} r="1.5"
            fill="currentColor"
            className="text-black/10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: delay + 1.5 + i * 0.1, duration: 0.3 }}
          />
        ))}
      </svg>
    </div>
  );
}

// Right-side doodle panel
export function RightDoodle({ delay = 0 }: { delay?: number }) {
  return (
    <div className="absolute right-0 top-0 w-28 md:w-40 h-full pointer-events-none overflow-hidden">
      <svg
        viewBox="0 0 120 600"
        fill="none"
        className="absolute top-0 right-0 w-full h-full"
        aria-hidden
      >
        {/* Arc */}
        <DrawPath
          d="M60 30 C90 90, 30 150, 60 240 C90 330, 30 420, 60 580"
          delay={delay + 0.3}
          className="stroke-black/7 stroke-[1.5]"
        />
        {/* Small diamond */}
        <motion.polygon
          points="60,80 70,95 60,110 50,95"
          fill="none"
          initial={{ opacity: 0, rotate: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, rotate: 45, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: delay + 1, duration: 0.8, ease: "easeOut" as const }}
          style={{ transformOrigin: "60px 95px" }}
          className="stroke-black/10 stroke-[1]"
        />
        {/* Horizontal tick marks */}
        {[200, 240, 280].map((y, i) => (
          <motion.line
            key={y}
            x1={50 - i * 4} y1={y} x2={70 + i * 4} y2={y}
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-black/8"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: delay + 0.8 + i * 0.15, duration: 0.5 }}
            style={{ transformOrigin: "60px" }}
          />
        ))}
        {/* Floating circle */}
        <motion.circle
          cx="60" cy="400" r="20"
          fill="none"
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: delay + 1.4, duration: 0.7, ease: "easeOut" as const }}
          className="stroke-black/8 stroke-[1]"
        />
        <motion.circle
          cx="60" cy="400" r="8"
          fill="none"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: delay + 1.7, duration: 0.5 }}
          className="stroke-black/10 stroke-[1]"
        />
      </svg>
    </div>
  );
}

// Precomputed waveform data — static so server and client produce identical values
const WAVE_COUNT = 40;
const WAVE_LINES = Array.from({ length: WAVE_COUNT }, (_, i) => ({
  x: Math.round((i / (WAVE_COUNT - 1)) * 800 * 10000) / 10000,
  h: Math.round(Math.sin((i / (WAVE_COUNT - 1)) * Math.PI) * 80 * 10000) / 10000,
}));

// Floating waveform bg — used in Sound Viz section
export function WaveformBg() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
      <svg viewBox="0 0 800 200" className="w-full max-w-4xl" fill="none" aria-hidden>
        {WAVE_LINES.map((line, i) => (
          <motion.line
            key={i}
            x1={line.x} y1={100}
            x2={line.x} y2={100 - line.h}
            stroke="black"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeOpacity={0.07}
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.025, duration: 0.8, ease: "easeOut" as const }}
            style={{ transformOrigin: `${line.x}px 100px` }}
          />
        ))}
        {WAVE_LINES.map((line, i) => (
          <motion.line
            key={`r-${i}`}
            x1={line.x} y1={100}
            x2={line.x} y2={100 + line.h}
            stroke="black"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeOpacity={0.04}
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.025 + 0.15, duration: 0.8, ease: "easeOut" as const }}
            style={{ transformOrigin: `${line.x}px 100px` }}
          />
        ))}
      </svg>
    </div>
  );
}
