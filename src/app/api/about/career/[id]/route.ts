import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { dbError, parseBody, requireAuth, revalidatePublic } from "@/lib/api";
import { careerUpdateSchema } from "@/lib/validation";

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: Ctx) {
  const denied = await requireAuth();
  if (denied) return denied;

  // Unknown keys (id, createdAt, ...) sent back by the form are stripped by the schema.
  const { data, error } = await parseBody(req, careerUpdateSchema);
  if (error) return error;

  try {
    const { id } = await params;
    const entry = await prisma.careerEntry.update({ where: { id }, data });
    revalidatePublic();
    return NextResponse.json(entry);
  } catch (err) {
    return dbError("Failed to update career entry", err);
  }
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const denied = await requireAuth();
  if (denied) return denied;

  try {
    const { id } = await params;
    await prisma.careerEntry.delete({ where: { id } });
    revalidatePublic();
    return NextResponse.json({ success: true });
  } catch (err) {
    return dbError("Failed to delete career entry", err);
  }
}
