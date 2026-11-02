"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { TabSwitcher } from "@/components/ui/tabs";
import ImpactExperience, { ExperienceItemProps, FullBleed, GradientHover } from "@/components/ui/impact-experience";

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
    <div className="space-y-24">
      <ImpactExperience
        title="WORK EXPERIENCE"
        badge="CAREER TRAJECTORY"
        subtitle="Professional roles & engineering contributions"
        items={workItems}
      />

      <ImpactExperience
        title="EDUCATION"
        badge="ACADEMIC BACKGROUND"
        subtitle="Formal education & technical foundation"
        items={educationItems}
      />
    </div>
  );
}

function MeTab({ aboutInfo }: { aboutInfo: AboutInfo }) {
  const stats = [
    { value: aboutInfo.stats.years, label: "Years Experience" },
    { value: aboutInfo.stats.projects, label: "Projects Completed" },
    { value: aboutInfo.stats.technologies, label: "Technologies" },
  ];

  return (
    <div className="space-y-24">
      {/* Introduction */}
      <div className="grid md:grid-cols-12 gap-y-8 gap-x-10">
        <p className="md:col-span-10 text-[clamp(1.75rem,3.5vw,3rem)] font-semibold leading-[1.15] tracking-tight text-zinc-400">
          Based in{" "}
          <span className="text-white font-extrabold">{aboutInfo.location}</span>
          . I&apos;m{" "}
          <span className="text-white font-extrabold">{aboutInfo.name}</span>,{" "}
          {aboutInfo.bio}
        </p>
        <p className="md:col-start-8 md:col-span-5 text-base text-zinc-400 leading-relaxed">
          {aboutInfo.bio2}
        </p>
      </div>

      {/* Currently Exploring */}
      <FullBleed>
        <GradientHover className="border-y border-white/10">
          <div className="grid md:grid-cols-12 gap-x-10 gap-y-8 px-6 sm:px-12 py-12 md:py-20">
            <div className="md:col-span-8">
              <span className="font-mono text-xs uppercase tracking-widest text-[#F4EFE7]/60 block mb-4">
                Currently Exploring
              </span>
              <h3 className="text-[clamp(2.5rem,6vw,5.5rem)] font-extrabold uppercase leading-[0.9] tracking-tighter text-white transition-transform duration-500 group-data-[active=true]:translate-x-2 motion-reduce:transform-none">
                {aboutInfo.currentlyExploring.title}
              </h3>
            </div>
            <div className="md:col-span-4 md:pt-10 space-y-6">
              <p className="text-base text-zinc-300 leading-relaxed">
                {aboutInfo.currentlyExploring.description}
              </p>
              <div className="flex items-end gap-4">
                <span className="text-[clamp(4rem,9vw,8rem)] font-extrabold leading-[0.8] tracking-tighter text-transparent [-webkit-text-stroke:1px_rgba(244,239,231,0.6)]">
                  {aboutInfo.currentlyExploring.progress}%
                </span>
              </div>
              <div className="h-px w-full bg-white/15">
                <div
                  className="h-px bg-[#F4EFE7]"
                  style={{ width: `${aboutInfo.currentlyExploring.progress}%` }}
                />
              </div>
            </div>
          </div>
        </GradientHover>
      </FullBleed>

      {/* Stats */}
      <FullBleed>
        <GradientHover className="border-y border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-x-10 gap-y-10 px-6 sm:px-12 py-12 md:py-20">
            {stats.map((s, i) => (
              <div
                key={s.label}
                className={`md:col-span-4 ${i === 1 ? "md:pt-12" : i === 2 ? "md:pt-24" : ""}`}
              >
                <p className="text-[clamp(4rem,10vw,9rem)] font-extrabold leading-[0.85] tracking-[-0.05em] text-white">
                  {s.value}
                </p>
                <p className="mt-3 font-mono text-xs uppercase tracking-widest text-zinc-400">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </GradientHover>
      </FullBleed>
    </div>
  );
}
