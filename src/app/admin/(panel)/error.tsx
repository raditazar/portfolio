"use client";

import { useEffect } from "react";
import { Button } from "@/components/admin/Button";

export default function PanelError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="rounded-2xl bg-canvas-surface p-12">
      <p className="font-mono text-xs uppercase tracking-widest text-white/50 mb-4">
        Error
      </p>
      <h2 className="font-serif font-black text-3xl text-white mb-4">
        Something went wrong
      </h2>
      <p className="text-white/60 mb-6">
        An unexpected error occurred while loading this page. Please try again.
      </p>
      {error.digest && (
        <p className="font-mono text-xs text-white/50 mb-6">{error.digest}</p>
      )}
      <Button variant="primary" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}
