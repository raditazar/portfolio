"use client"

import type React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import Link from "next/link"
import { ArrowUpRight, Sparkles } from "lucide-react"

export interface ProjectShowcaseItem {
  id?: string
  title: string
  description: string
  year?: string
  link?: string
  liveUrl?: string | null
  githubUrl?: string | null
  image?: string
  imageSrc?: string
  category?: string
  categoryColor?: string
  techStack?: string[]
}

const defaultProjects: ProjectShowcaseItem[] = [
  {
    title: "Lumina",
    description: "AI-powered design system generator.",
    year: "2024",
    link: "#",
    image: "https://cdn.21st.dev/assets/mirror/c1/c1671df27042b5889c9813bf8e89b79fe2954b88fefb6b2e3c4cd78463289b48.jpg",
  },
  {
    title: "Flux",
    description: "Real-time collaboration for creative teams.",
    year: "2024",
    link: "#",
    image: "https://cdn.21st.dev/assets/mirror/5d/5d41544231f49d8d650dc2f33ccc7282c099aea086dcca88f6de4d6430d21598.jpg",
  },
  {
    title: "Prism",
    description: "Color palette extraction from any image.",
    year: "2023",
    link: "#",
    image: "https://cdn.21st.dev/assets/mirror/67/677dbc17159d32becaf6209a1cc92022800d24cccbce2089e32fe5fe146464e3.jpg",
  },
  {
    title: "Vertex",
    description: "3D modeling toolkit for the web.",
    year: "2023",
    link: "#",
    image: "https://cdn.21st.dev/assets/mirror/b6/b61643bba150cf989b9fa16762d236dd89cb38121ecb53af6d05343d66153a0e.jpg",
  },
]

export interface ProjectShowcaseProps {
  projects?: ProjectShowcaseItem[]
  totalProjectCount?: number
  heading?: string
  subheading?: string
  className?: string
  viewAllHref?: string
}

