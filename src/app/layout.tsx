import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { TransitionProvider } from "@/components/PageTransition";

const plus_jakarta_sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plus-jakarta-sans",
});

export const metadata: Metadata = {
  title: "Raditazar | Portfolio",
  description: "Portfolio of Raditazar - Front-End Developer & AI Enthusiast",
  icons: {
    icon: "/assets/logo_only.png",
    apple: "/assets/logo_only.png",
  },
};

const extensionAttributeCleanup = `
(() => {
  const patterns = [/^bis_/, /^__processed_/];
  const clean = (node) => {
    if (node.nodeType !== 1) return;
    for (const attr of Array.from(node.attributes)) {
      if (patterns.some((pattern) => pattern.test(attr.name))) {
        node.removeAttribute(attr.name);
      }
    }
  };
  const cleanTree = (root) => {
    clean(root);
    for (const el of root.querySelectorAll?.("*") || []) clean(el);
  };
  cleanTree(document.documentElement);
  const observer = new MutationObserver((records) => {
    for (const record of records) {
      if (record.type === "attributes") clean(record.target);
      for (const node of record.addedNodes) {
        if (node.nodeType === 1) cleanTree(node);
      }
    }
  });
  observer.observe(document.documentElement, {
    attributes: true,
    childList: true,
    subtree: true,
  });
  window.addEventListener("load", () => {
    cleanTree(document.documentElement);
    window.setTimeout(() => observer.disconnect(), 1000);
  }, { once: true });
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={plus_jakarta_sans.className}
        suppressHydrationWarning
      >
        <script dangerouslySetInnerHTML={{ __html: extensionAttributeCleanup }} />
        <TransitionProvider>
          {children}
        </TransitionProvider>
      </body>
    </html>
  );
}
