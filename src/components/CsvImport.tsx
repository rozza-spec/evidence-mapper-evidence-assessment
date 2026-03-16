"use client";

import { useState, useRef } from "react";
import { toast } from "sonner";
import { Upload, FileSpreadsheet, AlertCircle } from "lucide-react";

interface Props {
  onComplete: () => void;
}

interface CsvRow {
  name: string;
  email: string;
  phone: string;
  qualification: string;
  totalOwing: string;
}

function parseCsv(text: string): CsvRow[] {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length < 2) return [];

  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
  const nameIdx = headers.findIndex((h) => h.includes("name"));
  const emailIdx = headers.findIndex((h) => h.includes("email"));
  const phoneIdx = headers.findIndex((h) => h.includes("phone"));
  const qualIdx = headers.findIndex((h) => h.includes("qual") || h.includes("certificate") || h.includes("course"));
  const owingIdx = headers.findIndex((h) => h.includes("owing") || h.includes("amount") || h.includes("fee"));

  if (nameIdx === -1 || qualIdx === -1) return [];

  return lines.slice(1).map((line) => {
    const cols = line.split(",").map((c) => c.trim());
    return {
      name: cols[nameIdx] || "",
      email: emailIdx >= 0 ? cols[emailIdx] || "" : "",
      phone: phoneIdx >= 0 ? cols[phoneIdx] || "" : "",
      qualification: cols[qualIdx] || "",
      totalOwing: owingIdx >= 0 ? cols[owingIdx] || "0" : "0",
    };
  });
}

export default function CsvImport({ onComplete }: Props) {
  const [rows, setRows] = useState<CsvRow[]>([]);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");

    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const parsed = parseCsv(text);
      if (parsed.length === 0) {
        setError("CSV must have 'name' and 'qualification' columns");
        return;
      }
      setRows(parsed);
    };
    reader.readAsText(file);
  }

  async function handleImport() {
    setImporting(true);
    let success = 0;
    let failed = 0;

    for (const row of rows) {
      const res = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: row.name,
          email: row.email,
          phone: row.phone,
          qualification: row.qualification,
          totalOwing: Number(row.totalOwing) || 0,
        }),
      });
      if (res.ok) success++;
      else failed++;
    }

    setImporting(false);
    setRows([]);
    if (fileRef.current) fileRef.current.value = "";

    if (failed === 0) {
      toast.success(`Imported ${success} students`);
    } else {
      toast.warning(`Imported ${success}, failed ${failed}`);
    }
    onComplete();
  }

  return (
    <div className="bg-surface border border-surface-border p-4 space-y-3">
      <h4 className="font-display text-sm font-bold text-white flex items-center gap-2">
        <FileSpreadsheet size={14} className="text-accent" />
        CSV IMPORT
      </h4>

      <label className="flex items-center gap-2 px-3 py-2 border border-dashed border-accent/30 bg-accent/5 cursor-pointer hover:bg-accent/10 transition-colors">
        <Upload size={14} className="text-accent" />
        <span className="text-sm text-muted">Choose CSV file</span>
        <input
          ref={fileRef}
          type="file"
          accept=".csv"
          onChange={handleFile}
          className="hidden"
        />
      </label>

      {error && (
        <div className="flex items-center gap-2 text-xs text-red-400">
          <AlertCircle size={12} />
          {error}
        </div>
      )}

      {rows.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-muted">{rows.length} students found in CSV</p>

          <div className="max-h-40 overflow-y-auto border border-surface-border">
            <table className="w-full text-xs">
              <thead className="bg-surface-light sticky top-0">
                <tr>
                  <th className="px-2 py-1 text-left text-muted">Name</th>
                  <th className="px-2 py-1 text-left text-muted">Qualification</th>
                  <th className="px-2 py-1 text-right text-muted">Owing</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i} className="border-t border-surface-border">
                    <td className="px-2 py-1 text-white">{r.name}</td>
                    <td className="px-2 py-1 text-muted">{r.qualification}</td>
                    <td className="px-2 py-1 text-right text-accent">${Number(r.totalOwing).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            onClick={handleImport}
            disabled={importing}
            className="w-full py-2 text-sm font-semibold bg-accent text-primary hover:brightness-110 transition-all disabled:opacity-50"
          >
            {importing ? "Importing..." : `Import ${rows.length} Students`}
          </button>
        </div>
      )}
    </div>
  );
}
