import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createStudentSchema } from "@/lib/validation";
import { logAction } from "@/lib/audit";

export async function GET() {
  const students = await prisma.student.findMany({
    include: { payments: { orderBy: { createdAt: "desc" } } },
    orderBy: { createdAt: "desc" },
  });

  const data = students.map((s) => {
    const totalPaid = s.payments.reduce((sum, p) => sum + p.amount, 0);
    return { ...s, totalPaid, balance: s.totalOwing - totalPaid };
  });

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = createStudentSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 }
    );
  }

  const { name, email, phone, qualification, totalOwing } = parsed.data;

  const student = await prisma.student.create({
    data: {
      name,
      email: email || null,
      phone: phone || null,
      qualification,
      totalOwing,
    },
    include: { payments: true },
  });

  await logAction("student.created", {
    targetId: student.id,
    details: `Enrolled ${name} in ${qualification}`,
  });

  return NextResponse.json(
    { ...student, totalPaid: 0, balance: student.totalOwing },
    { status: 201 }
  );
}
