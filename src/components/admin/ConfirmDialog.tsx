"use client";

import { useRef } from "react";
import { Dialog } from "radix-ui";
import { Button } from "./Button";

type ConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: "danger" | "primary";
  loading?: boolean;
  onConfirm: () => void | Promise<void>;
};

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  tone = "danger",
  loading = false,
  onConfirm,
}: ConfirmDialogProps) {
  const actionsRef = useRef<HTMLDivElement>(null);

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(next) => {
        if (loading && !next) return;
        onOpenChange(next);
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[90] bg-black/70 animate-in fade-in motion-reduce:animate-none" />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 z-[91] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-canvas-surface p-8 animate-in fade-in motion-reduce:animate-none"
          onOpenAutoFocus={(e) => {
            e.preventDefault();
            actionsRef.current?.querySelector("button")?.focus();
          }}
          onEscapeKeyDown={(e) => {
            if (loading) e.preventDefault();
          }}
          onPointerDownOutside={(e) => {
            if (loading) e.preventDefault();
          }}
          onInteractOutside={(e) => {
            if (loading) e.preventDefault();
          }}
        >
          <Dialog.Title className="font-serif text-2xl font-black text-white">
            {title}
          </Dialog.Title>
          {description ? (
            <Dialog.Description className="mt-3 text-white/60">
              {description}
            </Dialog.Description>
          ) : (
            <Dialog.Description className="sr-only">{title}</Dialog.Description>
          )}
          <div ref={actionsRef} className="mt-8 flex justify-end gap-3">
            <Button
              variant="secondary"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              {cancelLabel}
            </Button>
            <Button
              variant={tone === "danger" ? "danger" : "primary"}
              loading={loading}
              onClick={() => void onConfirm()}
            >
              {confirmLabel}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
