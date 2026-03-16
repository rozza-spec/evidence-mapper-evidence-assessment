import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const student = await prisma.student.findUnique({
    where: { id },
    include: { payments: { orderBy: { createdAt: "desc" } } },
  });

  if (!student) {
    return NextResponse.json({ error: "Student not found" }, { status: 404 });
  }

  const totalPaid = student.payments.reduce((sum, p) => sum + p.amount, 0);
  return NextResponse.json({ ...student, totalPaid, balance: student.totalOwing - totalPaid });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const student = await prisma.student.update({
    where: { id },
    data: {
      ...(body.name !== undefined && { name: body.name }),
      ...(body.email !== undefined && { email: body.email }),
      ...(body.phone !== undefined && { phone: body.phone }),
      ...(body.qualification !== undefined && { qualification: body.qualification }),
      ...(body.totalOwing !== undefined && { totalOwing: Number(body.totalOwing) }),
    },
    include: { payments: true },
  });

  const totalPaid = student.payments.reduce((sum, p) => sum + p.amount, 0);
  return NextResponse.json({ ...student, totalPaid, balance: student.totalOwing - totalPaid });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.student.delete({ where: { id } });
  return NextResponse.json({ deleted: true });
}
