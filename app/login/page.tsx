"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import InteractiveParticles from "@/components/InteractiveParticles";
import Magnetic from "@/components/Magnetic";
import TiltCard from "@/components/TiltCard";
import { usePageTransition } from "@/components/PageTransition";
import { useSound } from "@/components/useSound";

export default function LoginPage() {
  const router = useRouter();
  const { navigateTo } = usePageTransition();
  const { playClick } = useSound();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, filter: "blur(10px)" },
    visible: {
      opacity: 1, y: 0, filter: "blur(0px)",
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <main className="relative min-h-screen bg-[#F5F5F7] flex items-center justify-center overflow-hidden selection:bg-black/10 selection:text-black">

      {/* Interactive Canvas Background */}
      <InteractiveParticles />

      {/* Glowing Orbs for ambiance */}
      <motion.div
        animate={{ y: [0, -40, 0], x: [0, 30, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[5%] left-[10%] w-[50vw] h-[50vw] bg-white rounded-full blur-[100px] pointer-events-none opacity-60"
      />
      <motion.div
        animate={{ y: [0, 40, 0], x: [0, -30, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[5%] right-[10%] w-[40vw] h-[40vw] bg-white rounded-full blur-[100px] pointer-events-none opacity-60"
      />

      <div className="absolute top-6 left-6 md:top-10 md:left-10 z-20">
        <Magnetic strength={0.4}>
          <button
            onClick={() => { navigateTo('/'); }}
            className="p-4 -m-4 text-xs font-bold tracking-widest uppercase text-black/40 hover:text-black transition-colors"
          >
            ← Back to Aether
          </button>
        </Magnetic>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-[480px] mx-4"
      >
        <style jsx global>{`
          input:-webkit-autofill,
          input:-webkit-autofill:hover, 
          input:-webkit-autofill:focus, 
          input:-webkit-autofill:active{
            -webkit-box-shadow: 0 0 0 100px white inset !important;
            -webkit-text-fill-color: #111 !important;
            transition: background-color 5000s ease-in-out 0s;
          }
        `}</style>
        <TiltCard strength={10} className="w-full">
          <motion.div
            animate={{ 
              y: [0, -15, 0],
              boxShadow: [
                "0 20px 50px rgba(0,0,0,0.05), 0 5px 15px rgba(0,0,0,0.05)",
                "0 40px 100px rgba(0,0,0,0.08), 0 15px 30px rgba(0,0,0,0.04)",
                "0 20px 50px rgba(0,0,0,0.05), 0 5px 15px rgba(0,0,0,0.05)"
              ]
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="p-8 md:p-14 bg-white/40 backdrop-blur-3xl border border-white/60 rounded-[2.5rem]"
          >
            <motion.div variants={itemVariants} className="mb-12 text-center cursor-default">
              <motion.h1 whileHover={{ opacity: 0.7 }} transition={{ duration: 0.3 }} className="text-4xl md:text-5xl font-black tracking-tighter text-[#111] mb-3 uppercase">Welcome</motion.h1>
              <motion.p whileHover={{ opacity: 0.8 }} transition={{ duration: 0.3 }} className="text-base text-[#111]/50 tracking-wide">Enter your credentials to access your Aether ecosystem.</motion.p>
            </motion.div>

            <form className="flex flex-col gap-8" onSubmit={(e) => e.preventDefault()}>
              <motion.div variants={itemVariants} className="flex flex-col gap-3">
                <label className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#111]/40 ml-1">Email Address</label>
                <motion.input 
                  whileHover={{ scale: 1.01, backgroundColor: "rgba(255,255,255,0.8)" }}
                  whileFocus={{ backgroundColor: "rgba(255,255,255,0.9)", scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/40 border border-white/60 focus:border-[#111]/20 rounded-2xl px-6 py-5 text-sm outline-none transition-all"
                  placeholder="name@example.com"
                  suppressHydrationWarning
                />
              </motion.div>

              <motion.div variants={itemVariants} className="flex flex-col gap-3">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#111]/40">Security Key</label>
                  <a href="#" className="text-[10px] font-bold uppercase tracking-widest text-[#111]/30 hover:text-[#111] transition-colors">Recovery</a>
                </div>
                <motion.input 
                  whileHover={{ scale: 1.01, backgroundColor: "rgba(255,255,255,0.8)" }}
                  whileFocus={{ backgroundColor: "rgba(255,255,255,0.9)", scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/40 border border-white/60 focus:border-[#111]/20 rounded-2xl px-6 py-5 text-sm outline-none transition-all"
                  placeholder="••••••••"
                  suppressHydrationWarning
                />
              </motion.div>

              <motion.div variants={itemVariants} className="mt-6">
                <motion.button
                  onHoverStart={() => setIsHovered(true)}
                  onHoverEnd={() => setIsHovered(false)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative w-full bg-[#111] text-white rounded-2xl py-5 font-bold uppercase tracking-widest text-xs overflow-hidden group shadow-xl shadow-black/10"
                >
                  <motion.span 
                    className="relative z-10 inline-flex items-center gap-2"
                    animate={{ x: isHovered ? 4 : 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    Authenticate
                    <motion.span
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -5 }}
                      transition={{ duration: 0.2 }}
                    >
                      →
                    </motion.span>
                  </motion.span>
                  <motion.div 
                    className="absolute inset-0 bg-white/20"
                    initial={{ x: "-100%" }}
                    animate={{ x: isHovered ? "0%" : "-100%" }}
                    transition={{ ease: "easeInOut", duration: 0.3 }}
                  />
                </motion.button>
              </motion.div>
            </form>

            <motion.div variants={itemVariants} className="mt-12 text-center">
              <motion.p whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }} className="text-[10px] tracking-widest uppercase text-[#111]/40">
                New to aether? <a href="#" className="text-[#111] font-black hover:underline">Register Device</a>
              </motion.p>
            </motion.div>
          </motion.div>
        </TiltCard>
      </motion.div>
    </main>
  );
}
