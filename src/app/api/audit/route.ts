import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const MAX_LIMIT = 50;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const raw = Number(searchParams.get("limit")) || 20;
  const limit = Math.min(Math.max(raw, 1), MAX_LIMIT);

  const logs = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    select: {
      id: true,
      action: true,
      userName: true,
      details: true,
      createdAt: true,
    },
  });

  return NextResponse.json(logs);
}
