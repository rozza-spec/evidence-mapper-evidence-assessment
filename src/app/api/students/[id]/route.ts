import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { logAction } from "@/lib/audit";
import { updateStudentSchema } from "@/lib/validation";

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
  return NextResponse.json({
    id: student.id,
    name: student.name,
    email: student.email,
    phone: student.phone,
    qualification: student.qualification,
    totalOwing: student.totalOwing,
    createdAt: student.createdAt,
    payments: student.payments.map((p) => ({
      id: p.id,
      amount: p.amount,
      invoiceFilename: p.invoiceFilename,
      invoicePath: p.invoicePath,
      note: p.note,
      createdAt: p.createdAt,
    })),
    totalPaid,
    balance: student.totalOwing - totalPaid,
  });
}

export async function PATCH(
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

  const parsed = updateStudentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const updates = parsed.data;

  const student = await prisma.student.update({
    where: { id },
    data: {
      ...(updates.name !== undefined && { name: updates.name }),
      ...(updates.email !== undefined && { email: updates.email || null }),
      ...(updates.phone !== undefined && { phone: updates.phone || null }),
      ...(updates.qualification !== undefined && { qualification: updates.qualification }),
      ...(updates.totalOwing !== undefined && { totalOwing: updates.totalOwing }),
    },
    include: { payments: true },
  });

  await logAction("student.updated", {
    targetId: id,
    details: `Updated ${student.name}`,
  });

  const totalPaid = student.payments.reduce((sum, p) => sum + p.amount, 0);
  return NextResponse.json({
    id: student.id,
    name: student.name,
    email: student.email,
    phone: student.phone,
    qualification: student.qualification,
    totalOwing: student.totalOwing,
    totalPaid,
    balance: student.totalOwing - totalPaid,
  });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const student = await prisma.student.findUnique({ where: { id } });

  if (!student) {
    return NextResponse.json({ error: "Student not found" }, { status: 404 });
  }

  await prisma.student.delete({ where: { id } });

  await logAction("student.deleted", {
    targetId: id,
    details: `Deleted ${student.name}`,
  });

  return NextResponse.json({ deleted: true });
}
