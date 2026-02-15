import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function getStats() {
  try {
    const [projectCount, featuredCount, careerCount, aboutCount, settingsCount] =
      await Promise.all([
        prisma.project.count(),
        prisma.project.count({ where: { isFeatured: true } }),
        prisma.careerEntry.count(),
        prisma.aboutInfo.count(),
        prisma.siteSetting.count(),
      ]);
    return { projectCount, featuredCount, careerCount, aboutCount, settingsCount };
  } catch {
    return {
      projectCount: 0,
      featuredCount: 0,
      careerCount: 0,
      aboutCount: 0,
      settingsCount: 0,
    };
  }
}

export default async function AdminDashboard() {
  const stats = await getStats();

  const cards = [
    {
      label: "Total Projects",
      value: stats.projectCount,
      icon: "🗂️",
      href: "/admin/projects",
      color: "purple",
    },
    {
      label: "Featured Projects",
      value: stats.featuredCount,
      icon: "⭐",
      href: "/admin/projects",
      color: "amber",
    },
    {
      label: "Career Entries",
      value: stats.careerCount,
      icon: "💼",
      href: "/admin/career",
      color: "blue",
    },
    {
      label: "About Info",
      value: stats.aboutCount,
      icon: "👤",
      href: "/admin/about",
      color: "green",
    },
    {
      label: "Settings",
      value: stats.settingsCount,
      icon: "⚙️",
      href: "/admin/settings",
      color: "zinc",
    },
  ];

  const colorMap: Record<string, string> = {
    purple: "bg-purple-500/10 border-purple-500/20 text-purple-400",
    amber: "bg-amber-500/10 border-amber-500/20 text-amber-400",
    blue: "bg-blue-500/10 border-blue-500/20 text-blue-400",
    green: "bg-green-500/10 border-green-500/20 text-green-400",
    zinc: "bg-zinc-500/10 border-zinc-500/20 text-zinc-400",
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => (
          <a
            key={card.label}
            href={card.href}
            className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors group"
          >
            <div className="flex items-center justify-between mb-4">
              <span
                className={`text-2xl p-3 rounded-xl border ${colorMap[card.color]}`}
              >
                {card.icon}
              </span>
              <span className="text-3xl font-bold text-white">
                {card.value}
              </span>
            </div>
            <p className="text-sm text-zinc-400 group-hover:text-zinc-300 transition-colors">
              {card.label}
            </p>
          </a>
        ))}
      </div>

      <div className="mt-8 p-6 rounded-2xl bg-zinc-900 border border-zinc-800">
        <h2 className="text-lg font-semibold mb-3">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <a
            href="/admin/projects/new"
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium transition-colors"
          >
            + New Project
          </a>
          <a
            href="/admin/career"
            className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-medium transition-colors"
          >
            + New Career Entry
          </a>
          <a
            href="/"
            target="_blank"
            className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-medium transition-colors"
          >
            View Site ↗
          </a>
        </div>
      </div>
    </div>
  );
}
