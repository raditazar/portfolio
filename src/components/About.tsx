"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ActivityGallery } from "./ActivityGallery";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface AboutProps {
  stats: {
    projects: number;
    technologies: number;
  };
}

function AnimatedCounter({
  value,
  suffix = "",
}: {
  value: number;
  suffix?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      el.textContent = value + suffix;
      return;
    }

    const obj = { val: 0 };
    gsap.to(obj, {
      val: value,
      duration: 2,
      ease: "power2.out",
      scrollTrigger: {
        trigger: el,
        start: "top 90%",
        once: true,
      },
      onUpdate: () => {
        el.textContent = Math.round(obj.val) + suffix;
      },
    });
  }, [value, suffix]);

  return (
    <p ref={ref} className="text-3xl md:text-4xl font-bold text-white">
      0
    </p>
  );
}

export default function About({ stats }: AboutProps) {
  const yearsExp = new Date().getFullYear() - 2024;
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (isMobile) return;

    const ctx = gsap.context(() => {
      if (headingRef.current) {
        gsap.fromTo(
          headingRef.current,
          { opacity: 0, x: -40 },
          {
            opacity: 1,
            x: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: headingRef.current,
              start: "top 85%",
              once: true,
            },
          }
        );
      }

      if (contentRef.current) {
        const blocks = contentRef.current.querySelectorAll("[data-reveal]");
        blocks.forEach((block, i) => {
          gsap.fromTo(
            block,
            { opacity: 0, y: 50 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              delay: i * 0.1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: block,
                start: "top 88%",
                once: true,
              },
            }
          );
        });
      }

      if (galleryRef.current) {
        gsap.fromTo(
          galleryRef.current,
          { opacity: 0, x: 40 },
          {
            opacity: 1,
            x: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: galleryRef.current,
              start: "top 85%",
              once: true,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="about" className="min-h-screen relative py-32 text-white">
      <div className="relative z-10 mx-auto max-w-8xl px-20">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(420px,0.95fr)] lg:items-center lg:gap-16">
          <div ref={contentRef} className="flex flex-col gap-10">
            <div ref={headingRef} data-reveal>
              <div className="mb-4 inline-block rounded-full border border-zinc-800 bg-zinc-900/50 px-4 py-2 backdrop-blur-sm">
                <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                  Get to know me
                </span>
              </div>
              <h2 className="bg-linear-to-br from-white via-zinc-200 to-zinc-400 bg-clip-text text-4xl font-bold text-transparent md:text-5xl lg:text-6xl">
                About Me
              </h2>
              <div className="mt-6 h-1 w-20 rounded-full bg-linear-to-r from-purple-500 to-transparent" />
            </div>

            <div data-reveal className="space-y-6 text-lg leading-relaxed">
              <p className="text-zinc-300">
                Based in <span className="font-semibold text-white">Yogyakarta</span>. I&apos;m <span className="font-semibold text-white">Raditya Azhar Ananta</span>, an Information Engineering student who treats code as a creative medium.
              </p>
              <p className="text-zinc-400">
                Previously leading a team as a student organization head, I learned how to bridge technical execution with human empathy.
                My goal isn&apos;t just to build websites, but to build <span className="font-medium text-white">digital experiences</span> that feel natural and intuitive.
              </p>
            </div>

          

            <div data-reveal className="flex flex-wrap gap-x-10 gap-y-4 border-t border-zinc-800/50 pt-8">
              <div>
                <AnimatedCounter value={yearsExp} suffix="+" />
                <p className="mt-1 text-sm text-zinc-500">Years Experience</p>
              </div>
              <div>
                <AnimatedCounter value={stats.projects} />
                <p className="mt-1 text-sm text-zinc-500">Projects Completed</p>
              </div>
              <div>
                <AnimatedCounter value={stats.technologies} />
                <p className="mt-1 text-sm text-zinc-500">Technologies</p>
              </div>
            </div>
          </div>

          <div ref={galleryRef} className="lg:sticky">
            
            <ActivityGallery />
          </div>
        </div>
      </div>
    </section>
  );
}
