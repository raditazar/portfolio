import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const settings = await prisma.siteSetting.findMany();
    const settingsMap = Object.fromEntries(
      settings.map((s) => [s.key, s.value])
    );
    return NextResponse.json(settingsMap);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    for (const [key, value] of Object.entries(body)) {
      await prisma.siteSetting.upsert({
        where: { key },
        update: { value: value as string },
        create: { key, value: value as string },
      });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
