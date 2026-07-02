"use client";

import * as React from "react";
import {
  animate,
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";
import { cn } from "@/lib/utils";
import { hasPlayedIntroGlobal, setIntroPlayed } from "../PageTransition";

export type ArcRevealGreeting = {
  text: string;
  lang?: string;
};

export interface ArcRevealHeroProps {
  greetings?: ArcRevealGreeting[];
  greetingHold?: number;
  revealDuration?: number;
  className?: string;
  introClassName?: string;
  greetingClassName?: string;
  revealClassName?: string;
  children?: React.ReactNode;
}

const DEFAULT_GREETINGS: ArcRevealGreeting[] = [
  { text: "Hello.", lang: "en" },
  { text: "Halo.", lang: "id" },
  { text: "こんにちは.", lang: "ja" },
  { text: "Bonjour.", lang: "fr" },
  { text: "안녕하세요.", lang: "ko" },
  { text: "你好.", lang: "zh" },
  { text: "Hola.", lang: "es" },
  { text: "مرحبا.", lang: "ar" },
  { text: "Olá.", lang: "pt" },
  { text: "Ciao.", lang: "it" },
  { text: "Welcome.", lang: "en" },
];
type Phase = "intro" | "reveal" | "done";

export function ArcRevealHero({
  greetings = DEFAULT_GREETINGS,
  greetingHold = 600,
  revealDuration = 1200,
  className,
  introClassName,
  greetingClassName,
  revealClassName,
  children,
}: ArcRevealHeroProps) {
  const prefersReducedMotion = useReducedMotion();

  const [phase, setPhase] = React.useState<Phase>(() => {
    if (typeof window !== "undefined" && hasPlayedIntroGlobal) {
      return "done";
    }
    return "intro";
  });
  const [index, setIndex] = React.useState(0);

  const progress = useMotionValue(0);
  const arcPath = useTransform(progress, (p: number) => {
    const edge = 110 - p * 140;
    const control = edge + 25;
    return `M 0 ${edge} Q 50 ${control} 100 ${edge} L 100 110 L 0 110 Z`;
  });

  React.useEffect(() => {
    if (prefersReducedMotion) {
      setPhase("done");
    }
  }, [prefersReducedMotion]);

  React.useEffect(() => {
    if (phase !== "intro") return;
    const isLast = index >= greetings.length - 1;
    if (isLast) {
      const t = window.setTimeout(() => setPhase("reveal"), greetingHold + 50);
      return () => window.clearTimeout(t);
    }
    const t = window.setTimeout(() => setIndex((i) => i + 1), greetingHold);
    return () => window.clearTimeout(t);
  }, [phase, index, greetingHold, greetings.length]);

  React.useEffect(() => {
    if (phase !== "reveal") return;
    const controls = animate(progress, 1, {
      duration: revealDuration / 1000,
      ease: [0.76, 0, 0.24, 1],
      onComplete: () => {
        setIntroPlayed();
        setPhase("done");
      },
    });
    return () => controls.stop();
  }, [phase, progress, revealDuration]);

  const showOverlay = phase !== "done";
  const current = greetings[Math.min(index, greetings.length - 1)];

  return (
    <section
      suppressHydrationWarning
      aria-label="Hero"
      className={cn(
        "relative isolate min-h-screen w-full overflow-hidden bg-[#0B0F14] text-white",
        className,
      )}
    >
      <div className={cn("relative z-0", revealClassName)}>{children}</div>

      <AnimatePresence>
        {showOverlay && (
          <motion.div
            key="arc-reveal-overlay"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.05, ease: [0.4, 0, 0.2, 1] }}
            className={cn(
              "absolute inset-x-0 top-0 z-50 h-screen overflow-hidden bg-transparent",
              introClassName,
            )}
          >
            
            {/* Solid light background during intro */}
            {phase === "intro" && (
              <div className="absolute inset-0 bg-zinc-50" />
            )}
<div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
              <AnimatePresence mode="wait">
                {phase === "intro" && current && (
                  <motion.span
                    key={`${index}-${current.text}`}
                    lang={current.lang}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
                    className={cn(
                      "select-none px-6 text-center font-serif text-5xl font-normal tracking-tight text-zinc-900 sm:text-6xl md:text-7xl",
                      greetingClassName,
                    )}
                  >
                    {current.text}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>

            <svg
              className="pointer-events-none absolute inset-0 h-full w-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden
            >
              <defs>
                <mask id="curtainCutout">
                  <rect width="100" height="100" fill="white" />
                  <motion.path d={arcPath} fill="black" />
                </mask>
              </defs>
              <rect
                width="100"
                height="100"
                fill="#fafaf9"
                mask="url(#curtainCutout)"
              />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

export default ArcRevealHero;
