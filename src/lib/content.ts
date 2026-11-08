/**
 * Server-side content getters for the public site.
 * Every getter falls back to `content-defaults` when the DB is unreachable or empty,
 * so public pages always render.
 */
import prisma from "@/lib/prisma";
import {
  DEFAULT_CAREER,
  DEFAULT_GALLERY,
  DEFAULT_PROFILE,
  DEFAULT_PROJECTS,
  DEFAULT_SOCIALS,
  type CareerData,
  type GalleryData,
  type ProfileData,
  type ProjectData,
  type SiteData,
  type SocialData,
} from "@/lib/content-defaults";

export async function getProfile(): Promise<ProfileData> {
  try {
    const row = await prisma.profile.findUnique({ where: { id: "main" } });
    if (!row) return DEFAULT_PROFILE;
    const { id: _id, updatedAt: _updatedAt, ...profile } = row;
    void _id;
    void _updatedAt;
    return profile;
  } catch {
    return DEFAULT_PROFILE;
  }
}

export async function getSocials(): Promise<SocialData[]> {
  try {
    const rows = await prisma.socialLink.findMany({ orderBy: { order: "asc" } });
    // An intentionally emptied table is respected only once a Profile row exists.
    if (rows.length === 0) {
      const hasProfile = await prisma.profile.count();
      return hasProfile > 0 ? [] : DEFAULT_SOCIALS;
    }
    return rows.map(({ createdAt: _c, updatedAt: _u, ...rest }) => {
      void _c;
      void _u;
      return rest;
    });
  } catch {
    return DEFAULT_SOCIALS;
  }
}

export async function getSiteData(): Promise<SiteData> {
  const [profile, socials] = await Promise.all([getProfile(), getSocials()]);
  return { profile, socials };
}

export async function getGallery(): Promise<GalleryData[]> {
  try {
    const rows = await prisma.galleryItem.findMany({ orderBy: { order: "asc" } });
    if (rows.length === 0) {
      const hasProfile = await prisma.profile.count();
      return hasProfile > 0 ? [] : DEFAULT_GALLERY;
    }
    return rows.map(({ createdAt: _c, updatedAt: _u, ...rest }) => {
      void _c;
      void _u;
      return rest;
    });
  } catch {
    return DEFAULT_GALLERY;
  }
}

export async function getProjects(): Promise<ProjectData[]> {
  try {
    return await prisma.project.findMany({ orderBy: { order: "asc" } });
  } catch {
    return DEFAULT_PROJECTS;
  }
}

export async function getFeaturedProjects(
  take = 4
): Promise<{ projects: ProjectData[]; totalProjectCount: number }> {
  try {
    const [projects, totalProjectCount] = await Promise.all([
      prisma.project.findMany({
        where: { isFeatured: true },
        orderBy: { order: "asc" },
        take,
      }),
      prisma.project.count(),
    ]);
    return { projects, totalProjectCount };
  } catch {
    return {
      projects: DEFAULT_PROJECTS.filter((p) => p.isFeatured).slice(0, take),
      totalProjectCount: DEFAULT_PROJECTS.length,
    };
  }
}

export async function getCareer(): Promise<CareerData[]> {
  try {
    return await prisma.careerEntry.findMany({ orderBy: { order: "asc" } });
  } catch {
    return DEFAULT_CAREER;
  }
}
