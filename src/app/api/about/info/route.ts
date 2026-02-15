import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const infos = await prisma.aboutInfo.findMany();
    const infoMap = Object.fromEntries(infos.map((i) => [i.key, i.value]));
    return NextResponse.json(infoMap);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch about info" },
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

    // body is { key: value } pairs
    for (const [key, value] of Object.entries(body)) {
      await prisma.aboutInfo.upsert({
        where: { key },
        update: { value: value as string },
        create: { key, value: value as string },
      });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to update about info" },
      { status: 500 }
    );
  }
}
