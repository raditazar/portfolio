import Link from "next/link";
import { cn } from "@/lib/utils";

type StatTileProps = {
  label: string;
  value: number | string;
  href?: string;
  index?: number;
};

export function StatTile({ label, value, href, index }: StatTileProps) {
  const meta =
    typeof index === "number"
      ? `${String(index).padStart(2, "0")} / ${label}`
      : label;

  const content = (
    <>
      <p className="font-mono text-xs uppercase tracking-widest text-white/50">
        {meta}
      </p>
      <p className="font-serif font-black text-6xl text-white leading-none">
        {value}
      </p>
      {href ? (
        <span className="self-end font-mono text-xs uppercase tracking-widest text-white/50">
          Open →
        </span>
      ) : null}
    </>
  );

  const base = "rounded-2xl bg-canvas-surface p-6 flex flex-col gap-6 transition-colors";

  if (href) {
    return (
      <Link
        href={href}
        className={cn(
          "block",
          base,
          "hover:bg-canvas-raised focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-violet",
        )}
      >
        {content}
      </Link>
    );
  }

  return <div className={base}>{content}</div>;
}

export default StatTile;
