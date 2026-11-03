"use client";

import { useEffect, useRef } from "react";

const INTERACTIVE =
  'a, button, [role="button"], input, textarea, select, [data-cursor-hover], .cursor-pointer';

/**
 * Landing-page cursor: liquid morphing blobs that chase the pointer, stretch
 * along movement and invert whatever is beneath (mix-blend-difference).
 * Mouse only; disabled for touch and prefers-reduced-motion.
 */
export default function LiquidCursor() {
  const rootRef = useRef<HTMLDivElement>(null);
  const leadRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const discRef = useRef<HTMLDivElement>(null);

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
      raf: 0, seen: false,
    };

    const tick = () => {
      const plx = s.lx;
      const ply = s.ly;
      s.lx += (s.tx - s.lx) * 0.2;
      s.ly += (s.ty - s.ly) * 0.2;
      s.rx += (s.tx - s.rx) * 0.08;
      s.ry += (s.ty - s.ry) * 0.08;
      s.dx += (s.tx - s.dx) * 0.5;
      s.dy += (s.ty - s.dy) * 0.5;

      s.vx += (s.lx - plx - s.vx) * 0.25;
      s.vy += (s.ly - ply - s.vy) * 0.25;
      const mag = Math.hypot(s.vx, s.vy);
      if (mag > 0.6) s.angle = (Math.atan2(s.vy, s.vx) * 180) / Math.PI;
      s.speed += (Math.min(mag / 40, 1) - s.speed) * 0.2;
      const sp = s.speed;

      if (leadRef.current) {
        leadRef.current.style.transform = `translate3d(${s.lx}px,${s.ly}px,0) rotate(${s.angle}deg) scale(${1 + sp * 0.9},${1 - sp * 0.45})`;
        const hue = (s.lx / window.innerWidth) * 80 - 40 + sp * 50;
        leadRef.current.style.filter = `hue-rotate(${hue}deg)`;
      }
      if (trailRef.current) {
        trailRef.current.style.transform = `translate3d(${s.rx}px,${s.ry}px,0) rotate(${s.angle}deg) scale(${1 + sp * 0.5},${1 - sp * 0.25})`;
      }
      if (dotRef.current) dotRef.current.style.transform = `translate3d(${s.dx}px,${s.dy}px,0)`;
      if (discRef.current) discRef.current.style.transform = `translate3d(${s.lx}px,${s.ly}px,0)`;

      const settled =
        Math.abs(s.tx - s.lx) < 0.3 && Math.abs(s.ty - s.ly) < 0.3 &&
        Math.abs(s.tx - s.rx) < 0.3 && Math.abs(s.ty - s.ry) < 0.3 && sp < 0.01;
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
      root.dataset.link = String(!!(e.target as Element | null)?.closest?.(INTERACTIVE));
      wake();
    };
    const onDown = () => (root.dataset.down = "true");
    const onUp = () => (root.dataset.down = "false");
    const onLeave = () => (root.dataset.on = "false");
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
  return (
    <div
      ref={rootRef}
      aria-hidden
      data-on="false"
      data-link="false"
      data-down="false"
      className="group contents"
    >
      <div
        ref={trailRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] opacity-0 mix-blend-difference will-change-transform group-data-[on=true]:opacity-70 group-data-[link=true]:!opacity-0"
      >
        <div className="animate-blob-b h-[70px] w-[70px] bg-[radial-gradient(circle_at_40%_40%,#F59E0B,#B91C1C)]" />
      </div>

      <div
        ref={leadRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] opacity-0 mix-blend-difference will-change-transform group-data-[on=true]:opacity-100 group-data-[link=true]:!opacity-0"
      >
        <div className="animate-blob-a h-[120px] w-[120px] bg-[radial-gradient(circle_at_35%_35%,#F4EFE7,#E879B9_75%)] transition-transform duration-200 group-data-[down=true]:scale-75" />
      </div>

      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] opacity-0 mix-blend-difference group-data-[on=true]:opacity-100 group-data-[link=true]:!opacity-0"
      >
        <div className="h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#F4EFE7]" />
      </div>

      <div
        ref={discRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] will-change-transform"
      >
        <div className="flex h-[76px] w-[76px] -translate-x-1/2 -translate-y-1/2 scale-0 items-center justify-center rounded-full bg-[#F4EFE7] font-mono text-[10px] font-bold uppercase tracking-widest text-[#120820] transition-transform duration-300 ease-out group-data-[link=true]:scale-100">
          Open
        </div>
      </div>
    </div>
  );
}
