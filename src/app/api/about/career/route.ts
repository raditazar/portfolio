import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { parseBody, requireAuth, revalidatePublic, serverError } from "@/lib/api";
import { careerSchema } from "@/lib/validation";

export async function GET() {
  try {
    const entries = await prisma.careerEntry.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json(entries);
  } catch (err) {
    return serverError("Failed to fetch career entries", err);
  }
}

export async function POST(req: NextRequest) {
  const denied = await requireAuth();
  if (denied) return denied;

  const { data, error } = await parseBody(req, careerSchema);
  if (error) return error;

  try {
    const entry = await prisma.careerEntry.create({ data });
    revalidatePublic();
    return NextResponse.json(entry, { status: 201 });
  } catch (err) {
    return serverError("Failed to create career entry", err);
  }
}
