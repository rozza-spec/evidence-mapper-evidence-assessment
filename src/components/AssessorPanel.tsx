"use client";

import { useState } from "react";
import {
  EvidenceState,
  UnitCompetencyState,
  QualificationId,
  AssessorVerdict,
  UnitCompetency,
} from "@/lib/types";
import { computeUnitCoverage } from "@/lib/engine";
import { EVIDENCE_ITEMS, UNITS } from "@/lib/data";
import {
  Shield,
  CheckCircle2,
  AlertCircle,
  XCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface Props {
  evidenceState: EvidenceState;
  unitCompetency: UnitCompetencyState;
  qualFilter: QualificationId | null;
  onQualFilter: (q: QualificationId | null) => void;
  onVerdict: (id: string, verdict: AssessorVerdict) => void;
  onSetCompetency: (unitCode: string, status: UnitCompetency) => void;
}

const QUAL_LABELS: Record<QualificationId, string> = {
  CPC40120: "Cert IV",
  CPC50220: "Diploma",
  CPC60220: "Adv Diploma",
};

const VERDICT_OPTIONS: { value: AssessorVerdict; label: string; colour: string }[] = [
  { value: "verified", label: "Verified", colour: "bg-accent text-primary" },
  { value: "queried", label: "Queried", colour: "bg-orange-500 text-white" },
  { value: "rejected", label: "Rejected", colour: "bg-red-500 text-white" },
];

const COMPETENCY_OPTIONS: { value: UnitCompetency; label: string; colour: string }[] = [
  { value: "competent", label: "Competent", colour: "border-accent text-accent bg-accent/10" },
  { value: "not_yet_competent", label: "Not Yet Competent", colour: "border-orange-500 text-orange-400 bg-orange-500/10" },
  { value: "gap_training", label: "Requires Gap Training", colour: "border-red-500 text-red-400 bg-red-500/10" },
];

export default function AssessorPanel({
  evidenceState,
  unitCompetency,
  qualFilter,
  onQualFilter,
  onVerdict,
  onSetCompetency,
}: Props) {
  const [expandedUnit, setExpandedUnit] = useState<string | null>(null);
  const coverage = computeUnitCoverage(evidenceState, qualFilter ?? undefined);

  return (
    <div className="py-8 space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <Shield size={24} className="text-accent" />
        <div>
          <h2 className="font-display text-4xl font-bold tracking-wide text-white">
            ASSESSOR PANEL
          </h2>
          <p className="text-muted text-base mt-1">
            Review evidence per unit — verify, query or reject items. Mark competency decisions.
          </p>
        </div>
      </div>

      {/* Qual filter */}
      <div className="flex gap-1">
        <button
          onClick={() => onQualFilter(null)}
          className={`px-3 py-2 text-sm font-medium border transition-all ${
            !qualFilter ? "border-accent text-accent bg-accent/10" : "border-surface-border text-muted hover:text-white"
          }`}
        >
          All
        </button>
        {(["CPC40120", "CPC50220", "CPC60220"] as QualificationId[]).map((q) => (
          <button
            key={q}
            onClick={() => onQualFilter(qualFilter === q ? null : q)}
            className={`px-3 py-2 text-sm font-medium border transition-all ${
              qualFilter === q ? "border-accent text-accent bg-accent/10" : "border-surface-border text-muted hover:text-white"
            }`}
          >
            {QUAL_LABELS[q]}
          </button>
        ))}
      </div>

      {/* Unit list */}
      <div className="space-y-2">
        {coverage.map((unit) => {
          const unitKey = `${unit.qualification}-${unit.unitCode}`;
          const isExpanded = expandedUnit === unitKey;
          const comp = unitCompetency[unit.unitCode];
          const uploadedItems = unit.mappedEvidence.filter((e) => e.isUploaded && !e.isRejected);

          let statusBorder = "border-surface-border";
          if (unit.isFullyEvidenced) statusBorder = "border-accent/40";
          else if (unit.totalEvidence > 0) statusBorder = "border-surface-border";
          else statusBorder = "border-red-500/30";

          return (
            <div key={unitKey} className={`bg-surface border ${statusBorder}`}>
              <button
                onClick={() => setExpandedUnit(isExpanded ? null : unitKey)}
                className="w-full text-left p-4 flex items-start justify-between"
              >
                <div className="flex items-start gap-3">
                  {unit.isFullyEvidenced ? (
                    <CheckCircle2 size={16} className="text-accent mt-0.5" />
                  ) : unit.totalEvidence > 0 ? (
                    <AlertCircle size={16} className="text-muted mt-0.5" />
                  ) : (
                    <XCircle size={16} className="text-red-400 mt-0.5" />
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm text-accent">{unit.unitCode}</span>
                      <span className="text-sm font-mono text-muted">
                        {unit.totalEvidence}/3 evidence
                      </span>
                      {unit.isFullyEvidenced && (
                        <span className="text-xs bg-accent/10 text-accent px-1.5 py-0.5">READY</span>
                      )}
                      {comp && (
                        <span className={`text-xs px-1.5 py-0.5 border ${
                          COMPETENCY_OPTIONS.find((o) => o.value === comp)?.colour ?? ""
                        }`}>
                          {COMPETENCY_OPTIONS.find((o) => o.value === comp)?.label}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted mt-1">{unit.unitTitle}</p>
                  </div>
                </div>
                {isExpanded ? <ChevronUp size={14} className="text-muted" /> : <ChevronDown size={14} className="text-muted" />}
              </button>

              {isExpanded && (
                <div className="border-t border-surface-border px-4 pb-4 pt-3 space-y-4 animate-fade-in">
                  {/* Evidence items */}
                  <div>
                    <p className="text-sm font-bold text-white mb-2">Evidence Items ({unit.mappedEvidence.length} mapped):</p>
                    <div className="space-y-2">
                      {unit.mappedEvidence.map((me) => {
                        const ev = EVIDENCE_ITEMS.find((e) => e.id === me.evidenceId);
                        if (!ev) return null;
                        const state = evidenceState[me.evidenceId];
                        const verdict = state?.assessorVerdict;

                        return (
                          <div key={me.evidenceId} className="flex items-center gap-3 py-2 px-3 bg-surface-light border border-surface-border">
                            {me.isUploaded && !me.isRejected ? (
                              <CheckCircle2 size={14} className="text-accent shrink-0" />
                            ) : me.isRejected ? (
                              <XCircle size={14} className="text-red-400 shrink-0" />
                            ) : (
                              <HelpCircle size={14} className="text-muted shrink-0" />
                            )}
                            <div className="flex-1 min-w-0">
                              <span className={`text-sm ${me.isRejected ? "text-red-400 line-through" : "text-white"}`}>
                                {me.evidenceName}
                              </span>
                              {me.isUploaded && !me.isRejected && (
                                <span className="text-xs text-accent ml-2">carry-over</span>
                              )}
                            </div>
                            {state?.status === "uploaded" && (
                              <div className="flex gap-1 shrink-0">
                                {VERDICT_OPTIONS.map((opt) => (
                                  <button
                                    key={opt.value}
                                    onClick={() =>
                                      onVerdict(me.evidenceId, verdict === opt.value ? null : opt.value)
                                    }
                                    className={`px-2 py-0.5 text-xs font-medium transition-all ${
                                      verdict === opt.value
                                        ? opt.colour
                                        : "bg-surface border border-surface-border text-muted hover:text-white"
                                    }`}
                                  >
                                    {opt.label}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Gap info */}
                  {unit.needed > 0 && (
                    <div className="bg-red-500/5 border border-red-500/20 p-3">
                      <p className="text-sm text-red-400 font-medium">
                        Gap: {unit.needed} more evidence item{unit.needed > 1 ? "s" : ""} needed for this unit
                      </p>
                    </div>
                  )}

                  {/* Competency decision */}
                  <div>
                    <p className="text-sm font-bold text-white mb-2">Competency Decision:</p>
                    <div className="flex gap-2">
                      {COMPETENCY_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() =>
                            onSetCompetency(unit.unitCode, comp === opt.value ? null : opt.value)
                          }
                          className={`px-3 py-1.5 text-sm font-medium border transition-all ${
                            comp === opt.value ? opt.colour : "border-surface-border text-muted hover:text-white"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
