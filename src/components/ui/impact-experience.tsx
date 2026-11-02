"use client"

import React, { useEffect, useId, useRef } from "react"
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
 * Row wrapper with liquid-morph gradient blobs that chase the cursor,
 * stretch along movement, shift hue by position/speed, warp the project
 * image (SVG displacement) and swap the native cursor for a "VIEW" disc.
 * Full effect: mouse only. Touch: fade in when row crosses viewport centre.
 */
export const GradientHover: React.FC<{
  image?: string
  alt?: string
  className?: string
  children: React.ReactNode
}> = ({ image, alt = "", className, children }) => {
  const rowRef = useRef<HTMLDivElement>(null)
  const layerRef = useRef<HTMLDivElement>(null)
  const leadRef = useRef<HTMLDivElement>(null)
  const trailRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const dispRef = useRef<SVGFEDisplacementMapElement>(null)
  const turbRef = useRef<SVGFETurbulenceElement>(null)
  const filterId = `disp-${useId().replace(/[^a-zA-Z0-9]/g, "")}`
  const wild = useRef(false)

  const sim = useRef({
    tx: 0, ty: 0, lx: 0, ly: 0, rx: 0, ry: 0, dx: 0, dy: 0,
    vx: 0, vy: 0, speed: 0, angle: 0, disp: 0, w: 1,
    active: false, raf: 0,
  })

  const tick = (time: number) => {
    const s = sim.current
    const plx = s.lx
    const ply = s.ly
    s.lx += (s.tx - s.lx) * 0.18
    s.ly += (s.ty - s.ly) * 0.18
    s.rx += (s.tx - s.rx) * 0.07
    s.ry += (s.ty - s.ry) * 0.07
    s.dx += (s.tx - s.dx) * 0.35
    s.dy += (s.ty - s.dy) * 0.35

    s.vx += (s.lx - plx - s.vx) * 0.25
    s.vy += (s.ly - ply - s.vy) * 0.25
    const mag = Math.hypot(s.vx, s.vy)
    if (mag > 0.6) s.angle = (Math.atan2(s.vy, s.vx) * 180) / Math.PI
    s.speed += (Math.min(mag / 40, 1) - s.speed) * 0.2

    const sp = s.speed
    if (leadRef.current) {
      leadRef.current.style.transform = `translate3d(${s.lx}px,${s.ly}px,0) rotate(${s.angle}deg) scale(${1 + sp * 0.9},${1 - sp * 0.45})`
    }
    if (trailRef.current) {
      trailRef.current.style.transform = `translate3d(${s.rx}px,${s.ry}px,0) rotate(${s.angle}deg) scale(${1 + sp * 0.5},${1 - sp * 0.25})`
    }
    if (dotRef.current) dotRef.current.style.transform = `translate3d(${s.dx}px,${s.dy}px,0)`
    if (layerRef.current) {
      const hue = (s.lx / s.w) * 70 - 35 + sp * 40
      layerRef.current.style.filter = `hue-rotate(${hue}deg)`
    }
    s.disp += ((s.active ? 10 + sp * 90 : 0) - s.disp) * 0.12
    dispRef.current?.setAttribute("scale", s.disp.toFixed(1))
    turbRef.current?.setAttribute(
      "baseFrequency",
      (0.012 + Math.sin(time / 1500) * 0.003).toFixed(4)
    )

    if (s.active || sp > 0.01 || s.disp > 0.5) {
      s.raf = requestAnimationFrame(tick)
    } else {
      s.raf = 0
    }
  }

  const start = () => {
    if (!sim.current.raf) sim.current.raf = requestAnimationFrame(tick)
  }

  // setup: capability detection, static placement, touch in-view activation
  useEffect(() => {
    const row = rowRef.current
    if (!row) return
    const s = sim.current
    const touch = window.matchMedia("(hover: none)").matches
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    wild.current = !touch && !reduced
    row.dataset.wild = String(wild.current)

    const place = () => {
      const r = row.getBoundingClientRect()
      s.w = r.width || 1
      const x = r.width * 0.35
      const y = r.height * 0.5
      s.lx = s.tx = x
      s.ly = s.ty = y
      s.rx = x + r.width * 0.12
      s.ry = y + r.height * 0.15
      s.dx = x
      s.dy = y
      if (leadRef.current) leadRef.current.style.transform = `translate3d(${s.lx}px,${s.ly}px,0)`
      if (trailRef.current) trailRef.current.style.transform = `translate3d(${s.rx}px,${s.ry}px,0)`
    }
    place()
    if (wild.current && imgRef.current) imgRef.current.style.filter = `url(#${filterId})`

    let io: IntersectionObserver | undefined
    if (touch) {
      io = new IntersectionObserver(
        ([entry]) => {
          row.dataset.active = entry.isIntersecting ? "true" : "false"
        },
        { rootMargin: "-45% 0px -45% 0px" }
      )
      io.observe(row)
    }
    const onResize = () => {
      if (!s.active) place()
    }
    window.addEventListener("resize", onResize)
    return () => {
      io?.disconnect()
      window.removeEventListener("resize", onResize)
      cancelAnimationFrame(s.raf)
      s.raf = 0
    }
  }, [filterId])

  const onEnter = (e: React.PointerEvent<HTMLDivElement>) => {
    const row = rowRef.current
    if (!row || e.pointerType !== "mouse") return
    row.dataset.active = "true"
    if (!wild.current) return
    const r = row.getBoundingClientRect()
    const s = sim.current
    s.w = r.width || 1
    s.tx = e.clientX - r.left
    s.ty = e.clientY - r.top
    s.dx = s.tx
    s.dy = s.ty
    s.active = true
    start()
  }

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const row = rowRef.current
    if (!row || !wild.current || e.pointerType !== "mouse") return
    const r = row.getBoundingClientRect()
    const s = sim.current
    s.tx = e.clientX - r.left
    s.ty = e.clientY - r.top
    row.dataset.link = String(!!(e.target as Element).closest("a"))
    s.active = true
    start()
  }

  const onLeave = (e: React.PointerEvent<HTMLDivElement>) => {
    const row = rowRef.current
    if (!row || e.pointerType !== "mouse") return
    row.dataset.active = "false"
    row.dataset.link = "false"
    sim.current.active = false
    if (wild.current) start()
  }

  return (
    <div
      ref={rowRef}
      data-active="false"
      data-link="false"
      data-wild="false"
      onPointerEnter={onEnter}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={cn(
        "group relative overflow-hidden data-[wild=true]:cursor-none data-[wild=true]:[&_a]:cursor-none",
        className
      )}
    >
      {image && (
        <svg aria-hidden width="0" height="0" className="absolute">
          <filter id={filterId} x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence
              ref={turbRef}
              type="fractalNoise"
              baseFrequency="0.012"
              numOctaves="2"
              seed="3"
              result="noise"
            />
            <feDisplacementMap
              ref={dispRef}
              in="SourceGraphic"
              in2="noise"
              scale="0"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </svg>
      )}

      <div
        ref={layerRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-0 transition-opacity duration-700 ease-out group-data-[active=true]:opacity-100"
      >
        {image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            ref={imgRef}
            src={image}
            alt={alt}
            className="absolute inset-0 h-full w-full scale-110 object-cover opacity-35 mix-blend-luminosity"
          />
        )}
        <div className="absolute inset-0 bg-[#0E0717]/55" />
        <div ref={trailRef} className="absolute left-0 top-0 will-change-transform">
          <div className="animate-blob-b h-[360px] w-[420px] bg-[radial-gradient(closest-side,#F59E0B,#B91C1C_60%,transparent)] opacity-60 blur-2xl mix-blend-screen" />
        </div>
        <div ref={leadRef} className="absolute left-0 top-0 will-change-transform">
          <div className="animate-blob-a h-[440px] w-[500px] bg-[radial-gradient(closest-side,#D6288A,#7A1F6B_65%,transparent)] opacity-85 blur-2xl mix-blend-screen" />
        </div>
        <div
          className="absolute inset-0 opacity-[0.18] mix-blend-overlay"
          style={{ backgroundImage: GRAIN }}
        />
      </div>

      <div className="relative z-10">{children}</div>

      <div
        ref={dotRef}
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 z-20 hidden group-data-[wild=true]:block"
      >
        <div className="flex h-[72px] w-[72px] -translate-x-1/2 -translate-y-1/2 scale-0 items-center justify-center rounded-full bg-[#F4EFE7] font-mono text-[10px] font-bold uppercase tracking-widest text-[#120820] mix-blend-difference transition-transform duration-300 ease-out group-data-[active=true]:scale-100 group-data-[link=true]:scale-[1.6]">
          <span className="group-data-[link=true]:hidden">View</span>
          <span className="hidden group-data-[link=true]:inline">Open</span>
        </div>
      </div>
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
