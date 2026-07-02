"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Hero from "./Hero";
import { ActivityGallery } from "./ActivityGallery";
import HomeBento from "./HomeBento";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  categoryColor: string;
  techStack: string[];
  imageSrc: string;
  imageAlt: string;
  liveUrl?: string | null;
  githubUrl?: string | null;
}

interface ScrollExperienceProps {
  projects: Project[];
  totalProjectCount: number;
  stats: { projects: number; technologies: number };
}

export default function ScrollExperience({
  projects,
  totalProjectCount,
}: ScrollExperienceProps) {
  const rootRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const centerWellRef = useRef<HTMLDivElement>(null);
  const centerPanelRef = useRef<HTMLDivElement>(null);
  const heroContainerRef = useRef<HTMLDivElement>(null);
  const projectContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const media = gsap.matchMedia();

    media.add("(min-width: 768px)", () => {
      const ctx = gsap.context(() => {
        // Initial setup - left and right panels are 47.5vw, gap in center is 5vw
        gsap.set(leftPanelRef.current, { xPercent: -100, width: "47.5vw" });
        gsap.set(rightPanelRef.current, { xPercent: 100, width: "47.5vw" });
        gsap.set(centerWellRef.current, { autoAlpha: 0, width: "5vw" });
        gsap.set(centerPanelRef.current, {
          autoAlpha: 0,
          scale: 1,
          rotation: 0,
          width: "5vw",
          height: "112vh",
          xPercent: 0,
          yPercent: -50,
          transformOrigin: "50% 50%",
          zIndex: 40,
        });
        gsap.set(heroContainerRef.current, { opacity: 1 });
        gsap.set(projectContainerRef.current, { autoAlpha: 0 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "+=320%",
            scrub: 1,
            pin: stickyRef.current,
          },
        });

        // Phase 1: Panels slide in covering hero, leaving a narrow 5vw gap in center
        tl.to(leftPanelRef.current, { xPercent: 0, duration: 1, ease: "power2.inOut" })
          .to(rightPanelRef.current, { xPercent: 0, duration: 1, ease: "power2.inOut" }, "<")
          
          // Phase 2: Hero strip rotates and shrinks while panels close the 5vw gap
          .set(centerWellRef.current, { autoAlpha: 1 })
          .set(centerPanelRef.current, { autoAlpha: 1, zIndex: 40 })
          .to(centerPanelRef.current, { rotation: 45, scale: 0, duration: 1.25, ease: "power2.inOut" }, "+=0.1")
          .to(leftPanelRef.current, { width: "50vw", duration: 1.25, ease: "power2.inOut" }, "<")
          .to(rightPanelRef.current, { width: "50vw", duration: 1.25, ease: "power2.inOut" }, "<")
          .set(centerWellRef.current, { display: "none" })
          .set(centerPanelRef.current, { display: "none" })
          .set(projectContainerRef.current, { autoAlpha: 1 })
          .set(heroContainerRef.current, { opacity: 0 })
          
          // Phase 3: Split slide to reveal the project highlight underneath
          .to(leftPanelRef.current, { yPercent: -100, duration: 1.5, ease: "power2.inOut" }, "+=0.3")
          .to(rightPanelRef.current, { yPercent: 100, duration: 1.5, ease: "power2.inOut" }, "<");
      }, root);

      return () => ctx.revert();
    });

    return () => media.revert();
  }, []);

  return (
    <section ref={rootRef} className="relative bg-[#0B0F14] text-white">
      {/* Pinned Animation Container */}
      <div ref={stickyRef} className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Layer 1: HomeBento underneath Hero, revealed after panels split */}
        <div ref={projectContainerRef} className="absolute inset-0 z-0 flex h-screen items-center justify-center overflow-hidden bg-[#0B0F14]">
          <div className="h-full w-full max-w-6xl px-6">
            <HomeBento compact projects={projects} totalProjectCount={totalProjectCount} />
          </div>
        </div>

        {/* Layer 2: Hero Section (with ref to fade out during transition) */}
        <div ref={heroContainerRef} className="absolute inset-0 z-10">
          <Hero />
        </div>

        {/* Layer 3: About Panels */}
        <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
          {/* Left Panel - Text */}
          <div
            ref={leftPanelRef}
            className="pointer-events-auto absolute left-0 top-0 bottom-0 flex h-full items-center justify-center bg-[#f4efe7] px-6 text-zinc-950 md:px-10"
          >
            <div className="max-w-md">
              <p className="mb-5 text-xs font-black uppercase tracking-[0.28em] text-black">Get to know me</p>
              <h2 className="font-serif text-[clamp(2.5rem,6vw,5.5rem)] font-black leading-[0.85] tracking-[-0.06em] text-black">About Me</h2>
              <div className="my-6 h-px w-20 bg-black" />
              <div className="space-y-4 text-sm font-semibold leading-relaxed text-zinc-700 md:text-base">
                <p>Based in <span className="text-zinc-950">Yogyakarta</span>. I&apos;m <span className="text-zinc-950">Raditya Azhar Ananta</span>, an Information Engineering student who treats code as a creative medium.</p>
                <p>Previously leading a team as a student organization head, I learned how to bridge technical execution with human empathy. My goal isn&apos;t just to build websites, but to build <span className="text-zinc-950">digital experiences</span> that feel natural and intuitive.</p>
              </div>
            </div>
          </div>

          {/* Right Panel - Activity Gallery */}
          <div
            ref={rightPanelRef}
            className="pointer-events-auto absolute right-0 top-0 bottom-0 flex h-full items-center justify-center bg-[#f4efe7] px-3 md:px-8"
          >
            <div className="w-full max-w-xl">
              <ActivityGallery />
            </div>
          </div>
        </div>

        {/* Layer 4: Cream center well plus dark rotating strip */}
        <div
          ref={centerWellRef}
          className="absolute left-[47.5vw] top-0 bottom-0 z-30 h-full w-[5vw] overflow-hidden bg-[#f4efe7] pointer-events-none"
        />
        <div
          ref={centerPanelRef}
          className="absolute left-[47.5vw] top-1/2 z-40 h-[112vh] w-[5vw] overflow-hidden bg-[#120820] pointer-events-none"
        >
          <div className="absolute left-1/2 top-1/2 h-screen w-screen -translate-x-1/2 -translate-y-1/2">
            <Hero />
          </div>
        </div>
      </div>

      {/* Mobile Fallback - stack naturally */}
      <div className="relative z-40 bg-[#f4efe7] px-6 py-20 md:hidden text-zinc-950">
        <div className="mb-12">
          <p className="mb-4 text-xs font-black uppercase tracking-[0.24em] text-red-500">Get to know me</p>
          <h2 className="font-serif text-5xl font-black leading-none text-red-500">About Me</h2>
          <p className="mt-6 text-sm font-semibold leading-6 text-zinc-700">Based in Yogyakarta. I&apos;m Raditya Azhar Ananta, an Information Engineering student who treats code as a creative medium.</p>
        </div>
        <ActivityGallery />
        <div className="mt-16 bg-[#0B0F14] py-8 text-white">
          <HomeBento projects={projects} totalProjectCount={totalProjectCount} />
        </div>
      </div>
    </section>
  );
}
