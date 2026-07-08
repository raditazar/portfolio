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
// Starts from right (x=100), bulges out left, then straightens at x=0
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
          
          {/* Logo Replacement Hover Effect - Horizontal */}
          <Link 
            href="/" 
            onClick={(e) => handleLinkClick(e, "/", "home")}
            aria-label="Raditazar home"
            className="group relative flex h-10 w-36 items-center overflow-hidden"
          >
            <span
              aria-hidden
              className="absolute left-0 top-1/2 block h-8 w-8 -translate-y-1/2 bg-white transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] [mask-image:url('/assets/logo_only.png')] [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain] group-hover:-translate-x-2 group-hover:-translate-y-1/2 group-hover:scale-50 group-hover:rotate-[-10deg] group-hover:opacity-0"
            />
            <span className="absolute inset-0 flex items-center">
              <span
                aria-hidden
                className="mr-2 h-1.5 w-1.5 scale-0 rounded-full bg-[#e7ff5f] opacity-0 shadow-[0_0_18px_rgba(231,255,95,0.55)] transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:scale-100 group-hover:opacity-100"
              />
              <span className="inline-block max-w-0 overflow-hidden whitespace-nowrap font-serif text-lg font-bold tracking-tight text-white opacity-0 blur-sm transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:max-w-28 group-hover:opacity-100 group-hover:blur-0">
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
                className="relative text-xs font-bold uppercase tracking-[0.2em] text-white/70 transition-colors hover:text-white group"
              >
                {item.label}
                <span className="absolute bottom-[-4px] left-0 h-[1.5px] w-0 bg-white transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>

        </div>
      </motion.nav>

      {/* Floating menu button */}
      <AnimatePresence>
        {(isScrolled || isOpen) && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
            onClick={() => setIsOpen(!isOpen)}
            className="fixed right-6 top-6 z-50 hidden h-16 w-16 items-center justify-center rounded-full bg-zinc-50 shadow-lg transition-transform duration-300 hover:scale-105 sm:right-8 md:flex lg:right-16 cursor-pointer"
            aria-label="Toggle Menu"
            aria-expanded={isOpen}
          >
            <div className="flex flex-col gap-1.5 justify-center items-center">
              <span className={`h-[2px] w-6 bg-zinc-950 transition-transform duration-300 ${isOpen ? "rotate-45 translate-y-[8px]" : ""}`} />
              <span className={`h-[2px] w-6 bg-zinc-950 transition-opacity duration-300 ${isOpen ? "opacity-0" : ""}`} />
              <span className={`h-[2px] w-6 bg-zinc-950 transition-transform duration-300 ${isOpen ? "-rotate-45 -translate-y-[8px]" : ""}`} />
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      <motion.button
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.35, ease: [0.76, 0, 0.24, 1] }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed right-5 top-5 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-50 shadow-lg transition-transform duration-300 active:scale-95 md:hidden cursor-pointer"
        aria-label="Toggle Menu"
        aria-expanded={isOpen}
      >
        <div className="flex flex-col gap-1.5 justify-center items-center">
          <span className={`h-[2px] w-5 bg-zinc-950 transition-transform duration-300 ${isOpen ? "rotate-45 translate-y-[7px]" : ""}`} />
          <span className={`h-[2px] w-5 bg-zinc-950 transition-opacity duration-300 ${isOpen ? "opacity-0" : ""}`} />
          <span className={`h-[2px] w-5 bg-zinc-950 transition-transform duration-300 ${isOpen ? "-rotate-45 -translate-y-[7px]" : ""}`} />
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
              className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
            />

            {/* Sidebar liquid container */}
            <div className="fixed right-0 top-0 z-40 h-screen w-[88vw] min-w-0 max-w-[480px] sm:w-[50vw] md:w-[33vw]">
              
              {/* Animated Liquid Background SVG */}
              <svg className="absolute left-[-99px] top-0 h-full w-[calc(100%+100px)] fill-[#f5f4f3] pointer-events-none z-10" viewBox="0 0 100 100" preserveAspectRatio="none">
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
                  <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-zinc-500">
                    Navigation
                  </p>
                  <div className="mt-4 h-[1px] w-full bg-zinc-300" />
                </div>

                {/* Links */}
                <div className="flex flex-col gap-6 my-auto">
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
                          className="group flex items-center text-4xl font-light tracking-tight transition-colors hover:text-zinc-500 md:text-5xl"
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
                  <div className="h-[1px] w-full bg-zinc-300" />
                  <div className="flex flex-col gap-2">
                    <p className="text-[9px] font-bold uppercase tracking-[0.24em] text-zinc-500">
                      Socials
                    </p>
                    <div className="flex flex-wrap gap-4 mt-1">
                      {socialLinks.map((link) => (
                        <Link
                          key={link.label}
                          href={link.href}
                          target={link.href.startsWith("http") ? "_blank" : undefined}
                          rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                          className="text-xs font-semibold uppercase tracking-wider hover:text-zinc-500 transition-colors"
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
