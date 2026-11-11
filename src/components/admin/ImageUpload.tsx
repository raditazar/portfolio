"use client";

import { useRef, useState } from "react";
import { Button } from "./Button";
import { useToast } from "./Toast";

const MAX_BYTES = 5 * 1024 * 1024;
const ACCEPT = "image/png,image/jpeg,image/webp,image/avif,image/gif";
const ALLOWED_TYPES = ACCEPT.split(",");
const TYPE_ERROR = "Unsupported file type. Use PNG, JPEG, WebP, AVIF or GIF.";
const SIZE_ERROR = "File too large. Maximum size is 5 MB.";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  id?: string;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean | "true" | "false";
  disabled?: boolean;
  /** Hide "Remove" for required images (an empty value would fail validation). */
  removable?: boolean;
}

export default function ImageUpload({
  value,
  onChange,
  id,
  "aria-describedby": ariaDescribedBy,
  "aria-invalid": ariaInvalid,
  disabled,
  removable = true,
}: ImageUploadProps) {
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [failedSrc, setFailedSrc] = useState("");

  function fail(message: string) {
    setError(message);
    toast(message, { tone: "error" });
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const input = e.target;
    const file = input.files?.[0];
    if (!file) return;
    setError("");

    try {
      if (!ALLOWED_TYPES.includes(file.type)) return fail(TYPE_ERROR);
      if (file.size > MAX_BYTES) return fail(SIZE_ERROR);

      setUploading(true);
      const body = new FormData();
      body.append("file", file);

      let res: Response;
      try {
        res = await fetch("/api/upload", { method: "POST", body });
      } catch {
        return fail("Upload failed. Check your connection and try again.");
      }

      let data: { url?: string; error?: string } | null = null;
      try {
        data = await res.json();
      } catch {
        data = null;
      }

      if (!res.ok || !data?.url) {
        return fail(data?.error || `Upload failed (${res.status}).`);
      }

      onChange(data.url);
      toast("Image uploaded", { tone: "success" });
    } finally {
      setUploading(false);
      input.value = "";
    }
  }

  const showImage = value !== "" && failedSrc !== value;

  return (
    <div className="flex flex-col gap-3">
      <div className="aspect-[16/10] w-full max-w-md rounded-2xl bg-canvas-raised overflow-hidden">
        {showImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={value}
            alt=""
            className="h-full w-full object-cover"
            onError={() => setFailedSrc(value)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-mono text-xs text-white/50">
            No image
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT}
          className="hidden"
          tabIndex={-1}
          onChange={handleFile}
        />
        <Button
          variant="secondary"
          size="sm"
          loading={uploading}
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? "Uploading…" : "Upload image"}
        </Button>
        {removable && value && (
          <Button
            variant="ghost"
            size="sm"
            disabled={disabled || uploading}
            onClick={() => {
              setError("");
              onChange("");
            }}
          >
            Remove
          </Button>
        )}
      </div>

      <input
        id={id}
        type="text"
        value={value}
        disabled={disabled}
        placeholder="Paste image URL or /path"
        aria-describedby={ariaDescribedBy}
        aria-invalid={ariaInvalid}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl bg-canvas-raised px-4 py-3 text-white placeholder:text-white/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-violet"
      />

      {error && (
        <p role="alert" className="text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
