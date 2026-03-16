import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { logAction } from "@/lib/audit";
import { competencyActionSchema } from "@/lib/validation";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const records = await prisma.competencyRecord.findMany({
    where: { studentId: id },
  });

  const state: Record<string, string> = {};
  for (const r of records) {
    state[r.unitCode] = r.status;
  }

  return NextResponse.json(state);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = competencyActionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const { unitCode, status, assessorId } = parsed.data;

  const record = await prisma.competencyRecord.upsert({
    where: {
      studentId_unitCode: { studentId: id, unitCode },
    },
    update: { status, assessorId: assessorId ?? null },
    create: {
      studentId: id,
      unitCode,
      status,
      assessorId: assessorId ?? null,
    },
  });

  await logAction("competency.decided", {
    targetId: id,
    details: `${unitCode} → ${status}`,
  });

  return NextResponse.json({
    id: record.id,
    unitCode: record.unitCode,
    status: record.status,
  }, { status: 201 });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const unitCode = searchParams.get("unitCode");

  if (!unitCode) {
    return NextResponse.json({ error: "unitCode required" }, { status: 400 });
  }

  await prisma.competencyRecord.deleteMany({
    where: { studentId: id, unitCode },
  });

  await logAction("competency.deleted", {
    targetId: id,
    details: `Removed competency for ${unitCode}`,
  });

  return NextResponse.json({ ok: true });
}
