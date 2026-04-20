"use client";

import React from "react";
import { motion } from "framer-motion";
import { LeftDoodle, RightDoodle, WaveformBg } from "@/components/DoodleLayer";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// Precomputed — static module-level constant prevents server/client float mismatch
const AUDIO_BARS = Array.from({ length: 17 }, (_, i) => ({
  x: i * 18,
  h: Math.round(Math.sin((i / 16) * Math.PI) * 50 * 1e8) / 1e8,
}));

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.9, ease: EASE, delay }}
      className={className}
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
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 1.1, ease: EASE }}
      className="w-full h-px bg-black/8 origin-left mx-auto max-w-6xl px-6 md:px-20"
    />
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs uppercase tracking-[0.3em] text-black/35 mb-16 font-medium">
      {children}
    </p>
  );
}

export default function ProductSections() {
  return (
    <div className="bg-white w-full overflow-x-hidden">

      {/* ── TRANSITION BRIDGE */}
      <div className="h-32 w-full bg-gradient-to-b from-white/0 to-white" />

      {/* ══════════════════════════════════════════════════════════
          §1  PRODUCT INTRO
      ══════════════════════════════════════════════════════════ */}
      <section className="relative px-6 md:px-20 pt-4 pb-40 text-center max-w-4xl mx-auto">
        <LeftDoodle delay={0.2} />
        <RightDoodle delay={0.4} />

        <Reveal><Label>Introducing</Label></Reveal>
        <Reveal delay={0.1}>
          <h1 className="text-7xl md:text-9xl font-bold tracking-tighter text-[#111] leading-none mb-8">
            Aether One
          </h1>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="text-2xl md:text-3xl text-[#111] font-light tracking-tight mb-10 leading-snug">
            Pure Sound. No Distractions.
          </p>
        </Reveal>
        <Reveal delay={0.3}>
          <p className="text-base md:text-lg text-[#555] leading-relaxed max-w-2xl mx-auto font-light">
            Engineered for those who hear the difference. Aether One blends precision acoustic
            engineering with a form refined to near-invisibility — disappearing into your day
            while the music stays present.
          </p>
        </Reveal>
      </section>

      <Divider />

      {/* ══════════════════════════════════════════════════════════
          §2  FEATURES
      ══════════════════════════════════════════════════════════ */}
      <section className="px-6 md:px-20 py-32 max-w-6xl mx-auto">
        <Reveal><Label>Features</Label></Reveal>

        {/* F1 — ANC */}
        <div className="grid md:grid-cols-2 gap-16 items-center mb-36">
          <Reveal className="order-2 md:order-1">
            <p className="text-xs tracking-[0.25em] text-black/30 mb-5 font-medium uppercase">01</p>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-[#111] leading-tight mb-6">
              Active Noise<br />Cancellation
            </h2>
            <p className="text-lg text-[#555] font-light leading-relaxed max-w-md">
              Block out the world. Stay in your sound. Adaptive algorithms continuously
              sample and counteract ambient noise, so your music plays in silence.
            </p>
          </Reveal>
          <Reveal delay={0.12} className="order-1 md:order-2">
            <div className="aspect-square rounded-3xl bg-[#F5F5F7] flex items-center justify-center relative overflow-hidden">
              <div className="relative flex items-center justify-center w-full h-full">
                {[260, 200, 140, 86, 44].map((size, i) => (
                  <motion.div
                    key={i}
                    className="absolute rounded-full border border-black/10"
                    style={{ width: size, height: size }}
                    initial={{ opacity: 0, scale: 0.6 }}
                    whileInView={{ opacity: 1 - i * 0.15, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.09, duration: 0.8, ease: EASE }}
                  />
                ))}
                <div className="relative z-10 text-center">
                  <p className="text-5xl font-bold tracking-tighter text-[#111]">ANC</p>
                  <p className="text-xs tracking-widest uppercase text-[#555] mt-2">Adaptive</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* F2 — Battery */}
        <div className="grid md:grid-cols-2 gap-16 items-center mb-36">
          <Reveal delay={0.06}>
            <div className="aspect-square rounded-3xl bg-[#F5F5F7] flex items-center justify-center">
              <div className="text-center">
                <motion.p
                  className="text-[9rem] md:text-[11rem] font-bold tracking-tighter text-[#111] leading-none"
                  initial={{ opacity: 0, scale: 0.75 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, ease: EASE }}
                >30</motion.p>
                <motion.p
                  className="text-xl tracking-widest uppercase text-[#555] font-light -mt-2"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.35, duration: 0.6 }}
                >Hours</motion.p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="text-xs tracking-[0.25em] text-black/30 mb-5 font-medium uppercase">02</p>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-[#111] leading-tight mb-6">
              30-Hour<br />Battery
            </h2>
            <p className="text-lg text-[#555] font-light leading-relaxed max-w-md">
              Power that lasts through your day. A 10-minute charge delivers 3 hours of
              playback. USB-C fast charging keeps you in the music, not the outlet.
            </p>
          </Reveal>
        </div>

        {/* F3 — Audio */}
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <Reveal className="order-2 md:order-1">
            <p className="text-xs tracking-[0.25em] text-black/30 mb-5 font-medium uppercase">03</p>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-[#111] leading-tight mb-6">
              Precision<br />Audio
            </h2>
            <p className="text-lg text-[#555] font-light leading-relaxed max-w-md">
              Clear, balanced, immersive sound. Custom 40mm bio-cellulose drivers reproduce
              every layer — from the deepest sub-bass to the finest high-frequency detail.
            </p>
          </Reveal>
          <Reveal delay={0.12} className="order-1 md:order-2">
            <div className="aspect-square rounded-3xl bg-[#F5F5F7] flex items-center justify-center overflow-hidden px-10 py-8">
              <svg viewBox="0 0 300 120" className="w-full" fill="none">
                {AUDIO_BARS.map((bar, i) => (
                  <React.Fragment key={i}>
                    <motion.line x1={bar.x} y1={60} x2={bar.x} y2={60 - bar.h}
                      stroke="#111" strokeWidth="2" strokeLinecap="round"
                      initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.04, duration: 0.6, ease: "easeOut" as const }}
                      style={{ transformOrigin: `${bar.x}px 60px` }}
                    />
                    <motion.line x1={bar.x} y1={60} x2={bar.x} y2={60 + bar.h * 0.4}
                      stroke="#111" strokeWidth="2" strokeLinecap="round" strokeOpacity={0.18}
                      initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.04 + 0.1, duration: 0.6, ease: "easeOut" as const }}
                      style={{ transformOrigin: `${bar.x}px 60px` }}
                    />
                  </React.Fragment>
                ))}
              </svg>
            </div>
          </Reveal>
        </div>
      </section>

      <Divider />

      {/* ══════════════════════════════════════════════════════════
          §3  IMMERSIVE STATEMENT BREAK
      ══════════════════════════════════════════════════════════ */}
      <section className="relative px-6 md:px-20 py-40 overflow-hidden">
        <LeftDoodle delay={0.1} />
        <RightDoodle delay={0.3} />
        <div className="max-w-5xl mx-auto text-center">
          <motion.h2
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-[#111] leading-tight"
            initial={{ opacity: 0, letterSpacing: "0.05em" }}
            whileInView={{ opacity: 1, letterSpacing: "-0.04em" }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1.4, ease: EASE }}
          >
            Engineered for silence.<br />Designed for clarity.
          </motion.h2>
          <Reveal delay={0.4}>
            <p className="text-lg text-[#555] font-light mt-10 max-w-lg mx-auto leading-relaxed">
              Built to disappear. Made to perform.
            </p>
          </Reveal>
        </div>
      </section>

      <Divider />

      {/* ══════════════════════════════════════════════════════════
          §4  MICRO DETAILS  (side animated panel)
      ══════════════════════════════════════════════════════════ */}
      <section className="relative px-6 md:px-20 py-32 max-w-6xl mx-auto">
        <Reveal><Label>Micro Details</Label></Reveal>
        <div className="grid md:grid-cols-2 gap-20 items-center">
          <div className="space-y-16">
            {[
              { title: "Adaptive Noise Control", body: "Sound that adapts to you. The headphones analyse your environment 50,000 times per second, dynamically adjusting noise cancellation without you lifting a finger." },
              { title: "Precision-Tuned Drivers", body: "Clarity in every frequency. Each driver is individually calibrated to deliver consistent, accurate sound across the full spectrum." },
              { title: "Soft-Touch Architecture", body: "Designed for everyday listening. Memory foam ear cushions and a featherlight frame ensure hours of fatigue-free wear." },
            ].map((item, i) => (
              <Reveal key={item.title} delay={i * 0.12}>
                <p className="text-xs tracking-widest uppercase text-black/30 mb-3 font-medium">
                  0{i + 1}
                </p>
                <h3 className="text-2xl md:text-3xl font-bold tracking-tighter text-[#111] mb-3">
                  {item.title}
                </h3>
                <p className="text-base text-[#555] font-light leading-relaxed">{item.body}</p>
              </Reveal>
            ))}
          </div>

          {/* Animated right panel — slow rotating abstract shape */}
          <div className="relative flex items-center justify-center h-96 md:h-[520px]">
            <motion.div
              className="absolute inset-0"
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            >
              <svg viewBox="0 0 300 300" className="w-full h-full opacity-[0.06]" fill="none">
                <ellipse cx="150" cy="150" rx="120" ry="60" stroke="black" strokeWidth="1" />
                <ellipse cx="150" cy="150" rx="60" ry="120" stroke="black" strokeWidth="1" />
                <circle cx="150" cy="150" r="100" stroke="black" strokeWidth="1" />
                <circle cx="150" cy="150" r="50" stroke="black" strokeWidth="1" />
              </svg>
            </motion.div>
            <motion.div
              className="absolute inset-8"
              animate={{ rotate: -360 }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            >
              <svg viewBox="0 0 300 300" className="w-full h-full opacity-[0.05]" fill="none">
                <polygon points="150,30 270,210 30,210" stroke="black" strokeWidth="1" />
                <polygon points="150,270 30,90 270,90" stroke="black" strokeWidth="1" />
              </svg>
            </motion.div>
            <div className="relative z-10 text-center">
              <p className="text-6xl md:text-7xl font-bold tracking-tighter text-[#111]">40mm</p>
              <p className="text-sm tracking-widest uppercase text-[#555] mt-2">Driver Size</p>
            </div>
          </div>
        </div>
      </section>

      <Divider />

      {/* ══════════════════════════════════════════════════════════
          §5  EXPERIENCE FLOW
      ══════════════════════════════════════════════════════════ */}
      <section className="px-6 md:px-20 py-32 max-w-5xl mx-auto">
        <Reveal><Label>Experience</Label></Reveal>
        <div className="grid md:grid-cols-3 gap-12">
          {[
            { step: "01", title: "Connect instantly", body: "Open the case. Pair in under 2 seconds via Bluetooth 5.3 multipoint." },
            { step: "02", title: "Play effortlessly", body: "Intuitive touch controls let you navigate without breaking focus." },
            { step: "03", title: "Stay immersed", body: "ANC + Transparency mode adapt to your world, automatically." },
          ].map((item, i) => (
            <Reveal key={item.step} delay={i * 0.15}>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
                className="group"
              >
                <p className="text-xs tracking-widest uppercase text-black/25 mb-6 font-medium">
                  Step {item.step}
                </p>
                <motion.div
                  className="w-10 h-10 rounded-full border border-black/15 flex items-center justify-center mb-6 group-hover:border-black/40 transition-colors duration-300"
                  whileInView={{ scale: [0.5, 1.05, 1] }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 + 0.3, duration: 0.6, ease: EASE }}
                >
                  <span className="text-xs font-bold text-[#111]">{i + 1}</span>
                </motion.div>
                <h3 className="text-xl md:text-2xl font-bold tracking-tight text-[#111] mb-3">
                  {item.title}
                </h3>
                <p className="text-sm text-[#555] font-light leading-relaxed">{item.body}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </section>

      <Divider />

      {/* ══════════════════════════════════════════════════════════
          §6  SOUND VISUALIZATION
      ══════════════════════════════════════════════════════════ */}
      <section className="relative px-6 md:px-20 py-40 overflow-hidden">
        <WaveformBg />
        <div className="relative z-10 text-center max-w-3xl mx-auto">
          <Reveal>
            <p className="text-xs tracking-[0.3em] uppercase text-black/35 mb-10 font-medium">Sound</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-[#111] leading-tight mb-8">
              Clarity in every<br />frequency.
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-lg text-[#555] font-light leading-relaxed max-w-xl mx-auto">
              From 20Hz to 20kHz, every note is reproduced with faithful accuracy.
              Hear music the way the artist intended.
            </p>
          </Reveal>
        </div>
      </section>

      <Divider />

      {/* ══════════════════════════════════════════════════════════
          §7  SPECIFICATIONS
      ══════════════════════════════════════════════════════════ */}
      <section className="px-6 md:px-20 py-32 max-w-6xl mx-auto">
        <Reveal><Label>Specifications</Label></Reveal>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-black/6">
          {[
            { label: "Battery Life", value: "30 hrs", sub: "Up to" },
            { label: "Bluetooth", value: "5.3", sub: "Version" },
            { label: "Charging", value: "USB-C", sub: "Fast Charge" },
            { label: "Weight", value: "250g", sub: "Featherlight" },
          ].map((spec, i) => (
            <motion.div
              key={spec.label}
              className="bg-white px-8 py-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: i * 0.1, duration: 0.7, ease: EASE }}
            >
              <p className="text-xs uppercase tracking-widest text-black/30 mb-4 font-medium">{spec.sub}</p>
              <p className="text-4xl md:text-5xl font-bold tracking-tighter text-[#111] mb-2">{spec.value}</p>
              <p className="text-sm text-[#555] font-light">{spec.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <Divider />

      {/* ══════════════════════════════════════════════════════════
          §8  SOCIAL PROOF
      ══════════════════════════════════════════════════════════ */}
      <section className="relative px-6 md:px-20 py-32 max-w-6xl mx-auto overflow-hidden">
        <LeftDoodle delay={0} />
        <RightDoodle delay={0.2} />
        <Reveal className="text-center mb-20">
          <p className="text-xs uppercase tracking-[0.3em] text-black/35 mb-4 font-medium">Reviews</p>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-[#111]">
            Loved by 10,000+<br />listeners.
          </h2>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { quote: "The best headphones I've ever worn. The silence is absolute.", name: "Arjun M.", location: "Mumbai" },
            { quote: "Aether One changed how I listen to music. Nothing compares.", name: "Priya K.", location: "Bangalore" },
            { quote: "30 hours of battery and it still sounds incredible. Unreal.", name: "Rahul S.", location: "Delhi" },
          ].map((review, i) => (
            <Reveal key={review.name} delay={i * 0.12}>
              <div className="bg-[#F9F9F9] rounded-2xl p-8">
                <p className="text-base text-[#222] font-light leading-relaxed mb-8 italic">
                  "{review.quote}"
                </p>
                <div>
                  <p className="text-sm font-semibold text-[#111] tracking-tight">{review.name}</p>
                  <p className="text-xs text-[#888] mt-1">{review.location}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <Divider />

      {/* ══════════════════════════════════════════════════════════
          §9  PRICING
      ══════════════════════════════════════════════════════════ */}
      <section className="px-6 md:px-20 py-32 max-w-2xl mx-auto text-center">
        <Reveal><Label>Pricing</Label></Reveal>
        <motion.div
          className="bg-[#F5F5F7] rounded-3xl px-12 py-16 flex flex-col items-center"
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          <p className="text-sm tracking-widest uppercase text-[#555] mb-8 font-medium">Aether One</p>
          <p className="text-7xl md:text-8xl font-bold tracking-tighter text-[#111] mb-3 leading-none">
            ₹12,999
          </p>
          <p className="text-sm text-[#555] mb-12 font-light">Free shipping · 2-year warranty</p>
          <motion.button
            whileHover={{ scale: 1.03, backgroundColor: "#333" }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="px-14 py-5 bg-[#111] text-white font-semibold tracking-widest uppercase text-sm rounded-full"
          >
            Buy Now
          </motion.button>
        </motion.div>
      </section>

      <Divider />

      {/* ══════════════════════════════════════════════════════════
          §10  FINAL CTA
      ══════════════════════════════════════════════════════════ */}
      <section className="px-6 md:px-20 py-48 text-center max-w-4xl mx-auto">
        <Reveal>
          <h2 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter text-[#111] leading-none mb-12">
            Listen<br />Differently.
          </h2>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="text-lg text-[#555] font-light mb-16 max-w-xl mx-auto leading-relaxed">
            Sound as it was meant to be heard. Crafted without compromise.
          </p>
        </Reveal>
        <Reveal delay={0.25}>
          <motion.button
            whileHover={{ scale: 1.04, backgroundColor: "#333" }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.25, ease: "easeOut" as const }}
            className="px-14 py-5 bg-[#111] text-white font-semibold tracking-widest uppercase text-sm rounded-full"
          >
            Get Aether One
          </motion.button>
        </Reveal>
      </section>

      <div className="h-24 bg-white" />
    </div>
  );
}
