"use client";

import React from "react";
import { useScroll, motion, useTransform } from "framer-motion";
import ScrollSequence from "@/components/ScrollSequence";
import TextOverlay from "@/components/TextOverlay";
import ProductSections from "@/components/ProductSections";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import InteractiveParticles from "@/components/InteractiveParticles";
import Magnetic from "@/components/Magnetic";

export default function Home() {
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Track scroll progress specifically for the animation container
  const { scrollYProgress: sequenceProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Track global scroll for things that need it (like Navbar, though it has its own)
  const { scrollYProgress } = useScroll();

  return (
    <main className="relative min-h-screen bg-transparent selection:bg-black/10 selection:text-black">
      <InteractiveParticles intensity={0.25} className="fixed inset-0 pointer-events-none z-0" />
      <Navbar sequenceProgress={sequenceProgress} />
      {/*
        ScrollSequence manages its own scoped sticky canvas + scroll tracking
        internally, using its own ref on the 400vh container.
      */}
      <ScrollSequence containerRef={containerRef} scrollYProgress={sequenceProgress} />


      {/* Beat A — 0–25% | Centered Hero Beat */}
      <TextOverlay
        title="EVOLUTION"
        subtitle="Witness the seamless assembly of raw performance."
        align="center"
        startRange={0.0}
        endRange={0.22}
        scrollYProgress={sequenceProgress}
        maxOpacity={1.0}
        premiumFadeIn
        titleClass="text-6xl md:text-8xl text-white"
        subtitleClass="text-sm md:text-xl text-white/80 font-medium"
      />


      {/* Beat B — 15–26% | Bottom Right (ANC section) */}
      <TextOverlay
        title="DYNAMICS"
        subtitle="Fluid mechanics meeting state-of-the-art engineering."
        align="top-left"

        startRange={0.27}
        endRange={0.45}
        scrollYProgress={sequenceProgress}
        maxOpacity={1.0}
        titleClass="text-6xl md:text-8xl text-white"
        subtitleClass="text-sm md:text-xl text-white/60"
      />


      {/* Beat C — 30–45% | Top Left (Before Carousel) */}
      <TextOverlay
        title="PRECISION"
        subtitle="Every component forged with absolute intent."
        align="bottom-right"

        startRange={0.45}
        endRange={0.70}
        scrollYProgress={sequenceProgress}
        maxOpacity={1.0}
        titleClass="text-6xl md:text-8xl text-white"
        subtitleClass="text-sm md:text-xl text-white/60"
      />


      {/* Beat D — 55–75% | Centered (Experience & Specs) */}
      <TextOverlay
        variant="aether"
        title="AETHER"
        subtitle="Introducing the new standard of pure sound."
        align="center-top"

        startRange={0.80}
        endRange={1.00}
        scrollYProgress={sequenceProgress}
        maxOpacity={1.0}
        premiumFadeIn
        titleClass="text-5xl md:text-7xl text-[#000] font-medium tracking-[0.25em] uppercase"
        subtitleClass="text-sm md:text-xl text-[#000]/80 font-medium"
      />




      {/* Additional Overlays for Product Sections */}
      {/* Feature Section Right */}
      {/* 💡 TO ADJUST OPACITY: Change maxOpacity={1.0} below. Example: maxOpacity={0.7} */}
      <TextOverlay
        title="PURE"
        subtitle="Minimalist form, maximalist output."
        align="right"
        startRange={0.12}
        endRange={0.23}
        scrollYProgress={scrollYProgress}
        maxOpacity={0.95}
        titleClass="text-4xl md:text-7xl text-[#000]"
        subtitleClass="text-sm md:text-xl text-[#000]/60"
      />

      {/* Feature Section Left */}
      {/* 💡 TO ADJUST OPACITY: Change maxOpacity={1.0} below. Example: maxOpacity={0.7} */}
      <TextOverlay
        title="INTENT"
        subtitle="Designed for the discerning listener."
        align="left"
        startRange={0.23}
        endRange={0.34}
        scrollYProgress={scrollYProgress}
        maxOpacity={0.75}
        titleClass="text-4xl md:text-7xl text-[#000]"
        subtitleClass="text-sm md:text-xl text-[#000]/60"
      />





      {/* ── Product detail sections begin after animation completes ───── */}
      {/* Horizontal Marquee Animation */}
      <div className="w-full overflow-hidden bg-white py-12 md:py-24 border-y border-black/5 relative z-10">
        <motion.div
          className="flex whitespace-nowrap"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
        >
          {Array(8).fill("AETHER ONE • PURE SOUND • SEAMLESS DESIGN • ").map((text, i) => (
            <span key={i} className="text-3xl md:text-5xl font-black text-black/5 uppercase tracking-[0.2em] px-4">
              {text}
            </span>
          ))}
        </motion.div>
      </div>
      <ProductSections />
      <Footer />
    </main>
  );
}
