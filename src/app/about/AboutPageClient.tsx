"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { TabSwitcher } from "@/components/ui/tabs";

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

  return (
    <div className="space-y-16">
      {/* Work Experience */}
      <div>
        <h2 className="text-2xl font-bold mb-8 text-zinc-900 dark:text-white">
          Work Experience
        </h2>
        <div className="space-y-1">
          {workEntries.map((entry, idx) => (
            <TimelineItem key={entry.id} entry={entry} isLast={idx === workEntries.length - 1} />
          ))}
          {workEntries.length === 0 && (
            <p className="text-zinc-500">No work experience entries yet.</p>
          )}
        </div>
      </div>

      {/* Education */}
      <div>
        <h2 className="text-2xl font-bold mb-8 text-zinc-900 dark:text-white">
          Education
        </h2>
        <div className="space-y-1">
          {educationEntries.map((entry, idx) => (
            <TimelineItem key={entry.id} entry={entry} isLast={idx === educationEntries.length - 1} />
          ))}
          {educationEntries.length === 0 && (
            <p className="text-zinc-500">No education entries yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function TimelineItem({
  entry,
  isLast,
}: {
  entry: CareerEntry;
  isLast: boolean;
}) {
  return (
    <div className="relative flex gap-6">
      {/* Timeline line */}
      <div className="flex flex-col items-center">
        <div
          className={`w-3 h-3 rounded-full mt-1.5 ${
            entry.isCurrent
              ? "bg-purple-500 ring-4 ring-purple-500/20"
              : "bg-zinc-400 dark:bg-zinc-600"
          }`}
        />
        {!isLast && (
          <div className="w-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
        )}
      </div>

      {/* Content */}
      <div className="pb-10">
        <div className="flex items-center gap-3 mb-1">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
            {entry.title}
          </h3>
          {entry.isCurrent && (
            <span className="px-2 py-0.5 text-[10px] font-bold bg-green-500/10 text-green-500 rounded-full border border-green-500/20">
              Current
            </span>
          )}
        </div>
        <p className="text-sm font-medium text-purple-500 dark:text-purple-400 mb-1">
          {entry.organization}
        </p>
        <p className="text-xs text-zinc-500 mb-3">
          {entry.startDate} — {entry.isCurrent ? "Present" : entry.endDate}
        </p>
        {entry.description && (
          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-lg">
            {entry.description}
          </p>
        )}
      </div>
    </div>
  );
}

function MeTab({ aboutInfo }: { aboutInfo: AboutInfo }) {
  return (
    <div className="space-y-12">
      {/* Introduction */}
      <div className="space-y-4 max-w-3xl">
        <p className="text-lg text-zinc-700 dark:text-zinc-300 leading-relaxed">
          Based in{" "}
          <span className="text-zinc-900 dark:text-white font-semibold">
            {aboutInfo.location}
          </span>
          . I&apos;m{" "}
          <span className="text-zinc-900 dark:text-white font-semibold">
            {aboutInfo.name}
          </span>
          , {aboutInfo.bio}
        </p>
        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
          {aboutInfo.bio2}
        </p>
      </div>

      {/* Currently Exploring */}
      <div className="group relative p-8 rounded-2xl bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-500 max-w-2xl">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
        <div className="relative">
          <span className="text-xs font-bold tracking-widest uppercase text-purple-500 dark:text-purple-400 mb-3 block">
            Currently Exploring
          </span>
          <h3 className="text-2xl font-bold mb-3 text-zinc-900 dark:text-white">
            {aboutInfo.currentlyExploring.title}
          </h3>
          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
            {aboutInfo.currentlyExploring.description}
          </p>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                style={{ width: `${aboutInfo.currentlyExploring.progress}%` }}
              />
            </div>
            <span className="text-xs font-medium text-zinc-500">
              {aboutInfo.currentlyExploring.progress}%
            </span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-8 border-t border-zinc-200 dark:border-zinc-800/50">
        <div className="space-y-2">
          <p className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white">
            {aboutInfo.stats.years}
          </p>
          <p className="text-sm text-zinc-500">Years Experience</p>
        </div>
        <div className="space-y-2">
          <p className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white">
            {aboutInfo.stats.projects}
          </p>
          <p className="text-sm text-zinc-500">Projects Completed</p>
        </div>
        <div className="space-y-2">
          <p className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white">
            {aboutInfo.stats.technologies}
          </p>
          <p className="text-sm text-zinc-500">Technologies</p>
        </div>
      </div>
    </div>
  );
}
