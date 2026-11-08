import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { parseBody, requireAuth, revalidatePublic, serverError } from "@/lib/api";
import { projectSchema } from "@/lib/validation";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const featured = searchParams.get("featured");

    const projects = await prisma.project.findMany({
      where: featured === "true" ? { isFeatured: true } : undefined,
      orderBy: { order: "asc" },
    });

    return NextResponse.json(projects);
  } catch (err) {
    return serverError("Failed to fetch projects", err);
  }
}

export async function POST(req: NextRequest) {
  const denied = await requireAuth();
  if (denied) return denied;

  const { data, error } = await parseBody(req, projectSchema);
  if (error) return error;

  try {
    const project = await prisma.project.create({ data });
    revalidatePublic();
    return NextResponse.json(project, { status: 201 });
  } catch (err) {
    return serverError("Failed to create project", err);
  }
}
