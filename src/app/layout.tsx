import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plus_jakarta_sans =  Plus_Jakarta_Sans({subsets: ["latin"], weight: ["400", "700"], variable: "--font-plus-jakarta-sans"});

export const metadata: Metadata = {
  title: "Raditazar | Portfolio",
  description: "Porfolio of Raditazar - Front-End Developer & AI Enthusiast",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={plus_jakarta_sans.className}
      >
        {children}
      </body>
    </html>
  );
}
