"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { EvidenceState, UnitCompetencyState, QualificationId } from "@/lib/types";

interface ExportButtonProps {
  label: string;
  onClick: () => Promise<void>;
  className?: string;
}

function ExportButton({ label, onClick, className = "" }: ExportButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      await onClick();
    } catch (err) {
      console.error("Export failed:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium border border-accent/30 text-accent hover:bg-accent/10 transition-all disabled:opacity-50 ${className}`}
    >
      {loading ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
      {loading ? "Generating..." : label}
    </button>
  );
}

async function generateAndDownload(element: React.ReactElement, filename: string) {
  const { pdf } = await import("@react-pdf/renderer");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const blob = await pdf(element as any).toBlob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function ExportEvidenceMatrix({
  studentName,
  qualification,
  evidenceState,
  qualFilter,
}: {
  studentName: string;
  qualification: string;
  evidenceState: EvidenceState;
  qualFilter?: QualificationId;
}) {
  return (
    <ExportButton
      label="Evidence Matrix PDF"
      onClick={async () => {
        const { default: Report } = await import("@/lib/reports/evidence-matrix");
        const el = Report({ studentName, qualification, evidenceState, qualFilter });
        await generateAndDownload(el, `evidence-matrix-${studentName.replace(/\s+/g, "-")}.pdf`);
      }}
    />
  );
}

export function ExportGapAnalysis({
  studentName,
  qualification,
  evidenceState,
}: {
  studentName: string;
  qualification: string;
  evidenceState: EvidenceState;
}) {
  return (
    <ExportButton
      label="Gap Analysis PDF"
      onClick={async () => {
        const { default: Report } = await import("@/lib/reports/gap-analysis");
        const el = Report({ studentName, qualification, evidenceState });
        await generateAndDownload(el, `gap-analysis-${studentName.replace(/\s+/g, "-")}.pdf`);
      }}
    />
  );
}

export function ExportCompetencyRecord({
  studentName,
  qualification,
  unitCompetency,
  qualFilter,
}: {
  studentName: string;
  qualification: string;
  unitCompetency: UnitCompetencyState;
  qualFilter?: QualificationId;
}) {
  return (
    <ExportButton
      label="Competency Record PDF"
      onClick={async () => {
        const { default: Report } = await import("@/lib/reports/competency-record");
        const el = Report({ studentName, qualification, unitCompetency, qualFilter });
        await generateAndDownload(el, `competency-record-${studentName.replace(/\s+/g, "-")}.pdf`);
      }}
    />
  );
}

export function ExportPaymentStatement({
  studentName,
  qualification,
  totalOwing,
  totalPaid,
  balance,
  payments,
}: {
  studentName: string;
  qualification: string;
  totalOwing: number;
  totalPaid: number;
  balance: number;
  payments: { id: string; amount: number; invoiceFilename: string | null; note: string | null; createdAt: string }[];
}) {
  return (
    <ExportButton
      label="Payment Statement PDF"
      onClick={async () => {
        const { default: Report } = await import("@/lib/reports/payment-statement");
        const el = Report({ studentName, qualification, totalOwing, totalPaid, balance, payments });
        await generateAndDownload(el, `payment-statement-${studentName.replace(/\s+/g, "-")}.pdf`);
      }}
    />
  );
}
