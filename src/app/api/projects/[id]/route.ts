import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import {
  dbError,
  notFound,
  parseBody,
  requireAuth,
  revalidatePublic,
  serverError,
} from "@/lib/api";
import { projectUpdateSchema } from "@/lib/validation";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Ctx) {
  try {
    const { id } = await params;
    const project = await prisma.project.findUnique({ where: { id } });
    return project ? NextResponse.json(project) : notFound();
  } catch (err) {
    return serverError("Failed to fetch project", err);
  }
}

export async function PUT(req: NextRequest, { params }: Ctx) {
  const denied = await requireAuth();
  if (denied) return denied;

  const { data, error } = await parseBody(req, projectUpdateSchema);
  if (error) return error;

  try {
    const { id } = await params;
    const project = await prisma.project.update({ where: { id }, data });
    revalidatePublic();
    return NextResponse.json(project);
  } catch (err) {
    return dbError("Failed to update project", err);
  }
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const denied = await requireAuth();
  if (denied) return denied;

  try {
    const { id } = await params;
    await prisma.project.delete({ where: { id } });
    revalidatePublic();
    return NextResponse.json({ success: true });
  } catch (err) {
    return dbError("Failed to delete project", err);
  }
}
