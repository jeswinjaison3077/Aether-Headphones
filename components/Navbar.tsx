"use client";

import React, { useState } from "react";
import { motion, useScroll, useMotionValueEvent, useSpring, MotionValue, useTransform, useMotionValue, Variants } from "framer-motion";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import Magnetic from "@/components/Magnetic";
import { usePageTransition } from "@/components/PageTransition";
import { useSound } from "@/components/useSound";

interface NavbarProps {
  sequenceProgress?: MotionValue<number>;
}

export default function Navbar({ sequenceProgress }: NavbarProps) {
  const router = useRouter();
  const { navigateTo } = usePageTransition();
  const { playClick } = useSound();
  const { scrollYProgress } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  // Use the scroll trigger to show navbar almost immediately
  // Added back the reverse trigger so it disappears when at the top
  // 💡 TO ADJUST TIMING OF NAVBAR APPEARANCE ON SCROLL:
  // Change the `0.078` value below. A smaller number (e.g., 0.05) makes the background bar appear sooner.
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest > 0.0716) {
      if (!isScrolled) setIsScrolled(true);
    } else {
      if (isScrolled) setIsScrolled(false);
    }
  });

  const defaultProgress = useMotionValue(0);

  const { scrollYProgress: pageScrollY } = useScroll();
  const scaleX = useSpring(pageScrollY, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    playClick();
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMobileLink = (id: string, isRoute = false) => {
    setIsMenuOpen(false);
    playClick();
    if (isRoute) {
      navigateTo(id);
    } else {
      setTimeout(() => scrollToSection(id), 500); // Wait for menu close animation
    }
  };

  const showNavbar = isScrolled || isMenuOpen;

  const menuVariants: Variants = {
    closed: {
      opacity: 0,
      y: "-100%",
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
        when: "afterChildren"
      }
    },
    open: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants: Variants = {
    closed: { opacity: 0, y: 20 },
    open: { opacity: 1, y: 0 }
  };

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 right-0 z-[100] h-16 md:h-24 px-4 md:px-6 pointer-events-none"
      >
        {/* Background Bar - Center to Sides expansion */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{
            scaleX: showNavbar ? 1 : 0,
            opacity: showNavbar ? 1 : 0
          }}
          transition={{ delay: 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 navbar-glass origin-center"
        />

        {/* Brand on Left */}
        <div className="absolute top-1/2 -translate-y-1/2 left-4 md:left-10 flex items-center z-10">
          <Magnetic>
            <motion.button
              initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)", pointerEvents: "auto" }}
              transition={{ delay: 0.1, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => { playClick(); scrollToSection('carousel'); }}
              className="text-xl font-bold tracking-tighter text-black hover:opacity-70 transition-opacity"
            >
              AETHER
            </motion.button>
          </Magnetic>
        </div>

        {/* Desktop Menu Actions */}
        <div className="absolute top-1/2 -translate-y-1/2 right-4 md:right-8 flex items-center gap-4 md:gap-6 z-10">
          <Magnetic>
            <motion.button
              initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ delay: 0.2, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => { playClick(); scrollToSection('features'); }}
              className="hidden md:block text-xs uppercase tracking-widest font-bold text-black/40 hover:text-black transition-colors p-2 pointer-events-auto"
            >
              Features
            </motion.button>
          </Magnetic>
          <Magnetic>
            <motion.button
              initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ delay: 0.3, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => { playClick(); scrollToSection('specifications'); }}
              className="hidden md:block text-xs uppercase tracking-widest font-bold text-black/40 hover:text-black transition-colors p-2 pointer-events-auto"
            >
              Specs
            </motion.button>
          </Magnetic>
          <Magnetic>
            <motion.button
              initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ delay: 0.4, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => { navigateTo('/login'); }}
              className="text-sm font-bold uppercase tracking-[0.3em] text-black hover:opacity-70 transition-opacity p-2 pointer-events-auto"
            >
              Login
            </motion.button>
          </Magnetic>
          <Magnetic>
            <motion.button
              initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)", pointerEvents: "auto" }}
              transition={{ delay: 0.5, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => { navigateTo('/login'); }}
              className="hidden md:block px-5 py-2 bg-black text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-black/80 transition-all transform active:scale-95 shadow-lg shadow-black/10 pointer-events-auto"
            >
              Pre-order
            </motion.button>
          </Magnetic>

          {/* Hamburger Toggle (Mobile) */}
          <div className="md:hidden flex items-center pointer-events-auto">
            <Magnetic>
              <button
                onClick={toggleMenu}
                className="w-10 h-10 flex flex-col items-center justify-center gap-1.5 relative z-[110]"
              >
                <motion.span
                  animate={{ rotate: isMenuOpen ? 45 : 0, y: isMenuOpen ? 7.5 : 0 }}
                  className="w-6 h-0.5 bg-black block"
                />
                <motion.span
                  animate={{ opacity: isMenuOpen ? 0 : 1 }}
                  className="w-6 h-0.5 bg-black block"
                />
                <motion.span
                  animate={{ rotate: isMenuOpen ? -45 : 0, y: isMenuOpen ? -7.5 : 0 }}
                  className="w-6 h-0.5 bg-black block"
                />
              </button>
            </Magnetic>
          </div>
        </div>
      </motion.div>

      {/* Mobile Menu Overlay */}
      <motion.div
        initial="closed"
        animate={isMenuOpen ? "open" : "closed"}
        variants={menuVariants}
        className="fixed inset-0 z-[90] bg-white/95 backdrop-blur-2xl md:hidden flex flex-col items-center justify-center"
      >
        <div className="flex flex-col items-center gap-8">
          {[
            { label: "Aesthetics", id: "carousel" },
            { label: "Features", id: "features" },
            { label: "Specs", id: "specifications" },
            { label: "Pre-order", id: "/login", isRoute: true }
          ].map((item) => (
            <Magnetic key={item.label}>
              <motion.button
                variants={itemVariants}
                onClick={() => handleMobileLink(item.id, item.isRoute)}
                className={cn(
                  "text-4xl font-bold tracking-tighter text-black pointer-events-auto",
                  item.isRoute && "px-8 py-3 bg-black text-white rounded-full text-xl mt-4"
                )}
              >
                {item.label}
              </motion.button>
            </Magnetic>
          ))}
        </div>
        
        {/* Footer info in menu */}
        <motion.div variants={itemVariants} className="absolute bottom-12 flex flex-col items-center text-black/30">
          <p className="text-[10px] tracking-[0.3em] font-bold uppercase">Aether Acoustics</p>
          <p className="text-xs mt-2">© 2024 Legacy Design</p>
        </motion.div>
      </motion.div>
    </>
  );
}
