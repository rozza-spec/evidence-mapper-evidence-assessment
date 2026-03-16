import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // If user is a student, find their linked student record
  let studentData = null;
  if (user.role === "STUDENT") {
    const student = await prisma.student.findFirst({
      where: { userId: user.id },
      include: {
        payments: { orderBy: { createdAt: "desc" } },
        evidenceRecords: true,
        competencyRecords: true,
      },
    });

    if (student) {
      const totalPaid = student.payments.reduce((sum, p) => sum + p.amount, 0);
      studentData = {
        id: student.id,
        name: student.name,
        qualification: student.qualification,
        totalOwing: student.totalOwing,
        totalPaid,
        balance: student.totalOwing - totalPaid,
        evidenceCount: student.evidenceRecords.filter((r) => r.status === "uploaded").length,
        verifiedCount: student.evidenceRecords.filter((r) => r.assessorVerdict === "verified").length,
        competentCount: student.competencyRecords.filter((r) => r.status === "competent").length,
        totalCompetency: student.competencyRecords.length,
        payments: student.payments.map((p) => ({
          id: p.id,
          amount: p.amount,
          note: p.note,
          createdAt: p.createdAt,
        })),
      };
    }
  }

  return NextResponse.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    student: studentData,
  });
}
