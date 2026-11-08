import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { dbError, parseBody, requireAuth, revalidatePublic } from "@/lib/api";
import { socialUpdateSchema } from "@/lib/validation";

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: Ctx) {
  const denied = await requireAuth();
  if (denied) return denied;

  const { data, error } = await parseBody(req, socialUpdateSchema);
  if (error) return error;

  try {
    const { id } = await params;
    const row = await prisma.socialLink.update({ where: { id }, data });
    revalidatePublic();
    return NextResponse.json(row);
  } catch (err) {
    return dbError("Failed to update social link", err);
  }
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const denied = await requireAuth();
  if (denied) return denied;

  try {
    const { id } = await params;
    await prisma.socialLink.delete({ where: { id } });
    revalidatePublic();
    return NextResponse.json({ success: true });
  } catch (err) {
    return dbError("Failed to delete social link", err);
  }
}
