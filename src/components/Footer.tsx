"use client";

import KilnWordmarkFooter, {
  KilnLink,
  KilnWordmarkFooterProps,
} from "@/components/ui/kiln-wordmark-footer";

export interface FooterProps extends Partial<KilnWordmarkFooterProps> {
  variant?: "dark-plum" | "linen-stone" | "linen-terracotta";
}

export default function Footer({
  brand = "Raditazar",
  wordmark = "raditazar",
  motto = ["Available for work", "Let's collaborate"],
  address = [
    "Raditya Azhar Ananta",
    "↳ Front-End Developer & AI",
    "Yogyakarta — Indonesia",
  ],
  navigation = [
    [
      { label: "Home", href: "/" },
      { label: "Work", href: "/#work" },
      { label: "Projects", href: "/projects" },
    ],
    [
      { label: "About", href: "/about" },
      { label: "Contact", href: "mailto:radityaazhar@gmail.com" },
    ],
  ],
  socials = [
    [
      {
        label: "LinkedIn",
        href: "https://www.linkedin.com/in/raditya-azhar-ananta",
      },
      { label: "GitHub", href: "https://github.com/raditazar" },
    ],
    [
      { label: "Instagram", href: "https://instagram.com/raditazar_" },
      { label: "Email", href: "mailto:radityaazhar@gmail.com" },
    ],
  ],
  year = new Date().getFullYear(),
  registry = "Crafted with Next.js, Tailwind CSS & Motion — Est. 2024",
  legal = [
    { label: "radityaazhar@gmail.com", href: "mailto:radityaazhar@gmail.com" },
    { label: "All Rights Reserved", href: "#" },
  ],
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
