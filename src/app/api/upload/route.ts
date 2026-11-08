import { NextRequest, NextResponse } from "next/server";
import { requireAuth, serverError } from "@/lib/api";
import { getSupabaseAdmin, IMAGE_BUCKET } from "@/lib/supabase-admin";

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/gif": "gif",
};

/** POST multipart `file` -> `{ url, path }`. Auth required. */
export async function POST(req: NextRequest) {
  const denied = await requireAuth();
  if (denied) return denied;

  let supabase;
  try {
    supabase = getSupabaseAdmin();
  } catch (err) {
    return serverError(err instanceof Error ? err.message : "Storage not configured", err);
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    const ext = ALLOWED[file.type];
    if (!ext) {
      return NextResponse.json(
        { error: "Unsupported file type. Use PNG, JPEG, WebP, AVIF or GIF." },
        { status: 415 }
      );
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 5 MB." },
        { status: 413 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const path = `uploads/${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${ext}`;

    const { error } = await supabase.storage
      .from(IMAGE_BUCKET)
      .upload(path, buffer, { contentType: file.type, upsert: false });
    if (error) return serverError("Failed to upload file", error);

    const { data } = supabase.storage.from(IMAGE_BUCKET).getPublicUrl(path);
    return NextResponse.json({ url: data.publicUrl, path });
  } catch (err) {
    return serverError("Failed to upload file", err);
  }
}

/** DELETE `?path=uploads/...` removes an uploaded object. Auth required. */
export async function DELETE(req: NextRequest) {
  const denied = await requireAuth();
  if (denied) return denied;

  const path = new URL(req.url).searchParams.get("path");
  if (!path || !path.startsWith("uploads/") || path.includes("..")) {
    return NextResponse.json({ error: "Invalid path" }, { status: 400 });
  }

  try {
    const { error } = await getSupabaseAdmin().storage.from(IMAGE_BUCKET).remove([path]);
    if (error) return serverError("Failed to delete file", error);
    return NextResponse.json({ success: true });
  } catch (err) {
    return serverError("Failed to delete file", err);
  }
}
