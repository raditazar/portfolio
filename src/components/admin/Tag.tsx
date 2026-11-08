import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type TagTone = "neutral" | "linen" | "emerald" | "danger";

const TONES: Record<TagTone, string> = {
  neutral: "bg-canvas-raised text-white/70",
  linen: "bg-cream-sheet text-cream-ink",
  emerald: "bg-[#0F2A22] text-accent-emerald",
  danger: "bg-danger-surface text-danger",
};

interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: TagTone;
}

export function Tag({ tone = "neutral", className, ...props }: TagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 font-mono text-[11px] uppercase tracking-widest",
        TONES[tone],
        className,
      )}
      {...props}
    />
  );
}
