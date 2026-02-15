"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { TabSwitcher } from "@/components/ui/tabs";

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
  caseStudyUrl?: string | null;
  isFeatured: boolean;
}

export default function ProjectsPageClient({
  projects,
}: {
  projects: Project[];
}) {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") || "featured";
  const [activeTab, setActiveTab] = useState(initialTab);

  const filteredProjects =
    activeTab === "featured"
      ? projects.filter((p) => p.isFeatured)
      : projects;

  return (
    <>
      <TabSwitcher
        tabs={[
          { id: "featured", label: "Featured" },
          { id: "all", label: "All Projects" },
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        className="mb-10"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="group relative rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 overflow-hidden hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-500"
          >
            {/* Image */}
            <div className="relative h-56 overflow-hidden">
              <Image
                src={project.imageSrc}
                alt={project.imageAlt}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute top-4 left-4">
                <span
                  className={`text-xs font-bold tracking-widest uppercase ${project.categoryColor}`}
                >
                  {project.category}
                </span>
              </div>
              {project.isFeatured && (
                <div className="absolute top-4 right-4">
                  <span className="px-2 py-1 text-[10px] font-bold bg-purple-500/20 text-purple-300 rounded-full border border-purple-500/30">
                    Featured
                  </span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2 text-zinc-900 dark:text-white">
                {project.title}
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4 line-clamp-2">
                {project.description}
              </p>

              {/* Tech Stack */}
              <div className="flex flex-wrap gap-2 mb-5">
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-1 text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-lg"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Links */}
              <div className="flex gap-3">
                {project.liveUrl && (
                  <Link
                    href={project.liveUrl}
                    target="_blank"
                    className="px-4 py-2 text-sm font-medium bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Live Demo
                  </Link>
                )}
                {project.githubUrl && (
                  <Link
                    href={project.githubUrl}
                    target="_blank"
                    className="px-4 py-2 text-sm font-medium border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    GitHub
                  </Link>
                )}
                {project.caseStudyUrl && (
                  <Link
                    href={project.caseStudyUrl}
                    className="px-4 py-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
                  >
                    Case Study →
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-20 text-zinc-500">
          <p className="text-lg">No projects found.</p>
        </div>
      )}
    </>
  );
}
