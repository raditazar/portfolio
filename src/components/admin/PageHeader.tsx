import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface PageHeaderProps {
  eyebrow?: string
  title: ReactNode | string
  description?: string
  actions?: ReactNode
  className?: string
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        "flex flex-col gap-6 md:flex-row md:items-end md:justify-between",
        "mb-10 border-b border-white/8 pb-8",
        className
      )}
    >
      <div className="flex flex-col gap-4">
        {eyebrow && (
          <p className="font-mono text-xs uppercase tracking-widest text-white/50">
            {eyebrow}
          </p>
        )}
        <h1 className="font-serif text-4xl font-black leading-[0.95] text-white md:text-6xl">
          {title}
        </h1>
        {description && (
          <p className="max-w-xl text-white/60">{description}</p>
        )}
      </div>
      {actions && (
        <div className="flex flex-wrap items-center gap-3 md:justify-end">
          {actions}
        </div>
      )}
    </header>
  )
}

export default PageHeader
