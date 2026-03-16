import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { logAction } from "@/lib/audit";
import { validatePdfUpload, sanitizeFilename } from "@/lib/file-validation";
import { evidenceActionSchema } from "@/lib/validation";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "evidence");

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const records = await prisma.evidenceRecord.findMany({
    where: { studentId: id },
  });

  const state: Record<
    string,
    { status: string; assessorVerdict: string | null; filePath: string | null; fileName: string | null }
  > = {};
  for (const r of records) {
    state[r.evidenceItemId] = {
      status: r.status,
      assessorVerdict: r.assessorVerdict,
      filePath: r.filePath,
      fileName: r.fileName,
    };
  }

  return NextResponse.json(state);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const contentType = request.headers.get("content-type") || "";

  let evidenceItemId: string;
  let status = "uploaded";
  let assessorVerdict: string | null = null;
  let filePath: string | null = null;
  let fileName: string | null = null;

  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    evidenceItemId = formData.get("evidenceItemId") as string;
    status = (formData.get("status") as string) || "uploaded";
    assessorVerdict = (formData.get("assessorVerdict") as string) || null;

    const file = formData.get("file") as File | null;
    if (file && file.size > 0) {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const validation = validatePdfUpload(file, bytes);

      if (!validation.valid) {
        await logAction("upload.rejected", {
          targetId: id,
          details: `Evidence upload rejected: ${validation.error}`,
        });
        return NextResponse.json({ error: validation.error }, { status: 400 });
      }

      const studentDir = path.join(UPLOAD_DIR, id);
      await mkdir(studentDir, { recursive: true });
      const safeName = `${sanitizeFilename(evidenceItemId)}_${Date.now()}.pdf`;
      await writeFile(path.join(studentDir, safeName), bytes);
      filePath = `/uploads/evidence/${id}/${safeName}`;
      fileName = sanitizeFilename(file.name);
    }
  } else {
    const body = await request.json();
    const parsed = evidenceActionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }
    evidenceItemId = parsed.data.evidenceItemId;
    status = parsed.data.status;
    assessorVerdict = parsed.data.assessorVerdict ?? null;
  }

  if (!evidenceItemId) {
    return NextResponse.json({ error: "evidenceItemId required" }, { status: 400 });
  }

  const existing = await prisma.evidenceRecord.findUnique({
    where: { studentId_evidenceItemId: { studentId: id, evidenceItemId } },
  });

  const record = await prisma.evidenceRecord.upsert({
    where: {
      studentId_evidenceItemId: { studentId: id, evidenceItemId },
    },
    update: {
      status,
      ...(assessorVerdict !== null ? { assessorVerdict } : {}),
      ...(filePath ? { filePath, fileName } : {}),
    },
    create: {
      studentId: id,
      evidenceItemId,
      status,
      assessorVerdict,
      filePath: filePath ?? existing?.filePath ?? null,
      fileName: fileName ?? existing?.fileName ?? null,
    },
  });

  await logAction("evidence.updated", {
    targetId: id,
    details: `Evidence ${evidenceItemId} → ${status}${assessorVerdict ? ` (${assessorVerdict})` : ""}`,
  });

  return NextResponse.json({
    id: record.id,
    evidenceItemId: record.evidenceItemId,
    status: record.status,
    assessorVerdict: record.assessorVerdict,
    filePath: record.filePath,
    fileName: record.fileName,
  }, { status: 201 });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const evidenceItemId = searchParams.get("evidenceItemId");

  if (!evidenceItemId) {
    return NextResponse.json({ error: "evidenceItemId required" }, { status: 400 });
  }

  await prisma.evidenceRecord.deleteMany({
    where: { studentId: id, evidenceItemId },
  });

  await logAction("evidence.deleted", {
    targetId: id,
    details: `Removed evidence ${evidenceItemId}`,
  });

  return NextResponse.json({ ok: true });
}
