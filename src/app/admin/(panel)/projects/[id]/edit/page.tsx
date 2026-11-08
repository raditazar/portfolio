import Link from "next/link";
import { notFound } from "next/navigation";

import { buttonVariants } from "@/components/admin/Button";
import { PageHeader } from "@/components/admin/PageHeader";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { prisma } from "@/lib/prisma";

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
    <>
      <PageHeader
        eyebrow="02 / Projects / Edit"
        title="Edit project"
        description={project.title}
        actions={
          <Link
            href="/admin/projects"
            className={buttonVariants({ variant: "ghost", size: "sm" })}
          >
            Back to projects
          </Link>
        }
      />
      <ProjectForm
        mode="edit"
        project={{
          id: project.id,
          title: project.title,
          description: project.description,
          category: project.category,
          categoryColor: project.categoryColor,
          imageSrc: project.imageSrc || "",
          imageAlt: project.imageAlt || "",
          techStack: project.techStack,
          liveUrl: project.liveUrl,
          githubUrl: project.githubUrl,
          caseStudyUrl: project.caseStudyUrl,
          isFeatured: project.isFeatured,
          order: project.order,
        }}
      />
    </>
  );
}
