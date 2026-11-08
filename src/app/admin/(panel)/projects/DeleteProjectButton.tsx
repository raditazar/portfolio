"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/admin/Button";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { useToast } from "@/components/admin/Toast";
import { deleteProject } from "./actions";

export default function DeleteProjectButton({
  id,
  title,
}: {
  id: string;
  title: string;
}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const { toast } = useToast();

  function handleConfirm() {
    startTransition(async () => {
      try {
        await deleteProject(id);
        setOpen(false);
        toast("Project deleted", { tone: "success" });
        router.refresh();
      } catch (err) {
        toast(
          err instanceof Error ? err.message : "Failed to delete project",
          { tone: "error" },
        );
      }
    });
  }

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="text-danger hover:text-danger"
        onClick={() => setOpen(true)}
      >
        Delete
      </Button>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title={`Delete "${title}"?`}
        description="This cannot be undone."
        confirmLabel="Delete"
        tone="danger"
        loading={pending}
        onConfirm={handleConfirm}
      />
    </>
  );
}
