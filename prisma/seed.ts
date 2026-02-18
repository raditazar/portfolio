import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const hashedPassword = await hash("misterradit15", 12);
  await prisma.user.upsert({
    where: { email: "radityaazhar@gmail.com" },
    update: { password: hashedPassword, email: "radityaazhar@gmail.com" },
    create: {
      email: "radityaazhar@gmail.com",
      password: hashedPassword,
      name: "Raditazar",
    },
  });

  // Create projects
  const projects = [
    {
      title: "Movo - Onchain Invoicing",
      description:
        "Traditional international payments are slow and opaque. Movo combines the speed of crypto with the accountability of fiat-linked ledgers, making every settlement verifiable.",
      category: "WEB3 / FINTECH",
      categoryColor: "text-green-400",
      techStack: ["Next.js", "Wagmi", "TypeScript", "Tailwind"],
      imageSrc: "/images/project-movo.png",
      imageAlt: "Movo App Interface",
      liveUrl: "https://movopay.vercel.app/",
      githubUrl: "https://github.com/Movo-Labs",
      isFeatured: true,
      order: 1,
    },
    {
      title: "FnB Inventory & Production",
      description:
        "Manual kitchen management led to mistracking and waste. Acting as Product Manager, I bridged the gap between client need and technical execution, designing a seamless inventory tracking system.",
      category: "UX / PRODUCT MGMT",
      categoryColor: "text-blue-400",
      techStack: ["React Native", "Golang", "Next.js", "Figma"],
      imageSrc: "/images/project-fnb.png",
      imageAlt: "FnB Wireframe",
      caseStudyUrl: "/projects#fnb",
      isFeatured: true,
      order: 2,
    },
    {
      title: "AI Chat Assistant",
      description:
        "A conversational AI interface powered by LLMs with streaming responses, context memory, and tool-use capabilities. Built with Vercel AI SDK for seamless integration.",
      category: "AI / ML",
      categoryColor: "text-purple-400",
      techStack: ["Next.js", "Vercel AI SDK", "TypeScript", "Tailwind"],
      imageSrc: "/images/project-movo.png",
      imageAlt: "AI Chat Interface",
      isFeatured: true,
      order: 3,
    },
    {
      title: "Portfolio Website",
      description:
        "A modern portfolio built with Next.js 16, featuring Three.js shader animations, GSAP interactions, and a full admin CMS with Prisma + PostgreSQL.",
      category: "WEB DEV",
      categoryColor: "text-cyan-400",
      techStack: ["Next.js", "Three.js", "GSAP", "Prisma", "PostgreSQL"],
      imageSrc: "/images/project-movo.png",
      imageAlt: "Portfolio Website",
      githubUrl: "https://github.com/raditazar",
      isFeatured: false,
      order: 4,
    },
  ];

  for (const project of projects) {
    await prisma.project.create({ data: project });
  }

  // Create career entries
  const careers = [
    {
      type: "education",
      title: "Information Engineering",
      organization: "Universitas Gadjah Mada",
      description:
        "Studying Information Engineering with focus on web development and machine learning.",
      startDate: "2022",
      endDate: null,
      isCurrent: true,
      order: 1,
    },
    {
      type: "work",
      title: "Frontend Developer",
      organization: "Freelance",
      description:
        "Building modern web applications with Next.js, React, and TypeScript for various clients.",
      startDate: "2023",
      endDate: null,
      isCurrent: true,
      order: 2,
    },
    {
      type: "work",
      title: "Student Organization Head",
      organization: "University Student Body",
      description:
        "Led a team of 50+ members, bridging technical execution with human empathy and organizational goals.",
      startDate: "2023",
      endDate: "2024",
      isCurrent: false,
      order: 3,
    },
  ];

  for (const career of careers) {
    await prisma.careerEntry.create({ data: career });
  }

  // Create about info
  const aboutInfos = [
    { key: "intro_name", value: "Raditya Azhar Ananta" },
    { key: "intro_location", value: "Yogyakarta" },
    {
      key: "intro_bio",
      value:
        "An Information Engineering student who treats code as a creative medium.",
    },
    {
      key: "intro_bio_2",
      value:
        "Previously leading a team as a student organization head, I learned how to bridge technical execution with human empathy. My goal isn't just to build websites, but to build digital experiences that feel natural and intuitive.",
    },
    {
      key: "currently_exploring_title",
      value: "AI & Machine Learning Bootcamp",
    },
    {
      key: "currently_exploring_desc",
      value:
        "Deep diving into Large Language Models (LLM) and integrating Vercel AI SDK with Next.js. Building a bridge between prompt engineering and UI components to create smarter web applications.",
    },
    { key: "currently_exploring_progress", value: "66" },
    {
      key: "technologies",
      value:
        "JavaScript (ES6+),TypeScript,React & Next.js,Tailwind CSS,Wagmi,Solidity,Python,Figma",
    },
    { key: "stat_years", value: "2+" },
    { key: "stat_projects", value: "10+" },
    { key: "stat_technologies", value: "8+" },
  ];

  for (const info of aboutInfos) {
    await prisma.aboutInfo.upsert({
      where: { key: info.key },
      update: { value: info.value },
      create: info,
    });
  }

  // Create site settings
  const settings = [
    { key: "site_name", value: "Raditazar" },
    { key: "site_tagline", value: "Front-End Developer & AI Enthusiast" },
    { key: "email", value: "radityaazhar@gmail.com" },
    {
      key: "github_url",
      value: "https://github.com/raditazar",
    },
    {
      key: "linkedin_url",
      value: "https://www.linkedin.com/in/raditya-azhar-ananta",
    },
    {
      key: "instagram_url",
      value: "https://instagram.com/raditazar_",
    },
  ];

  for (const setting of settings) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
  }

  console.log("✅ Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
