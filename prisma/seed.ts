import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
import { ensureContentDefaults } from "./content-bootstrap";

const prisma = new PrismaClient();

async function main() {
  // Admin user: credentials come from the environment, never from source.
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (email && password) {
    const hashedPassword = await hash(password, 12);
    await prisma.user.upsert({
      where: { email },
      update: { password: hashedPassword },
      create: { email, password: hashedPassword, name: "Raditazar" },
    });
    console.log(`Admin user ensured: ${email}`);
  } else {
    console.log("ADMIN_EMAIL / ADMIN_PASSWORD not set - skipping admin user.");
  }

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

  // Idempotent: only create projects that do not exist yet (matched by title).
  for (const project of projects) {
    const exists = await prisma.project.findFirst({ where: { title: project.title } });
    if (!exists) await prisma.project.create({ data: project });
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
    const exists = await prisma.careerEntry.findFirst({
      where: { title: career.title, organization: career.organization },
    });
    if (!exists) await prisma.careerEntry.create({ data: career });
  }

  // Profile / socials / gallery (only when missing - never overwrite admin edits)
  await ensureContentDefaults(prisma);

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
