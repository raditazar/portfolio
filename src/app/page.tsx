import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import HomeBento from "@/components/HomeBento";
import About from "@/components/About";
import Footer from "@/components/Footer";
import IntroOverlay from "@/components/IntroOverlay";
import ScrollToTop from "@/components/ScrollToTop";

export const dynamic = "force-dynamic";
import HomeLogoLoop from "@/components/HomeLogoLoop";
import HomeLightRays from "@/components/HomeLightRays";
import prisma from "@/lib/prisma";

async function getHomeData() {
  try {
    const [projects, allProjectCount] = await Promise.all([
      prisma.project.findMany({
        where: { isFeatured: true },
        orderBy: { order: "asc" },
        take: 4,
      }),
      prisma.project.count(),
    ]);

    return {
      projects,
      totalProjectCount: allProjectCount,
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
      totalProjectCount: 4,
    };
  }
}

export default async function Home() {
  const data = await getHomeData();

  return (
    <main className="min-h-screen bg-[#0B0F14] text-white selection:bg-white selection:text-black overflow-x-clip relative">
      {/* Intro Animation */}
      <IntroOverlay />

      {/* Background LightRays */}
      <HomeLightRays />

      <div className="relative z-10">
        <Navbar />
        <Hero />
        <HomeLogoLoop />
        <HomeBento
          projects={data.projects}
          totalProjectCount={data.totalProjectCount}
        />
        <About stats={{ projects: data.totalProjectCount, technologies: 12 }} />
        <Footer />
      </div>

      <ScrollToTop />
    </main>
  );
}
