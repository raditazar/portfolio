"use client";

import { LightRays } from "./ui/light-rays";

export default function HomeLightRays() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <LightRays
        count={5}
        color="rgba(120, 80, 200, 0.08)"
        blur={60}
        speed={18}
        length="80vh"
      />
    </div>
  );
}
