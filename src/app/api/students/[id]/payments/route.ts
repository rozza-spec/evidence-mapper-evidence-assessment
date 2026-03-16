import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "invoices");

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const payments = await prisma.payment.findMany({
    where: { studentId: id },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(payments);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const student = await prisma.student.findUnique({ where: { id } });
  if (!student) {
    return NextResponse.json({ error: "Student not found" }, { status: 404 });
  }

  const formData = await request.formData();
  const amount = Number(formData.get("amount"));
  const note = (formData.get("note") as string) || null;
  const file = formData.get("invoice") as File | null;

  if (!amount || amount <= 0) {
    return NextResponse.json({ error: "Valid payment amount is required" }, { status: 400 });
  }

  let invoiceFilename: string | null = null;
  let invoicePath: string | null = null;

  if (file && file.size > 0) {
    await mkdir(UPLOAD_DIR, { recursive: true });
    const ext = path.extname(file.name) || ".pdf";
    const safeName = `${id}_${Date.now()}${ext}`;
    const bytes = new Uint8Array(await file.arrayBuffer());
    const fullPath = path.join(UPLOAD_DIR, safeName);
    await writeFile(fullPath, bytes);
    invoiceFilename = file.name;
    invoicePath = `/uploads/invoices/${safeName}`;
  }

  const payment = await prisma.payment.create({
    data: {
      amount,
      note,
      invoiceFilename,
      invoicePath,
      studentId: id,
    },
  });

  const allPayments = await prisma.payment.findMany({ where: { studentId: id } });
  const totalPaid = allPayments.reduce((sum, p) => sum + p.amount, 0);
  const balance = student.totalOwing - totalPaid;

  return NextResponse.json({ payment, totalPaid, balance }, { status: 201 });
}
