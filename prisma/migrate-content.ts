/**
 * One-time, idempotent data migration: legacy AboutInfo / SiteSetting key-value rows
 * -> typed Profile / SocialLink / GalleryItem rows.
 *
 *   npx tsx prisma/migrate-content.ts          # apply
 *   npx tsx prisma/migrate-content.ts --dry    # print what would be written
 *
 * Safe to re-run: if a Profile row already exists nothing is written.
 * Legacy tables are NOT modified or dropped (do that in a later migration once verified).
 */
import { PrismaClient } from "@prisma/client";
import { ensureContentDefaults } from "./content-bootstrap";
import {
  DEFAULT_SOCIALS,
  type ProfileData,
  type SocialData,
} from "../src/lib/content-defaults";

const prisma = new PrismaClient();
const dry = process.argv.includes("--dry");

const pick = (map: Record<string, string>, ...keys: string[]) => {
  for (const k of keys) {
    const v = map[k]?.trim();
    if (v) return v;
  }
  return undefined;
};

async function main() {
  const [about, settings] = await Promise.all([
    prisma.aboutInfo.findMany(),
    prisma.siteSetting.findMany(),
  ]);
  const a = Object.fromEntries(about.map((r) => [r.key, r.value]));
  const s = Object.fromEntries(settings.map((r) => [r.key, r.value]));

  // Seeded keys (intro_*, stat_*, ...) win; the old admin-form keys (name, bio, ...) are the fallback.
  const profile: Partial<ProfileData> = {};
  const set = <K extends keyof ProfileData>(key: K, value: ProfileData[K] | undefined) => {
    if (value !== undefined) profile[key] = value;
  };
  set("name", pick(a, "intro_name", "name"));
  set("title", pick(a, "title"));
  set("location", pick(a, "intro_location", "location"));
  set("bio", pick(a, "intro_bio", "bio"));
  set("bio2", pick(a, "intro_bio_2"));
  set("exploringTitle", pick(a, "currently_exploring_title"));
  set("exploringDescription", pick(a, "currently_exploring_desc"));
  const progress = parseInt(pick(a, "currently_exploring_progress") ?? "", 10);
  if (!Number.isNaN(progress)) set("exploringProgress", Math.min(100, Math.max(0, progress)));
  set("statYears", pick(a, "stat_years", "yearsExperience"));
  set("statProjects", pick(a, "stat_projects", "projectsCompleted"));
  set("statTechnologies", pick(a, "stat_technologies", "techUsed"));
  const tech = pick(a, "technologies");
  if (tech) {
    set(
      "technologies",
      tech.split(",").map((t) => t.trim()).filter(Boolean)
    );
  }

  // Socials: legacy values override the default URL of the matching default entry.
  const legacyUrl: Record<string, string | undefined> = {
    github: pick(s, "github_url", "github"),
    linkedin: pick(s, "linkedin_url", "linkedin"),
    instagram: pick(s, "instagram_url", "instagram"),
    email: pick(s, "email"),
  };
  const socials: Omit<SocialData, "id">[] = DEFAULT_SOCIALS.map(({ id: _id, ...rest }) => {
    void _id;
    return { ...rest, url: legacyUrl[rest.kind] ?? rest.url };
  });
  const twitter = pick(s, "twitter");
  if (twitter) {
    socials.push({
      label: "X",
      kind: "x",
      url: twitter,
      showInNavbar: false,
      showInHero: false,
      showInFooter: true,
      order: socials.length + 1,
    });
  }
  const resume = pick(s, "resume");
  if (resume) profile.cvUrl = resume;

  if (dry) {
    console.log("DRY RUN - would create:");
    console.log(JSON.stringify({ profile, socials }, null, 2));
    return;
  }

  const result = await ensureContentDefaults(prisma, { profile, socials });
  console.log(result.created ? "Migration done." : "Nothing to do.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
