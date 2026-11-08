import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatTile } from "@/components/admin/StatTile";
import { EmptyState } from "@/components/admin/EmptyState";
import { buttonVariants } from "@/components/admin/Button";

export const dynamic = "force-dynamic";

async function getStats() {
  try {
    const [
      projectCount,
      featuredCount,
      careerCount,
      galleryCount,
      socialCount,
      profileCount,
    ] = await Promise.all([
      prisma.project.count(),
      prisma.project.count({ where: { isFeatured: true } }),
      prisma.careerEntry.count(),
      prisma.galleryItem.count(),
      prisma.socialLink.count(),
      prisma.profile.count(),
    ]);
    return {
      projectCount,
      featuredCount,
      careerCount,
      galleryCount,
      socialCount,
      profileCount,
    };
  } catch (error) {
    console.error("Failed to load dashboard stats", error);
    return null;
  }
}

export default async function AdminDashboard() {
  const stats = await getStats();

  const tiles = stats
    ? [
        { label: "Total Projects", value: stats.projectCount, href: "/admin/projects" },
        { label: "Featured Projects", value: stats.featuredCount, href: "/admin/projects" },
        { label: "Career Entries", value: stats.careerCount, href: "/admin/career" },
        { label: "Gallery photos", value: stats.galleryCount, href: "/admin/gallery" },
        { label: "Social links", value: stats.socialCount, href: "/admin/settings" },
        {
          label: "Profile",
          value: stats.profileCount > 0 ? "Set" : "Empty",
          href: "/admin/about",
        },
      ]
    : null;

  return (
    <div>
      <PageHeader
        eyebrow="01 / Dashboard"
        title="Dashboard"
        description="Overview of your portfolio content."
      />

      {tiles ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tiles.map((tile, i) => (
            <StatTile
              key={tile.label}
              label={tile.label}
              value={tile.value}
              href={tile.href}
              index={i + 1}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="Could not load stats"
          description="Check the database connection and refresh."
        />
      )}

      <section className="mt-10">
        <h2 className="font-mono text-xs uppercase tracking-widest text-white/50 mb-4">
          Quick actions
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/projects/new"
            className={buttonVariants({ variant: "primary", size: "md" })}
          >
            + New project
          </Link>
          <Link
            href="/admin/career"
            className={buttonVariants({ variant: "secondary", size: "md" })}
          >
            + New career entry
          </Link>
          <Link
            href="/admin/gallery"
            className={buttonVariants({ variant: "secondary", size: "md" })}
          >
            + Add photo
          </Link>
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ variant: "ghost", size: "md" })}
          >
            View site ↗
          </Link>
        </div>
      </section>
    </div>
  );
}
