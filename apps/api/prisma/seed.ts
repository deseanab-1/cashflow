import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Scaffold-only: creates a few default categories under no user.
  // Once auth is implemented, you'll seed per-user defaults at signup instead.
  console.log("Seed scaffold: nothing to do yet.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

