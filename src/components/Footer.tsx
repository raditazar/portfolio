"use client";

import Link from "next/link";
import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (isMobile) return;

    const ctx = gsap.context(() => {
      if (ctaRef.current) {
        gsap.fromTo(
          ctaRef.current.children,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            stagger: 0.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ctaRef.current,
              start: "top 85%",
              once: true,
            },
          }
        );
      }

      if (bottomRef.current) {
        gsap.fromTo(
          bottomRef.current,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.8,
            delay: 0.3,
            ease: "power2.out",
            scrollTrigger: {
              trigger: bottomRef.current,
              start: "top 95%",
              once: true,
            },
          }
        );
      }
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={footerRef}
      id="contact"
      className="relative text-white pt-32 pb-10"
    >

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* CTA section */}
        <div ref={ctaRef} className="mb-24">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-sm font-medium text-zinc-500">
              Available for work
            </span>
          </div>

          <p className="text-2xl md:text-3xl text-gray-400 mb-8">
            Have an idea? Ready to collaborate?
          </p>

          <Link
            href="mailto:radityaazhar@gmail.com"
            className="text-4xl md:text-7xl lg:text-8xl font-bold tracking-tighter hover:text-gray-300 transition-colors underline decoration-2 underline-offset-8 decoration-gray-600 hover:decoration-purple-400"
          >
            radityaazhar@gmail.com
          </Link>
        </div>

        {/* Footer grid */}
        <div
          ref={bottomRef}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8"
        >
          {/* Navigation */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold tracking-[0.2em] uppercase text-zinc-500">
              Navigation
            </h4>
            <div className="flex flex-col gap-2">
              <Link
                href="#work"
                className="text-sm text-zinc-400 hover:text-white transition-colors w-fit"
              >
                Projects
              </Link>
              <Link
                href="#about"
                className="text-sm text-zinc-400 hover:text-white transition-colors w-fit"
              >
                About
              </Link>
              <Link
                href="#contact"
                className="text-sm text-zinc-400 hover:text-white transition-colors w-fit"
              >
                Contact
              </Link>
            </div>
          </div>

          {/* Social */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold tracking-[0.2em] uppercase text-zinc-500">
              Connect
            </h4>
            <div className="flex flex-col gap-2">
              <Link
                href="https://www.linkedin.com/in/raditya-azhar-ananta"
                target="_blank"
                className="text-sm text-zinc-400 hover:text-white transition-colors w-fit"
              >
                LinkedIn ↗
              </Link>
              <Link
                href="https://github.com/raditazar"
                target="_blank"
                className="text-sm text-zinc-400 hover:text-white transition-colors w-fit"
              >
                GitHub ↗
              </Link>
              <Link
                href="https://instagram.com/raditazar_"
                target="_blank"
                className="text-sm text-zinc-400 hover:text-white transition-colors w-fit"
              >
                Instagram ↗
              </Link>
            </div>
          </div>

        </div>

        {/* Copyright */}
        <div className="mt-12 pt-6 border-t border-white/5">
          <p className="text-gray-600 text-xs text-center">
            © {new Date().getFullYear()} Raditya Azhar Ananta. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}