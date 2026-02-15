"use client";

import LogoLoop from "./LogoLoop";

const techLogos = [
  { node: <span className="text-lg font-bold text-zinc-400">JavaScript</span>, title: "JavaScript" },
  { node: <span className="text-lg font-bold text-blue-400">TypeScript</span>, title: "TypeScript" },
  { node: <span className="text-lg font-bold text-cyan-400">React</span>, title: "React" },
  { node: <span className="text-lg font-bold text-zinc-300">Next.js</span>, title: "Next.js" },
  { node: <span className="text-lg font-bold text-sky-400">Tailwind</span>, title: "Tailwind CSS" },
  { node: <span className="text-lg font-bold text-purple-400">Wagmi</span>, title: "Wagmi" },
  { node: <span className="text-lg font-bold text-zinc-400">Solidity</span>, title: "Solidity" },
  { node: <span className="text-lg font-bold text-yellow-400">Python</span>, title: "Python" },
  { node: <span className="text-lg font-bold text-pink-400">Figma</span>, title: "Figma" },
  { node: <span className="text-lg font-bold text-green-400">GSAP</span>, title: "GSAP" },
  { node: <span className="text-lg font-bold text-orange-400">Three.js</span>, title: "Three.js" },
  { node: <span className="text-lg font-bold text-indigo-400">Prisma</span>, title: "Prisma" },
];

export default function HomeLogoLoop() {
  return (
    <section className="relative py-8 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0B0F14]/0 via-[#0B0F14]/50 to-[#0B0F14]/0 dark:from-transparent dark:via-white/[0.02] dark:to-transparent pointer-events-none" />
      <LogoLoop
        logos={techLogos}
        speed={80}
        direction="left"
        gap={48}
        logoHeight={32}
        pauseOnHover={true}
        fadeOut={true}
        fadeOutColor="#0B0F14"
        scaleOnHover={true}
        className="opacity-60 hover:opacity-80 transition-opacity duration-500"
      />
    </section>
  );
}
