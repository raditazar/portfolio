import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { dbError, parseBody, requireAuth, revalidatePublic } from "@/lib/api";
import { galleryUpdateSchema } from "@/lib/validation";

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: Ctx) {
  const denied = await requireAuth();
  if (denied) return denied;

  const { data, error } = await parseBody(req, galleryUpdateSchema);
  if (error) return error;

  try {
    const { id } = await params;
    const row = await prisma.galleryItem.update({ where: { id }, data });
    revalidatePublic();
    return NextResponse.json(row);
  } catch (err) {
    return dbError("Failed to update gallery item", err);
  }
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const denied = await requireAuth();
  if (denied) return denied;

  try {
    const { id } = await params;
    await prisma.galleryItem.delete({ where: { id } });
    revalidatePublic();
    return NextResponse.json({ success: true });
  } catch (err) {
    return dbError("Failed to delete gallery item", err);
  }
}
