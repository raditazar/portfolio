"use client"

import React, { useEffect, useRef } from "react"
import { ArrowUpRight, ExternalLink, Github } from "lucide-react"
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

const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")"

/** Breaks out of the page container so children span viewport edge to edge. */
export const FullBleed: React.FC<{
  className?: string
  children: React.ReactNode
}> = ({ className, children }) => (
  <div className={cn("relative left-1/2 w-screen -translate-x-1/2", className)}>
    {children}
  </div>
)

/**
 * Row wrapper with plum-ember gradient blobs that follow the cursor,
 * optional blended image and film grain. Active on hover (mouse) or when
 * the row crosses the viewport centre (touch devices).
 */
export const GradientHover: React.FC<{
  image?: string
  alt?: string
  className?: string
  children: React.ReactNode
}> = ({ image, alt = "", className, children }) => {
  const ref = useRef<HTMLDivElement>(null)
  const raf = useRef(0)

  useEffect(() => {
    const el = ref.current
    if (!el || typeof window === "undefined") return
    if (!window.matchMedia("(hover: none)").matches) return
    const io = new IntersectionObserver(
      ([entry]) => {
        el.dataset.active = entry.isIntersecting ? "true" : "false"
      },
      { rootMargin: "-45% 0px -45% 0px" }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => () => cancelAnimationFrame(raf.current), [])

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = e.clientX - r.left
    const y = e.clientY - r.top
    cancelAnimationFrame(raf.current)
    raf.current = requestAnimationFrame(() => {
      el.style.setProperty("--mx", `${x}px`)
      el.style.setProperty("--my", `${y}px`)
    })
  }

  return (
    <div
      ref={ref}
      data-active="false"
      onPointerEnter={(e) => {
        if (e.pointerType === "mouse" && ref.current) ref.current.dataset.active = "true"
      }}
      onPointerLeave={(e) => {
        if (e.pointerType === "mouse" && ref.current) ref.current.dataset.active = "false"
      }}
      onPointerMove={onMove}
      className={cn("group relative overflow-hidden", className)}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-700 ease-out group-data-[active=true]:opacity-100"
      >
        {image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={alt}
            className="absolute inset-0 h-full w-full scale-100 object-cover opacity-35 mix-blend-luminosity transition-transform duration-1000 ease-out group-data-[active=true]:scale-105 motion-reduce:transition-none"
          />
        )}
        <div className="absolute inset-0 bg-[#0E0717]/55" />
        <div
          className="absolute h-[70vh] w-[55vw] max-w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,#C0267F,transparent)] opacity-80 blur-3xl mix-blend-screen transition-[left,top] duration-500 ease-out motion-reduce:transition-none"
          style={{ left: "var(--mx, 35%)", top: "var(--my, 50%)" }}
        />
        <div
          className="absolute h-[55vh] w-[40vw] max-w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,#F59E0B,transparent)] opacity-60 blur-3xl mix-blend-screen transition-[left,top] duration-[900ms] ease-out motion-reduce:transition-none"
          style={{
            left: "calc(var(--mx, 35%) + 16vw)",
            top: "calc(var(--my, 50%) + 12vh)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.18] mix-blend-overlay"
          style={{ backgroundImage: GRAIN }}
        />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  )
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
  const href = (u: string) => (u.startsWith("http") ? u : `https://${u}`)

  const meta: [string, string][] = [
    ["Position", position],
    ["Location", location],
    ["Industry", industry],
  ]

  return (
    <GradientHover
      image={bgImage}
      alt={`${company} preview`}
      className={cn("border-b border-white/10", className)}
    >
      <div className="grid grid-cols-1 gap-x-10 gap-y-10 px-6 py-12 sm:px-12 md:grid-cols-12 md:py-20">
        {/* Identity — wide, oversized */}
        <div className="md:col-span-7">
          <div className="mb-4 flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-[#F4EFE7]/60">
            <span>{badge}</span>
            <span className="h-px w-10 bg-[#F4EFE7]/30" />
            <span className="tabular-nums">{period}</span>
          </div>

          <div className="flex items-start gap-4 md:gap-6">
            <span
              className="select-none text-[clamp(2.5rem,6vw,5.5rem)] font-extrabold leading-[0.9] tracking-tighter text-transparent transition-[-webkit-text-stroke-color] duration-500 [-webkit-text-stroke:1px_rgba(244,239,231,0.35)] group-data-[active=true]:[-webkit-text-stroke:1px_rgba(244,239,231,0.9)]"
              aria-hidden
            >
              {String(index).padStart(2, "0")}
            </span>
            <h3 className="text-[clamp(2.5rem,6vw,5.5rem)] font-extrabold uppercase leading-[0.9] tracking-tighter text-white transition-transform duration-500 ease-out group-data-[active=true]:translate-x-2 motion-reduce:transform-none">
              {company}
            </h3>
          </div>

          <p className="mt-6 max-w-xl text-lg font-semibold text-zinc-200 md:ml-[calc(clamp(2.5rem,6vw,5.5rem)*1.6)]">
            {tagline}
          </p>

          {tags && tags.length > 0 && (
            <p className="mt-4 max-w-xl font-mono text-xs uppercase tracking-wider text-zinc-400 md:ml-[calc(clamp(2.5rem,6vw,5.5rem)*1.6)]">
              {tags.join(" / ")}
            </p>
          )}
        </div>

        {/* Details — narrower, dropped lower for asymmetry */}
        <div className="space-y-8 md:col-span-5 md:pt-10">
          <dl className="grid grid-cols-[7rem_1fr] gap-y-3 text-sm">
            {meta.map(([k, v]) => (
              <React.Fragment key={k}>
                <dt className="font-mono text-xs uppercase tracking-wider text-zinc-400">{k}</dt>
                <dd className="text-base font-bold text-white">{v}</dd>
              </React.Fragment>
            ))}
            {website && (
              <>
                <dt className="font-mono text-xs uppercase tracking-wider text-zinc-400">Website</dt>
                <dd>
                  <a
                    href={href(website)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-fit items-center gap-1 border-b border-[#F4EFE7]/50 text-base font-bold text-[#F4EFE7] transition-colors hover:border-white hover:text-white"
                  >
                    {website.replace(/^https?:\/\//, "")}
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                </dd>
              </>
            )}
            {github && (
              <>
                <dt className="font-mono text-xs uppercase tracking-wider text-zinc-400">Source</dt>
                <dd>
                  <a
                    href={github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-fit items-center gap-1.5 border-b border-zinc-500 text-base font-bold text-zinc-200 transition-colors hover:border-white hover:text-white"
                  >
                    <Github className="h-4 w-4" /> GitHub <ExternalLink className="h-3 w-3" />
                  </a>
                </dd>
              </>
            )}
          </dl>

          <div className="space-y-4">
            {description.map((para, i) => (
              <p key={i} className="text-pretty text-base leading-relaxed text-zinc-300 group-data-[active=true]:text-zinc-100">
                {para}
              </p>
            ))}
          </div>
        </div>
      </div>
    </GradientHover>
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
  subtitle = "Hover rows to unveil contextual previews",
  items = DEFAULT_ITEMS,
  hideHeader = false,
}) => {
  return (
    <FullBleed>
      <section className={cn("text-white", className)}>
        <div className={containerClassName}>
          {!hideHeader && (
            <div className="border-t border-white/10 border-b px-6 pb-8 pt-10 sm:px-12 md:pb-10 md:pt-14">
              <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                <h2 className="text-[clamp(3.5rem,11vw,10rem)] font-extrabold uppercase leading-[0.85] tracking-[-0.04em] text-white">
                  {title}
                </h2>
                <div className="space-y-1 font-mono text-xs uppercase tracking-widest text-zinc-400 md:max-w-[16rem] md:pb-3 md:text-right">
                  <p className="text-[#F4EFE7]">{badge}</p>
                  {subtitle && <p className="normal-case tracking-normal">{subtitle}</p>}
                </div>
              </div>
            </div>
          )}

          <div className={hideHeader ? "border-t border-white/10" : undefined}>
            {items.map((item) => (
              <ExperienceItem key={item.index} {...item} />
            ))}
          </div>
        </div>
      </section>
    </FullBleed>
  )
}

export default ImpactExperience
