import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import EditProjectClient from "./EditProjectClient";

export const dynamic = "force-dynamic";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) notFound();

  return (
    <EditProjectClient
      project={{
        id: project.id,
        title: project.title,
        description: project.description,
        category: project.category,
        imageSrc: project.imageSrc || "",
        imageAlt: project.imageAlt || "",
        techStack: project.techStack,
        liveUrl: project.liveUrl || "",
        githubUrl: project.githubUrl || "",
        caseStudyUrl: project.caseStudyUrl || "",
        isFeatured: project.isFeatured,
        order: project.order,
      }}
    />
  );
}
