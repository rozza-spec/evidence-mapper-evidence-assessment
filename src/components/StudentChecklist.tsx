"use client";

import { useMemo } from "react";
import { EvidenceState } from "@/lib/types";
import { EVIDENCE_ITEMS, UNITS } from "@/lib/data";
import { computeStats, getUploadImpact, getPriorityChecklist } from "@/lib/engine";
import { CheckCircle2, Circle, ArrowRight, Zap, Target } from "lucide-react";

interface Props {
  evidenceState: EvidenceState;
  onUpload: (id: string) => void;
  onRemove: (id: string) => void;
}

function getColourClasses(colour: string) {
  switch (colour) {
    case "#FFD700": return { text: "text-yellow-400", dot: "bg-yellow-400", bg: "bg-yellow-400/10" };
    case "#FF8C00": return { text: "text-orange-400", dot: "bg-orange-400", bg: "bg-orange-400/10" };
    case "#06B6D4": return { text: "text-cyan-400", dot: "bg-cyan-400", bg: "bg-cyan-400/10" };
    case "#84CC16": return { text: "text-lime-400", dot: "bg-lime-400", bg: "bg-lime-400/10" };
    default: return { text: "text-slate-400", dot: "bg-slate-400", bg: "bg-slate-400/10" };
  }
}

export default function StudentChecklist({ evidenceState, onUpload, onRemove }: Props) {
  const stats = computeStats(evidenceState);
  const remaining = getPriorityChecklist(evidenceState);
  const uploaded = EVIDENCE_ITEMS.filter(
    (ev) =>
      evidenceState[ev.id]?.status === "uploaded" &&
      evidenceState[ev.id]?.assessorVerdict !== "rejected"
  );

  const impacts = useMemo(() => {
    const map: Record<string, ReturnType<typeof getUploadImpact>> = {};
    for (const ev of remaining.slice(0, 20)) {
      map[ev.id] = getUploadImpact(ev.id, evidenceState);
    }
    return map;
  }, [remaining, evidenceState]);

  return (
    <div className="py-8 space-y-6 animate-fade-in">
      <div>
        <h2 className="font-display text-4xl font-bold tracking-wide text-white">
          STUDENT EVIDENCE CHECKLIST
        </h2>
        <p className="text-muted text-base mt-1">
          Upload evidence in priority order — most transferable first for maximum coverage
        </p>
      </div>

      {/* Progress summary */}
      <div className="bg-surface border border-surface-border p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Target size={16} className="text-accent" />
            <span className="text-base font-semibold text-white">Your Progress</span>
          </div>
          <span className="font-display text-2xl font-bold text-accent">{stats.coveragePercent}%</span>
        </div>
        <div className="w-full h-3 bg-surface-light overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-accent-dark to-accent progress-fill"
            style={{ width: `${stats.coveragePercent}%` }}
          />
        </div>
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="text-center">
            <div className="font-display text-2xl font-bold text-accent">{stats.fullyEvidenced}</div>
            <div className="text-sm text-muted">Units Complete</div>
          </div>
          <div className="text-center">
            <div className="font-display text-2xl font-bold text-white">{stats.partiallyEvidenced}</div>
            <div className="text-sm text-muted">Partially Covered</div>
          </div>
          <div className="text-center">
            <div className={`font-display text-2xl font-bold ${stats.noEvidence > 0 ? "text-red-400" : "text-white"}`}>
              {stats.noEvidence}
            </div>
            <div className="text-sm text-muted">Remaining</div>
          </div>
        </div>
      </div>

      {/* Uploaded items */}
      {uploaded.length > 0 && (
        <div>
          <h3 className="font-display text-xl font-bold text-accent mb-3 flex items-center gap-2">
            <CheckCircle2 size={16} />
            UPLOADED ({uploaded.length})
          </h3>
          <div className="space-y-1">
            {uploaded.map((ev) => {
              const cls = getColourClasses(ev.colourCode);
              return (
                <div key={ev.id} className="flex items-center gap-3 bg-accent/5 border border-accent/20 px-4 py-2.5">
                  <button onClick={() => onRemove(ev.id)} aria-label="Remove upload">
                    <CheckCircle2 size={18} className="text-accent" />
                  </button>
                  <div className={`w-1 h-4 ${cls.dot}`} />
                  <span className="text-base text-white flex-1">{ev.name}</span>
                  <span className="text-sm font-mono text-accent">{ev.transferabilityScore} units</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Remaining checklist */}
      <div>
        <h3 className="font-display text-xl font-bold text-white mb-3 flex items-center gap-2">
          <Zap size={16} className="text-accent" />
          PRIORITY UPLOAD LIST ({remaining.length} remaining)
        </h3>
        <p className="text-sm text-muted mb-4">
          Items are ordered by impact — uploading the top items first will cover the most units automatically through carry-over.
        </p>

        <div className="space-y-2">
          {remaining.map((ev, idx) => {
            const cls = getColourClasses(ev.colourCode);
            const impact = impacts[ev.id];

            return (
              <div key={ev.id} className={`bg-surface border border-surface-border hover:border-accent/30 transition-all`}>
                <div className="flex items-start gap-3 p-4">
                  <span className="font-mono text-xs text-muted w-6 text-right shrink-0 mt-0.5">
                    {idx + 1}.
                  </span>
                  <button onClick={() => onUpload(ev.id)} aria-label="Mark as uploaded">
                    <Circle size={18} className="text-muted hover:text-accent transition-colors mt-0.5" />
                  </button>
                  <div className={`w-1 self-stretch ${cls.dot} shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <h4 className={`text-base font-semibold ${cls.text}`}>{ev.name}</h4>
                    <p className="text-sm text-muted mt-0.5">{ev.description}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span className="text-xs font-mono text-muted bg-surface-light px-2 py-0.5">
                        {ev.category}
                      </span>
                      <span className={`text-xs font-mono ${cls.text} ${cls.bg} px-2 py-0.5`}>
                        {ev.transferabilityScore} units
                      </span>
                      {impact && (impact.completesUnits > 0 || impact.partiallyFills > 0) && (
                        <span className="text-xs flex items-center gap-1 text-accent bg-accent/10 px-2 py-0.5">
                          <ArrowRight size={10} />
                          {impact.completesUnits > 0 && `Completes ${impact.completesUnits} unit${impact.completesUnits > 1 ? "s" : ""}`}
                          {impact.completesUnits > 0 && impact.partiallyFills > 0 && " · "}
                          {impact.partiallyFills > 0 && `Fills ${impact.partiallyFills} partially`}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
