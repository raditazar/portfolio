import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const newPassword = process.argv[2];
  if (!newPassword) {
    console.error("Usage: npx tsx prisma/reset-password.ts <new-password>");
    process.exit(1);
  }

  const hashedPassword = await hash(newPassword, 12);

  const user = await prisma.user.update({
    where: { email: "radityaazhar@gmail.com" },
    data: { password: hashedPassword },
  });

  console.log(`Password updated for ${user.email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
