"use client";

import { useRef, useCallback, useEffect } from "react";

// Singleton audio instances to avoid multiple loads
let clickAudio: HTMLAudioElement | null = null;
let whooshAudio: HTMLAudioElement | null = null;

function getClickAudio() {
  if (typeof window === "undefined") return null;
  if (!clickAudio) {
    clickAudio = new Audio("/sounds/47313572-ui-sounds-pack-3-15-359713.mp3");
    clickAudio.volume = 0.35;
    clickAudio.preload = "auto";
  }
  return clickAudio;
}

function getWhooshAudio() {
  if (typeof window === "undefined") return null;
  if (!whooshAudio) {
    whooshAudio = new Audio("/sounds/dragon-studio-whoosh-cinematic-sound-effect-376889.mp3");
    whooshAudio.volume = 0.18;
    whooshAudio.preload = "auto";
  }
  return whooshAudio;
}

export function useSound() {
  const playClick = useCallback(() => {
    const audio = getClickAudio();
    if (!audio) return;
    // Use a clone to allow overlapping sounds for rapid clicks
    const clone = audio.cloneNode() as HTMLAudioElement;
    clone.volume = audio.volume;
    clone.play().catch(() => { });
  }, []);

  const playWhoosh = useCallback(() => {
    const audio = getWhooshAudio();
    if (!audio) return;
    // Use a clone for consistency and reliability
    const clone = audio.cloneNode() as HTMLAudioElement;
    clone.volume = audio.volume;
    // Crop the starting silence/slow build-up (start at 0.2s)
    clone.currentTime = 0.3;
    clone.play().catch(() => { });
  }, []);

  return { playClick, playWhoosh };
}

// Preload both sounds on first user interaction (browser policy)
export function SoundPreloader() {
  useEffect(() => {
    const preload = () => {
      const c = getClickAudio();
      const w = getWhooshAudio();

      // 'Warm up' the audio elements to unlock them for future plays (including clones)
      if (c) {
        c.muted = true;
        c.play().then(() => {
          c.pause();
          c.muted = false;
          c.currentTime = 0;
        }).catch(() => { });
      }
      if (w) {
        w.muted = true;
        w.play().then(() => {
          w.pause();
          w.muted = false;
          w.currentTime = 0;
        }).catch(() => { });
      }

      window.removeEventListener("pointerdown", preload);
    };
    window.addEventListener("pointerdown", preload, { once: true });
  }, []);

  return null;
}
