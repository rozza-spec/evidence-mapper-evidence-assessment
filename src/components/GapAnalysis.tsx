"use client";

import { EvidenceState, QualificationId } from "@/lib/types";
import { getGapAnalysis, computeStats } from "@/lib/engine";
import { UNITS } from "@/lib/data";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Target,
  Upload,
  Lightbulb,
} from "lucide-react";

interface Props {
  evidenceState: EvidenceState;
  qualFilter: QualificationId | null;
  onQualFilter: (q: QualificationId | null) => void;
  onUpload: (id: string) => void;
}

const QUAL_LABELS: Record<QualificationId, string> = {
  CPC40120: "Cert IV",
  CPC50220: "Diploma",
  CPC60220: "Adv Diploma",
};

function getColourClasses(colour: string) {
  switch (colour) {
    case "#FFD700": return { text: "text-yellow-400", dot: "bg-yellow-400" };
    case "#FF8C00": return { text: "text-orange-400", dot: "bg-orange-400" };
    case "#06B6D4": return { text: "text-cyan-400", dot: "bg-cyan-400" };
    case "#84CC16": return { text: "text-lime-400", dot: "bg-lime-400" };
    default: return { text: "text-slate-400", dot: "bg-slate-400" };
  }
}

export default function GapAnalysis({ evidenceState, qualFilter, onQualFilter, onUpload }: Props) {
  const analysis = getGapAnalysis(evidenceState);
  const stats = computeStats(evidenceState);

  const filteredGaps = qualFilter
    ? analysis.gapUnits.filter((g) => g.qualification === qualFilter)
    : analysis.gapUnits;

  const totalNeeded = filteredGaps.reduce((sum, g) => sum + g.needed, 0);
  const noAlternative = filteredGaps.filter((g) => g.suggestedEvidence.length === 0);

  return (
    <div className="py-8 space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <AlertTriangle size={24} className="text-accent" />
        <div>
          <h2 className="font-display text-4xl font-bold tracking-wide text-white">
            GAP ANALYSIS & ALTERNATIVES
          </h2>
          <p className="text-muted text-base mt-1">
            Units with fewer than 3 evidence items — with suggested alternatives to fill gaps
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

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-accent/10 border border-accent/30 p-4 text-center">
          <div className="font-display text-3xl font-bold text-accent">{stats.fullyEvidenced}</div>
          <div className="text-sm text-accent mt-1">Fully Evidenced</div>
        </div>
        <div className={`border p-4 text-center ${filteredGaps.length > 0 ? "bg-red-500/10 border-red-500/30" : "bg-surface border-surface-border"}`}>
          <div className={`font-display text-3xl font-bold ${filteredGaps.length > 0 ? "text-red-400" : "text-white"}`}>
            {filteredGaps.length}
          </div>
          <div className="text-sm text-muted mt-1">Units with Gaps</div>
        </div>
        <div className="bg-surface border border-surface-border p-4 text-center">
          <div className="font-display text-3xl font-bold text-white">{totalNeeded}</div>
          <div className="text-sm text-muted mt-1">Total Items Needed</div>
        </div>
        <div className={`border p-4 text-center ${noAlternative.length > 0 ? "bg-orange-500/10 border-orange-500/30" : "bg-surface border-surface-border"}`}>
          <div className={`font-display text-3xl font-bold ${noAlternative.length > 0 ? "text-orange-400" : "text-white"}`}>
            {noAlternative.length}
          </div>
          <div className="text-sm text-muted mt-1">Need Gap Training</div>
        </div>
      </div>

      {filteredGaps.length === 0 ? (
        <div className="bg-accent/5 border border-accent/30 p-8 text-center">
          <CheckCircle2 size={32} className="text-accent mx-auto mb-3" />
          <h3 className="font-display text-2xl font-bold text-accent">ALL UNITS FULLY EVIDENCED</h3>
          <p className="text-base text-muted mt-1">Every unit has 3 or more evidence items mapped.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredGaps.map((gap) => (
            <div key={`${gap.qualification}-${gap.unitCode}`} className="bg-surface border border-surface-border">
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm text-accent">{gap.unitCode}</span>
                      <span className={`text-xs px-1.5 py-0.5 border ${
                        gap.qualification === "CPC40120"
                          ? "border-blue-500/30 text-blue-400 bg-blue-500/10"
                          : gap.qualification === "CPC50220"
                          ? "border-purple-500/30 text-purple-400 bg-purple-500/10"
                          : "border-emerald-500/30 text-emerald-400 bg-emerald-500/10"
                      }`}>
                        {QUAL_LABELS[gap.qualification]}
                      </span>
                    </div>
                    <p className="text-sm text-muted mt-1">{gap.unitTitle}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          className={`w-3 h-3 border ${
                            i < gap.currentCount
                              ? "bg-accent border-accent"
                              : "bg-surface-light border-red-500/30"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-red-400 mt-1 block">
                      {gap.needed} more needed
                    </span>
                  </div>
                </div>

                {/* Suggested alternatives */}
                {gap.suggestedEvidence.length > 0 ? (
                  <div className="mt-3 pt-3 border-t border-surface-border">
                    <p className="text-sm font-bold text-white mb-2 flex items-center gap-1.5">
                      <Lightbulb size={12} className="text-accent" />
                      Suggested alternatives (ranked by transferability):
                    </p>
                    <div className="space-y-1.5">
                      {gap.suggestedEvidence.map((sev) => {
                        const cls = getColourClasses(sev.colourCode);
                        return (
                          <div key={sev.id} className="flex items-center gap-2">
                            <button
                              onClick={() => onUpload(sev.id)}
                              className="shrink-0 flex items-center gap-1.5 text-xs text-accent bg-accent/10 hover:bg-accent/20 px-2 py-1 transition-colors"
                            >
                              <Upload size={10} />
                              Upload
                            </button>
                            <div className={`w-2 h-2 ${cls.dot} shrink-0`} />
                            <span className={`text-sm ${cls.text}`}>{sev.name}</span>
                            <span className="text-xs font-mono text-muted ml-auto">
                              {sev.transferabilityScore} units
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="mt-3 pt-3 border-t border-surface-border">
                    <p className="text-sm text-orange-400 flex items-center gap-1.5">
                      <AlertTriangle size={12} />
                      No suitable evidence alternative — gap training required
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
