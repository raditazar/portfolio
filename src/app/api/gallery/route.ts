import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { parseBody, requireAuth, revalidatePublic, serverError } from "@/lib/api";
import { gallerySchema, reorderSchema } from "@/lib/validation";

export async function GET() {
  try {
    const rows = await prisma.galleryItem.findMany({ orderBy: { order: "asc" } });
    return NextResponse.json(rows);
  } catch (err) {
    return serverError("Failed to fetch gallery", err);
  }
}

export async function POST(req: NextRequest) {
  const denied = await requireAuth();
  if (denied) return denied;

  const { data, error } = await parseBody(req, gallerySchema);
  if (error) return error;

  try {
    const row = await prisma.galleryItem.create({ data });
    revalidatePublic();
    return NextResponse.json(row, { status: 201 });
  } catch (err) {
    return serverError("Failed to create gallery item", err);
  }
}

/** Bulk reorder: `{ items: [{ id, order }] }`. */
export async function PATCH(req: NextRequest) {
  const denied = await requireAuth();
  if (denied) return denied;

  const { data, error } = await parseBody(req, reorderSchema);
  if (error) return error;

  try {
    await prisma.$transaction(
      data.items.map((i) =>
        prisma.galleryItem.update({ where: { id: i.id }, data: { order: i.order } })
      )
    );
    revalidatePublic();
    return NextResponse.json({ success: true });
  } catch (err) {
    return serverError("Failed to reorder gallery", err);
  }
}
