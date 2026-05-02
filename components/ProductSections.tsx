"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent, useMotionValue } from "framer-motion";
import { useRouter } from "next/navigation";
import { usePageTransition } from "@/components/PageTransition";
import LiquidImage from "@/components/LiquidImage";
import DepthParallaxImage from "@/components/DepthParallaxImage";
import { useSound } from "@/components/useSound";
import { cn } from "@/lib/utils";
import { LeftDoodle, RightDoodle } from "./DoodleLayer";
import Magnetic from "./Magnetic";


const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// ── 3D Tilt Card (for spec tiles) ────────────────────────────────
function TiltCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
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
    rotateX.set((y - 0.5) * -20);  // tilt up/down max ±20deg
    rotateY.set((x - 0.5) * 20);   // tilt left/right max ±20deg
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
        perspective: 600,
      }}
      className={cn("relative overflow-hidden", className)}
    >
      {/* Glare overlay */}
      <motion.div
        style={{
          opacity: glareOpacity,
          background: useTransform(
            [glareX, glareY],
            ([x, y]: number[]) =>
              `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,0.6) 0%, transparent 70%)`
          ),
        }}
        className="absolute inset-0 pointer-events-none z-20"
      />
      {children}
    </motion.div>
  );
}


// ── Interactive Particles ────────────────────────────────────────
function DustParticle({ i, mouseX, mouseY }: { i: number; mouseX: any; mouseY: any }) {
  const xOffset = useSpring(useTransform(mouseX, [0, 2000], [0, (i - 20) * 20]), { stiffness: 40, damping: 25 });
  const yOffset = useSpring(useTransform(mouseY, [0, 1000], [0, (i - 20) * 20]), { stiffness: 40, damping: 25 });

  return (
    <motion.div
      className="absolute w-[3px] h-[3px] bg-black/[0.15] rounded-full shadow-sm"
      initial={{
        left: `${(i * 7.7) % 100}%`,
        top: `${(i * 13.3) % 100}%`
      }}
      animate={{
        x: [0, (i % 2 === 0 ? 1 : -1) * 70],
        y: [0, (i % 3 === 0 ? 1 : -1) * 70],
        opacity: [0.2, 0.6, 0.2],
      }}
      transition={{
        duration: 15 + (i % 10),
        repeat: Infinity,
        ease: "easeInOut",
      }}
      style={{ x: xOffset, y: yOffset }}
    />
  );
}

function HudParticle({ i, mouseX, mouseY }: { i: number; mouseX: any; mouseY: any }) {
  const xOffset = useSpring(useTransform(mouseX, [0, 2000], [0, (i - 7) * 50]), { stiffness: 60, damping: 30 });
  const yOffset = useSpring(useTransform(mouseY, [0, 1000], [0, (i - 7) * 50]), { stiffness: 60, damping: 30 });

  return (
    <motion.div
      className="absolute flex items-center justify-center"
      initial={{
        left: `${(i * 3.3) % 100}%`,
        top: `${(i * 7.7) % 100}%`
      }}
      style={{ x: xOffset, y: yOffset }}
    >
      <div className="w-5 h-[1.5px] bg-black/[0.08] absolute" />
      <div className="h-5 w-[1.5px] bg-black/[0.08] absolute" />
      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 3, repeat: Infinity, delay: (i * 0.15) % 2 }}
        className="w-1.5 h-1.5 bg-black/10 rounded-full shadow-sm"
      />
    </motion.div>
  );
}

function InteractiveParticles() {
  const [mounted, setMounted] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    setMounted(true);
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      {[...Array(100)].map((_, i) => (
        <DustParticle key={`dust-${i}`} i={i} mouseX={mouseX} mouseY={mouseY} />
      ))}
      {[...Array(30)].map((_, i) => (
        <HudParticle key={`hud-${i}`} i={i} mouseX={mouseX} mouseY={mouseY} />
      ))}
    </div>
  );
}


function MagneticLetter({ letter }: { letter: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.4, y: middleY * 0.4 });
    setIsHovered(true);
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
    setIsHovered(false);
  };

  return (
    <span
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={reset}
      className="relative inline-block px-[0.1em] cursor-default group/letter"
    >
      {/* Ghost Background Echo 1 (Slowest) */}
      <motion.span
        animate={{
          x: position.x * 0.2,
          y: position.y * 0.2,
          opacity: isHovered ? 0.3 : 0.05,
          filter: isHovered ? "blur(4px)" : "blur(0px)"
        }}
        transition={{ type: "spring", stiffness: 100, damping: 25 }}
        className="absolute inset-0 text-black select-none pointer-events-none flex items-center justify-center"
        style={{ WebkitTextStroke: "1px rgba(0,0,0,0.1)", color: "transparent" }}
      >
        {letter}
      </motion.span>

      {/* Ghost Background Echo 2 (Medium) */}
      <motion.span
        animate={{
          x: position.x * 0.5,
          y: position.y * 0.5,
          opacity: isHovered ? 0.2 : 0,
          scale: isHovered ? 1.1 : 1
        }}
        transition={{ type: "spring", stiffness: 150, damping: 20 }}
        className="absolute inset-0 text-black select-none pointer-events-none flex items-center justify-center"
        style={{ WebkitTextStroke: "1px rgba(0,0,0,0.05)", color: "transparent" }}
      >
        {letter}
      </motion.span>

      {/* Main Letter (Responsive) */}
      <motion.span
        animate={{
          x: position.x,
          y: position.y,
          scale: isHovered ? 1.05 : 1,
          color: isHovered ? "#000" : "#111",
        }}
        transition={{ type: "spring", stiffness: 200, damping: 15, mass: 0.5 }}
        className="relative z-10 block pointer-events-none transition-colors duration-300"
      >
        {letter}
      </motion.span>

      {/* Bottom Underline Highlight */}
      <motion.div
        animate={{
          width: isHovered ? "100%" : "0%",
          opacity: isHovered ? 1 : 0,
          x: position.x * 0.8
        }}
        className="absolute -bottom-2 left-0 h-[2px] bg-black/10 rounded-full"
      />
    </span>
  );
}

function LegacyHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 100, filter: "blur(20px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ margin: "100% 0px -10% 0px" }}
      transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex flex-col items-center"
    >
      <h2 className="text-7xl md:text-[8rem] font-bold tracking-tighter text-black leading-none flex justify-center cursor-default">
        {"LEGACY".split("").map((letter, i) => (
          <MagneticLetter key={i} letter={letter} />
        ))}
      </h2>
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ margin: "0px 0px -20% 0px" }}
        transition={{ duration: 1, delay: 0.5 }}
        className="text-sm md:text-xl text-black/40 font-light mt-4 md:mt-6"
      >
        Built to last, engineered to inspire.
      </motion.p>
    </motion.div>
  );
}


function FloatingGadget({ i, scrollYProgress, forceRange }: { i: number; scrollYProgress: any; forceRange?: [number, number] }) {
  // Ultra-Wide jitter for absolute maximum "spaciousness" within the flow
  const xJitter = ((i * 223) % 200) - 100;
  const yJitter = ((i * 337) % 200) - 100;

  const x = useTransform(scrollYProgress,
    [0, 0.25, 0.6, 0.9, 1],
    [62.5, 17.5, 100, 0, -25].map(v => v + (xJitter / 10))
  );

  const y = useTransform(scrollYProgress,
    [0, 0.25, 0.6, 0.9, 1],
    [0, 25, 62.5, 95.8, 105].map(v => v + (yJitter / 10))
  );

  // useSpring for smooth, "drift" turning
  const springX = useSpring(x, { stiffness: 45, damping: 30, mass: 0.5 });
  const springY = useSpring(y, { stiffness: 45, damping: 30, mass: 0.5 });

  // Depth Effect
  const isBack = i % 2 === 0;
  const scale = isBack ? 0.6 : 1.15;
  const blur = isBack ? "blur(3px)" : "none";
  const zIndex = isBack ? -1 : 1;

  // High Screen Time distribution (24 items, 35% life)
  let opStart, opEnd;
  if (forceRange) {
    opStart = forceRange[0];
    opEnd = forceRange[1];
  } else {
    // Spread 24 items with long lifespans (35%) for lingering detail
    opStart = (i / 24) * 0.7;
    const lifeSpan = 0.35;
    opEnd = Math.min(opStart + lifeSpan, 1);
  }

  const opacity = useTransform(scrollYProgress, [opStart, opStart + 0.08, opEnd - 0.08, opEnd], [0, 0.45, 0.45, 0]);
  const rotate = useTransform(scrollYProgress, [0, 1], [i * 40, i * 40 + 360]);

  const iconPaths = [
    "M12 1v22M17 5H7a5 5 0 00-5 5v3a5 5 0 005 5h10a5 5 0 005-5v-3a5 5 0 00-5-5z M8 5h8M12 2v3", // Aether Headphones
    "M17.05 20.28c-.96.95-2.04 1.72-3.12 1.72s-1.4-.26-2.5-.26-1.54.26-2.62.26-2.08-.72-3.13-1.72C3.54 18.2 2 15.15 2 12.11c0-3.38 2.22-5.18 4.38-5.18 1.15 0 2.14.39 2.87.39s1.65-.45 3.01-.45c1.43 0 2.59.54 3.3 1.5-3.01 1.81-2.53 5.92.51 7.15-.71 2.03-1.49 3.81-2.02 4.76z M12.03 6.64c-.04-1.92 1.58-3.56 3.49-3.64.04 1.93-1.58 3.56-3.49 3.64z", // Apple Logo
    "M12 18h.01 M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z M9 21h6", // iPhone
    "M17.5 13c.83 0 1.5-.67 1.5-1.5S18.33 10 17.5 10 16 10.67 16 11.5s.67 1.5 1.5 1.5zm-11 0c.83 0 1.5-.67 1.5-1.5S7.33 10 6.5 10 5 10.67 5 11.5s.67 1.5 1.5 1.5zm11.2-4.1l1.4-2.4c.1-.2.1-.5-.1-.7-.2-.1-.5-.1-.7.1l-1.4 2.5C15.4 7.6 13.8 7 12 7s-3.4.6-4.9 1.4l-1.4-2.5c-.2-.2-.5-.2-.7-.1-.2.2-.2.5-.1.7l1.4 2.4C3.8 10.1 2 13 2 16h20c0-3-1.8-5.9-4.3-7.1z", // Android Robot
    "M12 21a8 8 0 100-16 8 8 0 000 16z M12 15a2 2 0 100-4 2 2 0 000 4z M12 9a.5.5 0 100-1 .5.5 0 000 1z", // Speaker
    "M2 20h20M4 17h16V6a2 2 0 00-2-2H6a2 2 0 00-2 2v11z M12 17h.01", // Laptop
    "M16 10c0-2.21-1.79-4-4-4s-4 1.79-4 4v7a2 2 0 002 2h4a2 2 0 002-2v-7z M9 19v2 M15 19v2", // AirPods
    "M6 12h4M8 10v4M15 13h.01M18 10h.01 M21 11a5 5 0 00-5-5H8a5 5 0 00-5 5v2a5 5 0 005 5h8a5 5 0 005-5v-2z", // Controller
    "M12 7h.01 M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z M12 18h.01", // Smartwatch
    "M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2z M12 12h.01 M8 12h.01 M16 12h.01", // Tech Component / Chip
    "M12 8a4 4 0 100 8 4 4 0 000-8z M12 2v4 M12 18v4 M4 12H2 M22 12h-4" // Radar / Sensor
  ];

  return (
    <motion.div
      style={{
        left: useTransform(springX, (v) => `${v}%`),
        top: useTransform(springY, (v) => `${v}%`),
        opacity,
        rotate,
        scale,
        filter: blur,
        zIndex,
        position: 'absolute',
        width: 60,
        height: 60
      }}
      className="pointer-events-none flex items-center justify-center"
    >
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        <path d={iconPaths[i % iconPaths.length]} />
      </svg>
    </motion.div>
  );
}

