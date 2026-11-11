"use client";

import { useState } from "react";
import type { ClipboardEvent, KeyboardEvent } from "react";
import { cn } from "@/lib/utils";

type TagInputProps = {
  value: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
  id?: string;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean | "true" | "false";
  disabled?: boolean;
};

export function TagInput({
  value,
  onChange,
  placeholder,
  id,
  "aria-describedby": ariaDescribedBy,
  "aria-invalid": ariaInvalid,
  disabled,
}: TagInputProps) {
  const [draft, setDraft] = useState("");
  const invalid = ariaInvalid === true || ariaInvalid === "true";

  function commit(raw: string[]) {
    const next = [...value];
    const seen = new Set(next.map((t) => t.toLowerCase()));
    for (const part of raw) {
      const tag = part.trim();
      if (!tag) continue;
      const key = tag.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      next.push(tag);
    }
    if (next.length !== value.length) onChange(next);
  }

  function commitDraft() {
    commit([draft]);
    setDraft("");
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      commitDraft();
    } else if (e.key === "Backspace" && draft === "" && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  }

  function handlePaste(e: ClipboardEvent<HTMLInputElement>) {
    const text = e.clipboardData.getData("text");
    if (!text.includes(",")) return;
    e.preventDefault();
    commit((draft + text).split(","));
    setDraft("");
  }

  function remove(tag: string) {
    onChange(value.filter((t) => t !== tag));
  }

  return (
    <div
      className={cn(
        "rounded-xl bg-canvas-raised px-3 py-2 flex flex-wrap gap-2 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-accent-violet",
        invalid && "bg-danger-surface",
        disabled && "opacity-50 pointer-events-none",
      )}
    >
      {value.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center gap-2 rounded-full bg-cream-sheet text-cream-ink px-3 py-1 font-mono text-[11px] uppercase tracking-widest"
        >
          {tag}
          <button
            type="button"
            aria-label={`Remove ${tag}`}
            disabled={disabled}
            onClick={() => remove(tag)}
            className="cursor-pointer leading-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-violet"
          >
            ×
          </button>
        </span>
      ))}
      <input
        id={id}
        type="text"
        value={draft}
        disabled={disabled}
        placeholder={placeholder}
        aria-describedby={ariaDescribedBy}
        aria-invalid={ariaInvalid}
        onChange={(e) => {
          // Mobile keyboards often skip keydown for ",", so split here as well.
          const text = e.target.value;
          if (!text.includes(",")) return setDraft(text);
          const parts = text.split(",");
          setDraft(parts.pop() ?? "");
          commit(parts);
        }}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        onBlur={commitDraft}
        className="bg-transparent flex-1 min-w-[8ch] text-white placeholder:text-white/50 outline-none px-1 py-1"
      />
    </div>
  );
}

export default TagInput;
