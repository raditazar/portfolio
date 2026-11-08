/**
 * Single source of truth for public-site content types and fallback data.
 * Safe to import from client components (no Prisma / server imports).
 * Fallbacks are used when the database is unreachable or a row does not exist yet.
 */

export interface ProfileData {
  name: string;
  title: string;
  location: string;
  bio: string;
  bio2: string;
  heroHeadlineTop: string;
  heroHeadlineBottom: string;
  heroTagline: string;
  heroFocusTitle: string;
  heroFocusSince: string;
  heroImage: string;
  exploringTitle: string;
  exploringDescription: string;
  exploringProgress: number;
  statYears: string;
  statProjects: string;
  statTechnologies: string;
  technologies: string[];
  cvUrl: string | null;
}

export type SocialKind = "github" | "linkedin" | "instagram" | "email" | "x" | "other";

export interface SocialData {
  id: string;
  label: string;
  kind: SocialKind | string;
  url: string;
  showInNavbar: boolean;
  showInHero: boolean;
  showInFooter: boolean;
  order: number;
}

export interface GalleryData {
  id: string;
  src: string;
  alt: string;
  title: string;
  caption: string;
  order: number;
}

export interface ProjectData {
  id: string;
  title: string;
  description: string;
  category: string;
  categoryColor: string;
  techStack: string[];
  imageSrc: string;
  imageAlt: string;
  liveUrl: string | null;
  githubUrl: string | null;
  caseStudyUrl: string | null;
  isFeatured: boolean;
  order: number;
}

export interface CareerData {
  id: string;
  type: string;
  title: string;
  organization: string;
  description: string | null;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  order: number;
}

export interface SiteData {
  profile: ProfileData;
  socials: SocialData[];
}

export const DEFAULT_PROFILE: ProfileData = {
  name: "Raditya Azhar Ananta",
  title: "Data & Backend Integration",
  location: "Yogyakarta",
  bio: "An Information Engineering student at Universitas Gadjah Mada focused on data and backend integration.",
  bio2: "I like building the connections between raw data and the products that rely on it, and making them dependable. I also bring product and leadership experience as a Product Manager and a student association chairperson.",
  heroHeadlineTop: "Quietly",
  heroHeadlineBottom: "Connecting",
  heroTagline:
    "Connecting raw data to the products and people that rely on it, with a focus on clarity and systems that hold up.",
  heroFocusTitle: "Data & backend integration",
  heroFocusSince: "since 2024.",
  heroImage: "/images/hero.png",
  exploringTitle: "Data Engineering & Cloud Computing",
  exploringDescription:
    "Semester 5 coursework alongside hackathon builds, learning how data moves from its source to the product that uses it.",
  exploringProgress: 66,
  statYears: "2+",
  statProjects: "10+",
  statTechnologies: "10+",
  technologies: [
    "Python",
    "TypeScript",
    "Golang",
    "PostgreSQL",
    "FastAPI",
    "Hono",
    "MCP",
    "Next.js",
    "Prisma",
    "Docker",
  ],
  cvUrl: null,
};

export const DEFAULT_SOCIALS: SocialData[] = [
  {
    id: "default-github",
    label: "GitHub",
    kind: "github",
    url: "https://github.com/raditazar",
    showInNavbar: true,
    showInHero: true,
    showInFooter: true,
    order: 1,
  },
  {
    id: "default-linkedin",
    label: "LinkedIn",
    kind: "linkedin",
    url: "https://www.linkedin.com/in/raditya-azhar-ananta",
    showInNavbar: true,
    showInHero: true,
    showInFooter: true,
    order: 2,
  },
  {
    id: "default-email",
    label: "Email",
    kind: "email",
    url: "radityaazhar@gmail.com",
    showInNavbar: true,
    showInHero: true,
    showInFooter: true,
    order: 3,
  },
  {
    id: "default-instagram",
    label: "Instagram",
    kind: "instagram",
    url: "https://instagram.com/raditazar_",
    showInNavbar: false,
    showInHero: false,
    showInFooter: true,
    order: 4,
  },
];

