import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

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
  const { name, email, phone, qualification, totalOwing } = body;

  if (!name || !qualification) {
    return NextResponse.json(
      { error: "Name and qualification are required" },
      { status: 400 }
    );
  }

  const student = await prisma.student.create({
    data: {
      name,
      email: email || null,
      phone: phone || null,
      qualification,
      totalOwing: Number(totalOwing) || 0,
    },
    include: { payments: true },
  });

  return NextResponse.json(
    { ...student, totalPaid: 0, balance: student.totalOwing },
    { status: 201 }
  );
}
