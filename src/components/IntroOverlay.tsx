"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function IntroOverlay() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    // Only play intro once per browser session
    if (sessionStorage.getItem("intro-played")) {
      setHidden(true);
      return;
    }

    // Lock scroll during intro
    document.documentElement.style.overflow = "hidden";

    const tl = gsap.timeline({
      onComplete: () => {
        sessionStorage.setItem("intro-played", "1");
        document.documentElement.style.overflow = "";
        setHidden(true);
      },
    });

    // Accent line grows
    tl.fromTo(
      lineRef.current,
      { scaleX: 0 },
      { scaleX: 1, duration: 0.5, ease: "power3.out" }
    );

    // Name fades in + slides up
    tl.fromTo(
      textRef.current,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
      "-=0.2"
    );

    // Brief hold
    tl.to({}, { duration: 0.5 });

    // Text + line fade out upward
    tl.to([textRef.current, lineRef.current], {
      opacity: 0,
      y: -16,
      duration: 0.3,
      ease: "power2.in",
    });

    // Overlay reveals page by sliding up
    tl.to(overlayRef.current, {
      yPercent: -100,
      duration: 0.8,
      ease: "power3.inOut",
    }, "-=0.1");

    return () => {
      tl.kill();
      document.documentElement.style.overflow = "";
    };
  }, []);

  if (hidden) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] bg-[#0B0F14] flex items-center justify-center"
    >
      <div className="flex flex-col items-center gap-4">
        {/* Accent line */}
        <div
          ref={lineRef}
          className="w-12 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 origin-center"
          style={{ transform: "scaleX(0)" }}
        />

        {/* Name & subtitle */}
        <div ref={textRef} className="text-center opacity-0">
          <p className="text-2xl md:text-4xl font-bold tracking-tight text-white">
            Raditya Azhar
          </p>
          <p className="mt-2 text-sm md:text-base text-zinc-500 tracking-[0.2em] uppercase font-medium">
            Portfolio
          </p>
        </div>
      </div>
    </div>
  );
}
