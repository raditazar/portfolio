import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const featured = searchParams.get("featured");

    const projects = await prisma.project.findMany({
      where: featured === "true" ? { isFeatured: true } : undefined,
      orderBy: { order: "asc" },
    });

    return NextResponse.json(projects);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch projects" },
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
    const project = await prisma.project.create({
      data: {
        title: body.title,
        description: body.description,
        category: body.category,
        categoryColor: body.categoryColor || "text-blue-400",
        techStack: body.techStack || [],
        imageSrc: body.imageSrc,
        imageAlt: body.imageAlt,
        liveUrl: body.liveUrl,
        githubUrl: body.githubUrl,
        caseStudyUrl: body.caseStudyUrl,
        isFeatured: body.isFeatured || false,
        order: body.order || 0,
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}
