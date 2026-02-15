import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import HomeBento from "@/components/HomeBento";
import About from "@/components/About";
import Footer from "@/components/Footer";

export const dynamic = "force-dynamic";
import HomeLogoLoop from "@/components/HomeLogoLoop";
import HomeLightRays from "@/components/HomeLightRays";
import prisma from "@/lib/prisma";

async function getHomeData() {
  try {
    const [projects, aboutInfos, settings] = await Promise.all([
      prisma.project.findMany({
        where: { isFeatured: true },
        orderBy: { order: "asc" },
        take: 4,
      }),
      prisma.aboutInfo.findMany(),
      prisma.siteSetting.findMany(),
    ]);

    const infoMap = Object.fromEntries(aboutInfos.map((i) => [i.key, i.value]));

    return {
      projects,
      technologies: infoMap.technologies?.split(",") || [
        "JavaScript",
        "TypeScript",
        "React & Next.js",
        "Tailwind CSS",
        "Wagmi",
        "Solidity",
        "Python",
        "Figma",
      ],
      stats: {
        years: infoMap.stat_years || "2+",
        projects: infoMap.stat_projects || "10+",
        technologies: infoMap.stat_technologies || "8+",
      },
      currentlyExploring: {
        title: infoMap.currently_exploring_title || "AI & Machine Learning Bootcamp",
        description:
          infoMap.currently_exploring_desc ||
          "Deep diving into LLMs and integrating Vercel AI SDK with Next.js.",
        progress: parseInt(infoMap.currently_exploring_progress || "66"),
      },
    };
  } catch {
    // Fallback data when DB is not available
    return {
      projects: [
        {
          id: "1",
          title: "Movo - Onchain Invoicing",
          description:
            "Traditional international payments are slow and opaque. Movo combines the speed of crypto with the accountability of fiat-linked ledgers.",
          category: "WEB3 / FINTECH",
          categoryColor: "text-green-400",
          techStack: ["Next.js", "Wagmi", "TypeScript", "Tailwind"],
          imageSrc: "/images/project-movo.png",
          imageAlt: "Movo App Interface",
          liveUrl: "https://movopay.vercel.app/",
          githubUrl: "https://github.com/Movo-Labs",
          caseStudyUrl: null,
          isFeatured: true,
          order: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "2",
          title: "FnB Inventory & Production",
          description:
            "Manual kitchen management led to mistracking and waste. A seamless inventory tracking system.",
          category: "UX / PRODUCT MGMT",
          categoryColor: "text-blue-400",
          techStack: ["React Native", "Golang", "Next.js", "Figma"],
          imageSrc: "/images/project-fnb.png",
          imageAlt: "FnB Wireframe",
          liveUrl: null,
          githubUrl: null,
          caseStudyUrl: null,
          isFeatured: true,
          order: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "3",
          title: "AI Chat Assistant",
          description:
            "A conversational AI interface powered by LLMs with streaming responses and tool-use capabilities.",
          category: "AI / ML",
          categoryColor: "text-purple-400",
          techStack: ["Next.js", "Vercel AI SDK", "TypeScript", "Tailwind"],
          imageSrc: "/images/project-movo.png",
          imageAlt: "AI Chat Interface",
          liveUrl: null,
          githubUrl: null,
          caseStudyUrl: null,
          isFeatured: true,
          order: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      technologies: [
        "JavaScript (ES6+)",
        "TypeScript",
        "React & Next.js",
        "Tailwind CSS",
        "Wagmi",
        "Solidity",
        "Python",
        "Figma",
      ],
      stats: { years: "2+", projects: "10+", technologies: "8+" },
      currentlyExploring: {
        title: "AI & Machine Learning Bootcamp",
        description:
          "Deep diving into Large Language Models and integrating Vercel AI SDK with Next.js.",
        progress: 66,
      },
    };
  }
}

export default async function Home() {
  const data = await getHomeData();

  return (
    <main className="min-h-screen bg-[var(--portfolio-bg)] dark:bg-[#0B0F14] text-[var(--portfolio-text)] dark:text-white selection:bg-white selection:text-black overflow-x-clip relative">
      {/* Background LightRays */}
      <HomeLightRays />

      <div className="relative z-10">
        <Navbar />
        <Hero />
        <HomeLogoLoop />
        <HomeBento
          projects={data.projects}
          technologies={data.technologies}
          stats={data.stats}
          currentlyExploring={data.currentlyExploring}
        />
        <About />
        <Footer />
      </div>
    </main>
  );
}
