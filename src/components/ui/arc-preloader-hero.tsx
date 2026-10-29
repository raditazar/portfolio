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
  greetingHold = 300,
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

  const isLocked = phase !== "done";

  // Lock scroll completely while intro and reveal animations are running
  React.useEffect(() => {
    if (!isLocked) return;
    if (typeof window === "undefined") return;

    window.__isScrollLocked = true;

    // Reset scroll to top
    window.scrollTo(0, 0);
    const lenis = window.__lenis;
    if (lenis) {
      lenis.scrollTo(0, { immediate: true, force: true });
      lenis.stop();
    }

    // Save previous styles and history restoration
    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevBodyOverflow = document.body.style.overflow;
    let prevScrollRestoration: ScrollRestoration | null = null;
    try {
      prevScrollRestoration = window.history.scrollRestoration;
      window.history.scrollRestoration = "manual";
    } catch {}

    // Lock native document overflow
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.documentElement.classList.add("lenis-stopped");

    // Intercept and prevent scroll events (wheel, touchmove, keyboard)
    const preventScroll = (e: Event) => {
      if (e.cancelable) {
        e.preventDefault();
      }
    };

    const preventKeys = (e: KeyboardEvent) => {
      const scrollKeys = [
        "ArrowUp",
        "ArrowDown",
        "PageUp",
        "PageDown",
        "Home",
        "End",
        " ",
        "Spacebar",
      ];
      if (scrollKeys.includes(e.key)) {
        e.preventDefault();
      }
    };

    window.addEventListener("wheel", preventScroll, {
      passive: false,
      capture: true,
    });
    window.addEventListener("touchmove", preventScroll, {
      passive: false,
      capture: true,
    });
    window.addEventListener("keydown", preventKeys, { capture: true });

    return () => {
      window.__isScrollLocked = false;
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.classList.remove("lenis-stopped");

      if (prevScrollRestoration) {
        try {
          window.history.scrollRestoration = prevScrollRestoration;
        } catch {}
      }

      window.removeEventListener("wheel", preventScroll, { capture: true });
      window.removeEventListener("touchmove", preventScroll, { capture: true });
      window.removeEventListener("keydown", preventKeys, { capture: true });

      const currentLenis = window.__lenis;
      if (currentLenis) {
        currentLenis.start();
        currentLenis.resize();
      }
    };
  }, [isLocked]);

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

    // Safety: ensure scroll is at top and Lenis stopped when entering reveal
    window.scrollTo(0, 0);
    const lenis = window.__lenis;
    if (lenis) {
      lenis.scrollTo(0, { immediate: true, force: true });
      lenis.stop();
    }

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
        "relative isolate min-h-screen w-full overflow-hidden bg-[#120820] text-white",
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
            transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
            className={cn(
              "fixed inset-0 z-50 overflow-hidden bg-transparent touch-none select-none",
              introClassName,
            )}
          >
            {/* Solid warm linen background during intro */}
            {phase === "intro" && (
              <div className="absolute inset-0 bg-[#F4EFE7]" />
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
                      "select-none px-6 text-center font-serif text-5xl font-normal tracking-tight text-[#120820] sm:text-6xl md:text-7xl",
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
                fill="#F4EFE7"
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
