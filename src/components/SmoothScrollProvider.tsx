"use client";

import React, { useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { hasPlayedIntroGlobal } from "./PageTransition";

declare global {
  interface Window {
    __lenis?: Lenis | null;
    __isScrollLocked?: boolean;
  }
}

export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Accessibility: skip smooth inertia scroll if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
    });

    lenisRef.current = lenis;
    window.__lenis = lenis;

    // Sync Lenis scroll with GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    const updateTicker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    // If preloader is running or scroll is locked, pause Lenis immediately
    if (
      window.__isScrollLocked ||
      (!hasPlayedIntroGlobal && window.location.pathname === "/")
    ) {
      lenis.stop();
    }

    return () => {
      lenis.destroy();
      gsap.ticker.remove(updateTicker);
      if (window.__lenis === lenis) {
        window.__lenis = null;
      }
    };
  }, []);

  return <>{children}</>;
}
