"use client";

import { AnimatePresence, motion } from "motion/react";
import React, { createContext, useContext, useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

// Global module variable to track if intro has played
export let hasPlayedIntroGlobal = false;

if (typeof window !== "undefined") {
  if (window.location.pathname !== "/") {
    hasPlayedIntroGlobal = true;
  }
}

export function setIntroPlayed() {
  hasPlayedIntroGlobal = true;
}

const pathNamesMap: Record<string, string> = {
  "/": "home",
  "/projects": "work",
  "/about": "about",
};

type TransitionContextType = {
  startTransition: (href: string, label: string) => void;
};

const TransitionContext = createContext<TransitionContextType | null>(null);

export function usePageTransition() {
  return useContext(TransitionContext);
}

// SVG Arc Transition curves
const entranceVariants = {
  initial: {
    d: "M 0 100 Q 50 100 100 100 L 100 100 L 0 100 Z",
  },
  animate: {
    d: [
      "M 0 100 Q 50 100 100 100 L 100 100 L 0 100 Z",
      "M 0 50 Q 50 20 100 50 L 100 100 L 0 100 Z",
      "M 0 0 Q 50 0 100 0 L 100 100 L 0 100 Z"
    ],
    transition: {
      times: [0, 0.45, 1],
      duration: 0.6,
      ease: [0.76, 0, 0.24, 1]
    }
  }
};

const exitVariants = {
  initial: {
    d: "M 0 0 L 100 0 L 100 100 Q 50 100 0 100 Z",
  },
  animate: {
    d: [
      "M 0 0 L 100 0 L 100 100 Q 50 100 0 100 Z",
      "M 0 0 L 100 0 L 100 50 Q 50 115 0 50 Z",
      "M 0 0 L 100 0 L 100 0 Q 50 0 0 0 Z"
    ],
    transition: {
      times: [0, 0.45, 1],
      duration: 0.6,
      ease: [0.76, 0, 0.24, 1]
    }
  }
};

export function TransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [phase, setPhase] = useState<"idle" | "entrance" | "exit">("idle");
  const [targetLabel, setTargetLabel] = useState("");
  const [pendingRoute, setPendingRoute] = useState<string | null>(null);

  const startTransition = (href: string, label: string) => {
    if (phase !== "idle") return;
    setTargetLabel(label.toLowerCase());
    setPendingRoute(href);
    setPhase("entrance");
  };

  // Switch route once entrance transition is complete
  useEffect(() => {
    if (phase === "entrance" && pendingRoute) {
      const timer = setTimeout(() => {
        router.push(pendingRoute);
      }, 600); // match duration of entrance (600ms)
      return () => clearTimeout(timer);
    }
  }, [phase, pendingRoute, router]);

  // Once pathname changes client-side, trigger exit transition
  useEffect(() => {
    if (phase === "entrance") {
      setPhase("exit");
      setPendingRoute(null);
    }
  }, [pathname]);

  // Reset to idle after exit animation completes
  useEffect(() => {
    if (phase === "exit") {
      const timer = setTimeout(() => {
        setPhase("idle");
      }, 600); // match duration of exit (600ms)
      return () => clearTimeout(timer);
    }
  }, [phase]);

  return (
    <TransitionContext.Provider value={{ startTransition }}>
      {children}
      <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden">
        
        {/* Entrance Arc Curtain */}
        {phase === "entrance" && (
          <svg className="absolute inset-0 h-full w-full fill-[#f5f4f3] pointer-events-auto" viewBox="0 0 100 100" preserveAspectRatio="none">
            <motion.path
              variants={entranceVariants}
              initial="initial"
              animate="animate"
            />
          </svg>
        )}

        {/* Exit Arc Curtain */}
        {phase === "exit" && (
          <svg className="absolute inset-0 h-full w-full fill-[#f5f4f3] pointer-events-auto" viewBox="0 0 100 100" preserveAspectRatio="none">
            <motion.path
              variants={exitVariants}
              initial="initial"
              animate="animate"
            />
          </svg>
        )}

        {/* Page Name Text Overlay */}
        <AnimatePresence>
          {(phase === "entrance" || phase === "exit") && (
            <div className="absolute inset-0 flex items-center justify-center z-50">
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: phase === "entrance" ? 1 : 0, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, delay: phase === "entrance" ? 0.3 : 0 }}
                className="select-none px-6 text-center font-serif text-5xl font-normal tracking-tight text-zinc-900 sm:text-6xl md:text-7xl lowercase"
              >
                {targetLabel || pathNamesMap[pathname] || "portfolio"}
              </motion.span>
            </div>
          )}
        </AnimatePresence>

      </div>
    </TransitionContext.Provider>
  );
}
