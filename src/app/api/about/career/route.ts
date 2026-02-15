import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const entries = await prisma.careerEntry.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json(entries);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch career entries" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const entry = await prisma.careerEntry.create({
      data: {
        type: body.type,
        title: body.title,
        organization: body.organization,
        description: body.description,
        startDate: body.startDate,
        endDate: body.endDate,
        isCurrent: body.isCurrent || false,
        order: body.order || 0,
      },
    });

    return NextResponse.json(entry, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create career entry" },
      { status: 500 }
    );
  }
}
