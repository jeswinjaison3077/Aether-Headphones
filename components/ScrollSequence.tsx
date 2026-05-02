"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { useScroll, useSpring, motion, useTransform, MotionValue } from "framer-motion";
import { LeftDoodle, RightDoodle } from "./DoodleLayer";
import Magnetic from "./Magnetic";
import { cn } from "@/lib/utils";

const FRAME_COUNT = 150;

// Global cache to persist images across component remounts (navigation)
let globalImageCache: HTMLImageElement[] = [];
let globalIsLoaded = false;

interface ScrollSequenceProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  scrollYProgress: MotionValue<number>;
}

export default function ScrollSequence({ containerRef, scrollYProgress }: ScrollSequenceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [images, setImages] = useState<HTMLImageElement[]>(globalImageCache);
  const [loadedCount, setLoadedCount] = useState(globalIsLoaded ? FRAME_COUNT : 0);
  const [isReady, setIsReady] = useState(globalIsLoaded);
  
  // Smooth out the scroll progress to avoid jitter

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Calculate indicator opacity (visible at 0, fades out by 10% scroll)
  const indicatorOpacity = useTransform(smoothProgress, [0, 0.05, 0.1], [1, 1, 0]);

  // Preload images on mount
  useEffect(() => {
    // If already globally loaded, don't do anything
    if (globalIsLoaded) return;

    let isCancelled = false;
    const loadedImages: HTMLImageElement[] = [];
    
    const preloadImages = async () => {
      for (let i = 1; i <= FRAME_COUNT; i++) {
        if (isCancelled) break;
        
        const img = new Image();
        const paddedIndex = String(i).padStart(3, "0");
        img.src = `/sequence/ezgif-frame-${paddedIndex}.jpg`;
        
        await new Promise((resolve) => {
          img.onload = () => {
            loadedImages.push(img);
            setLoadedCount((prev) => prev + 1);
            resolve(null);
          };
          img.onerror = () => {
            console.error(`Failed to load image: ${img.src}`);
            loadedImages.push(img);
            setLoadedCount((prev) => prev + 1);
            resolve(null);
          }
        });
      }
      
      if (!isCancelled) {
        setImages(loadedImages);
        globalImageCache = loadedImages;
        globalIsLoaded = true;
        // Small delay to let React commit the loaded state and prevent a flash
        setTimeout(() => setIsReady(true), 500);
      }
    };
    
    preloadImages();
    
    return () => {
      isCancelled = true;
    };
  }, []);

  // Draw current frame on canvas
  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const img = images[index];

    if (!canvas || !ctx || !img) return;

    // We want the internal resolution of the canvas to match its display size for crispness
    const { width, height } = canvas.getBoundingClientRect();
    
    // Optimize performance by not resizing if it hasn't changed
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // "cover" fit logic: scale image to fill the entire canvas while maintaining aspect ratio
    const imgAspect = img.width / img.height;
    const canvasAspect = canvas.width / canvas.height;
    
    let renderWidth, renderHeight, x, y;

    
    if (imgAspect > canvasAspect) {
      // Image is wider than canvas: match height and crop sides
      renderHeight = canvas.height;
      renderWidth = canvas.height * imgAspect;
    } else {
      // Image is taller than canvas: match width and crop top/bottom
      renderWidth = canvas.width;
      renderHeight = canvas.width / imgAspect;
    }

    x = (canvas.width - renderWidth) / 2;
    y = (canvas.height - renderHeight) / 2;

    // Scale up by 8% to push the Gemini watermark (bottom right) off the canvas
    const scaleFactor = 1.08;
    const scaledWidth = renderWidth * scaleFactor;
    const scaledHeight = renderHeight * scaleFactor;
    const scaledX = canvas.width / 2 - scaledWidth / 2;
    const scaledY = canvas.height / 2 - scaledHeight / 2;

    ctx.drawImage(img, scaledX, scaledY, scaledWidth, scaledHeight);

  }, [images]);

  // Subscribe to smoothProgress changes and draw corresponding frame
  useEffect(() => {
    if (!isReady || images.length === 0) return;
    
    // Draw initial frame
    drawFrame(0);
    
    // Subscribe to spring progress
    const unsubscribe = smoothProgress.on("change", (latest) => {
      // Map 0 -> 1 progress to 0 -> FRAME_COUNT - 1 index
      let frameIndex = Math.floor(latest * FRAME_COUNT);
      if (frameIndex >= FRAME_COUNT) frameIndex = FRAME_COUNT - 1;
      if (frameIndex < 0) frameIndex = 0;
      
      // Use requestAnimationFrame for smoother rendering
      requestAnimationFrame(() => drawFrame(frameIndex));
    });
    
    return () => unsubscribe();
  }, [isReady, images, smoothProgress, drawFrame]);

  // Handle window resize to re-draw current frame
  useEffect(() => {
    if (!isReady) return;
    
    const handleResize = () => {
      const latest = smoothProgress.get();
      let frameIndex = Math.floor(latest * FRAME_COUNT);
      if (frameIndex >= FRAME_COUNT) frameIndex = FRAME_COUNT - 1;
      if (frameIndex < 0) frameIndex = 0;
      requestAnimationFrame(() => drawFrame(frameIndex));
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isReady, smoothProgress, drawFrame]);

  return (
    <div ref={containerRef} className="relative w-full" style={{ height: "170vh" }}>
      {/* Loading Overlay */}
      {!isReady && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
          <div className="flex flex-col items-center space-y-6">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-t-2 border-black/20 animate-spin"></div>
              <div className="absolute inset-0 rounded-full border-t-2 border-black animate-spin" style={{ animationDuration: '1.5s', animationDirection: 'reverse' }}></div>
            </div>
            <div className="text-black/60 font-medium text-sm tracking-widest uppercase">
              Assembling... {Math.round((loadedCount / FRAME_COUNT) * 100)}%
            </div>
            <div className="w-64 h-1 bg-black/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-black transition-all duration-300 ease-out" 
                style={{ width: `${(loadedCount / FRAME_COUNT) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* Sticky Canvas Container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-white">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-contain"
        />

        {/* Floating Doodles inside sticky canvas container */}
        <motion.div 
          style={{ opacity: useTransform(smoothProgress, [0, 0.1, 0.9, 1], [1, 0, 0, 1]) }}
          className="absolute inset-0 pointer-events-none"
        >
          <LeftDoodle delay={0} />
          <RightDoodle delay={0} />
        </motion.div>
        
        {/* Scroll Indicator */}

        {isReady && (
          <motion.div 
            style={{ opacity: indicatorOpacity }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none"
          >
            <span className="text-black/60 uppercase tracking-widest text-xs mb-3">Scroll to Explore</span>
            <div className="w-[1px] h-12 bg-black/20 relative overflow-hidden">
              <motion.div 
                className="absolute top-0 w-full h-1/2 bg-black"
                animate={{ y: ["-100%", "200%"] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              />
            </div>
          </motion.div>
        )}

        {/* Specifications Button - Sliding from the left */}
        <motion.div
          style={{
            opacity: useTransform(smoothProgress, [0.6, 0.75], [0, 1]),
            x: useTransform(smoothProgress, [0.6, 0.85], ["-15vw", "0vw"])
          }}
          className="absolute bottom-12 md:bottom-24 left-8 md:left-20 z-50 hidden md:flex items-center justify-start"
        >
          <Magnetic>
            <motion.button 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              onClick={() => {
                document.getElementById("specifications")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="group flex items-center gap-5 px-2 py-2 bg-transparent text-xl md:text-3xl font-light tracking-[0.1em] uppercase transition-all text-[#111]"
            >
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-full border border-black/20 flex items-center justify-center group-hover:bg-[#111] group-hover:text-white transition-all duration-500 shadow-sm overflow-hidden relative">
                <motion.div className="absolute inset-0 bg-[#111] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="relative z-10 group-hover:-rotate-45 group-hover:scale-110 transition-transform duration-500 ease-out">
                  <path d="M19 12H5"></path>
                  <path d="M12 19l-7-7 7-7"></path>
                </svg>
              </div>
              <span className="group-hover:translate-x-3 transition-transform duration-500 ease-out">Specs</span>
            </motion.button>
          </Magnetic>
        </motion.div>

        {/* Features Button - Sliding from the right */}
        <motion.div
          style={{
            opacity: useTransform(smoothProgress, [0.6, 0.75], [0, 1]),
            x: useTransform(smoothProgress, [0.6, 0.85], ["15vw", "0vw"])
          }}
          className="absolute bottom-12 md:bottom-24 right-8 md:right-20 z-50 hidden md:flex items-center justify-end"
        >
          <Magnetic>
            <motion.button 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              onClick={() => {
                document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="group flex items-center gap-5 px-2 py-2 bg-transparent text-xl md:text-3xl font-light tracking-[0.1em] uppercase transition-all text-[#111]"
            >
              <span className="group-hover:-translate-x-3 transition-transform duration-500 ease-out">Features</span>
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-full border border-black/20 flex items-center justify-center group-hover:bg-[#111] group-hover:text-white transition-all duration-500 shadow-sm overflow-hidden relative">
                <motion.div className="absolute inset-0 bg-[#111] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="relative z-10 group-hover:rotate-45 group-hover:scale-110 transition-transform duration-500 ease-out">
                  <path d="M5 12h14"></path>
                  <path d="M12 5l7 7-7 7"></path>
                </svg>
              </div>
            </motion.button>
          </Magnetic>
        </motion.div>
      </div>
    </div>
  );
}
