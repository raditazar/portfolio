"use client";

import Image from "next/image";
import Link from "next/link";
import BentoGrid, { BentoCardData } from "./BentoGrid";

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
  technologies: string[];
  stats: { years: string; projects: string; technologies: string };
  currentlyExploring: {
    title: string;
    description: string;
    progress: number;
  };
}

export default function HomeBento({
  projects,
  technologies,
  stats,
  currentlyExploring,
}: HomeBentoProps) {
  const cards: BentoCardData[] = [
    // Project cards
    ...projects.slice(0, 3).map((project, idx) => ({
      id: `project-${project.id}`,
      color: "#060010",
      label: project.category,
      title: project.title,
      description: project.description,
      href: project.liveUrl || project.githubUrl || "/projects",
      content: (
        <div className="flex flex-col h-full relative group">
          <div className="absolute inset-0 rounded-[20px] overflow-hidden">
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

    // Currently Exploring card
    {
      id: "currently-exploring",
      color: "#0a0015",
      content: (
        <div className="flex flex-col h-full p-1">
          <span className="text-xs font-bold tracking-widest uppercase text-purple-400 mb-3">
            Currently Exploring
          </span>
          <h3 className="text-base font-bold text-white mb-2">
            {currentlyExploring.title}
          </h3>
          <p className="text-xs text-zinc-400 line-clamp-3 mb-4">
            {currentlyExploring.description}
          </p>
          <div className="mt-auto flex items-center gap-3">
            <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-1000"
                style={{ width: `${currentlyExploring.progress}%` }}
              />
            </div>
            <span className="text-[10px] font-medium text-zinc-500">
              {currentlyExploring.progress}%
            </span>
          </div>
        </div>
      ),
    },

    // Tech Stack card
    {
      id: "tech-stack",
      color: "#050510",
      href: "/about?tab=me",
      content: (
        <div className="flex flex-col h-full p-1">
          <span className="text-xs font-bold tracking-widest uppercase text-cyan-400 mb-3">
            Tech Stack
          </span>
          <div className="grid grid-cols-2 gap-1.5 mt-auto">
            {technologies.slice(0, 8).map((tech) => (
              <div
                key={tech}
                className="px-2 py-1.5 text-[11px] font-medium text-zinc-300 bg-white/5 rounded-lg border border-white/5 text-center truncate"
              >
                {tech}
              </div>
            ))}
          </div>
        </div>
      ),
    },

    // Stats card
    {
      id: "stats",
      color: "#0d0008",
      href: "/about",
      content: (
        <div className="flex flex-col h-full p-1 justify-center">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <p className="text-3xl font-bold text-white">{stats.years}</p>
              <p className="text-[11px] text-zinc-500">Years Experience</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">{stats.projects}</p>
              <p className="text-[11px] text-zinc-500">Projects</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">
                {stats.technologies}
              </p>
              <p className="text-[11px] text-zinc-500">Technologies</p>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section id="work" className="relative py-20">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl md:text-5xl font-bold text-white dark:text-white">
            Selected Work
          </h2>
          <Link
            href="/projects"
            className="text-sm font-medium text-zinc-400 hover:text-white transition-colors hidden md:block"
          >
            View All →
          </Link>
        </div>
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
        <div className="mt-8 text-center md:hidden">
          <Link
            href="/projects"
            className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
          >
            View All Projects →
          </Link>
        </div>
      </div>
    </section>
  );
}
