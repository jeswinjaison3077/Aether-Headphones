"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { useScroll, useSpring, motion, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

const FRAME_COUNT = 206;

export default function ScrollSequence() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [loadedCount, setLoadedCount] = useState(0);
  const [isReady, setIsReady] = useState(false);
  
  // Track scroll progress of the 400vh container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  
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
            // Push an empty/broken image placeholder or skip if needed. We'll just push what we have to keep indices aligned.
            loadedImages.push(img);
            setLoadedCount((prev) => prev + 1);
            resolve(null);
          }
        });
      }
      
      if (!isCancelled) {
        setImages(loadedImages);
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

    // "contain" fit logic: scale image to fit within canvas bounds while maintaining aspect ratio
    const imgAspect = img.width / img.height;
    const canvasAspect = canvas.width / canvas.height;
    
    let renderWidth, renderHeight, x, y;
    
    if (imgAspect > canvasAspect) {
      renderWidth = canvas.width;
      renderHeight = canvas.width / imgAspect;
      x = 0;
      y = (canvas.height - renderHeight) / 2;
    } else {
      renderHeight = canvas.height;
      renderWidth = canvas.height * imgAspect;
      y = 0;
      x = (canvas.width - renderWidth) / 2;
    }

    ctx.drawImage(img, x, y, renderWidth, renderHeight);
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
    <div ref={containerRef} className="relative w-full" style={{ height: "400vh" }}>
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
      </div>
    </div>
  );
}
