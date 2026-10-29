"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { TabSwitcher } from "@/components/ui/tabs";
import ImpactExperience, { ExperienceItemProps } from "@/components/ui/impact-experience";

interface CareerEntry {
  id: string;
  type: string;
  title: string;
  organization: string;
  description?: string | null;
  startDate: string;
  endDate?: string | null;
  isCurrent: boolean;
}

interface AboutInfo {
  name: string;
  location: string;
  bio: string;
  bio2: string;
  currentlyExploring: {
    title: string;
    description: string;
    progress: number;
  };
  technologies: string[];
  stats: { years: string; projects: string; technologies: string };
}

export default function AboutPageClient({
  careers,
  aboutInfo,
}: {
  careers: CareerEntry[];
  aboutInfo: AboutInfo;
}) {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") || "career";
  const [activeTab, setActiveTab] = useState(initialTab);

  return (
    <>
      <TabSwitcher
        tabs={[
          { id: "career", label: "Career" },
          { id: "me", label: "Me" },
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        className="mb-10"
      />

      {activeTab === "career" ? (
        <CareerTab careers={careers} />
      ) : (
        <MeTab aboutInfo={aboutInfo} />
      )}
    </>
  );
}

function CareerTab({ careers }: { careers: CareerEntry[] }) {
  const workEntries = careers.filter((c) => c.type === "work");
  const educationEntries = careers.filter((c) => c.type === "education");

  const workItems: ExperienceItemProps[] =
    workEntries.length > 0
      ? workEntries.map((entry, idx) => ({
          index: String(idx + 1),
          company: entry.organization,
          tagline: entry.title,
          period: `${entry.startDate} — ${entry.isCurrent ? "Present" : entry.endDate || "Present"}`,
          position: entry.title,
          location: "Indonesia / Remote",
          industry: "Software Engineering & Web3",
          description: [
            entry.description ||
              "Building modern web applications and accessible design systems with high technical fidelity.",
          ],
          badge: "Role",
          image:
            idx === 0
              ? "https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=1200&auto=format&fit=crop"
              : "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop",
        }))
      : [
          {
            index: "1",
            company: "Freelance",
            tagline: "Frontend Developer & Web Engineering",
            period: "2023 — Present",
            position: "Frontend Developer",
            location: "Remote / Indonesia",
            industry: "Web & AI Engineering",
            description: [
              "Building modern web applications with Next.js, React, TypeScript, and Tailwind CSS for various clients.",
              "Designing fluid micro-interactions and ensuring top performance and accessibility across screen resolutions.",
            ],
            badge: "Role",
            image: "https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=1200&auto=format&fit=crop",
          },
        ];

  const educationItems: ExperienceItemProps[] =
    educationEntries.length > 0
      ? educationEntries.map((entry, idx) => ({
          index: String(idx + 1),
          company: entry.organization,
          tagline: entry.title,
          period: `${entry.startDate} — ${entry.isCurrent ? "Present" : entry.endDate || "Graduated"}`,
          position: entry.title,
          location: "Yogyakarta, Indonesia",
          industry: "Information Engineering",
          description: [
            entry.description ||
              "Studying Information Engineering with focus on web development, distributed systems, and machine learning.",
          ],
          badge: "Academics",
          image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1200&auto=format&fit=crop",
        }))
      : [
          {
            index: "1",
            company: "Universitas Gadjah Mada",
            tagline: "Information Engineering Degree",
            period: "2022 — Present",
            position: "Undergraduate Student",
            location: "Yogyakarta, Indonesia",
            industry: "Higher Education & Tech",
            description: [
              "Focusing on computer systems, software architecture, full-stack web technologies, and machine learning foundations.",
            ],
            badge: "Academics",
            image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1200&auto=format&fit=crop",
          },
        ];

  return (
    <div className="space-y-12">
      <ImpactExperience
        className="bg-transparent py-0 px-0 sm:py-0 sm:px-0 lg:px-0"
        title="WORK EXPERIENCE"
        badge="CAREER TRAJECTORY"
        subtitle="Professional roles & engineering contributions"
        items={workItems}
      />

      <ImpactExperience
        className="bg-transparent py-0 px-0 sm:py-0 sm:px-0 lg:px-0"
        title="EDUCATION"
        badge="ACADEMIC BACKGROUND"
        subtitle="Formal education & technical foundation"
        items={educationItems}
      />
    </div>
  );
}

function MeTab({ aboutInfo }: { aboutInfo: AboutInfo }) {
  return (
    <div className="space-y-12">
      {/* Introduction */}
      <div className="space-y-4 max-w-3xl">
        <p className="text-lg text-zinc-300 leading-relaxed">
          Based in{" "}
          <span className="text-white font-semibold">
            {aboutInfo.location}
          </span>
          . I&apos;m{" "}
          <span className="text-white font-semibold">
            {aboutInfo.name}
          </span>
          , {aboutInfo.bio}
        </p>
        <p className="text-zinc-400 leading-relaxed">
          {aboutInfo.bio2}
        </p>
      </div>

      {/* Currently Exploring */}
      <div className="group relative p-8 rounded-2xl bg-[#170C28] border border-white/10 hover:border-purple-500/40 transition-all duration-500 max-w-2xl">
        <div className="relative">
          <span className="text-xs font-bold tracking-widest uppercase text-purple-400 mb-3 block">
            Currently Exploring
          </span>
          <h3 className="text-2xl font-bold mb-3 text-white">
            {aboutInfo.currentlyExploring.title}
          </h3>
          <p className="text-zinc-300 leading-relaxed mb-6">
            {aboutInfo.currentlyExploring.description}
          </p>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-1.5 bg-black/40 rounded-full overflow-hidden border border-white/10">
              <div
                className="h-full bg-purple-500 rounded-full"
                style={{ width: `${aboutInfo.currentlyExploring.progress}%` }}
              />
            </div>
            <span className="text-xs font-medium text-zinc-400">
              {aboutInfo.currentlyExploring.progress}%
            </span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-8 border-t border-white/10">
        <div className="space-y-2">
          <p className="text-3xl md:text-4xl font-bold text-white">
            {aboutInfo.stats.years}
          </p>
          <p className="text-sm text-zinc-400">Years Experience</p>
        </div>
        <div className="space-y-2">
          <p className="text-3xl md:text-4xl font-bold text-white">
            {aboutInfo.stats.projects}
          </p>
          <p className="text-sm text-zinc-400">Projects Completed</p>
        </div>
        <div className="space-y-2">
          <p className="text-3xl md:text-4xl font-bold text-white">
            {aboutInfo.stats.technologies}
          </p>
          <p className="text-sm text-zinc-400">Technologies</p>
        </div>
      </div>
    </div>
  );
}
