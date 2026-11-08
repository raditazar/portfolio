/**
 * Reset (or create) the single admin login. Touches the `User` table only.
 *
 * Usage (type the password yourself so it never lands in chat or shell history files you share):
 *   ADMIN_EMAIL=you@example.com ADMIN_PASSWORD='a-long-password' npx tsx prisma/reset-admin.ts
 *
 * The password is hashed with bcrypt (cost 12), same as prisma/seed.ts. It is never printed.
 */
import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error("Set ADMIN_EMAIL and ADMIN_PASSWORD in the environment.");
  }
  if (password.length < 10) {
    throw new Error("ADMIN_PASSWORD must be at least 10 characters.");
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  const hashed = await hash(password, 12);

  if (existing) {
    await prisma.user.update({ where: { email }, data: { password: hashed } });
    console.log(`Password updated for existing admin: ${email}`);
  } else {
    await prisma.user.create({ data: { email, password: hashed, name: "Raditazar" } });
    console.log(`Admin created: ${email}`);
    console.log("Note: no user with this email existed before. Other users (if any) are untouched.");
  }
}

main()
  .catch((err) => {
    console.error(err instanceof Error ? err.message : err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
