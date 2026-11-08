import type { PrismaClient } from "@prisma/client";
import {
  DEFAULT_GALLERY,
  DEFAULT_PROFILE,
  DEFAULT_SOCIALS,
  type ProfileData,
  type SocialData,
} from "../src/lib/content-defaults";

export interface BootstrapOverrides {
  profile?: Partial<ProfileData>;
  socials?: Omit<SocialData, "id">[];
}

/**
 * Idempotent: creates the Profile / SocialLink / GalleryItem rows ONLY on a fresh install
 * (no Profile row yet). Once a Profile exists, nothing is touched, so admin edits - including
 * deliberately emptied social/gallery lists - are never overwritten.
 */
export async function ensureContentDefaults(
  prisma: PrismaClient,
  overrides: BootstrapOverrides = {}
) {
  const hadProfile = (await prisma.profile.count({ where: { id: "main" } })) > 0;
  if (hadProfile) {
    console.log("Profile already exists - leaving profile, socials and gallery untouched.");
    return { created: false };
  }

  await prisma.profile.create({
    data: { ...DEFAULT_PROFILE, ...overrides.profile, id: "main" },
  });

  if ((await prisma.socialLink.count()) === 0) {
    const socials = overrides.socials ?? DEFAULT_SOCIALS.map(({ id: _id, ...rest }) => {
      void _id;
      return rest;
    });
    await prisma.socialLink.createMany({ data: socials });
  }

  if ((await prisma.galleryItem.count()) === 0) {
    await prisma.galleryItem.createMany({
      data: DEFAULT_GALLERY.map(({ id: _id, ...rest }) => {
        void _id;
        return rest;
      }),
    });
  }

  console.log("Created Profile, SocialLink and GalleryItem rows.");
  return { created: true };
}
