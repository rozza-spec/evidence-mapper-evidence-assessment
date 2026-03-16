"use client";

import { useState } from "react";
import { EvidenceState, QualificationId } from "@/lib/types";
import { computeUnitCoverage } from "@/lib/engine";
import { UNITS } from "@/lib/data";
import { ChevronDown, ChevronUp, CheckCircle2, AlertCircle, XCircle } from "lucide-react";

interface Props {
  evidenceState: EvidenceState;
  qualFilter: QualificationId | null;
  onQualFilter: (q: QualificationId | null) => void;
}

const QUAL_LABELS: Record<QualificationId, string> = {
  CPC40120: "Cert IV",
  CPC50220: "Diploma",
  CPC60220: "Adv Diploma",
};

export default function CarryOverMap({ evidenceState, qualFilter, onQualFilter }: Props) {
  const [expandedUnit, setExpandedUnit] = useState<string | null>(null);
  const coverage = computeUnitCoverage(evidenceState, qualFilter ?? undefined);

  const fullyEvidenced = coverage.filter((u) => u.isFullyEvidenced).length;
  const partial = coverage.filter((u) => u.totalEvidence > 0 && !u.isFullyEvidenced).length;
  const none = coverage.filter((u) => u.totalEvidence === 0).length;

  return (
    <div className="py-8 space-y-6 animate-fade-in">
      <div>
        <h2 className="font-display text-4xl font-bold tracking-wide text-white">
          CARRY-OVER COVERAGE MAP
        </h2>
        <p className="text-muted text-base mt-1">
          Visual overview of evidence coverage per unit — 3 items required per unit
        </p>
      </div>

      {/* Qual filter */}
      <div className="flex gap-1">
        <button
          onClick={() => onQualFilter(null)}
          className={`px-3 py-2 text-sm font-medium border transition-all ${
            !qualFilter ? "border-accent text-accent bg-accent/10" : "border-surface-border text-muted hover:text-white"
          }`}
        >
          All ({coverage.length})
        </button>
        {(["CPC40120", "CPC50220", "CPC60220"] as QualificationId[]).map((q) => {
          const count = computeUnitCoverage(evidenceState, q).length;
          return (
            <button
              key={q}
              onClick={() => onQualFilter(qualFilter === q ? null : q)}
              className={`px-3 py-2 text-sm font-medium border transition-all ${
                qualFilter === q ? "border-accent text-accent bg-accent/10" : "border-surface-border text-muted hover:text-white"
              }`}
            >
              {QUAL_LABELS[q]} ({count})
            </button>
          );
        })}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-accent/10 border border-accent/30 p-4 text-center">
          <div className="font-display text-4xl font-bold text-accent">{fullyEvidenced}</div>
          <div className="text-sm text-accent mt-1">Fully Evidenced</div>
        </div>
        <div className="bg-surface border border-surface-border p-4 text-center">
          <div className="font-display text-4xl font-bold text-white">{partial}</div>
          <div className="text-sm text-muted mt-1">Partially Evidenced</div>
        </div>
        <div className={`border p-4 text-center ${none > 0 ? "bg-red-500/10 border-red-500/30" : "bg-surface border-surface-border"}`}>
          <div className={`font-display text-4xl font-bold ${none > 0 ? "text-red-400" : "text-white"}`}>{none}</div>
          <div className={`text-sm mt-1 ${none > 0 ? "text-red-400" : "text-muted"}`}>No Evidence</div>
        </div>
      </div>

      {/* Unit Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {coverage.map((unit) => {
          const unitKey = `${unit.qualification}-${unit.unitCode}`;
          const isExpanded = expandedUnit === unitKey;
          const pct = Math.min(100, Math.round((unit.totalEvidence / 3) * 100));
          let statusColour = "border-red-500/40 bg-red-500/5";
          let statusIcon = <XCircle size={16} className="text-red-400" />;
          if (unit.isFullyEvidenced) {
            statusColour = "border-accent/40 bg-accent/5";
            statusIcon = <CheckCircle2 size={16} className="text-accent" />;
          } else if (unit.totalEvidence > 0) {
            statusColour = "border-surface-border bg-surface";
            statusIcon = <AlertCircle size={16} className="text-muted" />;
          }

          return (
            <div key={`${unit.qualification}-${unit.unitCode}`} className={`border ${statusColour} transition-all`}>
              <button
                onClick={() => setExpandedUnit(isExpanded ? null : unitKey)}
                className="w-full text-left p-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {statusIcon}
                    <span className="font-mono text-sm text-accent">{unit.unitCode}</span>
                    {(() => {
                      const u = UNITS.find((u) => u.code === unit.unitCode && u.qualification === unit.qualification);
                      return u ? (
                        <span className={`text-xs px-1 py-0.5 border ${u.isCore ? "border-accent/30 text-accent/60" : "border-surface-border text-muted"}`}>
                          {u.isCore ? "CORE" : "ELECTIVE"}
                        </span>
                      ) : null;
                    })()}
                  </div>
                  {isExpanded ? <ChevronUp size={14} className="text-muted" /> : <ChevronDown size={14} className="text-muted" />}
                </div>
                <p className="text-sm text-muted mt-2 line-clamp-2">{unit.unitTitle}</p>

                {/* Progress dots */}
                <div className="flex items-center gap-2 mt-3">
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className={`w-4 h-4 border ${
                          i < unit.totalEvidence
                            ? "bg-accent border-accent"
                            : "bg-surface-light border-surface-border"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-mono text-muted">
                    {unit.totalEvidence}/3
                  </span>
                  {unit.needed > 0 && (
                    <span className="text-xs text-red-400 ml-auto">
                      {unit.needed} more needed
                    </span>
                  )}
                </div>

                {/* Progress bar */}
                <div className="w-full h-1 bg-surface-light mt-2 overflow-hidden">
                  <div
                    className={`h-full progress-fill ${unit.isFullyEvidenced ? "bg-accent" : "bg-muted"}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </button>

              {isExpanded && (
                <div className="border-t border-surface-border p-4 animate-fade-in">
                  <p className="text-sm font-bold text-white mb-2">Mapped Evidence:</p>
                  {unit.mappedEvidence.length === 0 ? (
                    <p className="text-sm text-muted italic">No evidence items mapped</p>
                  ) : (
                    <div className="space-y-1.5">
                      {unit.mappedEvidence.map((me) => (
                        <div key={me.evidenceId} className="flex items-center gap-2 text-sm">
                          {me.isUploaded && !me.isRejected ? (
                            <CheckCircle2 size={12} className="text-accent shrink-0" />
                          ) : me.isRejected ? (
                            <XCircle size={12} className="text-red-400 shrink-0" />
                          ) : (
                            <div className="w-3 h-3 border border-surface-border shrink-0" />
                          )}
                          <span className={me.isUploaded && !me.isRejected ? "text-white" : me.isRejected ? "text-red-400 line-through" : "text-muted"}>
                            {me.evidenceName}
                          </span>
                          {me.isUploaded && !me.isRejected && (
                            <span className="text-xs bg-accent/10 text-accent px-1.5 py-0.5 ml-auto">
                              carry-over
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
