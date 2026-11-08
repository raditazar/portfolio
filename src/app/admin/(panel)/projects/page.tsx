import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { PageHeader } from "@/components/admin/PageHeader";
import { EmptyState } from "@/components/admin/EmptyState";
import { Tag } from "@/components/admin/Tag";
import { buttonVariants } from "@/components/admin/Button";
import DeleteProjectButton from "./DeleteProjectButton";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  let projects: {
    id: string;
    title: string;
    category: string;
    isFeatured: boolean;
    order: number;
    createdAt: Date;
    liveUrl: string | null;
  }[] = [];

  try {
    projects = await prisma.project.findMany({
      orderBy: { order: "asc" },
      select: {
        id: true,
        title: true,
        category: true,
        isFeatured: true,
        order: true,
        createdAt: true,
        liveUrl: true,
      },
    });
  } catch {
    // DB not ready
  }

  return (
    <div>
      <PageHeader
        eyebrow="02 / Projects"
        title="Projects"
        description="Manage portfolio case studies."
        actions={
          <Link
            href="/admin/projects/new"
            className={buttonVariants({ variant: "primary" })}
          >
            + New project
          </Link>
        }
      />

      {projects.length === 0 ? (
        <EmptyState
          title="No projects yet"
          description="Add your first case study to get started."
          action={
            <Link
              href="/admin/projects/new"
              className={buttonVariants({ variant: "primary" })}
            >
              Create your first project
            </Link>
          }
        />
      ) : (
        <ul>
          {projects.map((project, i) => (
            <li
              key={project.id}
              className="py-6 grid gap-4 md:grid-cols-12 md:items-center border-b border-white/8"
            >
              <span className="font-mono text-xs text-white/50 md:col-span-1">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="flex min-w-0 flex-col items-start gap-3 md:col-span-5">
                <h2 className="font-serif text-2xl text-white break-words">
                  {project.title}
                </h2>
                <Tag tone="neutral">{project.category}</Tag>
              </div>
              <div className="flex flex-wrap items-center gap-3 md:col-span-3">
                <span className="font-mono text-xs text-white/50">
                  Order {project.order}
                </span>
                {project.isFeatured && <Tag tone="linen">Featured</Tag>}
              </div>
              <div className="flex flex-wrap items-center gap-4 md:col-span-3 md:justify-end">
                <Link
                  href={`/admin/projects/${project.id}/edit`}
                  className={buttonVariants({ variant: "ghost", size: "sm" })}
                >
                  Edit →
                </Link>
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={buttonVariants({
                      variant: "ghost",
                      size: "sm",
                    })}
                  >
                    View ↗
                  </a>
                )}
                <DeleteProjectButton id={project.id} title={project.title} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
