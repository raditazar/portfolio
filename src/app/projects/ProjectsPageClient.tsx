"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
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
    description: [project.description],
  }));

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

      {filteredProjects.length === 0 ? (
        <div className="text-center py-20 text-zinc-500">
          <p className="text-lg">No projects found.</p>
        </div>
      ) : (
        <ImpactExperience hideHeader items={projectItems} />
      )}
    </>
  );
}
