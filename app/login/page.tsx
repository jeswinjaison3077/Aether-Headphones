"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, Variants } from "framer-motion";
import { useRouter } from "next/navigation";
import InteractiveParticles from "@/components/InteractiveParticles";
import Magnetic from "@/components/Magnetic";
import TiltCard from "@/components/TiltCard";
import { usePageTransition } from "@/components/PageTransition";
import { useSound } from "@/components/useSound";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function LoginPage() {
  const router = useRouter();
  const { navigateTo } = usePageTransition();
  const { playClick } = useSound();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(true);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      playClick();
      navigateTo('/');
    } catch (err: any) {
      setError(err.message || "Failed to authenticate.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      playClick();
      navigateTo('/');
    } catch (err: any) {
      setError(err.message || "Failed to authenticate with Google.");
    }
  };

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

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20, filter: "blur(10px)" },
    visible: {
      opacity: 1, y: 0, filter: "blur(0px)",
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <main className="relative min-h-screen bg-[#F5F5F7] flex items-center justify-center overflow-hidden selection:bg-black/10 selection:text-black">

      {/* Interactive Canvas Background */}
      <InteractiveParticles className="fixed inset-0 pointer-events-none z-0" />

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
            <motion.div variants={itemVariants} className="mb-8 text-center cursor-default">
              <motion.h1 whileHover={{ opacity: 0.7 }} transition={{ duration: 0.3 }} className="text-4xl md:text-5xl font-black tracking-tighter text-[#111] mb-3 uppercase">
                {isSignUp ? "Join Aether" : "Welcome"}
              </motion.h1>
              <motion.p whileHover={{ opacity: 0.8 }} transition={{ duration: 0.3 }} className="text-base text-[#111]/50 tracking-wide">
                {isSignUp ? "Create an account to join the ecosystem." : "Enter your credentials to access your Aether ecosystem."}
              </motion.p>
            </motion.div>

            {/* Large Tab Selector */}
            <motion.div variants={itemVariants} className="flex bg-[#111]/5 p-1 rounded-2xl mb-8 relative">
              <div 
                className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-xl shadow-sm transition-all duration-300 ease-out"
                style={{ left: !isSignUp ? "calc(50% + 2px)" : "4px" }}
              />
              <button
                type="button"
                onClick={() => setIsSignUp(true)}
                className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest relative z-10 transition-colors ${isSignUp ? 'text-[#111]' : 'text-[#111]/40 hover:text-[#111]/70'}`}
              >
                Create Account
              </button>
              <button
                type="button"
                onClick={() => setIsSignUp(false)}
                className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest relative z-10 transition-colors ${!isSignUp ? 'text-[#111]' : 'text-[#111]/40 hover:text-[#111]/70'}`}
              >
                Log In
              </button>
            </motion.div>

            <form className="flex flex-col gap-8" onSubmit={handleLogin}>
              {error && (
                <motion.div variants={itemVariants} className="text-red-500 text-xs font-bold text-center bg-red-100/10 p-3 rounded-lg border border-red-500/20">
                  {error}
                </motion.div>
              )}
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

              <motion.div variants={itemVariants} className="mt-6 flex flex-col gap-4">
                <motion.button
                  type="submit"
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
                    {isSignUp 
                      ? (isLoading ? "Registering..." : "Register") 
                      : (isLoading ? "Authenticating..." : "Authenticate")}
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
                
                <div className="flex items-center gap-2 w-full px-2">
                  <div className="h-px bg-[#111]/10 flex-1"></div>
                  <span className="text-[10px] uppercase font-bold text-[#111]/30">OR</span>
                  <div className="h-px bg-[#111]/10 flex-1"></div>
                </div>

                <motion.button
                  type="button"
                  onClick={handleGoogleLogin}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative w-full bg-white text-[#111] border border-[#111]/10 rounded-2xl py-5 font-bold uppercase tracking-widest text-xs shadow-sm hover:bg-[#111]/5 transition-colors flex items-center justify-center gap-3"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Continue with Google
                </motion.button>
              </motion.div>
            </form>
          </motion.div>
        </TiltCard>
      </motion.div>
    </main>
  );
}
