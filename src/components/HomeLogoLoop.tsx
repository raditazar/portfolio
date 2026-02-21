"use client";

import LogoLoop from "./LogoLoop";
import { useScrollReveal } from "@/lib/useScrollReveal";
import {
  SiJavascript,
  SiTypescript,
  SiReact,
  SiNextdotjs,
  SiTailwindcss,
  SiEthereum,
  SiSolidity,
  SiPython,
  SiFigma,
  SiGreensock,
  SiThreedotjs,
  SiPrisma,
  SiNodedotjs,
  SiGit,
  SiDocker,
  SiPostgresql,
  SiVercel,
  SiFramer,
} from "react-icons/si";

interface TechBadgeProps {
  icon: React.ReactNode;
  label: string;
}

function TechBadge({ icon }: TechBadgeProps) {
  return (
    <span className="inline-flex items-center justify-center text-inherit shrink-0">
      {icon}
    </span>
  );
}

const topRow = [
  { node: <TechBadge icon={<SiJavascript color="#F7DF1E" />} label="JavaScript" />, title: "JavaScript" },
  { node: <TechBadge icon={<SiTypescript color="#3178C6" />} label="TypeScript" />, title: "TypeScript" },
  { node: <TechBadge icon={<SiReact color="#61DAFB" />} label="React" />, title: "React" },
  { node: <TechBadge icon={<SiNextdotjs color="#ffffff" />} label="Next.js" />, title: "Next.js" },
  { node: <TechBadge icon={<SiTailwindcss color="#38BDF8" />} label="Tailwind CSS" />, title: "Tailwind CSS" },
  { node: <TechBadge icon={<SiPython color="#3776AB" />} label="Python" />, title: "Python" },
  { node: <TechBadge icon={<SiGreensock color="#88CE02" />} label="GSAP" />, title: "GSAP" },
  { node: <TechBadge icon={<SiThreedotjs color="#ffffff" />} label="Three.js" />, title: "Three.js" },
  { node: <TechBadge icon={<SiPrisma color="#818CF8" />} label="Prisma" />, title: "Prisma" },
];

const bottomRow = [
  { node: <TechBadge icon={<SiNodedotjs color="#339933" />} label="Node.js" />, title: "Node.js" },
  { node: <TechBadge icon={<SiEthereum color="#818CF8" />} label="Wagmi" />, title: "Wagmi" },
  { node: <TechBadge icon={<SiSolidity color="#9CA3AF" />} label="Solidity" />, title: "Solidity" },
  { node: <TechBadge icon={<SiFigma color="#F24E1E" />} label="Figma" />, title: "Figma" },
  { node: <TechBadge icon={<SiGit color="#F05032" />} label="Git" />, title: "Git" },
  { node: <TechBadge icon={<SiDocker color="#2496ED" />} label="Docker" />, title: "Docker" },
  { node: <TechBadge icon={<SiPostgresql color="#4169E1" />} label="PostgreSQL" />, title: "PostgreSQL" },
  { node: <TechBadge icon={<SiVercel color="#ffffff" />} label="Vercel" />, title: "Vercel" },
  { node: <TechBadge icon={<SiFramer color="#0055FF" />} label="Motion" />, title: "Motion" },
];

export default function HomeLogoLoop() {
  const sectionRef = useScrollReveal<HTMLElement>({ distance: 40, duration: 0.8 });

  return (
    <section ref={sectionRef} className="relative pt-8 pb-8 lg:pt-12">
      {/* Top fade for seamless transition from Hero */}
      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-[#0B0F14] to-transparent pointer-events-none z-[1]" />

      {/* Section label */}
      <div className="max-w-5xl mx-auto px-6 mb-10">
        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-linear-to-r from-transparent via-zinc-700/50 to-transparent" />
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-zinc-500">
            Tools & Technologies
          </span>
          <div className="h-px flex-1 bg-linear-to-r from-transparent via-zinc-700/50 to-transparent" />
        </div>
      </div>

      {/* Row 1 — scrolls left */}
      <div className="mb-4">
        <LogoLoop
          logos={topRow}
          speed={20}
          direction="left"
          gap={48}
          logoHeight={42}
          pauseOnHover={true}
          fadeOut={true}
          fadeOutColor="#0B0F14"
          scaleOnHover={true}
          className="opacity-90 hover:opacity-100 transition-opacity duration-500"
        />
      </div>

      {/* Row 2 — scrolls right */}
      <LogoLoop
        logos={bottomRow}
        speed={20}
        direction="right"
        gap={48}
        logoHeight={42}
        pauseOnHover={true}
        fadeOut={true}
        fadeOutColor="#0B0F14"
        scaleOnHover={true}
        className="opacity-75 hover:opacity-100 transition-opacity duration-500"
      />
    </section>
  );
}
