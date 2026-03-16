import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { createPaymentSchema } from "@/lib/validation";
import { logAction } from "@/lib/audit";
import { validatePdfUpload, sanitizeFilename } from "@/lib/file-validation";

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

  return NextResponse.json(
    payments.map((p) => ({
      id: p.id,
      amount: p.amount,
      invoiceFilename: p.invoiceFilename,
      invoicePath: p.invoicePath,
      note: p.note,
      createdAt: p.createdAt,
    }))
  );
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
  const rawAmount = formData.get("amount") as string;
  const rawNote = (formData.get("note") as string) || "";
  const file = formData.get("invoice") as File | null;

  const parsed = createPaymentSchema.safeParse({ amount: rawAmount, note: rawNote });
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const { amount, note } = parsed.data;

  let invoiceFilename: string | null = null;
  let invoicePath: string | null = null;

  if (file && file.size > 0) {
    const bytes = new Uint8Array(await file.arrayBuffer());
    const validation = validatePdfUpload(file, bytes);

    if (!validation.valid) {
      await logAction("upload.rejected", {
        targetId: id,
        details: `Invoice upload rejected: ${validation.error}`,
      });
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    await mkdir(UPLOAD_DIR, { recursive: true });
    const safeName = `${sanitizeFilename(id)}_${Date.now()}.pdf`;
    await writeFile(path.join(UPLOAD_DIR, safeName), bytes);
    invoiceFilename = sanitizeFilename(file.name);
    invoicePath = `/uploads/invoices/${safeName}`;
  }

  const payment = await prisma.payment.create({
    data: {
      amount,
      note: note || null,
      invoiceFilename,
      invoicePath,
      studentId: id,
    },
  });

  await logAction("payment.created", {
    targetId: id,
    details: `Payment of $${amount.toFixed(2)} for ${student.name}`,
  });

  const allPayments = await prisma.payment.findMany({ where: { studentId: id } });
  const totalPaid = allPayments.reduce((sum, p) => sum + p.amount, 0);
  const balance = student.totalOwing - totalPaid;

  return NextResponse.json({
    payment: {
      id: payment.id,
      amount: payment.amount,
      invoiceFilename: payment.invoiceFilename,
      invoicePath: payment.invoicePath,
      note: payment.note,
      createdAt: payment.createdAt,
    },
    totalPaid,
    balance,
  }, { status: 201 });
}
