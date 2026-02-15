import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import "./globals.css";

const plus_jakarta_sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plus-jakarta-sans",
});

export const metadata: Metadata = {
  title: "Raditazar | Portfolio",
  description: "Portfolio of Raditazar - Front-End Developer & AI Enthusiast",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={plus_jakarta_sans.className}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
