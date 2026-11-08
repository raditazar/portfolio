import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { parseBody, requireAuth, revalidatePublic, serverError } from "@/lib/api";
import { profileUpdateSchema } from "@/lib/validation";
import { getProfile } from "@/lib/content";
import { DEFAULT_PROFILE } from "@/lib/content-defaults";

/** Public read: current profile (DB row or defaults). */
export async function GET() {
  try {
    return NextResponse.json(await getProfile());
  } catch (err) {
    return serverError("Failed to fetch profile", err);
  }
}

/** Partial update of the singleton profile; creates it from defaults on first save. */
export async function PUT(req: NextRequest) {
  const denied = await requireAuth();
  if (denied) return denied;

  const { data, error } = await parseBody(req, profileUpdateSchema);
  if (error) return error;

  try {
    const profile = await prisma.profile.upsert({
      where: { id: "main" },
      update: data,
      create: { ...DEFAULT_PROFILE, ...data, id: "main" },
    });
    revalidatePublic();
    return NextResponse.json(profile);
  } catch (err) {
    return serverError("Failed to save profile", err);
  }
}
