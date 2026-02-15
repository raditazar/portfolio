import prisma from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HomeLightRays from "@/components/HomeLightRays";
import ProjectsPageClient from "./ProjectsPageClient";

export const dynamic = "force-dynamic";

async function getProjects() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { order: "asc" },
    });
    return projects;
  } catch {
    return [
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
    ];
  }
}

export const metadata = {
  title: "Projects | Raditazar",
  description: "Explore my projects and work",
};

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <main className="min-h-screen bg-[var(--portfolio-bg)] dark:bg-[#0B0F14] text-[var(--portfolio-text)] dark:text-white overflow-x-clip relative">
      <HomeLightRays />
      <div className="relative z-10">
        <Navbar />
        <div className="pt-32 pb-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-12">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">Projects</h1>
              <p className="text-lg text-zinc-500 dark:text-zinc-400 max-w-2xl">
                A collection of projects I&apos;ve worked on, from web3
                applications to AI-powered interfaces.
              </p>
            </div>
            <ProjectsPageClient projects={projects} />
          </div>
        </div>
        <Footer />
      </div>
    </main>
  );
}