export const DEFAULT_GALLERY: GalleryData[] = [
  { id: "g1", src: "/images/setup.webp", alt: "Coding setup in Yogyakarta", title: "Setup - Yogyakarta", caption: "Coding setup in Yogyakarta", order: 1 },
  { id: "g2", src: "/images/workshop.webp", alt: "Web3 Workshop & Bootcamp", title: "Web3 - Workshop", caption: "Web3 Workshop & Bootcamp", order: 2 },
  { id: "g3", src: "/images/team.webp", alt: "Team Discussion & Workflow", title: "Team - Sync", caption: "Team Discussion & Workflow", order: 3 },
  { id: "g4", src: "/images/coinfest.webp", alt: "Coinfest 2025 - Event", title: "Coinfest - 2025", caption: "Coinfest 2025 - Event", order: 4 },
  { id: "g5", src: "/images/public-speaking.webp", alt: "Public Speaking & Presentation", title: "Public Speaking", caption: "Public Speaking & Presentation", order: 5 },
];

export const DEFAULT_PROJECTS: ProjectData[] = [
  {
    id: "1",
    title: "Movo - Onchain Invoicing",
    description:
      "Traditional international payments are slow and opaque. Movo combines the speed of crypto with the accountability of fiat-linked ledgers.",
    category: "WEB3 / FINTECH",
    categoryColor: "text-green-400",
    techStack: ["Next.js", "Wagmi", "TypeScript", "Tailwind"],
    imageSrc: "/images/project-movo.png",
    imageAlt: "Movo App Interface",
    liveUrl: "https://movopay.vercel.app/",
    githubUrl: "https://github.com/Movo-Labs",
    caseStudyUrl: null,
    isFeatured: true,
    order: 1,
  },
  {
    id: "2",
    title: "FnB Inventory & Production",
    description:
      "Manual kitchen management led to mistracking and waste. A seamless inventory tracking system.",
    category: "UX / PRODUCT MGMT",
    categoryColor: "text-blue-400",
    techStack: ["React Native", "Golang", "Next.js", "Figma"],
    imageSrc: "/images/project-fnb.png",
    imageAlt: "FnB Wireframe",
    liveUrl: null,
    githubUrl: null,
    caseStudyUrl: null,
    isFeatured: true,
    order: 2,
  },
];

export const DEFAULT_CAREER: CareerData[] = [
  {
    id: "c-edu",
    type: "education",
    title: "Information Engineering",
    organization: "Universitas Gadjah Mada",
    description: "Focus on web development and machine learning.",
    startDate: "2022",
    endDate: null,
    isCurrent: true,
    order: 1,
  },
  {
    id: "c-work",
    type: "work",
    title: "Frontend Developer",
    organization: "Freelance",
    description:
      "Building modern web applications with Next.js, React, and TypeScript.",
    startDate: "2023",
    endDate: null,
    isCurrent: true,
    order: 2,
  },
];

export const DEFAULT_SITE: SiteData = {
  profile: DEFAULT_PROFILE,
  socials: DEFAULT_SOCIALS,
};

/** "radit@x.com" -> "mailto:radit@x.com"; urls and existing mailto: are returned unchanged. */
export function socialHref(social: Pick<SocialData, "kind" | "url">): string {
  const url = social.url.trim();
  if (/^(https?:|mailto:|tel:|\/|#)/i.test(url)) return url;
  if (social.kind === "email" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(url)) {
    return `mailto:${url}`;
  }
  return `https://${url}`;
}

/** Lower-case the first character so the bio reads naturally after "I'm {name}, ". */
export function lowerFirst(text: string): string {
  return text ? text.charAt(0).toLowerCase() + text.slice(1) : text;
}
