"use client";

import React from "react";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="bg-black text-white py-6 md:py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
        <div className="flex flex-col gap-6">
          <span className="text-2xl font-bold tracking-tighter">AETHER</span>
          <p className="text-white/50 text-sm max-w-xs leading-relaxed">
            Redefining the boundaries of sound and engineering. Forged for those who hear the difference.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <h4 className="text-xs uppercase tracking-widest font-bold text-white/30">Shop</h4>
          <ul className="flex flex-col gap-2 text-sm text-white/60">
            <li className="hover:text-white transition-colors cursor-pointer">Aether Headphones</li>
            <li className="hover:text-white transition-colors cursor-pointer">Accessories</li>
            <li className="hover:text-white transition-colors cursor-pointer">Gift Cards</li>
          </ul>
        </div>

        <div className="hidden md:flex flex-col gap-4">
          <h4 className="text-xs uppercase tracking-widest font-bold text-white/30">Support</h4>
          <ul className="flex flex-col gap-2 text-sm text-white/60">
            <li className="hover:text-white transition-colors cursor-pointer">Help Center</li>
            <li className="hover:text-white transition-colors cursor-pointer">Warranty</li>
            <li className="hover:text-white transition-colors cursor-pointer">Contact Us</li>
          </ul>
        </div>

        <div className="hidden md:flex flex-col gap-4">
          <h4 className="text-xs uppercase tracking-widest font-bold text-white/30">Legal</h4>
          <ul className="flex flex-col gap-2 text-sm text-white/60">
            <li className="hover:text-white transition-colors cursor-pointer">Privacy Policy</li>
            <li className="hover:text-white transition-colors cursor-pointer">Terms of Service</li>
            <li className="hover:text-white transition-colors cursor-pointer">Shipping & Returns</li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-white/30 text-xs">
          © 2026 Aether Audio Inc. All rights reserved.
        </p>
        <div className="flex gap-8 text-xs text-white/30">
          <span className="hover:text-white transition-colors cursor-pointer">Instagram</span>
          <span className="hover:text-white transition-colors cursor-pointer">Twitter</span>
          <span className="hover:text-white transition-colors cursor-pointer">YouTube</span>
        </div>
      </div>
    </footer>
  );
}
