"use client";

import React from "react";
import { useScroll } from "framer-motion";
import ScrollSequence from "@/components/ScrollSequence";
import TextOverlay from "@/components/TextOverlay";
import ProductSections from "@/components/ProductSections";

export default function Home() {
  // Track scroll progress against the full window — no target needed since
  // the page itself is the scroll container. This avoids the Framer Motion
  // "non-static position" warning that fires when using a target ref.
  const { scrollYProgress } = useScroll();

  return (
    <main className="relative min-h-screen bg-white selection:bg-black/10 selection:text-black">
      {/*
        ScrollSequence manages its own scoped sticky canvas + scroll tracking
        internally, using its own ref on the 400vh container.
      */}
      <ScrollSequence />

      {/* Beat A — 0–20% | Centered */}
      <TextOverlay
        title="EVOLUTION"
        subtitle="Witness the seamless assembly of raw performance and design."
        align="center"
        startRange={0.0}
        endRange={0.20}
        scrollYProgress={scrollYProgress}
      />

      {/* Beat B — 25–45% | Left */}
      <TextOverlay
        title="PRECISION"
        subtitle="Every component forged with absolute intent. Nothing is extraneous."
        align="left"
        startRange={0.25}
        endRange={0.45}
        scrollYProgress={scrollYProgress}
      />

      {/* Beat C — 50–70% | Right */}
      <TextOverlay
        title="DYNAMICS"
        subtitle="Fluid mechanics meeting state-of-the-art engineering to push boundaries."
        align="right"
        startRange={0.50}
        endRange={0.70}
        scrollYProgress={scrollYProgress}
      />

      {/* Beat D — 75–95% | Centered, no CTA button (clean hero) */}
      <TextOverlay
        title="EXPERIENCE IT"
        subtitle="The future is no longer a concept. It is here."
        align="center"
        startRange={0.75}
        endRange={0.95}
        scrollYProgress={scrollYProgress}
      />

      {/* ── Product detail sections begin after animation completes ───── */}
      <ProductSections />
    </main>
  );
}
