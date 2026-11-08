"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { TabSwitcher } from "@/components/ui/tabs";
import ImpactExperience, { ExperienceItemProps, FullBleed, GradientHover } from "@/components/ui/impact-experience";
import { lowerFirst, type CareerData, type ProfileData } from "@/lib/content-defaults";

export default function AboutPageClient({
  careers,
  profile,
}: {
  careers: CareerData[];
  profile: ProfileData;
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
        <MeTab profile={profile} />
      )}
    </>
  );
}

function CareerTab({ careers }: { careers: CareerData[] }) {
  const workEntries = careers.filter((c) => c.type === "work");
  const educationEntries = careers.filter((c) => c.type === "education");

  const workItems: ExperienceItemProps[] = workEntries.map((entry, idx) => ({
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
        }));

  const educationItems: ExperienceItemProps[] = educationEntries.map((entry, idx) => ({
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
        }));

  return (
    <div className="space-y-24">
      {workItems.length > 0 && (
      <ImpactExperience
        title="WORK EXPERIENCE"
        badge="CAREER TRAJECTORY"
        subtitle="Professional roles & engineering contributions"
        items={workItems}
      />
      )}

      {educationItems.length > 0 && (
      <ImpactExperience
        title="EDUCATION"
        badge="ACADEMIC BACKGROUND"
        subtitle="Formal education & technical foundation"
        items={educationItems}
      />
      )}
    </div>
  );
}

function MeTab({ profile }: { profile: ProfileData }) {
  const stats = [
    { value: profile.statYears, label: "Years Experience" },
    { value: profile.statProjects, label: "Projects Completed" },
    { value: profile.statTechnologies, label: "Technologies" },
  ];

  return (
    <div className="space-y-24">
      {/* Introduction */}
      <div className="grid md:grid-cols-12 gap-y-8 gap-x-10">
        <p className="md:col-span-10 text-[clamp(1.75rem,3.5vw,3rem)] font-semibold leading-[1.15] tracking-tight text-zinc-400">
          Based in{" "}
          <span className="text-white font-extrabold">{profile.location}</span>
          . I&apos;m{" "}
          <span className="text-white font-extrabold">{profile.name}</span>,{" "}
          {lowerFirst(profile.bio)}
        </p>
        <p className="md:col-start-8 md:col-span-5 text-base text-zinc-400 leading-relaxed">
          {profile.bio2}
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
                {profile.exploringTitle}
              </h3>
            </div>
            <div className="md:col-span-4 md:pt-10 space-y-6">
              <p className="text-base text-zinc-300 leading-relaxed">
                {profile.exploringDescription}
              </p>
              <div className="flex items-end gap-4">
                <span className="text-[clamp(4rem,9vw,8rem)] font-extrabold leading-[0.8] tracking-tighter text-transparent [-webkit-text-stroke:1px_rgba(244,239,231,0.6)]">
                  {profile.exploringProgress}%
                </span>
              </div>
              <div className="h-px w-full bg-white/15">
                <div
                  className="h-px bg-[#F4EFE7]"
                  style={{ width: `${profile.exploringProgress}%` }}
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

      {/* Technologies */}
      {profile.technologies.length > 0 && (
        <div className="grid md:grid-cols-12 gap-x-10 gap-y-6">
          <p className="md:col-span-3 font-mono text-xs uppercase tracking-widest text-zinc-400">
            Technologies
          </p>
          <p className="md:col-span-9 text-[clamp(1.5rem,3vw,2.5rem)] font-extrabold uppercase leading-[1.1] tracking-tight text-white">
            {profile.technologies.join(" / ")}
          </p>
        </div>
      )}
    </div>
  );
}
