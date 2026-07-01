"use client";

import { AnimatePresence, motion } from "motion/react";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
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
const curveVariants = {
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
      ease: [0.76, 0, 0.24, 1]
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
      ease: [0.76, 0, 0.24, 1]
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
            className="group relative block h-8 w-32 overflow-hidden"
          >
            {/* Logo Image - slides left and fades out */}
            <div className="absolute inset-0 flex items-center transition-all duration-300 ease-out transform group-hover:translate-x-[-100%] group-hover:opacity-0">
              <Image
                src="/assets/logo_only.png"
                alt="Logo"
                width={32}
                height={32}
                className="object-contain filter invert"
              />
            </div>
            {/* Logo Text "raditazar" - slides in from the right and fades in */}
            <div className="absolute inset-0 flex items-center transition-all duration-300 ease-out transform translate-x-[100%] opacity-0 group-hover:translate-x-0 group-hover:opacity-100">
              <span className="font-serif text-lg font-bold tracking-tight text-white lowercase">
                raditazar
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="flex items-center gap-8">
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
        {isScrolled && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
            onClick={() => setIsOpen(!isOpen)}
            className="fixed right-6 top-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-50 shadow-lg transition-transform duration-300 hover:scale-105 sm:right-8 lg:right-16 cursor-pointer"
            aria-label="Toggle Menu"
          >
            <div className="flex flex-col gap-1.5 justify-center items-center">
              <span className={`h-[2px] w-6 bg-zinc-950 transition-transform duration-300 ${isOpen ? "rotate-45 translate-y-[8px]" : ""}`} />
              <span className={`h-[2px] w-6 bg-zinc-950 transition-opacity duration-300 ${isOpen ? "opacity-0" : ""}`} />
              <span className={`h-[2px] w-6 bg-zinc-950 transition-transform duration-300 ${isOpen ? "-rotate-45 -translate-y-[8px]" : ""}`} />
            </div>
          </motion.button>
        )}
      </AnimatePresence>

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
            <div className="fixed right-0 top-0 z-40 h-screen w-[88vw] sm:w-[50vw] md:w-[33vw] min-w-[320px] max-w-[480px]">
              
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
                className="relative z-20 flex h-full w-full flex-col p-12 text-[#120820] justify-between"
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
                    const isActive = pathname === item.href;
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
