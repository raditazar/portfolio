"use client";

/** Per-field validation messages returned by the API as `{ fieldErrors }`. */
export type FieldErrors = Record<string, string[] | undefined>;

export interface ApiResult<T = unknown> {
  ok: boolean;
  status: number;
  data?: T;
  /** Top-level message (never silently swallowed - show it next to the form). */
  error?: string;
  fieldErrors?: FieldErrors;
}

/** Tiny fetch wrapper for admin forms: JSON in/out, normalises errors. */
export async function apiRequest<T = unknown>(
  url: string,
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" = "GET",
  body?: unknown
): Promise<ApiResult<T>> {
  try {
    const res = await fetch(url, {
      method,
      headers: body === undefined ? undefined : { "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const json = await res.json().catch(() => undefined);
    if (res.ok) return { ok: true, status: res.status, data: json as T };
    return {
      ok: false,
      status: res.status,
      error: json?.error ?? `Request failed (${res.status})`,
      fieldErrors: json?.fieldErrors,
    };
  } catch {
    return { ok: false, status: 0, error: "Network error - please try again." };
  }
}

export const firstError = (errors: FieldErrors | undefined, name: string) =>
  errors?.[name]?.[0];

/** Upload one image file through /api/upload. */
export async function uploadImage(file: File): Promise<ApiResult<{ url: string; path: string }>> {
  try {
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: form });
    const json = await res.json().catch(() => undefined);
    if (res.ok) return { ok: true, status: res.status, data: json };
    return { ok: false, status: res.status, error: json?.error ?? "Upload failed" };
  } catch {
    return { ok: false, status: 0, error: "Network error - upload failed." };
  }
}
