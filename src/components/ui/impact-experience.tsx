"use client"

import React from "react"
import { ArrowUpRight, Sparkles, ExternalLink, Github } from "lucide-react"
import { cn } from "@/lib/utils"

export interface ExperienceItemProps {
  index: string
  className?: string
  company: string
  tagline: string
  period: string
  position: string
  location: string
  industry: string
  website?: string
  github?: string
  tags?: string[]
  image?: string
  description: string[]
  badge?: string
}

const DEFAULT_IMAGES: Record<string, string> = {
  "1": "https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=1200&auto=format&fit=crop",
  "2": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop",
  "3": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop",
}

export const ExperienceItem: React.FC<ExperienceItemProps> = ({
  index,
  className,
  company,
  tagline,
  period,
  position,
  location,
  industry,
  website,
  github,
  tags,
  image,
  description,
  badge = "Company",
}) => {
  const bgImage = image || DEFAULT_IMAGES[index]

  return (
    <div className={cn("relative group transition-all duration-300", className)}>
      {/* Atmospheric Hover Reveal Image & Gradient Mesh */}
      {bgImage && (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none rounded-xl">
          <img
            src={bgImage}
            alt={`${company} preview`}
            className="w-full h-full object-cover opacity-0 group-hover:opacity-30 scale-100 group-hover:scale-105 transition-all duration-700 ease-out"
          />
          {/* Plum Noir dual gradient to guarantee crisp legibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0E0717]/95 via-[#170C28]/90 to-[#0E0717]/85 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
      )}

      <div
        className={cn(
          "grid grid-cols-1 md:grid-cols-12 gap-8 py-10 md:py-14 px-6 md:px-10 z-10 relative w-full",
          "rounded-xl border border-white/10 bg-[#170C28]/60 backdrop-blur-xs group-hover:bg-[#170C28]/85 group-hover:border-[#F4EFE7]/25 transition-all duration-300"
        )}
      >
        {/* Left Column: Company / Project Identity */}
        <div className="md:col-span-4 lg:col-span-3 space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#F4EFE7]/70 group-hover:text-[#F4EFE7] transition-colors">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F4EFE7]/80" />
            <span>0{index} / {badge}</span>
          </div>

          <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white group-hover:text-[#F4EFE7] transition-colors duration-300 leading-tight">
            {company}
          </h3>

          <div className="space-y-1.5">
            <p className="text-sm text-zinc-400 group-hover:text-zinc-200 font-medium transition-colors">
              {tagline}
            </p>
            <p className="text-xs sm:text-sm text-[#F4EFE7]/85 font-mono tabular-nums">
              {period}
            </p>
          </div>

          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 text-[11px] font-mono font-medium bg-white/5 border border-white/10 text-zinc-300 rounded group-hover:border-[#F4EFE7]/20 transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Middle Column: Metadata Grid */}
        <div className="md:col-span-4 space-y-4 relative z-10">
          <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm">
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 group-hover:text-zinc-300">
              Position
            </span>
            <span className="font-semibold text-white group-hover:text-[#F4EFE7] transition-colors">
              {position}
            </span>

            <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 group-hover:text-zinc-300">
              Location
            </span>
            <span className="font-semibold text-white group-hover:text-[#F4EFE7] transition-colors">
              {location}
            </span>

            <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 group-hover:text-zinc-300">
              Industry
            </span>
            <span className="font-semibold text-white group-hover:text-[#F4EFE7] transition-colors">
              {industry}
            </span>

            {website && (
              <>
                <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 group-hover:text-zinc-300">
                  Website
                </span>
                <a
                  href={website.startsWith("http") ? website : `https://${website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[#F4EFE7] hover:text-white border-b border-[#F4EFE7]/40 hover:border-white w-fit inline-flex items-center gap-1 transition-colors"
                >
                  {website.replace(/^https?:\/\//, "")} <ArrowUpRight className="w-3.5 h-3.5 text-xs" />
                </a>
              </>
            )}

            {github && (
              <>
                <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 group-hover:text-zinc-300">
                  Source
                </span>
                <a
                  href={github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-zinc-300 hover:text-white border-b border-zinc-600 hover:border-white w-fit inline-flex items-center gap-1 transition-colors"
                >
                  <Github className="w-3.5 h-3.5 text-xs" /> GitHub <ExternalLink className="w-3 h-3 text-xs" />
                </a>
              </>
            )}
          </div>
        </div>

        {/* Right Column: Descriptions */}
        <div className="md:col-span-4 lg:col-span-5 space-y-4 relative z-10 flex flex-col justify-between">
          <div className="space-y-3">
            {description.map((para, i) => (
              <p
                key={i}
                className="text-sm md:text-base leading-relaxed text-zinc-300 group-hover:text-zinc-100 transition-colors text-pretty"
              >
                {para}
              </p>
            ))}
          </div>

          {(website || github) && (
            <div className="pt-2 flex items-center gap-3">
              {website && (
                <a
                  href={website.startsWith("http") ? website : `https://${website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium bg-[#F4EFE7] text-[#120820] hover:bg-white transition-colors"
                >
                  <span>Visit Platform</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              )}
              {github && (
                <a
                  href={github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium border border-white/20 text-zinc-200 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>Repository</span>
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export interface ImpactExperienceProps {
  className?: string
  containerClassName?: string
  title?: string
  badge?: string
  subtitle?: string
  items?: ExperienceItemProps[]
  hideHeader?: boolean
}

const DEFAULT_ITEMS: ExperienceItemProps[] = [
  {
    index: "1",
    company: "Northline",
    tagline: "Building modern financial tools",
    period: "2022 — Present",
    position: "Frontend Engineer",
    location: "Remote",
    industry: "Fintech",
    website: "www.northline.co",
    description: [
      "I focus on crafting clean, scalable interfaces for a consumer-facing web platform, translating product requirements into intuitive and accessible user experiences.",
      "My work involves building reusable UI components, improving design consistency, and collaborating with cross-functional teams to ship features efficiently while maintaining a high visual and technical standard.",
    ],
  },
  {
    index: "2",
    company: "Habitatly",
    tagline: "Simplifying property exploration",
    period: "2020 — 2021",
    position: "Frontend Developer",
    location: "Berlin, Germany",
    industry: "Real Estate Technology",
    description: [
      "I contributed to the development of a property discovery application, working across key user flows such as onboarding, search, and detailed listing views.",
      "Beyond feature development, I helped refine UI patterns and improve performance across devices, ensuring a smooth and responsive experience for everyday users.",
    ],
  },
  {
    index: "3",
    company: "Brightstack",
    tagline: "Tools for growing digital products",
    period: "2021 — 2023",
    position: "UI Engineer",
    location: "Remote",
    industry: "SaaS",
    website: "www.brightstack.app",
    description: [
      "I worked on building and refining user interfaces for a web-based product used by small teams to manage workflows and internal tools.",
      "My responsibilities included developing reusable components, improving layout responsiveness, and collaborating with product and design to ship features that balanced usability with visual clarity.",
    ],
  },
]

export const ImpactExperience: React.FC<ImpactExperienceProps> = ({
  className,
  containerClassName,
  title = "EXPERIENCE",
  badge = "CAREER & CONTRIBUTIONS",
  subtitle = "Interactive timeline • Hover rows to unveil contextual previews",
  items = DEFAULT_ITEMS,
  hideHeader = false,
}) => {
  return (
    <section className={cn("bg-[#0E0717] py-12 sm:py-16 px-4 sm:px-6 lg:px-8", className)}>
      <div className={cn("max-w-7xl mx-auto space-y-4", containerClassName)}>
        {/* Section Header */}
        {!hideHeader && (
          <div className="px-6 md:px-10 py-8 md:py-10 bg-[#170C28]/80 border border-white/10 rounded-2xl flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F4EFE7]/10 border border-[#F4EFE7]/20 text-xs font-mono font-medium text-[#F4EFE7] mb-3">
                <Sparkles className="w-3.5 h-3.5 text-[#F4EFE7]" />
                <span>{badge}</span>
              </div>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white">
                {title}
              </h2>
            </div>
            {subtitle && (
              <p className="text-xs sm:text-sm font-mono text-zinc-400">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Experience Items List */}
        <div className="space-y-4">
          {items.map((item) => (
            <ExperienceItem key={item.index} {...item} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default ImpactExperience