// ── Liquid Flow Background Animation ────────────────────────────
function LiquidFlow({ scrollYProgress }: { scrollYProgress: any }) {
  // Main path transforms
  const pathLength = useTransform(scrollYProgress, [0, 0.9], [0, 1.1]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 0.15, 0.15, 0]);
  const strokeWidth = useTransform(scrollYProgress, [0, 0.5, 1], [120, 220, 350]);

  // Echo path transforms (Parallax effect)
  const echoLength = useTransform(scrollYProgress, [0, 1], [0, 1.3]);
  const echoOpacity = useTransform(scrollYProgress, [0.1, 0.3, 0.7, 0.9], [0, 0.05, 0.05, 0]);

  const pathD = "M 250 0 C 100 100 50 150 70 300 C 100 450 400 550 400 750 C 400 950 -50 1100 -100 1250";

  return (
    <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
      <svg
        viewBox="0 0 400 1200"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="none"
      >
        {/* Secondary Echo Path 1 */}
        <motion.path
          d={pathD}
          fill="none"
          stroke="url(#grey-water-grad)"
          strokeWidth="60"
          strokeLinecap="round"
          style={{ pathLength: echoLength, opacity: echoOpacity, x: -30, y: 20 }}
        />

        {/* Secondary Echo Path 2 */}
        <motion.path
          d={pathD}
          fill="none"
          stroke="url(#grey-water-grad)"
          strokeWidth="40"
          strokeLinecap="round"
          style={{ pathLength: echoLength, opacity: echoOpacity, x: 40, y: -40 }}
        />

        {/* Main Thick Stream */}
        <motion.path
          d={pathD}
          fill="none"
          stroke="url(#grey-water-grad)"
          strokeLinecap="round"
          style={{ pathLength, opacity, strokeWidth }}
        />
        <defs>
          <linearGradient id="grey-water-grad" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e5e7eb" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#9ca3af" stopOpacity="0.4" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      {/* Natural "Imperfect" Droplets */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          style={{
            y: useTransform(scrollYProgress, [0, 1], [`${-30 * (i + 1)}%`, `${150 + 20 * i}%`]),
            x: useTransform(scrollYProgress, [0, 1], [`${110 - i * 15}%`, `${-40 - i * 8}%`]),
            opacity: useTransform(scrollYProgress, [0.1, 0.4, 0.7], [0, 0.2, 0]),
            scale: [1, 1.2, 0.8][i % 3]
          }}
          className="absolute w-3 h-3 bg-black/5 rounded-full blur-sm"
        />
      ))}

      {/* High-Screen-Time Stream - 24 items with longer lifespans for lingering technical detail */}
      {[...Array(24)].map((_, i) => (
        <FloatingGadget key={i} i={i} scrollYProgress={scrollYProgress} />
      ))}

      {/* Cloud-Specific Burst - Fades in specifically at the Cloud Heading */}
      {[...Array(6)].map((_, i) => (
        <FloatingGadget key={`cloud-${i}`} i={i + 100} scrollYProgress={scrollYProgress} forceRange={[0.35, 0.65]} />
      ))}
    </div>
  );
}

