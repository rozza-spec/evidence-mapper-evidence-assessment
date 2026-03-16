import { PrismaClient } from "../src/generated/prisma";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcryptjs";
import path from "path";

const dbPath = path.join(process.cwd(), "dev.db");
const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` });
const prisma = new PrismaClient({ adapter });

async function main() {
  const existing = await prisma.user.findUnique({
    where: { email: "admin@preparetraining.com.au" },
  });

  if (!existing) {
    const hash = await bcrypt.hash("admin123", 12);
    await prisma.user.create({
      data: {
        name: "Admin",
        email: "admin@preparetraining.com.au",
        passwordHash: hash,
        role: "ADMIN",
      },
    });
    console.log("Created default admin user: admin@preparetraining.com.au / admin123");
  } else {
    console.log("Admin user already exists, skipping.");
  }

  const trainerExists = await prisma.user.findUnique({
    where: { email: "trainer@preparetraining.com.au" },
  });

  if (!trainerExists) {
    const hash = await bcrypt.hash("trainer123", 12);
    await prisma.user.create({
      data: {
        name: "Trainer",
        email: "trainer@preparetraining.com.au",
        passwordHash: hash,
        role: "TRAINER",
      },
    });
    console.log("Created default trainer user: trainer@preparetraining.com.au / trainer123");
  } else {
    console.log("Trainer user already exists, skipping.");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
