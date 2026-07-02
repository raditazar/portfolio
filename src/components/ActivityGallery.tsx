"use client";

import { AnimatePresence, motion } from "motion/react";
import React, { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const activities = [
  {
    src: "/images/setup.webp",
    alt: "Coding setup in Yogyakarta",
    code: "Setup - Yogyakarta",
  },
  {
    src: "/images/workshop.webp",
    alt: "Web3 Workshop & Bootcamp",
    code: "Web3 - Workshop",
  },
  {
    src: "/images/team.webp",
    alt: "Team Discussion & Workflow",
    code: "Team - Sync",
  },
  {
    src: "/images/coinfest.webp",
    alt: "Coinfest 2025 - Event",
    code: "Coinfest - 2025",
  },
  {
    src: "/images/public-speaking.webp",
    alt: "Public Speaking & Presentation",
    code: "Public Speaking",
  }
];

export function ActivityGallery({ className }: { className?: string }) {
  const [activeImage, setActiveImage] = useState<number | null>(0);

  return (
    <div className={cn("w-full py-4", className)}>
      <div className="flex w-full items-center justify-start gap-2 overflow-x-auto pb-4 sm:justify-center">
        {activities.map((item, index) => {
          const isActive = activeImage === index;

          return (
            <motion.div
              key={index}
              className="relative cursor-pointer overflow-hidden rounded-3xl  bg-zinc-900/50"
              initial={{ width: "5rem", height: "32rem" }}
              animate={{
                width: isActive ? "32rem" : "5rem",
                height: "32rem",
              }}
              transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
              onClick={() => setActiveImage(index)}
              onHoverStart={() => setActiveImage(index)}
            >
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0 z-10 bg-linear-to-t from-black/80 via-black/20 to-transparent"
                  />
                )}
              </AnimatePresence>

              <AnimatePresence>
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    transition={{ duration: 0.25, delay: 0.1 }}
                    className="absolute bottom-0 left-0 z-20 flex w-full flex-col justify-end p-4"
                  >
                    <p className="text-xs font-semibold uppercase tracking-wider text-white/90">
                      {item.code}
                    </p>
                    <p className="line-clamp-1 text-[11px] text-zinc-400">
                      {item.alt}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(max-width: 768px) 100vw, 30vw"
                className={cn(
                  "object-cover transition-transform duration-500",
                  isActive ? "scale-105" : "scale-100 grayscale-30"
                )}
              />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

