"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { revalidatePublic } from "@/lib/api";

export async function deleteProject(id: string) {
  // Server actions are public endpoints: never rely on middleware alone.
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  await prisma.project.delete({ where: { id } });
  revalidatePath("/admin/projects");
  revalidatePath("/admin/dashboard");
  revalidatePublic();
}
