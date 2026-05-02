"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";

type CursorMode = "default" | "hover" | "drag" | "text";

export default function CustomCursor() {
  const [mode, setMode] = useState<CursorMode>("default");
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [label, setLabel] = useState("");

  const mouseX = useMotionValue(-200);
  const mouseY = useMotionValue(-200);

  // Outer ring: heavier spring = lags behind for premium feel
  const ringX = useSpring(mouseX, { damping: 30, stiffness: 250, mass: 0.5 });
  const ringY = useSpring(mouseY, { damping: 30, stiffness: 250, mass: 0.5 });

  // Dot: instant follow
  const dotX = useSpring(mouseX, { damping: 40, stiffness: 600 });
  const dotY = useSpring(mouseY, { damping: 40, stiffness: 600 });

  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
    if (!isVisible) setIsVisible(true);
  }, [mouseX, mouseY, isVisible]);

  const handleMouseOver = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const btn = target.closest("button") || target.tagName === "BUTTON";
    const anchor = target.closest("a") || target.tagName === "A";
    const img = target.closest("[data-cursor='drag']");
    const textEl = target.closest("[data-cursor='text']");

    if (img) {
      setMode("drag");
      setLabel("DRAG");
    } else if (textEl) {
      setMode("text");
      setLabel("");
    } else if (btn || anchor) {
      setMode("hover");
      setLabel("");
    } else {
      setMode("default");
      setLabel("");
    }
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("mousedown", () => setIsClicking(true));
    window.addEventListener("mouseup", () => setIsClicking(false));
    document.documentElement.style.cursor = "none";

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      document.documentElement.style.cursor = "";
    };
  }, [handleMouseMove, handleMouseOver]);

  const ringSize =
    mode === "drag" ? 80 :
    mode === "hover" ? 52 :
    isClicking ? 24 :
    36;

  const ringBg =
    mode === "drag" ? "rgba(0,0,0,0.85)" :
    mode === "hover" ? "rgba(0,0,0,0.06)" :
    "transparent";

  const ringBorder =
    mode === "drag" ? "transparent" :
    mode === "hover" ? "rgba(0,0,0,0.5)" :
    "rgba(0,0,0,0.25)";

  return (
    <>
      {/* Outer ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] hidden md:flex items-center justify-center"
        animate={{
          width: ringSize,
          height: ringSize,
          backgroundColor: ringBg,
          borderColor: ringBorder,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
          borderRadius: "50%",
          border: "1.5px solid rgba(0,0,0,0.25)",
          mixBlendMode: "normal",
        }}
      >
        <AnimatePresence>
          {mode === "drag" && (
            <motion.span
              key="drag-label"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.15 }}
              className="text-white text-[9px] font-bold tracking-[0.2em] uppercase select-none"
            >
              DRAG
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Inner dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] hidden md:block"
        style={{
          x: dotX,
          y: dotY,
          translateX: "-50%",
          translateY: "-50%",
          borderRadius: "50%",
          backgroundColor: "#111",
          opacity: isVisible ? 1 : 0,
        }}
        animate={{
          width: mode === "hover" || mode === "drag" ? 0 : isClicking ? 6 : 4,
          height: mode === "hover" || mode === "drag" ? 0 : isClicking ? 6 : 4,
        }}
        transition={{ duration: 0.15 }}
      />
    </>
  );
}
