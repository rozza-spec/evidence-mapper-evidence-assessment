import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { logAction } from "@/lib/audit";
import { z } from "zod/v4";

const enrolmentSchema = z.object({
  qualificationId: z.string().min(1, "Qualification is required"),
});

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const enrolments = await prisma.studentEnrolment.findMany({
    where: { studentId: id },
    orderBy: { enrolledAt: "desc" },
  });

  return NextResponse.json(
    enrolments.map((e) => ({
      id: e.id,
      qualificationId: e.qualificationId,
      status: e.status,
      enrolledAt: e.enrolledAt,
    }))
  );
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

  const parsed = enrolmentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const { qualificationId } = parsed.data;

  const existing = await prisma.studentEnrolment.findUnique({
    where: { studentId_qualificationId: { studentId: id, qualificationId } },
  });

  if (existing) {
    return NextResponse.json({ error: "Already enrolled in this qualification" }, { status: 409 });
  }

  const enrolment = await prisma.studentEnrolment.create({
    data: { studentId: id, qualificationId },
  });

  await logAction("enrolment.added", {
    targetId: id,
    details: `Added qualification ${qualificationId}`,
  });

  return NextResponse.json(
    { id: enrolment.id, qualificationId: enrolment.qualificationId, status: enrolment.status, enrolledAt: enrolment.enrolledAt },
    { status: 201 }
  );
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const url = new URL(request.url);
  const enrolmentId = url.searchParams.get("enrolmentId");

  if (!enrolmentId) {
    return NextResponse.json({ error: "enrolmentId is required" }, { status: 400 });
  }

  const enrolment = await prisma.studentEnrolment.findFirst({
    where: { id: enrolmentId, studentId: id },
  });

  if (!enrolment) {
    return NextResponse.json({ error: "Enrolment not found" }, { status: 404 });
  }

  await prisma.studentEnrolment.delete({ where: { id: enrolmentId } });

  await logAction("enrolment.removed", {
    targetId: id,
    details: `Removed qualification ${enrolment.qualificationId}`,
  });

  return NextResponse.json({ deleted: true });
}
