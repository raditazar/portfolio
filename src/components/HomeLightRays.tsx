"use client";

import { LightRays } from "./ui/light-rays";

export default function HomeLightRays() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <LightRays
        count={5}
        color="rgba(147, 51, 234, 0.07)"
        blur={70}
        speed={16}
        length="80vh"
      />
    </div>
  );
}
