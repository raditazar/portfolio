"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

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

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (isMobile) return;

    const ctx = gsap.context(() => {
      // Heading reveal
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

      // Content blocks stagger
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
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative py-32 text-white"
    >
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div ref={headingRef} className="lg:col-span-4">
            <div className="lg:sticky lg:top-32">
              <div className="inline-block mb-4 px-4 py-2 rounded-full border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
                <span className="text-xs font-bold tracking-widest uppercase text-zinc-400">
                  Get to know me
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-linear-to-br from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                About Me
              </h2>
              
              <div className="mt-6 w-20 h-1 bg-linear-to-r from-purple-500 to-transparent rounded-full" />
            </div>
          </div>

          {/* Content Section */}
          <div ref={contentRef} className="lg:col-span-8 flex flex-col gap-12">
            {/* Introduction */}
            <div data-reveal className="space-y-6 text-lg leading-relaxed">
              <p className="text-zinc-300">
                Based in <span className="text-white font-semibold">Yogyakarta</span>. I&apos;m <span className="text-white font-semibold">Raditya Azhar Ananta</span>, an Information Engineering student who treats code as a creative medium.
              </p>
              <p className="text-zinc-400">
                Previously leading a team as a student organization head, I learned how to bridge technical execution with human empathy.
                My goal isn&apos;t just to build websites, but to build <span className="text-white font-medium">digital experiences</span> that feel natural and intuitive.
              </p>
            </div>

            {/* Currently Exploring Card */}
            <div data-reveal
              className="group relative p-8 rounded-2xl bg-linear-to-br from-zinc-900/80 to-zinc-900/40 border border-zinc-800 hover:border-zinc-700 transition-all duration-500 backdrop-blur-sm"
            >
              {/* Glow effect on hover */}
              <div className="absolute -inset-0.5 bg-linear-to-r from-purple-600/20 to-blue-600/20 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
              
              <div className="relative">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-xs font-bold tracking-widest uppercase text-zinc-400">
                    Currently Exploring
                  </span>
                </div>

                <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white group-hover:text-white/90 transition-colors">
                  AI & Machine Learning Bootcamp
                </h3>

                <p className="text-zinc-400 leading-relaxed text-base md:text-lg">
                  Deep diving into Large Language Models (LLM) and integrating <span className="text-white font-medium">Vercel AI SDK</span> with Next.js.
                  I&apos;m building a bridge between prompt engineering and UI components to create smarter web applications.
                </p>

                {/* Progress indicator */}
                <div className="mt-6 flex items-center gap-3">
                  <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full w-2/3 bg-linear-to-r from-purple-500 to-blue-500 rounded-full relative">
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-lg shadow-purple-500/50" />
                    </div>
                  </div>
                  <span className="text-xs font-medium text-zinc-500">In Progress</span>
                </div>
              </div>
            </div>

            {/* Stats Section */}
            <div data-reveal className="flex flex-wrap gap-x-10 gap-y-4 pt-8 border-t border-zinc-800/50">
              <div>
                <AnimatedCounter value={yearsExp} suffix="+" />
                <p className="text-sm text-zinc-500 mt-1">Years Experience</p>
              </div>
              <div>
                <AnimatedCounter value={stats.projects} />
                <p className="text-sm text-zinc-500 mt-1">Projects Completed</p>
              </div>
              <div>
                <AnimatedCounter value={stats.technologies} />
                <p className="text-sm text-zinc-500 mt-1">Technologies</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}