import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createStudentSchema } from "@/lib/validation";
import { logAction } from "@/lib/audit";
import bcrypt from "bcryptjs";

export async function GET() {
  const students = await prisma.student.findMany({
    include: {
      payments: { orderBy: { createdAt: "desc" } },
      enrolments: { orderBy: { enrolledAt: "desc" } },
    },
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

  // If email is provided, create a linked User account for student portal access
  let userId: string | null = null;
  if (email) {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (!existingUser) {
      const defaultPassword = await bcrypt.hash("student123", 12);
      const user = await prisma.user.create({
        data: {
          name,
          email,
          passwordHash: defaultPassword,
          role: "STUDENT",
        },
      });
      userId = user.id;
    }
  }

  const student = await prisma.student.create({
    data: {
      name,
      email: email || null,
      phone: phone || null,
      qualification,
      totalOwing,
      ...(userId ? { userId } : {}),
      enrolments: {
        create: { qualificationId: qualification },
      },
    },
    include: { payments: true, enrolments: true },
  });

  await logAction("student.created", {
    targetId: student.id,
    details: `Enrolled ${name} in ${qualification}${userId ? " (portal account created)" : ""}`,
  });

  return NextResponse.json(
    { ...student, totalPaid: 0, balance: student.totalOwing },
    { status: 201 }
  );
}
