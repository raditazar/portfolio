import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface EmptyStateProps {
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

export function EmptyState({
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-canvas-surface p-12 text-center",
        className
      )}
    >
      <h2 className="font-serif text-2xl text-white">{title}</h2>
      {description && (
        <p className="mx-auto mt-3 max-w-md text-white/60">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}

export default EmptyState
