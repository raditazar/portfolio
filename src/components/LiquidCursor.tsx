"use client";

import { useEffect, useRef } from "react";

const INTERACTIVE =
  'a, button, [role="button"], input, textarea, select, [data-cursor-hover], [data-cursor-label], .cursor-pointer';

/** Blob / disc geometry (px). The disc is slightly larger than the lead blob so the swap reads as growth. */
const LEAD = 96;
const DISC = 100;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/** Label shown inside the disc. `data-cursor-label="..."` on any ancestor wins. */
function labelFor(el: Element): string {
  const custom = el.closest("[data-cursor-label]")?.getAttribute("data-cursor-label");
  if (custom) return custom;
  const a = el.closest("a");
  if (a) {
    const href = a.getAttribute("href") ?? "";
    if (/^mailto:/i.test(href)) return "Email";
    if (/^tel:/i.test(href)) return "Call";
    if (/^https?:\/\//i.test(href) && !href.startsWith(window.location.origin)) return "Visit";
    return "Open";
  }
  if (el.closest("input, textarea")) return "Type";
  if (el.closest("select")) return "Pick";
  if (el.closest('button, [role="button"]')) return "Click";
  return "Open";
}

/**
 * Landing-page cursor: liquid morphing blobs that chase the pointer, stretch
 * along movement and invert whatever is beneath (mix-blend-difference).
 * Over interactive targets the lead blob cross-fades into a labelled disc
 * (`k` is eased every frame, so entering/leaving a target is a smooth morph).
 * Mouse only; disabled for touch and prefers-reduced-motion.
 */
export default function LiquidCursor() {
  const rootRef = useRef<HTMLDivElement>(null);
  const leadRef = useRef<HTMLDivElement>(null);
  const leadBlobRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const trailBlobRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const dotInnerRef = useRef<HTMLDivElement>(null);
  const discRef = useRef<HTMLDivElement>(null);
  const discInnerRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    document.documentElement.dataset.liquidCursor = "true";

    const s = {
      tx: -200, ty: -200, lx: -200, ly: -200, rx: -200, ry: -200,
      dx: -200, dy: -200, vx: 0, vy: 0, speed: 0, angle: 0,
      k: 0, target: 0, label: "Open",
      raf: 0, seen: false,
    };

    const tick = () => {
      const plx = s.lx;
      const ply = s.ly;
      // Lead stays close to the pointer (small lag), trail catches up slowly.
      s.lx += (s.tx - s.lx) * 0.35;
      s.ly += (s.ty - s.ly) * 0.35;
      s.rx += (s.tx - s.rx) * 0.12;
      s.ry += (s.ty - s.ry) * 0.12;
      s.dx += (s.tx - s.dx) * 0.6;
      s.dy += (s.ty - s.dy) * 0.6;

      s.vx += (s.lx - plx - s.vx) * 0.25;
      s.vy += (s.ly - ply - s.vy) * 0.25;
      const mag = Math.hypot(s.vx, s.vy);
      if (mag > 0.6) s.angle = (Math.atan2(s.vy, s.vx) * 180) / Math.PI;
      s.speed += (Math.min(mag / 40, 1) - s.speed) * 0.2;

      // Hover morph factor: 0 = blob, 1 = disc.
      s.k += (s.target - s.k) * 0.16;
      if (Math.abs(s.target - s.k) < 0.004) s.k = s.target;
      const k = s.k;

      const sp = s.speed * (1 - k); // stretch fades out while becoming a circle
      const grow = 1 + k * (DISC / LEAD - 1);

      if (leadRef.current) {
        leadRef.current.style.transform = `translate3d(${s.lx}px,${s.ly}px,0) rotate(${s.angle}deg) scale(${(1 + sp * 0.9) * grow},${(1 - sp * 0.45) * grow})`;
        const hue = (s.lx / window.innerWidth) * 80 - 40 + sp * 50;
        leadRef.current.style.filter = `hue-rotate(${hue}deg)`;
      }
      if (leadBlobRef.current) leadBlobRef.current.style.opacity = String(1 - clamp01(k * 1.6));
      if (trailRef.current) {
        trailRef.current.style.transform = `translate3d(${s.rx}px,${s.ry}px,0) rotate(${s.angle}deg) scale(${1 + sp * 0.5},${1 - sp * 0.25})`;
      }
      if (trailBlobRef.current) trailBlobRef.current.style.opacity = String(1 - clamp01(k * 2.2));
      if (dotRef.current) dotRef.current.style.transform = `translate3d(${s.dx}px,${s.dy}px,0)`;
      if (dotInnerRef.current) dotInnerRef.current.style.opacity = String(1 - clamp01(k * 2));
      if (discRef.current) discRef.current.style.transform = `translate3d(${s.lx}px,${s.ly}px,0)`;
      if (discInnerRef.current) {
        discInnerRef.current.style.opacity = String(clamp01((k - 0.15) / 0.6));
        discInnerRef.current.style.transform = `scale(${0.8 + 0.2 * k})`;
      }
      if (labelRef.current) labelRef.current.style.opacity = String(clamp01((k - 0.55) / 0.45));

      const settled =
        Math.abs(s.tx - s.lx) < 0.3 && Math.abs(s.ty - s.ly) < 0.3 &&
        Math.abs(s.tx - s.rx) < 0.3 && Math.abs(s.ty - s.ry) < 0.3 &&
        s.speed < 0.01 && s.k === s.target;
      s.raf = settled ? 0 : requestAnimationFrame(tick);
    };

    const wake = () => {
      if (!s.raf) s.raf = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      s.tx = e.clientX;
      s.ty = e.clientY;
      if (!s.seen) {
        s.seen = true;
        s.lx = s.rx = s.dx = s.tx;
        s.ly = s.ry = s.dy = s.ty;
        root.dataset.on = "true";
      }
      const hit = (e.target as Element | null)?.closest?.(INTERACTIVE) ?? null;
      s.target = hit ? 1 : 0;
      if (hit) {
        const label = labelFor(hit);
        if (label !== s.label) {
          s.label = label;
          if (labelRef.current) labelRef.current.textContent = label;
        }
      }
      wake();
    };
    const onDown = () => (root.dataset.down = "true");
    const onUp = () => (root.dataset.down = "false");
    const onLeave = () => {
      root.dataset.on = "false";
      s.target = 0;
      wake();
    };
    const onEnter = () => {
      if (s.seen) root.dataset.on = "true";
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);

    return () => {
      cancelAnimationFrame(s.raf);
      delete document.documentElement.dataset.liquidCursor;
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
    };
  }, []);

  // `contents` keeps this wrapper out of the stacking context so that the
  // fixed children can blend (difference) against the actual page.
  // Wrappers are 0x0 on purpose: rotate/scale pivot on the pointer itself,
  // otherwise a sized box orbits around its own centre and drifts off the pointer.
  return (
    <div
      ref={rootRef}
      aria-hidden
      data-on="false"
      data-down="false"
      className="group contents"
    >
      <div
        ref={trailRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-0 w-0 opacity-0 mix-blend-difference transition-opacity duration-200 will-change-transform group-data-[on=true]:opacity-70"
      >
        <div
          ref={trailBlobRef}
          className="animate-blob-b h-[52px] w-[52px] bg-[radial-gradient(circle_at_40%_40%,#F59E0B,#B91C1C)]"
        />
      </div>

      <div
        ref={leadRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-0 w-0 opacity-0 mix-blend-difference transition-opacity duration-200 will-change-transform group-data-[on=true]:opacity-100"
      >
        <div
          ref={leadBlobRef}
          className="animate-blob-a h-24 w-24 bg-[radial-gradient(circle_at_35%_35%,#F4EFE7,#E879B9_75%)] transition-[scale] duration-200 group-data-[down=true]:scale-75"
        />
      </div>

      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] opacity-0 mix-blend-difference transition-opacity duration-200 group-data-[on=true]:opacity-100"
      >
        <div
          ref={dotInnerRef}
          className="h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#F4EFE7]"
        />
      </div>

      <div
        ref={discRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-0 w-0 will-change-transform"
      >
        <div
          ref={discInnerRef}
          style={{ opacity: 0 }}
          className="flex h-[100px] w-[100px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#F4EFE7]"
        >
          <span
            ref={labelRef}
            style={{ opacity: 0 }}
            className="font-mono text-[11px] font-bold uppercase tracking-widest text-[#120820]"
          >
            Open
          </span>
        </div>
      </div>
    </div>
  );
}
