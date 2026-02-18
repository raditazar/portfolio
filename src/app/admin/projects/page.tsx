import { prisma } from "@/lib/prisma";
import Link from "next/link";
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
      },
    });
  } catch {
    // DB not ready
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Projects</h1>
        <Link
          href="/admin/projects/new"
          className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium transition-colors"
        >
          + New Project
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="p-12 rounded-2xl bg-zinc-900 border border-zinc-800 text-center">
          <p className="text-zinc-500 mb-4">No projects yet.</p>
          <Link
            href="/admin/projects/new"
            className="text-purple-400 hover:text-purple-300 text-sm"
          >
            Create your first project →
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-zinc-800">
          <table className="w-full">
            <thead className="bg-zinc-900">
              <tr>
                <th className="text-left text-sm font-medium text-zinc-400 px-6 py-4">
                  Title
                </th>
                <th className="text-left text-sm font-medium text-zinc-400 px-6 py-4">
                  Category
                </th>
                <th className="text-center text-sm font-medium text-zinc-400 px-6 py-4">
                  Featured
                </th>
                <th className="text-center text-sm font-medium text-zinc-400 px-6 py-4">
                  Order
                </th>
                <th className="text-right text-sm font-medium text-zinc-400 px-6 py-4">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {projects.map((project) => (
                <tr
                  key={project.id}
                  className="hover:bg-zinc-900/50 transition-colors"
                >
                  <td className="px-6 py-4 text-white font-medium">
                    {project.title}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-lg bg-zinc-800 text-zinc-400 text-xs">
                      {project.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {project.isFeatured ? (
                      <span className="text-amber-400">⭐</span>
                    ) : (
                      <span className="text-zinc-600">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center text-zinc-500">
                    {project.order}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/projects/${project.id}/edit`}
                        className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs transition-colors"
                      >
                        Edit
                      </Link>
                      <DeleteProjectButton id={project.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