// ── Atmospheric Background Marquee ──────────────────────────────
function ScrollingMarquee({ text, scrollYProgress }: { text: string; scrollYProgress: any }) {
  const x = useTransform(scrollYProgress, [0.11, 1], [0, -1500]);
  const baseVelocity = -2; // Constant slow move

  return (
    <div className="absolute top-[55%] left-0 -translate-y-1/2 w-[200vw] overflow-hidden whitespace-nowrap pointer-events-none opacity-[0.03] z-0">
      <motion.div
        style={{ x }}
        className="flex"
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <span key={i} className="text-[15rem] md:text-[25rem] font-black tracking-tighter text-black mr-20">
            {text}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

function Reveal({
  children,
  staggerIndex = 0,
  className = "",
}: {
  children: React.ReactNode;
  staggerIndex?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const offset = staggerIndex * 0.04;
  const opacity = useTransform(
    scrollYProgress,
    [0.1 + offset, 0.22 + offset, 0.9 + offset, 1 + offset],
    [0, 1, 1, 0]
  );
  const y = useTransform(
    scrollYProgress,
    [0.1 + offset, 0.22 + offset, 0.9 + offset, 1 + offset],
    [30, 0, 0, -30]
  );

  return (
    <motion.div
      ref={ref}
      style={{ opacity, y }}
      className={cn("relative", className)}
    >
      {children}
    </motion.div>
  );
}


function Divider() {
  return (
    <motion.div
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: false, amount: 0.5 }}
      transition={{ duration: 1.1, ease: EASE }}
      className="w-full h-px bg-black/8 origin-left mx-auto max-w-6xl px-6 md:px-20"
    />
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <motion.p
      whileHover={{ color: "#000", filter: "brightness(1.5)", x: 5 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="text-xs uppercase tracking-[0.3em] text-black/35 mb-8 md:mb-16 font-medium cursor-default"
    >
      {children}
    </motion.p>
  );
}

// ── Parallax Image with mouse-reactive tilt ─────────────────────
function ParallaxImage({ src, alt, speed = 0.2, className = "", objectFit = "object-cover" }: { src: string, alt: string, speed?: number, className?: string, objectFit?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1.05, 0.95]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  // Mouse tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), { stiffness: 200, damping: 30 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6, 6]), { stiffness: 200, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    mouseX.set((e.clientX - left) / width - 0.5);
    mouseY.set((e.clientY - top) / height - 0.5);
  };
  const handleMouseLeave = () => { mouseX.set(0); mouseY.set(0); };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.02, boxShadow: "0 20px 40px -10px rgba(0,0,0,0.15)" }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: 1000 }}
      className={`relative overflow-hidden rounded-3xl bg-[#F5F5F7] flex items-center justify-center ${className}`}
    >
      <motion.img
        style={{ y, scale, opacity }}
        whileHover={{ scale: 1.05 }}
        src={src}
        alt={alt}
        className={`w-full h-full ${objectFit} p-8`}
      />
    </motion.div>
  );
}

