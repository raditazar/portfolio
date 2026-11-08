import { z } from "zod";

const isHttpUrl = (v: string) => {
  try {
    const u = new URL(v);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
};

const emptyToNull = (v: unknown) =>
  typeof v === "string" && v.trim() === "" ? null : v;

const text = (max = 300) => z.string().trim().min(1, "Required").max(max, `Max ${max} characters`);
const optText = (max = 2000) => z.string().trim().max(max, `Max ${max} characters`);

/** http(s) URL or site-relative path (e.g. /images/hero.png). */
const urlOrPath = z
  .string()
  .trim()
  .refine((v) => v.startsWith("/") || isHttpUrl(v), "Must be an http(s) URL or a /path");

/** Optional http(s) URL; empty string becomes null. */
const optUrl = z.preprocess(
  emptyToNull,
  z
    .string()
    .trim()
    .refine(isHttpUrl, "Must start with http:// or https://")
    .nullable()
    .optional()
);

/** Optional URL or /path (e.g. CV pdf); empty string becomes null. */
const optUrlOrPath = z.preprocess(emptyToNull, urlOrPath.nullable().optional());

const socialUrl = z
  .string()
  .trim()
  .min(1, "Required")
  .refine(
    (v) =>
      isHttpUrl(v) ||
      /^mailto:.+@.+/i.test(v) ||
      /^tel:\+?[\d\s-]+$/i.test(v) ||
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
    "Must be an http(s) URL, mailto: link or email address"
  );

const order = z.coerce.number().int().min(0).max(10_000);

/* ---------- Profile ---------- */
export const profileSchema = z.object({
  name: text(120),
  title: text(120),
  location: text(120),
  bio: text(600),
  bio2: optText(1500),
  heroHeadlineTop: text(40),
  heroHeadlineBottom: text(40),
  heroTagline: optText(500),
  heroFocusTitle: optText(120),
  heroFocusSince: optText(60),
  heroImage: urlOrPath,
  exploringTitle: optText(160),
  exploringDescription: optText(1000),
  exploringProgress: z.coerce.number().int().min(0).max(100),
  statYears: optText(20),
  statProjects: optText(20),
  statTechnologies: optText(20),
  technologies: z.array(z.string().trim().min(1).max(60)).max(40),
  cvUrl: optUrlOrPath,
});
export const profileUpdateSchema = profileSchema.partial();

/* ---------- Social links ---------- */
export const socialSchema = z.object({
  label: text(60),
  kind: z.enum(["github", "linkedin", "instagram", "email", "x", "other"]).default("other"),
  url: socialUrl,
  showInNavbar: z.boolean().default(true),
  showInHero: z.boolean().default(true),
  showInFooter: z.boolean().default(true),
  order: order.default(0),
});
export const socialUpdateSchema = socialSchema.partial();

/* ---------- Gallery ---------- */
export const gallerySchema = z.object({
  src: urlOrPath,
  alt: text(200),
  title: text(120),
  caption: optText(300).default(""),
  order: order.default(0),
});
export const galleryUpdateSchema = gallerySchema.partial();

/* ---------- Bulk reorder (socials / gallery) ---------- */
export const reorderSchema = z.object({
  items: z.array(z.object({ id: z.string().min(1), order })).min(1).max(200),
});

/* ---------- Projects ---------- */
export const projectSchema = z.object({
  title: text(160),
  description: text(1500),
  category: text(80),
  categoryColor: text(60).default("text-blue-400"),
  techStack: z.array(z.string().trim().min(1).max(60)).max(30).default([]),
  imageSrc: urlOrPath,
  imageAlt: text(200),
  liveUrl: optUrl,
  githubUrl: optUrl,
  caseStudyUrl: optUrl,
  isFeatured: z.boolean().default(false),
  order: order.default(0),
});
export const projectUpdateSchema = projectSchema.partial();

/* ---------- Career ---------- */
export const careerSchema = z.object({
  type: z.enum(["work", "education"]),
  title: text(160),
  organization: text(160),
  description: z.preprocess(emptyToNull, optText(1500).nullable().optional()),
  startDate: text(40),
  endDate: z.preprocess(emptyToNull, z.string().trim().max(40).nullable().optional()),
  isCurrent: z.boolean().default(false),
  order: order.default(0),
});
export const careerUpdateSchema = careerSchema.partial();
