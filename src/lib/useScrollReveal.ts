"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealOptions {
  direction?: "up" | "down" | "left" | "right";
  distance?: number;
  duration?: number;
  delay?: number;
  stagger?: number;
  once?: boolean;
  start?: string;
  ease?: string;
}

/**
 * Hook to reveal an element when it enters the viewport using GSAP ScrollTrigger.
 * Returns a ref to attach to the element you want to animate.
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  options: ScrollRevealOptions = {}
) {
  const ref = useRef<T>(null);
  const {
    direction = "up",
    distance = 60,
    duration = 1,
    delay = 0,
    stagger = 0,
    once = true,
    start = "top 85%",
    ease = "power3.out",
  } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Skip animations on mobile for performance
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      gsap.set(el, { opacity: 1, x: 0, y: 0 });
      return;
    }

    const fromVars: gsap.TweenVars = { opacity: 0 };
    if (direction === "up") fromVars.y = distance;
    if (direction === "down") fromVars.y = -distance;
    if (direction === "left") fromVars.x = distance;
    if (direction === "right") fromVars.x = -distance;

    const targets = stagger > 0 ? el.children : el;

    gsap.set(targets, fromVars);

    gsap.to(targets, {
      opacity: 1,
      x: 0,
      y: 0,
      duration,
      delay,
      stagger: stagger > 0 ? stagger : undefined,
      ease,
      scrollTrigger: {
        trigger: el,
        start,
        once,
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === el) t.kill();
      });
    };
  }, [direction, distance, duration, delay, stagger, once, start, ease]);

  return ref;
}

/**
 * Hook for animating a number counting up when element enters viewport.
 */
export function useCountUp(
  targetValue: number,
  options: { duration?: number; start?: string; suffix?: string } = {}
) {
  const ref = useRef<HTMLElement>(null);
  const { duration = 2, start = "top 85%" } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      el.textContent = String(targetValue) + (options.suffix || "");
      return;
    }

    const obj = { val: 0 };
    gsap.to(obj, {
      val: targetValue,
      duration,
      ease: "power2.out",
      scrollTrigger: {
        trigger: el,
        start,
        once: true,
      },
      onUpdate: () => {
        el.textContent = Math.round(obj.val) + (options.suffix || "");
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === el) t.kill();
      });
    };
  }, [targetValue, duration, start, options.suffix]);

  return ref;
}
