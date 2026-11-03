import React from "react"
import { cn } from "@/lib/utils"

export interface HighlightRect {
  top?: string
  right?: string
  bottom?: string
  left?: string
}

interface SplitHighlightProps {
  children: React.ReactNode
  /** Edge offsets of the solid rectangle, relative to the wrapper (negatives bleed outside). */
  rect: HighlightRect
  /** Classes for the solid rectangle (default cream). */
  rectClass?: string
  /** Text colour used inside the rectangle. */
  inkColor?: string
  /** Classes for the text element (rendered twice). */
  className?: string
  /** Classes for the wrapper (layout: w-fit, md:col-span-12, ...). */
  wrapperClassName?: string
  as?: "h1" | "h2" | "h3" | "div" | "span" | "p"
}

/**
 * Text over a partial solid rectangle. The text is drawn twice: the base layer in
 * its normal colour, and a copy in `inkColor` clipped to exactly the rectangle,
 * so a single glyph can be split between two colours at the rectangle edge.
 */
export const SplitHighlight: React.FC<SplitHighlightProps> = ({
  children,
  rect,
  rectClass = "bg-[#F4EFE7]",
  inkColor = "#120820",
  className,
  wrapperClassName,
  as: Tag = "div",
}) => {
  const { top = "0px", right = "0px", bottom = "0px", left = "0px" } = rect

  return (
    <div className={cn("relative isolate", wrapperClassName)}>
      <div
        aria-hidden
        className={cn("absolute -z-10", rectClass)}
        style={{ top, right, bottom, left }}
      />
      <Tag className={className}>{children}</Tag>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 select-none"
        style={{ clipPath: `inset(${top} ${right} ${bottom} ${left})` }}
      >
        <Tag
          className={className}
          style={{ color: inkColor, filter: "none", textShadow: "none" }}
        >
          {children}
        </Tag>
      </div>
    </div>
  )
}

export default SplitHighlight
