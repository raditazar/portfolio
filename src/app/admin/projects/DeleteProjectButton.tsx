"use client";

import { deleteProject } from "./actions";

export default function DeleteProjectButton({ id }: { id: string }) {
  return (
    <button
      type="button"
      className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs transition-colors"
      onClick={async () => {
        if (!confirm("Delete this project?")) return;
        await deleteProject(id);
      }}
    >
      Delete
    </button>
  );
}
