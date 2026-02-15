import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { writeFile } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename
    const ext = path.extname(file.name);
    const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}${ext}`;
    const filepath = path.join(process.cwd(), "public", "images", filename);

    await writeFile(filepath, buffer);

    return NextResponse.json({
      url: `/images/${filename}`,
      filename,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