export function ProjectShowcase({
  projects: customProjects,
  totalProjectCount,
  heading = "Selected Works",
  subheading = "Curated Engineering & Design",
  className = "",
  viewAllHref = "/projects",
}: ProjectShowcaseProps) {
  // Use passed projects or fallback to default sample projects
  const rawList = customProjects && customProjects.length > 0 ? customProjects : defaultProjects

  const displayProjects = rawList.map((p, index) => ({
    title: p.title,
    description: p.description,
    year: p.year || (2024 - Math.floor(index / 2)).toString(),
    link: p.link || p.liveUrl || p.githubUrl || "/projects",
    image: p.image || p.imageSrc || "/images/project-movo.png",
    category: p.category,
    techStack: p.techStack,
  }))

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [mousePosition, setMousePosition] = useState({ x: -500, y: -500 })
  const [smoothPosition, setSmoothPosition] = useState({ x: -500, y: -500 })
  const [isVisible, setIsVisible] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number | null>(null)
  const lastMousePosRef = useRef({ x: -1, y: -1 })

  // Initialize mouse position in center if not yet moved
  useEffect(() => {
    if (typeof window !== "undefined") {
      lastMousePosRef.current = {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
      }
    }
  }, [])

  // Smooth lerp animation for floating preview coordinates
  useEffect(() => {
    const lerp = (start: number, end: number, factor: number) => {
      return start + (end - start) * factor
    }

    const animate = () => {
      setSmoothPosition((prev) => ({
        x: lerp(prev.x, mousePosition.x, 0.15),
        y: lerp(prev.y, mousePosition.y, 0.15),
      }))
      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [mousePosition])

  // Instant hit-test function: detects project row under stationary cursor on scroll / split reveal
  const checkHoverUnderMouse = useCallback((clientX: number, clientY: number) => {
    if (clientX < 0 || clientY < 0 || typeof document === "undefined") return

    const element = document.elementFromPoint(clientX, clientY)
    const projectRow = element?.closest("[data-project-index]")

    if (projectRow) {
      const indexStr = projectRow.getAttribute("data-project-index")
      if (indexStr !== null) {
        const idx = parseInt(indexStr, 10)
        setHoveredIndex((prev) => (prev !== idx ? idx : prev))
        setMousePosition({ x: clientX, y: clientY })
        setSmoothPosition((prev) => (prev.x < 0 ? { x: clientX, y: clientY } : prev))
        setIsVisible(true)
        return
      }
    }

    // If cursor is outside project rows
    setHoveredIndex(null)
    setIsVisible(false)
  }, [])

  // Listen to global pointer moves, scroll events, GSAP timeline updates, and interval polling
  useEffect(() => {
    const handleGlobalPointerMove = (e: MouseEvent | PointerEvent) => {
      lastMousePosRef.current = { x: e.clientX, y: e.clientY }
      setMousePosition({ x: e.clientX, y: e.clientY })
      checkHoverUnderMouse(e.clientX, e.clientY)
    }

    const handleScrollOrUpdate = () => {
      if (lastMousePosRef.current.x >= 0 && lastMousePosRef.current.y >= 0) {
        checkHoverUnderMouse(lastMousePosRef.current.x, lastMousePosRef.current.y)
      }
    }

    window.addEventListener("pointermove", handleGlobalPointerMove, { passive: true })
    window.addEventListener("mousemove", handleGlobalPointerMove, { passive: true })
    window.addEventListener("scroll", handleScrollOrUpdate, { passive: true })
    window.addEventListener("portfolio:scroll-update", handleScrollOrUpdate, { passive: true })

    // Active 50ms polling interval so stationary cursor automatically triggers when row reveals underneath
    const interval = setInterval(handleScrollOrUpdate, 50)

    return () => {
      window.removeEventListener("pointermove", handleGlobalPointerMove)
      window.removeEventListener("mousemove", handleGlobalPointerMove)
      window.removeEventListener("scroll", handleScrollOrUpdate)
      window.removeEventListener("portfolio:scroll-update", handleScrollOrUpdate)
      clearInterval(interval)
    }
  }, [checkHoverUnderMouse])

  const handleMouseEnter = (index: number, e: React.MouseEvent) => {
    setHoveredIndex(index)
    lastMousePosRef.current = { x: e.clientX, y: e.clientY }
    setMousePosition({ x: e.clientX, y: e.clientY })
    if (!isVisible) {
      setSmoothPosition({ x: e.clientX, y: e.clientY })
    }
    setIsVisible(true)
  }

  const handleMouseLeave = () => {
    setHoveredIndex(null)
    setIsVisible(false)
  }

  // Adaptive viewport boundaries for floating snapshot
  const previewWidth = 420
  const isNearRightEdge = typeof window !== "undefined" && mousePosition.x > window.innerWidth - (previewWidth + 40)
  const isNearTopEdge = typeof window !== "undefined" && mousePosition.y < 260

  const offsetX = isNearRightEdge ? -(previewWidth + 24) : 24
  const offsetY = isNearTopEdge ? 24 : -220

  return (
    <section
      ref={containerRef}
      data-project-showcase="true"
      className={`relative w-full py-6 md:py-10 min-h-[85vh] flex flex-col justify-center select-none ${className}`}
    >
      {/* Header bar - with subtle Warm Linen editorial accents */}
      <div className="w-full px-6 sm:px-12 md:px-16 lg:px-20 xl:px-24 mb-6 sm:mb-8 border-b border-[#F4EFE7]/15 pb-5">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-block w-2 h-2 rounded-full bg-[#F4EFE7] animate-pulse" />
              <span className="text-xs font-mono font-semibold uppercase tracking-[0.25em] text-[#F4EFE7] bg-[#F4EFE7]/10 border border-[#F4EFE7]/20 px-2 py-0.5 rounded-full">
                {heading}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight text-white">
              Featured Projects
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <p className="hidden md:block text-xs font-mono text-[#F4EFE7]/60">
              {subheading}
            </p>
            <Link
              href={viewAllHref}
              className="group/cta inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#F4EFE7]/20 bg-[#F4EFE7]/5 hover:bg-[#F4EFE7]/15 hover:border-[#F4EFE7]/50 text-xs font-semibold uppercase tracking-wider text-[#F4EFE7] transition-all duration-300"
            >
              <span>Explore All</span>
              {totalProjectCount && (
                <span className="px-2 py-0.5 rounded-full bg-[#F4EFE7] text-[#120820] font-bold text-[10px] tracking-normal shadow-sm">
                  {totalProjectCount}
                </span>
              )}
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5 text-[#F4EFE7]" />
            </Link>
          </div>
        </div>
      </div>

      {/* Floating Preview Image on Desktop: Framed in Warm Cream */}
      <div
        className="pointer-events-none fixed top-0 left-0 z-50 hidden md:block"
        style={{
          transform: `translate3d(${smoothPosition.x + offsetX}px, ${smoothPosition.y + offsetY}px, 0)`,
          willChange: "transform",
        }}
      >
        <div
          className="overflow-hidden rounded-2xl shadow-[0_30px_70px_rgba(0,0,0,0.85),0_0_35px_rgba(244,239,231,0.08)] border-2 border-[#F4EFE7] backdrop-blur-md transition-all duration-300 ease-out"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "scale(1)" : "scale(0.85)",
          }}
        >
          <div className="relative w-[340px] h-[210px] lg:w-[420px] lg:h-[260px] bg-[#120820] rounded-2xl overflow-hidden">
            {displayProjects.map((project, index) => (
              <img
                key={`${project.title}-${index}`}
                src={project.image || "/images/project-movo.png"}
                alt={project.title}
                className="absolute inset-0 w-full h-full object-cover transition-all duration-500 ease-out"
                style={{
                  opacity: hoveredIndex === index ? 1 : 0,
                  transform: hoveredIndex === index ? "scale(1)" : "scale(1.08)",
                  filter: hoveredIndex === index ? "none" : "blur(8px)",
                }}
              />
            ))}
            {/* Subtle gradient overlay with obsidian plum tint */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0E0717]/85 via-transparent to-transparent pointer-events-none" />

            {/* Bottom tag on preview: Museum Art Plaque in Warm Linen */}
            {hoveredIndex !== null && displayProjects[hoveredIndex]?.category && (
              <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between text-[11px] font-mono bg-[#F4EFE7] text-[#120820] px-3.5 py-1.5 rounded-lg shadow-lg border border-[#F4EFE7]/80">
                <span className="font-bold tracking-wider uppercase text-[#120820]">
                  {displayProjects[hoveredIndex].category}
                </span>
                <span className="font-semibold text-[#120820]/75">
                  {displayProjects[hoveredIndex].year}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Projects List: Full Bleed Width Across Screen, No Side Borders */}
      <div className="w-full space-y-0 border-t border-b border-[#F4EFE7]/15 divide-y divide-[#F4EFE7]/15">
        {displayProjects.map((project, index) => (
          <a
            key={`${project.title}-${index}`}
            href={project.link}
            data-project-index={index}
            data-cursor-hover="true"
            target={project.link.startsWith("http") ? "_blank" : undefined}
            rel={project.link.startsWith("http") ? "noopener noreferrer" : undefined}
            className="group block relative w-full cursor-pointer"
            onMouseEnter={(e) => handleMouseEnter(index, e)}
            onMouseLeave={handleMouseLeave}
          >
            <div className="relative w-full py-5 sm:py-7 lg:py-8.5 px-6 sm:px-12 md:px-16 lg:px-20 xl:px-24 transition-colors duration-300 ease-out">
              {/* Bold Inversion Slab on Hover: Solid Warm Cream (#F4EFE7) with Top/Bottom Borders */}
              <div
                className={`
                  absolute inset-0 w-full pointer-events-none transition-all duration-300 ease-out
                  border-t border-b border-l-0 border-r-0
                  group-hover:bg-[#F4EFE7] group-hover:border-[#120820]/20 group-hover:opacity-100
                  ${
                    hoveredIndex === index
                      ? "bg-[#F4EFE7] border-[#120820]/20 opacity-100"
                      : "bg-transparent border-transparent opacity-0"
                  }
                `}
              />

              <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
                {/* Left side: Index, Title, and Description */}
                <div className="flex-1 min-w-0 flex items-start gap-4 sm:gap-8">
                  {/* Serial counter: Subtle cream at rest, Deep ink on hover */}
                  <span
                    className={`
                      font-mono text-xs sm:text-sm pt-1.5 sm:pt-2 tabular-nums transition-colors duration-300
                      group-hover:text-[#120820]/70 group-hover:font-bold
                      ${hoveredIndex === index ? "text-[#120820]/70 font-bold" : "text-[#F4EFE7]/50"}
                    `}
                  >
                    0{index + 1}
                  </span>

                  <div className="flex-1 min-w-0">
                    {/* Category pill & Tech Stack */}
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      {project.category && (
                        <span
                          className={`
                            text-[10px] sm:text-xs font-mono font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full transition-all duration-300
                            group-hover:bg-[#120820]/10 group-hover:border-[#120820]/20 group-hover:text-[#120820]
                            ${
                              hoveredIndex === index
                                ? "bg-[#120820]/10 border border-[#120820]/20 text-[#120820]"
                                : "bg-[#F4EFE7]/10 border border-[#F4EFE7]/20 text-[#F4EFE7]"
                            }
                          `}
                        >
                          {project.category}
                        </span>
                      )}
                      {project.techStack?.slice(0, 3).map((tech) => (
                        <span
                          key={tech}
                          className={`
                            hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded-full transition-all duration-300
                            group-hover:bg-[#120820]/5 group-hover:border-[#120820]/15 group-hover:text-[#120820]/80
                            ${
                              hoveredIndex === index
                                ? "bg-[#120820]/5 border border-[#120820]/15 text-[#120820]/80"
                                : "bg-white/5 border border-white/10 text-zinc-400"
                            }
                          `}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Title with animated underline: Deep Ink on Hover */}
                    <div className="inline-flex items-center gap-3">
                      <h3
                        className={`
                          text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight transition-colors duration-300
                          group-hover:text-[#120820]
                          ${hoveredIndex === index ? "text-[#120820]" : "text-white"}
                        `}
                      >
                        <span className="relative">
                          {project.title}
                          {/* Animated underline: Deep ink rule on hover */}
                          <span
                            className={`
                              absolute left-0 -bottom-1 h-0.5 transition-all duration-300 ease-out
                              group-hover:w-full group-hover:bg-[#120820]
                              ${hoveredIndex === index ? "w-full bg-[#120820]" : "w-0 bg-[#F4EFE7]"}
                            `}
                          />
                        </span>
                      </h3>

                      {/* Arrow that slides in: Deep Ink on hover */}
                      <ArrowUpRight
                        className={`
                          w-5 h-5 sm:w-6 sm:h-6 transition-all duration-300 ease-out
                          group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:text-[#120820]
                          ${
                            hoveredIndex === index
                              ? "opacity-100 translate-x-0 translate-y-0 text-[#120820]"
                              : "opacity-30 translate-x-0 translate-y-0 text-[#F4EFE7]/60"
                          }
                        `}
                      />
                    </div>

                    {/* Description: Deep ink text on hover */}
                    <p
                      className={`
                        text-xs sm:text-sm md:text-base mt-2 leading-relaxed max-w-3xl
                        transition-colors duration-300
                        group-hover:text-[#120820]/85
                        ${hoveredIndex === index ? "text-[#120820]/85" : "text-zinc-400"}
                      `}
                    >
                      {project.description}
                    </p>
                  </div>
                </div>

                {/* Right side: Year and mobile thumbnail fallback */}
                <div className="flex md:flex-col items-center md:items-end justify-between gap-3 pt-2 md:pt-0">
                  <span
                    className={`
                      text-xs sm:text-sm font-mono tracking-wider tabular-nums transition-colors duration-300
                      group-hover:text-[#120820] group-hover:font-bold
                      ${hoveredIndex === index ? "text-[#120820] font-bold" : "text-[#F4EFE7]/50"}
                    `}
                  >
                    {project.year}
                  </span>

                  {/* Mobile image preview indicator */}
                  <div
                    className={`
                      md:hidden relative w-16 h-10 rounded-lg overflow-hidden shrink-0 transition-colors duration-300
                      group-hover:border-[#120820]/30 border border-white/10
                    `}
                  >
                    <img
                      src={project.image || "/images/project-movo.png"}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* Footer bar for showcase - with Warm Linen accents */}
      <div className="w-full px-6 sm:px-12 md:px-16 lg:px-20 xl:px-24 mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-500">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-[#F4EFE7]" />
          <span className="text-[#F4EFE7]/70">Hover rows to reveal live preview snapshots</span>
        </div>
        <Link
          href={viewAllHref}
          className="text-[#F4EFE7]/70 hover:text-[#F4EFE7] transition-colors duration-200 inline-flex items-center gap-1.5"
        >
          <span>View complete project archives</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </section>
  )
}

export default ProjectShowcase
