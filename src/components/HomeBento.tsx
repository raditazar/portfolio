"use client";

import Image from "next/image";
import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import BentoGrid, { BentoCardData } from "./BentoGrid";

gsap.registerPlugin(ScrollTrigger);

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

interface HomeBentoProps {
  projects: Project[];
  totalProjectCount?: number;
}

export default function HomeBento({
  projects,
  totalProjectCount,
}: HomeBentoProps) {
  const cards: BentoCardData[] = [
    // Project cards (up to 3)
    ...projects.slice(0, 3).map((project) => ({
      id: `project-${project.id}`,
      color: "#060010",
      label: project.category,
      title: project.title,
      description: project.description,
      href: project.liveUrl || project.githubUrl || "/projects",
      content: (
        <div className="flex flex-col h-full relative group">
          <div className="absolute inset-0 rounded-4xl overflow-hidden">
            <Image
              src={project.imageSrc}
              alt={project.imageAlt}
              fill
              className="object-cover opacity-20 group-hover:opacity-30 transition-opacity duration-500"
            />
          </div>
          <div className="relative z-10 flex flex-col h-full p-1">
            <span
              className={`text-xs font-bold tracking-widest uppercase ${project.categoryColor} mb-2`}
            >
              {project.category}
            </span>
            <div className="mt-auto">
              <h3 className="text-lg font-bold text-white mb-1">
                {project.title}
              </h3>
              <p className="text-xs text-zinc-400 line-clamp-2 mb-3">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {project.techStack.slice(0, 4).map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-0.5 text-[10px] font-medium bg-white/10 text-zinc-300 rounded-full border border-white/5"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      ),
    })),

    // CTA — View All Projects
    {
      id: "view-all-cta",
      color: "#07000f",
      href: "/projects",
      content: (
        <div className="flex flex-col h-full justify-between group">
          {/* Top badge */}
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 text-[10px] font-bold tracking-widest uppercase rounded-full bg-white/8 border border-white/10 text-zinc-400">
              Portfolio
            </span>
            {totalProjectCount && totalProjectCount > 3 && (
              <span className="px-2.5 py-1 text-[10px] font-bold tracking-widest uppercase rounded-full bg-purple-500/15 border border-purple-500/20 text-purple-400">
                +{totalProjectCount - 3} more
              </span>
            )}
          </div>

          {/* Main content */}
          <div className="mt-auto">
            <p className="text-xs font-medium text-zinc-500 uppercase tracking-widest">
              See everything I&apos;ve built
            </p>
            <div className="flex items-end justify-between">
              <h3 className="text-2xl md:text-3xl font-bold text-white leading-tight max-w-[70%]">
                View All Projects
              </h3>
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-purple-500/20 group-hover:border-purple-500/30 transition-all duration-300">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="text-zinc-400 group-hover:text-purple-300 transition-colors duration-300 -rotate-45"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (isMobile) return;

    const ctx = gsap.context(() => {
      // Header animation
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current.children,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: headerRef.current,
              start: "top 85%",
              once: true,
            },
          }
        );
      }

      // Grid animation
      if (gridRef.current) {
        gsap.fromTo(
          gridRef.current,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: gridRef.current,
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
    <section ref={sectionRef} id="work" className="relative py-12 pb-8">
      <div className="max-w-5xl mx-auto px-6">
        {/* Upgraded header */}
        <div ref={headerRef} className="mb-14">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-px bg-purple-500" />
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-purple-400">
              Portfolio
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-3">
            Selected Work
          </h2>
          <p className="text-base md:text-lg text-zinc-500 max-w-md">
            A curated selection of recent projects and experiments.
          </p>
        </div>
        <div ref={gridRef}>
          <BentoGrid
            cards={cards}
            enableSpotlight={true}
            enableBorderGlow={true}
            enableStars={true}
            enableTilt={false}
            enableMagnetism={true}
            clickEffect={true}
            glowColor="132, 0, 255"
          />
        </div>
      </div>

    </section>
  );
}
