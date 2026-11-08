"use client";

import {
  DEFAULT_PROFILE,
  DEFAULT_SOCIALS,
  socialHref,
  type ProfileData,
  type SocialData,
} from "@/lib/content-defaults";
import KilnWordmarkFooter, {
  KilnLink,
  KilnWordmarkFooterProps,
} from "@/components/ui/kiln-wordmark-footer";

export interface FooterProps extends Partial<KilnWordmarkFooterProps> {
  variant?: "dark-plum" | "linen-stone" | "linen-terracotta";
  /** CMS content. Falls back to defaults when omitted. */
  profile?: ProfileData;
  socialLinks?: SocialData[];
}

export default function Footer({
  profile = DEFAULT_PROFILE,
  socialLinks = DEFAULT_SOCIALS,
  brand = "Raditazar",
  wordmark = "raditazar",
  motto = ["Available for work", "Let's collaborate"],
  address,
  navigation,
  socials,
  year = new Date().getFullYear(),
  registry = "Crafted with Next.js, Tailwind CSS & Motion — Est. 2024",
  legal,
  variant = "dark-plum",
  surface: customSurface,
  deep: customDeep,
  ink: customInk,
  paper: customPaper,
  weight = 1,
  lens = true,
  defaultTile = 0,
  className = "",
  ...rest
}: FooterProps) {
  const footerSocials = socialLinks.filter((s) => s.showInFooter);
  const email = socialLinks.find((s) => s.kind === "email");
  const emailHref = email ? socialHref(email) : undefined;
  const links: KilnLink[] = footerSocials.map((s) => ({
    label: s.label,
    href: socialHref(s),
  }));
  if (profile.cvUrl) links.push({ label: "CV", href: profile.cvUrl });
  // The footer template lays links out in columns of two.
  const socialColumns: KilnLink[][] = [];
  for (let i = 0; i < links.length; i += 2) socialColumns.push(links.slice(i, i + 2));

  address ??= [
    profile.name,
    `↳ ${profile.title}`,
    `${profile.location} — Indonesia`,
  ];
  navigation ??= [
    [
      { label: "Home", href: "/" },
      { label: "Work", href: "/#work" },
      { label: "Projects", href: "/projects" },
    ],
    [
      { label: "About", href: "/about" },
      ...(emailHref ? [{ label: "Contact", href: emailHref }] : []),
    ],
  ];
  socials ??= socialColumns;
  legal ??= [
    ...(email ? [{ label: email.url.replace(/^mailto:/i, ""), href: emailHref! }] : []),
    { label: "All Rights Reserved", href: "#" },
  ];

  // Palettes:
  // "dark-plum" (Default): Seamless obsidian plum canvas (#0E0717) matching the projects section,
  //                         with lifted velvet plum tile and warm linen typography.
  // "linen-stone": Warm Linen cream (#F4EFE7) with stone glaze tile.
  // "linen-terracotta": Warm Linen cream (#F4EFE7) with terracotta red glaze tile.
  const palettes = {
    "dark-plum": {
      deep: "#0E0717",
      surface: "#22123B",
      ink: "#F4EFE7",
      paper: "#0E0717",
    },
    "linen-stone": {
      deep: "#F4EFE7",
      surface: "#DECFC0",
      ink: "#120820",
      paper: "#F4EFE7",
    },
    "linen-terracotta": {
      deep: "#F4EFE7",
      surface: "#C42B1C",
      ink: "#120820",
      paper: "#F4EFE7",
    },
  };

  const selectedPalette = palettes[variant] || palettes["dark-plum"];
  const deep = customDeep ?? selectedPalette.deep;
  const surface = customSurface ?? selectedPalette.surface;
  const ink = customInk ?? selectedPalette.ink;
  const paper = customPaper ?? selectedPalette.paper;

  const handleBackToTop = () => {
    if (typeof window !== "undefined") {
      const lenis = window.__lenis;
      if (lenis) {
        lenis.scrollTo(0, { immediate: false });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  return (
    <div id="contact" className="relative w-full border-t border-white/10">
      <KilnWordmarkFooter
        brand={brand}
        wordmark={wordmark}
        motto={motto}
        address={address}
        navigationTitle="Navigation"
        navigation={navigation}
        followTitle="Connect"
        socials={socials}
        year={year}
        registry={registry}
        legal={legal}
        surface={surface}
        deep={deep}
        ink={ink}
        paper={paper}
        weight={weight}
        lens={lens}
        defaultTile={defaultTile}
        onBackToTop={rest.onBackToTop ?? handleBackToTop}
        className={className}
        {...rest}
      />
    </div>
  );
}
