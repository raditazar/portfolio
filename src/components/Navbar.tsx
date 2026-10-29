"use client";

import { AnimatePresence, motion, type Variants } from "motion/react";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePageTransition } from "./PageTransition";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Work", href: "/projects" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "#contact" },
];

const socialLinks = [
  { label: "GitHub", href: "https://github.com/raditazar" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/raditya-azhar-ananta" },
  { label: "Email", href: "mailto:raditazar@example.com" },
];

// SVG Liquid panel variants (100x100 relative viewbox)
const curveEase: [number, number, number, number] = [0.76, 0, 0.24, 1];

const curveVariants: Variants = {
  initial: {
    d: "M 100,0 C 100,0 100,50 100,100 L 100,100 L 100,0 Z",
  },
  enter: {
    d: [
      "M 100,0 C 100,0 100,50 100,100 L 100,100 L 100,0 Z",
      "M 100,0 C 30,10 30,90 100,100 L 100,100 L 100,0 Z",
      "M 0,0 C 0,0 0,100 0,100 L 100,100 L 100,0 Z"
    ],
    transition: {
      times: [0, 0.45, 1],
      duration: 0.95,
      ease: curveEase
    }
  },
  exit: {
    d: [
      "M 0,0 C 0,0 0,100 0,100 L 100,100 L 100,0 Z",
      "M 100,0 C 30,10 30,90 100,100 L 100,100 L 100,0 Z",
      "M 100,0 C 100,0 100,50 100,100 L 100,100 L 100,0 Z"
    ],
    transition: {
      times: [0, 0.45, 1],
      duration: 0.85,
      ease: curveEase
    }
  }
};

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const transition = usePageTransition();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleLinkClick = (e: React.MouseEvent, href: string, label: string) => {
    setIsOpen(false);
    if (href === pathname) {
      e.preventDefault();
      return;
    }
    if (href.startsWith("#")) {
      e.preventDefault();
      const element = document.getElementById(href.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else if (transition) {
      e.preventDefault();
      transition.startTransition(href, label);
    }
  };

  return (
    <>
      {/* Top Navbar */}
      <motion.nav
        initial={{ y: 0, opacity: 1 }}
        animate={{
          y: isScrolled ? -100 : 0,
          opacity: isScrolled ? 0 : 1,
        }}
        transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
        className="fixed left-0 top-0 z-[45] w-full px-6 py-6 sm:px-12 lg:px-16"
      >
        <div className="mx-auto flex max-w-8xl items-center justify-between">
          
          {/* Logo Side-Mask Reveal */}
          <Link 
            href="/" 
            onClick={(e) => handleLinkClick(e, "/", "home")}
            aria-label="Raditazar home"
            className="group relative flex h-10 items-center overflow-hidden select-none cursor-pointer"
          >
            {/* Brand Icon Anchor */}
            <span
              aria-hidden
              className="relative block h-8 w-8 shrink-0 bg-white transition-transform duration-[450ms] ease-[cubic-bezier(0.7,0,0.2,1)] [mask-image:url('/assets/logo_only.png')] [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain] group-hover:scale-105"
            />
            {/* Revealable Wordmark Mask */}
            <span className="flex items-center overflow-hidden max-w-0 opacity-0 -translate-x-2 transition-all duration-[450ms] ease-[cubic-bezier(0.7,0,0.2,1)] group-hover:max-w-36 group-hover:opacity-100 group-hover:translate-x-0 group-hover:pl-2.5">
              <span className="whitespace-nowrap font-serif text-lg font-bold tracking-tight text-white lowercase">
                raditazar
              </span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden items-center gap-8 md:flex">
            {navItems.filter(item => item.label !== "Home").map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={(e) => handleLinkClick(e, item.href, item.label)}
                className="relative text-xs font-bold uppercase tracking-[0.2em] text-white/78 transition-colors hover:text-white group"
              >
                {item.label}
                <span className="absolute bottom-[-4px] left-0 h-[1.5px] w-0 bg-white transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>

        </div>
      </motion.nav>

      {/* Floating menu button - Desktop */}
      <AnimatePresence>
        {(isScrolled || isOpen) && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
            onClick={() => setIsOpen(!isOpen)}
            className="fixed right-6 top-6 z-50 hidden h-14 w-14 items-center justify-center rounded-full bg-[#170C28] border border-white/10 text-white shadow-xl transition-transform duration-300 hover:scale-105 sm:right-8 md:flex lg:right-16 cursor-pointer"
            aria-label="Toggle Menu"
            aria-expanded={isOpen}
          >
            <div className="flex flex-col gap-1.5 justify-center items-center">
              <span className={`h-[2px] w-5 bg-white transition-transform duration-300 ${isOpen ? "rotate-45 translate-y-[8px]" : ""}`} />
              <span className={`h-[2px] w-5 bg-white transition-opacity duration-300 ${isOpen ? "opacity-0" : ""}`} />
              <span className={`h-[2px] w-5 bg-white transition-transform duration-300 ${isOpen ? "-rotate-45 -translate-y-[8px]" : ""}`} />
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Floating menu button - Mobile */}
      <motion.button
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.35, ease: [0.76, 0, 0.24, 1] }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed right-5 top-5 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-[#170C28] border border-white/10 text-white shadow-xl transition-transform duration-300 active:scale-95 md:hidden cursor-pointer"
        aria-label="Toggle Menu"
        aria-expanded={isOpen}
      >
        <div className="flex flex-col gap-1.5 justify-center items-center">
          <span className={`h-[2px] w-5 bg-white transition-transform duration-300 ${isOpen ? "rotate-45 translate-y-[7px]" : ""}`} />
          <span className={`h-[2px] w-5 bg-white transition-opacity duration-300 ${isOpen ? "opacity-0" : ""}`} />
          <span className={`h-[2px] w-5 bg-white transition-transform duration-300 ${isOpen ? "-rotate-45 -translate-y-[7px]" : ""}`} />
        </div>
      </motion.button>

      {/* Sidebar Navigation */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            />

            {/* Sidebar liquid container */}
            <div className="fixed right-0 top-0 z-40 h-screen w-[88vw] min-w-0 max-w-[480px] sm:w-[50vw] md:w-[33vw]">
              
              {/* Animated Liquid Background SVG */}
              <svg className="absolute left-[-99px] top-0 h-full w-[calc(100%+100px)] fill-[#F4EFE7] pointer-events-none z-10" viewBox="0 0 100 100" preserveAspectRatio="none">
                <motion.path
                  variants={curveVariants}
                  initial="initial"
                  animate="enter"
                  exit="exit"
                />
              </svg>

              {/* Sidebar Content */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ 
                  opacity: 1, 
                  x: 0, 
                  transition: { delay: 0.35, duration: 0.5, ease: [0.76, 0, 0.24, 1] } 
                }}
                exit={{ 
                  opacity: 0, 
                  x: 20, 
                  transition: { duration: 0.3, ease: [0.76, 0, 0.24, 1] } 
                }}
                className="relative z-20 flex h-full w-full flex-col justify-between p-8 text-[#120820] sm:p-12"
              >
                
                {/* Header */}
                <div className="flex flex-col pt-16">
                  <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#120820]/60">
                    Navigation
                  </p>
                  <div className="mt-4 h-[1px] w-full bg-[#120820]/15" />
                </div>

                {/* Links */}
                <div className="flex flex-col gap-8 sm:gap-10 md:gap-12 my-auto">
                  {navItems.map((item, index) => {
                    return (
                      <motion.div
                        key={item.label}
                        initial={{ x: 60, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.45 + index * 0.05, duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
                      >
                        <Link
                          href={item.href}
                          onClick={(e) => handleLinkClick(e, item.href, item.label)}
                          className="group flex items-center text-4xl font-light tracking-tight transition-colors hover:text-[#120820]/60 md:text-5xl"
                        >
                          <span className="relative flex items-center">
                            {item.label}
                            <span className="absolute left-[-24px] h-2 w-2 rounded-full bg-[#120820] opacity-0 transition-all duration-300 group-hover:left-[-16px] group-hover:opacity-100" />
                          </span>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Footer Socials */}
                <div className="flex flex-col gap-4">
                  <div className="h-[1px] w-full bg-[#120820]/15" />
                  <div className="flex flex-col gap-2">
                    <p className="text-[9px] font-bold uppercase tracking-[0.24em] text-[#120820]/60">
                      Socials
                    </p>
                    <div className="flex flex-wrap gap-4 mt-1">
                      {socialLinks.map((link) => (
                        <Link
                          key={link.label}
                          href={link.href}
                          target={link.href.startsWith("http") ? "_blank" : undefined}
                          rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                          className="text-xs font-semibold uppercase tracking-wider text-[#120820]/80 hover:text-[#120820] transition-colors"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

              </motion.div>

            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