function CarouselItem({ num, index, total, scrollProgress, activeIndex }: { num: number, index: number, total: number, scrollProgress: any, activeIndex: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const step = 1 / (total - 1);
  const inputs = Array.from({ length: total }, (_, i) => i * step);
  const scaleOutputs = inputs.map((_, i) => i === index ? 1 : 0.85);
  const opacityOutputs = inputs.map((_, i) => i === index ? 1 : 0.4);

  const horizontalScale = useTransform(scrollProgress, inputs, scaleOutputs);
  const horizontalOpacity = useTransform(scrollProgress, inputs, opacityOutputs);

  const verticalOpacity = useTransform(scrollYProgress, [0, 0.35, 0.65, 1], [0, 1, 1, 0]);

  const dist = index - activeIndex;
  const burstStrength = 35;
  const xStart = -dist * burstStrength;

  const x = useTransform(
    scrollYProgress,
    [0, 0.35, 0.65, 1],
    [xStart, 0, 0, -xStart / 2]
  );

  return (
    <motion.div
      ref={ref}
      style={{
        scale: horizontalScale,
        opacity: verticalOpacity,
        x: useTransform(x, (val) => `${val}%`),
        willChange: "transform, opacity"
      }}
      className="w-[80vw] md:w-[35vw] shrink-0 snap-center flex flex-col items-center justify-center relative origin-center px-4"
    >
      <TiltCard className="w-full rounded-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.2)] bg-white p-4 md:p-8">
        <motion.div
          style={{ opacity: horizontalOpacity }}
          className="w-full flex flex-col items-center"
        >
          <div className="w-full aspect-square rounded-2xl overflow-hidden relative group">
            <DepthParallaxImage
              src={`/colors/color${num}.jpeg`}
              alt={`Color Option ${num}`}
              objectFit="cover"
              className="w-full h-full"
            />
          </div>
          <motion.p
            whileHover={{ color: "#000", filter: "brightness(1.3)", y: -2 }}
            className="mt-8 text-xs md:text-sm uppercase tracking-[0.2em] text-[#111]/60 font-medium cursor-default"
          >
            {[
              "Midnight Black", "Metallic Copper", "Slate Gray", "Ocean Blue", "Emerald Green",
              "Desert Sand", "Navy Blue", "Forest Green", "Platinum Silver", "Muted Bronze"
            ][num - 1]}
          </motion.p>
        </motion.div>
      </TiltCard>
    </motion.div>
  );
}


function ColorCarousel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollXProgress } = useScroll({ container: containerRef });
  const [activeIndex, setActiveIndex] = useState(2);

  useMotionValueEvent(scrollXProgress, "change", (latest) => {
    setActiveIndex(Math.round(latest * (totalItems - 1)));
  });

  const smoothProgress = useSpring(scrollXProgress, { damping: 20, stiffness: 100 });

  const totalItems = 10;

  const scroll = (direction: 'left' | 'right') => {
    if (containerRef.current) {
      const scrollAmount = window.innerWidth * (window.innerWidth < 768 ? 0.8 : 0.45);
      containerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") scroll('left');
      if (e.key === "ArrowRight") scroll('right');
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      const container = containerRef.current;
      const timer = setTimeout(() => {
        const scrollWidth = container.scrollWidth;
        const clientWidth = container.clientWidth;
        container.scrollTo({ left: (scrollWidth - clientWidth) * 0.22, behavior: 'instant' });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <section id="carousel" className="relative py-4 md:py-8 bg-[#F5F5F7] overflow-hidden z-20">
      <InteractiveParticles />
      <div className="w-full flex flex-col items-center text-center mb-6 md:mb-10">
        <Reveal>
          <motion.p
            whileHover={{ color: "#000", filter: "brightness(1.4)", x: 3 }}
            className="text-xs tracking-[0.3em] uppercase text-black/40 mb-1 font-medium cursor-default"
          >
            Colors
          </motion.p>
          <motion.h2
            whileHover={{ scale: 1.02, color: "#000", filter: "brightness(1.2)" }}
            transition={{ type: "spring", stiffness: 300 }}
            className="text-3xl md:text-5xl font-bold tracking-tighter text-[#111] cursor-default"
          >
            Find your aesthetic.
          </motion.h2>
        </Reveal>
      </div>

      {/* Navigation Arrows */}
      <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between px-4 md:px-12 z-20 pointer-events-none">
        <Magnetic>
          <button
            onClick={() => scroll('left')}
            className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/80 backdrop-blur-md shadow-lg flex items-center justify-center hover:bg-white transition-all pointer-events-auto active:scale-95"
            aria-label="Previous color"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
        </Magnetic>
        <Magnetic>
          <button
            onClick={() => scroll('right')}
            className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/80 backdrop-blur-md shadow-lg flex items-center justify-center hover:bg-white transition-all pointer-events-auto active:scale-95"
            aria-label="Next color"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </Magnetic>
      </div>

      <div
        ref={containerRef}
        className="flex gap-8 md:gap-20 overflow-x-auto snap-x snap-mandatory pt-12 pb-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] w-full"
      >
        <div className="w-[calc(10vw-2rem)] md:w-[calc(32.5vw-5rem)] shrink-0" />

        {Array.from({ length: totalItems }, (_, i) => i + 1).map((num, i) => (
          <CarouselItem
            key={num}
            num={num}
            index={i}
            total={totalItems}
            scrollProgress={smoothProgress}
            activeIndex={activeIndex}
          />
        ))}

        <div className="w-[calc(10vw-2rem)] md:w-[calc(32.5vw-5rem)] shrink-0" />
      </div>
    </section>
  );
}

export default function ProductSections() {
  const router = useRouter();
  const { navigateTo } = usePageTransition();
  const { playClick } = useSound();
  const { scrollYProgress } = useScroll();
  const specRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const experienceRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const { scrollYProgress: localScrollYProgress } = useScroll({
    target: specRef,
    offset: ["start end", "end start"]
  });
  const { scrollYProgress: featuresScrollYProgress } = useScroll({
    target: featuresRef,
    offset: ["start end", "end start"]
  });
  const { scrollYProgress: experienceScrollYProgress } = useScroll({
    target: experienceRef,
    offset: ["start end", "end 40%"]
  });
  return (
    <div className="bg-transparent w-full overflow-clip relative">
      {/* Decorative Doodles for Product Sections */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="sticky top-0 h-screen w-full">
          <LeftDoodle delay={0} />
          <RightDoodle delay={0.5} />
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-screen pointer-events-none overflow-hidden">
        <LeftDoodle delay={0} />
        <RightDoodle delay={0.5} />
      </div>

      {/* ── TRANSITION BRIDGE */}
      <div className="h-4 md:h-8 w-full bg-transparent" />


      {/* ══════════════════════════════════════════════════════════
          §2  FEATURES WITH NEW IMAGES
      ══════════════════════════════════════════════════════════ */}
      <section id="features" ref={featuresRef} className="px-6 md:px-20 py-20 md:py-32 max-w-[1440px] 2xl:max-w-[1600px] w-full  w-full mx-auto relative">
        <LiquidFlow scrollYProgress={featuresScrollYProgress} />
        <Reveal><Label>Features</Label></Reveal>

        {/* F1 — ANC (Angle) */}
        <div id="feature-1" className="flex flex-col md:flex-row gap-12 md:gap-20 items-center mb-24 md:mb-36 pt-12">
          <motion.div
            style={{
              opacity: useTransform(featuresScrollYProgress, [0.1, 0.25], [0, 1]),
              y: useTransform(featuresScrollYProgress, [0.1, 0.25], [60, 0])
            }}
            className="order-2 md:order-1 flex-1"
          >
            <p className="text-xs tracking-[0.25em] text-black/30 mb-4 font-medium uppercase">01</p>
            <motion.h2 whileHover={{ scale: 1.03, x: 10, color: "#000" }} transition={{ type: "spring", stiffness: 300 }} className="text-4xl md:text-6xl font-bold tracking-tighter text-[#111] leading-tight mb-6 cursor-default">
              Active Noise<br />Cancellation
            </motion.h2>
            <div className="flex flex-col md:flex-row md:items-end gap-8">
              <motion.p
                whileHover={{ color: "#000", filter: "brightness(1.2)", x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="text-lg text-[#555] font-light leading-relaxed max-w-md cursor-default"
              >
                Block out the world. Stay in your sound. Adaptive algorithms continuously
                sample and counteract ambient noise, so your music plays in silence.
                The perfectly angled cups secure your acoustic seal.
              </motion.p>

              <div className="hidden md:block flex-shrink-0">
                <Magnetic>
                  <motion.button
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    onClick={() => document.getElementById('feature-2')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                    className="group flex items-center gap-4 bg-transparent text-xl md:text-3xl font-light tracking-[0.15em] uppercase text-[#111]"
                  >
                    <span className="group-hover:translate-x-1 transition-transform duration-500">NEXT</span>
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-full border border-black/20 flex items-center justify-center group-hover:bg-[#111] group-hover:text-white transition-all duration-500 relative overflow-hidden">
                      <motion.div className="absolute inset-0 bg-[#111] translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="relative z-10 group-hover:rotate-45 transition-transform duration-500">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </div>
                  </motion.button>
                </Magnetic>
              </div>
            </div>
          </motion.div>
          <motion.div
            className="order-1 md:order-2 flex-1 w-full"
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            <DepthParallaxImage src="/gf/angle.jpeg" alt="Headphone angle for ANC" className="h-[50vh] md:h-[70vh] w-full" />
          </motion.div>
        </div>

        {/* F2 — Comfort (Cushion) */}
        <div id="feature-2" className="flex flex-col md:flex-row gap-12 md:gap-20 items-center mb-24 md:mb-36 pt-12">
          <motion.div
            className="flex-1 w-full"
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          >
            <DepthParallaxImage src="/gf/cushion.jpeg" alt="Memory foam cushion close up" className="h-[50vh] md:h-[70vh] w-full" />
          </motion.div>
          <motion.div
            style={{
              opacity: useTransform(featuresScrollYProgress, [0.15, 0.3], [0, 1]),
              y: useTransform(featuresScrollYProgress, [0.15, 0.3], [60, 0])
            }}
            className="flex-1 md:pl-20"
          >
            <p className="text-xs tracking-[0.25em] text-black/30 mb-4 font-medium uppercase">02</p>
            <motion.h2 whileHover={{ scale: 1.03, x: 10, color: "#000" }} transition={{ type: "spring", stiffness: 300 }} className="text-4xl md:text-6xl font-bold tracking-tighter text-[#111] leading-tight mb-6 cursor-default">
              Cloud-like<br />Comfort
            </motion.h2>
            <motion.p
              whileHover={{ color: "#000", filter: "brightness(1.2)", x: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="text-lg text-[#555] font-light leading-relaxed max-w-md cursor-default"
            >
              Designed for everyday listening. The memory foam ear cushions and featherlight frame ensure hours of fatigue-free wear. You'll forget you have them on.
            </motion.p>

            <div className="hidden md:block mt-10 md:mt-14">
              <Magnetic>
                <motion.button
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  onClick={() => document.getElementById('feature-3')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                  className="group flex items-center gap-4 bg-transparent text-xl md:text-3xl font-light tracking-[0.15em] uppercase text-[#111]"
                >
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-full border border-black/20 flex items-center justify-center group-hover:bg-[#111] group-hover:text-white transition-all duration-500 relative overflow-hidden">
                    <motion.div className="absolute inset-0 bg-[#111] translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="relative z-10 group-hover:-rotate-45 transition-transform duration-500">
                      <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                  </div>
                  <span className="group-hover:translate-x-2 transition-transform duration-500">NEXT</span>
                </motion.button>
              </Magnetic>
            </div>
          </motion.div>
        </div>

        {/* F3 — Controls & Charging (Volume/Buttons) */}
        <div id="feature-3" className="flex flex-col md:flex-row gap-12 md:gap-20 items-center pt-12">
          <motion.div
            style={{
              opacity: useTransform(featuresScrollYProgress, [0.45, 0.6], [0, 1]),
              y: useTransform(featuresScrollYProgress, [0.45, 0.6], [60, 0])
            }}
            className="order-2 md:order-1 flex-1"
          >
            <p className="text-xs tracking-[0.25em] text-black/30 mb-4 font-medium uppercase">03</p>
            <motion.h2 whileHover={{ scale: 1.03, x: 10, color: "#000" }} transition={{ type: "spring", stiffness: 300 }} className="text-4xl md:text-6xl font-bold tracking-tighter text-[#111] leading-tight mb-6 cursor-default">
              Seamless<br />Control
            </motion.h2>
            <motion.p
              whileHover={{ color: "#000", filter: "brightness(1.2)", x: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="text-lg text-[#555] font-light leading-relaxed max-w-md cursor-default"
            >
              Intuitive tactile buttons let you navigate without breaking focus.
              With ultra-fast USB-C charging, a 10-minute charge delivers 3 hours of playback.
            </motion.p>
          </motion.div>
          <motion.div
            className="order-1 md:order-2 flex-1 w-full"
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          >
            <DepthParallaxImage src="/gf/volume.jpeg" alt="Tactile volume buttons and Type-C port" className="h-[50vh] md:h-[70vh] w-full" />
          </motion.div>
        </div>

        {/* Centered Scroll Indicator beneath F3 */}
        <div className="hidden md:flex w-full justify-center mt-[-8px] md:mt-[-16px] relative">
          <div className="flex flex-col items-center gap-0">
            <motion.span
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="text-xs md:text-sm tracking-[0.6em] font-medium text-black/40 uppercase cursor-default mt-4"
            >
              SCROLL
            </motion.span>

            <motion.div
              style={{
                y: useTransform(featuresScrollYProgress, [0.6, 0.95], [0, 300]),
                zIndex: 0
              }}
              className="h-12 md:h-14"
            >
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-black/10 flex items-center justify-center opacity-40"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 13l5 5 5-5M12 6v12" />
                </svg>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          §3  HORIZONTAL CAROUSEL (Colors)
      ══════════════════════════════════════════════════════════ */}
      <ColorCarousel />

      <Divider />

      {/* ══════════════════════════════════════════════════════════
          §5  SPECIFICATIONS — with 3D TiltCard
      ══════════════════════════════════════════════════════════ */}
      <section id="specifications" ref={specRef} className="px-6 md:px-20 pt-[120vh] pb-10 md:pb-16 max-w-[1440px] mx-auto relative -mt-12 md:-mt-24 scroll-mt-[-107vh] md:scroll-mt-[-85vh]">
        {/* Sticky Legacy Header Wrapper (freezes at top-0, ends before grid) */}
        <div className="absolute inset-x-10 top-64 h-[87vh] pointer-events-none">
          <div className="sticky top-16 z-20 flex flex-col items-center text-center pointer-events-auto">
            <LegacyHeader />
          </div>
        </div>

        {/* Atmospheric technical elements to fill the "Breathing Room" */}
        <div className="absolute inset-x-0 top-[28vh] h-[105vh] pointer-events-none z-0">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false, amount: 0.1 }}
            className="w-full h-full relative"
          >
            {[
              { label: "ACOUSTIC CORE", value: "GEN 3", x: "10%", y: "20%", delay: 0 },
              { label: "TITANIUM", value: "GR5", x: "80%", y: "40%", delay: 0.2 },
              { label: "LATENCY", value: "12MS", x: "20%", y: "70%", delay: 0.4 },
              { label: "PRECISION", value: "99.9%", x: "70%", y: "85%", delay: 0.6 },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 0.15, scale: 1 }}
                transition={{ duration: 1, delay: item.delay }}
                style={{ left: item.x, top: item.y }}
                className="absolute flex flex-col items-start"
              >
                <motion.div whileHover={{ scale: 1.1, opacity: 0.6 }} transition={{ type: "spring", stiffness: 400 }} className="h-px w-12 bg-black/20 mb-2" />
                <motion.span
                  whileHover={{ color: "#000", filter: "brightness(1.5)", x: 2 }}
                  className="text-[10px] tracking-[0.4em] font-bold text-black uppercase cursor-default"
                >
                  {item.label}
                </motion.span>
                <motion.span
                  whileHover={{ color: "#000", scale: 1.1 }}
                  className="text-2xl font-light text-black/40 tracking-tighter mt-1 cursor-default"
                >
                  {item.value}
                </motion.span>
              </motion.div>
            ))}

            <ScrollingMarquee text="AETHER" scrollYProgress={localScrollYProgress} />
          </motion.div>
        </div>

        <div className="relative z-10">
          <Reveal><Label>Specifications</Label></Reveal>

          {/* Entire Card with 3D Tilt and Floating Effect */}
          <motion.div
            animate={{ y: [0, -40, 0] }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <TiltCard className="rounded-3xl overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15),0_30px_60px_-30px_rgba(0,0,0,0.2),inset_0_-2px_20px_0_rgba(255,255,255,0.5)] border border-black/5 bg-[#F5F5F7]">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-px">
                {[
                  { label: "Battery Life", value: "30 hrs", sub: "Up to" },
                  { label: "Bluetooth", value: "5.3", sub: "Version" },
                  { label: "Charging", value: "USB-C", sub: "Fast Charge" },
                  { label: "Weight", value: "250g", sub: "Featherlight" },
                ].map((spec, i) => (
                  <Reveal
                    key={spec.label}
                    staggerIndex={i}
                    className="bg-white"
                  >
                    <div className="px-6 md:px-12 py-20 md:py-28 text-center group relative overflow-hidden bg-white">
                      {/* Off-white hover sweep */}
                      <motion.div
                        className="absolute inset-0 bg-[#F5F5F7] z-0"
                        initial={{ y: "100%" }}
                        whileHover={{ y: 0 }}
                        transition={{ duration: 0.4, ease: EASE }}
                      />
                      <div className="relative z-10 cursor-default">
                        <motion.p whileHover={{ x: 5, color: "#000" }} transition={{ type: "spring", stiffness: 300 }} className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-black/30 mb-4 md:mb-6 font-medium">{spec.sub}</motion.p>
                        <motion.p whileHover={{ scale: 1.1, color: "#000" }} transition={{ type: "spring", stiffness: 300, damping: 15 }} className="text-4xl md:text-6xl font-bold tracking-tighter text-[#111] mb-2 md:mb-4">{spec.value}</motion.p>
                        <motion.p whileHover={{ x: 5, color: "#000" }} transition={{ type: "spring", stiffness: 300 }} className="text-xs md:text-sm text-[#111]/60 font-light tracking-wide">{spec.label}</motion.p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </TiltCard>
          </motion.div>
        </div>
      </section>



      {/* ══════════════════════════════════════════════════════════
          §4  EXPERIENCE FLOW — Horizontal Scroll Carousel
      ══════════════════════════════════════════════════════════ */}
      <section id="experience" ref={experienceRef} className="relative h-[300vh] bg-white">
        <div className="sticky top-0 h-screen w-full flex items-center overflow-hidden">
          {/* Ambient Background Elements */}
          <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-black/[0.01] rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-black/[0.01] rounded-full blur-[100px] pointer-events-none" />

          {/* Interactive Particles Layer */}
          <InteractiveParticles />

          <div className="relative w-full max-w-7xl mx-auto px-6 md:px-20 z-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16">
              <Reveal><Label>Experience</Label></Reveal>
              <Reveal staggerIndex={1}>
                <motion.p
                  whileHover={{ color: "#000", filter: "brightness(1.5)", letterSpacing: "0.1em" }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="text-sm text-black/30 font-medium tracking-tight mb-8 md:mb-16 cursor-default"
                >
                  SCROLL TO EXPLORE <span className="ml-2 inline-block animate-bounce">→</span>
                </motion.p>
              </Reveal>
            </div>

            {/* 💡 TIMING GUIDE (Experience Cards): 
                Adjust [0, 1] to [0.2, 0.8] if you want it to start/end later. 
                Adjust ["0%", "-66.6%"] to control total slide distance. */}
            <motion.div
              style={{ x: useTransform(experienceScrollYProgress, [0, 1], isMobile ? ["-260%", "15%"] : ["-90%", "4%"]) }}
              className="flex gap-8 md:gap-16"
            >
              {[
                {
                  step: "01",
                  title: "Connect instantly",
                  body: "Pair in under 2 seconds via Bluetooth 5.3 multipoint. Two devices, zero friction.",
                  icon: (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M8.5 12a8.5 8.5 0 0 0 7 0M5 12a12 12 0 0 0 14 0M12 8a4 4 0 0 0 0 8" />
                    </svg>
                  ),
                },
                {
                  step: "02",
                  title: "Play effortlessly",
                  body: "Intuitive tactile controls respond to the lightest touch. Navigate without breaking focus.",
                  icon: (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="9" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  ),
                },
                {
                  step: "03",
                  title: "Stay immersed",
                  body: "Adaptive ANC and Transparency mode detect your environment in real time — automatically.",
                  icon: (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 12c0-5 3.5-9 9-9s9 4 9 9M6.5 12c0-3 2.5-5.5 5.5-5.5S17.5 9 17.5 12" />
                      <circle cx="12" cy="12" r="2" />
                    </svg>
                  ),
                },

              ].map((item, i) => (
                <div key={item.step} className="w-[85vw] md:w-[42vw] shrink-0">
                  <Magnetic strength={0.08}>
                    <motion.div
                      animate={{ y: [0, -20, 0] }}
                      transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 0.4
                      }}
                    >
                      <TiltCard>
                        <motion.div
                          initial={{ opacity: 0, x: 50, filter: "blur(10px)" }}
                          whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, delay: i * 0.1, ease: EASE }}
                          whileHover={{ y: -10, boxShadow: "0 30px 60px -15px rgba(0,0,0,0.08)" }}
                          className="group cursor-default p-8 md:p-14 bg-white border border-black/[0.04] rounded-[2.5rem] h-full flex flex-col relative overflow-hidden backdrop-blur-sm"
                        >
                          {/* Giant background number */}
                          <span className="absolute -bottom-4 -right-4 text-[150px] md:text-[220px] font-black text-black/[0.02] leading-none select-none pointer-events-none">
                            {item.step}
                          </span>

                          <div className="flex items-center gap-4 mb-10">
                            <div className="relative">
                              <motion.div
                                animate={{ scale: [1, 1.8, 1], opacity: [0.1, 0, 0.1] }}
                                transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                                className="absolute inset-0 rounded-2xl bg-black/5"
                              />
                              <div className="w-14 h-14 rounded-2xl bg-black/[0.03] border border-black/[0.05] flex items-center justify-center group-hover:bg-[#111] group-hover:text-white transition-all duration-500 relative z-10">
                                {item.icon}
                              </div>
                            </div>
                            <div className="h-px w-8 bg-black/10" />
                            <span className="text-[10px] tracking-[0.4em] uppercase text-black/30 font-bold">{item.step}</span>
                          </div>

                          <h3 className="text-3xl md:text-5xl font-bold tracking-tighter text-[#111] mb-6 group-hover:translate-x-1 transition-transform duration-300">
                            {item.title}
                          </h3>
                          <motion.p
                            whileHover={{ color: "#000", filter: "brightness(1.2)", x: 3 }}
                            transition={{ type: "spring", stiffness: 300 }}
                            className="text-lg md:text-xl text-[#666] font-light leading-relaxed max-w-[380px] cursor-default"
                          >
                            {item.body}
                          </motion.p>

                          <motion.div
                            initial={{ scaleX: 0 }}
                            whileHover={{ scaleX: 1 }}
                            transition={{ duration: 0.5, ease: EASE }}
                            className="absolute bottom-0 left-0 right-0 h-1 bg-black/5 origin-left"
                          />
                        </motion.div>
                      </TiltCard>
                    </motion.div>
                  </Magnetic>
                </div>
              ))}
              {/* Spacer for ending the horizontal scroll cleanly */}
              <div className="w-[5vw] md:w-[10vw] shrink-0" />
            </motion.div>
          </div>
        </div>
      </section>

      <Divider />

      {/* ══════════════════════════════════════════════════════════
          §6  FINAL CTA
      ══════════════════════════════════════════════════════════ */}
      <section className="px-6 md:px-20 py-16 md:py-24 text-center max-w-4xl mx-auto">
        <Reveal>
          <motion.h2 whileHover={{ scale: 1.05, filter: "brightness(1.5)" }} transition={{ type: "spring", stiffness: 300 }} className="text-5xl md:text-8xl lg:text-9xl font-bold tracking-tighter text-[#111] leading-none mb-6 md:mb-10 cursor-default">
            Listen<br />Differently.
          </motion.h2>
        </Reveal>
        <Reveal staggerIndex={1}>
          <motion.p
            whileHover={{ color: "#000", filter: "brightness(1.2)", y: -2 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="text-base md:text-lg text-[#555] font-light mb-8 md:mb-12 max-w-xl mx-auto leading-relaxed cursor-default"
          >
            Sound as it was meant to be heard. Crafted without compromise.
          </motion.p>
        </Reveal>
        <Reveal staggerIndex={0.5}>
          <Magnetic>
            <motion.button
              whileHover={{ scale: 1.04, backgroundColor: "#333" }}
              whileTap={{ scale: 0.97 }}
              onClick={() => { navigateTo('/login'); }}
              // 💡 TO ADJUST HOVER ANIMATION TIMING: Change `duration: 0.25` below
              transition={{ duration: 0.25, ease: "easeOut" as const }}
              className="px-10 md:px-14 py-4 md:py-5 bg-[#111] text-white font-semibold tracking-widest uppercase text-xs md:text-sm rounded-full"
            >
              Get Aether
            </motion.button>
          </Magnetic>
        </Reveal>
      </section>

      <div className="h-16 md:h-24 bg-white" />
    </div>
  );
}
