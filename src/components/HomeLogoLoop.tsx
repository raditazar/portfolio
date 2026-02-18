"use client";

import LogoLoop from "./LogoLoop";
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
} from "react-icons/si";

interface TechBadgeProps {
  icon: React.ReactNode;
  label: string;
}

function TechBadge({ icon, label }: TechBadgeProps) {
  return (
    <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-white/4 border border-white/8 hover:border-white/16 transition-colors duration-300">
      <span className="text-[22px] shrink-0">{icon}</span>
      <span className="text-sm font-semibold text-zinc-300 whitespace-nowrap">{label}</span>
    </div>
  );
}

const techLogos = [
  {
    node: <TechBadge icon={<SiJavascript color="#F7DF1E" />} label="JavaScript" />,
    title: "JavaScript",
  },
  {
    node: <TechBadge icon={<SiTypescript color="#3178C6" />} label="TypeScript" />,
    title: "TypeScript",
  },
  {
    node: <TechBadge icon={<SiReact color="#61DAFB" />} label="React" />,
    title: "React",
  },
  {
    node: <TechBadge icon={<SiNextdotjs color="#ffffff" />} label="Next.js" />,
    title: "Next.js",
  },
  {
    node: <TechBadge icon={<SiTailwindcss color="#38BDF8" />} label="Tailwind CSS" />,
    title: "Tailwind CSS",
  },
  {
    node: <TechBadge icon={<SiEthereum color="#818CF8" />} label="Wagmi" />,
    title: "Wagmi",
  },
  {
    node: <TechBadge icon={<SiSolidity color="#9CA3AF" />} label="Solidity" />,
    title: "Solidity",
  },
  {
    node: <TechBadge icon={<SiPython color="#3776AB" />} label="Python" />,
    title: "Python",
  },
  {
    node: <TechBadge icon={<SiFigma color="#F24E1E" />} label="Figma" />,
    title: "Figma",
  },
  {
    node: <TechBadge icon={<SiGreensock color="#88CE02" />} label="GSAP" />,
    title: "GSAP",
  },
  {
    node: <TechBadge icon={<SiThreedotjs color="#ffffff" />} label="Three.js" />,
    title: "Three.js",
  },
  {
    node: <TechBadge icon={<SiPrisma color="#818CF8" />} label="Prisma" />,
    title: "Prisma",
  },
];

export default function HomeLogoLoop() {
  return (
    <section className="relative pt-[220px] pb-12 lg:pt-[280px] overflow-hidden">
      <LogoLoop
        logos={techLogos}
        speed={60}
        direction="left"
        gap={12}
        logoHeight={44}
        pauseOnHover={true}
        fadeOut={true}
        fadeOutColor="#0B0F14"
        scaleOnHover={true}
        className="opacity-80 hover:opacity-100 transition-opacity duration-500"
      />
    </section>
  );
}
