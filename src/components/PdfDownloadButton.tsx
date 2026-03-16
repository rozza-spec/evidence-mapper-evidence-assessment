"use client";

import { useState } from "react";
import { pdf } from "@react-pdf/renderer";
import { Download, Loader2 } from "lucide-react";

interface Props {
  document: React.ReactElement;
  fileName: string;
  label?: string;
  className?: string;
}

export default function PdfDownloadButton({
  document,
  fileName,
  label = "Export PDF",
  className = "",
}: Props) {
  const [generating, setGenerating] = useState(false);

  async function handleDownload() {
    setGenerating(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const blob = await pdf(document as any).toBlob();
      const url = URL.createObjectURL(blob);
      const a = window.document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setGenerating(false);
    }
  }

  return (
    <button
      onClick={handleDownload}
      disabled={generating}
      className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium border border-accent/30 text-accent hover:bg-accent/10 transition-all disabled:opacity-50 ${className}`}
    >
      {generating ? (
        <Loader2 size={14} className="animate-spin" />
      ) : (
        <Download size={14} />
      )}
      {generating ? "Generating..." : label}
    </button>
  );
}
