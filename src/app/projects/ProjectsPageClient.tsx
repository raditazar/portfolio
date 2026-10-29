"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { LayoutGrid, Rows3 } from "lucide-react";
import { TabSwitcher } from "@/components/ui/tabs";
import ImpactExperience, { ExperienceItemProps } from "@/components/ui/impact-experience";

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
  const [viewMode, setViewMode] = useState<"impact" | "grid">("impact");

  const filteredProjects =
    activeTab === "featured"
      ? projects.filter((p) => p.isFeatured)
      : projects;

  const projectItems: ExperienceItemProps[] = filteredProjects.map((project, idx) => ({
    index: String(idx + 1),
    company: project.title,
    tagline: project.category,
    period: project.isFeatured ? "Featured Production" : "Live Release",
    position: "Software & UI Engineering",
    location: "Global / Web",
    industry: project.category,
    website: project.liveUrl || undefined,
    github: project.githubUrl || undefined,
    tags: project.techStack,
    image: project.imageSrc,
    badge: "Project",
    description: [
      project.description,
    ],
  }));

  return (
    <>
      {/* Controls Bar: Filter Tabs & View Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <TabSwitcher
          tabs={[
            { id: "featured", label: "Featured" },
            { id: "all", label: "All Projects" },
          ]}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          className="mb-0"
        />

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#170C28] border border-white/10 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setViewMode("impact")}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
              viewMode === "impact"
                ? "bg-[#F4EFE7] text-[#120820] shadow-sm font-semibold"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Rows3 className="w-3.5 h-3.5" />
            <span>Impact View</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("grid")}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
              viewMode === "grid"
                ? "bg-[#F4EFE7] text-[#120820] shadow-sm font-semibold"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Grid View</span>
          </button>
        </div>
      </div>

      {filteredProjects.length === 0 ? (
        <div className="text-center py-20 text-zinc-500">
          <p className="text-lg">No projects found.</p>
        </div>
      ) : viewMode === "impact" ? (
        /* Impact View (Interactive Full-Width Rows with Hover Reveal) */
        <ImpactExperience
          className="bg-transparent py-0 px-0 sm:py-0 sm:px-0 lg:px-0"
          hideHeader={true}
          items={projectItems}
        />
      ) : (
        /* Classic Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="group relative rounded-2xl border border-white/10 bg-[#170C28] overflow-hidden hover:border-[#F4EFE7]/30 transition-all duration-500"
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden">
                <Image
                  src={project.imageSrc}
                  alt={project.imageAlt}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#170C28] via-transparent to-transparent" />
                <div className="absolute top-4 left-4">
                  <span
                    className={`text-xs font-bold tracking-widest uppercase ${project.categoryColor}`}
                  >
                    {project.category}
                  </span>
                </div>
                {project.isFeatured && (
                  <div className="absolute top-4 right-4">
                    <span className="px-2 py-1 text-[10px] font-bold bg-[#F4EFE7]/15 text-[#F4EFE7] rounded-full border border-[#F4EFE7]/30">
                      Featured
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-white group-hover:text-[#F4EFE7] transition-colors">
                  {project.title}
                </h3>
                <p className="text-sm text-zinc-400 mb-4 line-clamp-2">
                  {project.description}
                </p>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 text-xs font-mono font-medium bg-white/5 text-zinc-300 border border-white/10 rounded-lg"
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
                      className="px-4 py-2 text-sm font-medium bg-[#F4EFE7] text-[#120820] rounded-lg hover:bg-white transition-all shadow-sm"
                    >
                      Live Demo
                    </Link>
                  )}
                  {project.githubUrl && (
                    <Link
                      href={project.githubUrl}
                      target="_blank"
                      className="px-4 py-2 text-sm font-medium border border-white/20 text-white rounded-lg hover:bg-white/10 transition-colors"
                    >
                      GitHub
                    </Link>
                  )}
                  {project.caseStudyUrl && (
                    <Link
                      href={project.caseStudyUrl}
                      className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
                    >
                      Case Study →
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
