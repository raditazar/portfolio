import prisma from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HomeLightRays from "@/components/HomeLightRays";
import AboutPageClient from "./AboutPageClient";

export const dynamic = "force-dynamic";

async function getAboutData() {
  try {
    const [careers, aboutInfos] = await Promise.all([
      prisma.careerEntry.findMany({ orderBy: { order: "asc" } }),
      prisma.aboutInfo.findMany(),
    ]);

    const infoMap = Object.fromEntries(aboutInfos.map((i) => [i.key, i.value]));

    return {
      careers,
      aboutInfo: {
        name: infoMap.intro_name || "Raditya Azhar Ananta",
        location: infoMap.intro_location || "Yogyakarta",
        bio: infoMap.intro_bio || "An Information Engineering student.",
        bio2:
          infoMap.intro_bio_2 ||
          "My goal is to build digital experiences that feel natural.",
        currentlyExploring: {
          title:
            infoMap.currently_exploring_title ||
            "AI & Machine Learning Bootcamp",
          description:
            infoMap.currently_exploring_desc ||
            "Deep diving into LLMs and Vercel AI SDK.",
          progress: parseInt(infoMap.currently_exploring_progress || "66"),
        },
        technologies: (
          infoMap.technologies ||
          "JavaScript (ES6+),TypeScript,React & Next.js,Tailwind CSS,Wagmi,Solidity,Python,Figma"
        ).split(","),
        stats: {
          years: infoMap.stat_years || "2+",
          projects: infoMap.stat_projects || "10+",
          technologies: infoMap.stat_technologies || "8+",
        },
      },
    };
  } catch {
    return {
      careers: [
        {
          id: "1",
          type: "education",
          title: "Information Engineering",
          organization: "Universitas Gadjah Mada",
          description: "Focus on web development and machine learning.",
          startDate: "2022",
          endDate: null,
          isCurrent: true,
          order: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "2",
          type: "work",
          title: "Frontend Developer",
          organization: "Freelance",
          description:
            "Building modern web applications with Next.js, React, and TypeScript.",
          startDate: "2023",
          endDate: null,
          isCurrent: true,
          order: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      aboutInfo: {
        name: "Raditya Azhar Ananta",
        location: "Yogyakarta",
        bio: "An Information Engineering student who treats code as a creative medium.",
        bio2: "Previously leading a team as a student organization head, I learned how to bridge technical execution with human empathy.",
        currentlyExploring: {
          title: "AI & Machine Learning Bootcamp",
          description:
            "Deep diving into LLMs and integrating Vercel AI SDK with Next.js.",
          progress: 66,
        },
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
      },
    };
  }
}

export const metadata = {
  title: "About | Raditazar",
  description: "Learn more about Raditya Azhar Ananta",
};

export default async function AboutPage() {
  const { careers, aboutInfo } = await getAboutData();

  return (
    <main className="min-h-screen bg-[var(--portfolio-bg)] dark:bg-[#0B0F14] text-[var(--portfolio-text)] dark:text-white overflow-x-clip relative">
      <HomeLightRays />
      <div className="relative z-10">
        <Navbar />
        <div className="pt-32 pb-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-12">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">About</h1>
              <p className="text-lg text-zinc-500 dark:text-zinc-400 max-w-2xl">
                Get to know more about my journey, career, and what drives me.
              </p>
            </div>
            <AboutPageClient careers={careers} aboutInfo={aboutInfo} />
          </div>
        </div>
        <Footer />
      </div>
    </main>
  );
}
