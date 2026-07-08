"use client";

import Image from "next/image";
import Link from "next/link";

const socialLinks = [
  { label: "GitHub", href: "https://github.com/raditazar" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/raditya-azhar-ananta" },
  { label: "Email", href: "mailto:raditazar@example.com" },
];

const heroImageSrc = "/images/hero.png?v=20260708-181859";

export default function Hero() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-[#120820] text-white">
      <Image
        key={heroImageSrc}
        src={heroImageSrc}
        alt="Raditya Azhar Ananta portrait"
        fill
        priority
        sizes="100vw"
        className="object-cover object-[58%_center] md:object-center"
      />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_68%_36%,transparent_0,rgba(18,8,32,0.08)_34%,rgba(18,8,32,0.72)_100%)]" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#120820]/90 via-[#120820]/28 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#120820]/95 via-[#120820]/30 to-transparent" />

        <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-8xl flex-col px-5 pb-8 pt-24 sm:px-8 sm:pb-12 lg:px-16">

        {/* Social links - hide on mobile */}
        <div className="absolute left-6 top-1/3 hidden gap-3 text-xl font-extrabold uppercase tracking-[0.2em] text-white/78 md:left-8 md:flex lg:left-16 lg:gap-12 lg:text-3xl">
          {socialLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="transition hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* ML focus text - desktop only */}
        <div className="absolute right-8 top-1/3 hidden max-w-xs text-right lg:right-16 lg:block">
          <p className="text-xl font-bold leading-5 text-white/90">
            Machine learning focus
          </p>
          <p className="mt-2 text-xs leading-5 text-white/65">
            since 2024.
          </p>
        </div>

        {/* Spacer to push content to bottom */}
        <div className="flex-1" />

        {/* Bottom content - responsive layout */}
        <div className="flex flex-col gap-6 sm:gap-8 md:flex-row md:items-end md:justify-start md:gap-12 lg:gap-16">

          {/* Deskripsi - pojok kiri bawah */}
          <div className="max-w-md lg:max-w-lg">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.28em] text-white/70 sm:text-[11px]">
              Front-End Developer · Yogyakarta
            </p>
            <p className="text-sm leading-6 text-white/72 sm:text-base sm:leading-7">
              Building ML-powered interfaces and on-chain applications with a
              focus on clarity, motion, and usable product systems.
            </p>
          </div>

          {/* Judul - kanan bawah (desktop), kiri (mobile) */}
          <div className="flex flex-col justify-start md:justify-between md:flex-1 lg:items-end">
            <div className="font-serif text-[clamp(3.2rem,12vw,12rem)] font-black -tracking-wide text-white drop-shadow-[0_24px_50px_rgba(0,0,0,0.4)] md:text-left">
               Quietly 
            </div>
            <h1 className="font-serif text-[clamp(3.2rem,12vw,12rem)] font-black leading-[0.78] -tracking-wide text-white drop-shadow-[0_24px_50px_rgba(0,0,0,0.4)] md:text-right">
                Building
            </h1>
            <div className="mt-6 flex flex-wrap gap-3 md:hidden">
              <Link
                href="#work"
                className="rounded-full bg-white px-5 py-3 text-xs font-bold uppercase tracking-[0.16em] text-[#120820] shadow-[0_12px_30px_rgba(0,0,0,0.25)]"
              >
                View work
              </Link>
              <Link
                href="#contact"
                className="rounded-full border border-white/35 px-5 py-3 text-xs font-bold uppercase tracking-[0.16em] text-white backdrop-blur-sm"
              >
                Contact
              </Link>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
