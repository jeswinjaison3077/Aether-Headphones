"use client";

import React, { createContext, useContext, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import { useSound } from "@/components/useSound";

interface TransitionContextType {
  navigateTo: (href: string) => void;
}

const TransitionContext = createContext<TransitionContextType>({
  navigateTo: () => { },
});

export const usePageTransition = () => useContext(TransitionContext);

export function PageTransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionType, setTransitionType] = useState<"sweep" | "fade">("sweep");
  const targetRef = useRef<string>("");
  const { playWhoosh } = useSound();

  const navigateTo = useCallback((href: string) => {
    if (isTransitioning) return;
    targetRef.current = href;
    playWhoosh();

    // Determine transition type:
    // If going FROM login TO home, use "fade"
    // Else (going to login), use "sweep"
    if (pathname === "/login" && (href === "/" || href === "")) {
      setTransitionType("fade");
    } else {
      setTransitionType("sweep");
    }

    setIsTransitioning(true);
  }, [isTransitioning, playWhoosh, pathname]);

  const handleAnimationComplete = useCallback(() => {
    router.push(targetRef.current);

    // 💡 ADJUST BLACK SCREEN HOLD TIME HERE:
    // This is how long the screen stays black before the reveal starts.
    // Increase for a more cinematic "breath" in the dark, decrease for speed.
    const holdTime = transitionType === "fade" ? 230 : 500;

    setTimeout(() => setIsTransitioning(false), holdTime);
  }, [router, transitionType]);

  return (
    <TransitionContext.Provider value={{ navigateTo }}>
      {children}

      <AnimatePresence mode="wait">
        {isTransitioning && (
          <motion.div
            key="curtain-container"
            className="fixed inset-0 z-[99999] pointer-events-none"
            exit={transitionType === "fade" ? { opacity: 0 } : undefined}
            transition={{ duration: 1.2, ease: "easeInOut" }}
          >
            {/* Curtain wave — 3 staggered panels sweep across to black */}
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="absolute inset-y-0 bg-[#111]"
                initial={{ scaleY: 0, originY: "bottom" }}
                animate={{ scaleY: 1 }}
                exit={transitionType === "sweep" ? { scaleY: 0, originY: "top" } : undefined}
                transition={{
                  duration: 0.5,
                  delay: i * 0.07,
                  ease: [0.76, 0, 0.24, 1],
                }}
                onAnimationComplete={i === 2 ? handleAnimationComplete : undefined}
                style={{
                  left: `${(i / 3) * 100}%`,
                  width: `${100 / 3 + 1}%`,
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </TransitionContext.Provider>
  );
}
