"use client";

import { useState, useMemo } from "react";
import { EvidenceState, QualificationId } from "@/lib/types";
import {
  EVIDENCE_ITEMS,
  UNITS,
  COLOUR_LEGEND,
  EVIDENCE_CATEGORIES,
  getQualificationsForEvidence,
} from "@/lib/data";
import {
  Search,
  Upload,
  X,
  ArrowUpDown,
  Info,
  CheckCircle2,
  Circle,
  Filter,
} from "lucide-react";

interface Props {
  evidenceState: EvidenceState;
  qualFilter: QualificationId | null;
  onQualFilter: (q: QualificationId | null) => void;
  onUpload: (id: string) => void;
  onRemove: (id: string) => void;
}

const QUAL_LABELS: Record<QualificationId, string> = {
  CPC40120: "Cert IV",
  CPC50220: "Diploma",
  CPC60220: "Adv Diploma",
};

const QUAL_COLOURS: Record<QualificationId, string> = {
  CPC40120: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  CPC50220: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  CPC60220: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
};

function getColourClasses(colour: string) {
  switch (colour) {
    case "#FFD700": return { bg: "bg-yellow-400/15", border: "border-yellow-400/50", text: "text-yellow-400", dot: "bg-yellow-400" };
    case "#FF8C00": return { bg: "bg-orange-400/15", border: "border-orange-400/50", text: "text-orange-400", dot: "bg-orange-400" };
    case "#06B6D4": return { bg: "bg-cyan-400/15", border: "border-cyan-400/50", text: "text-cyan-400", dot: "bg-cyan-400" };
    case "#84CC16": return { bg: "bg-lime-400/15", border: "border-lime-400/50", text: "text-lime-400", dot: "bg-lime-400" };
    default: return { bg: "bg-slate-400/15", border: "border-slate-400/50", text: "text-slate-400", dot: "bg-slate-400" };
  }
}

export default function MasterEvidenceList({
  evidenceState,
  qualFilter,
  onQualFilter,
  onUpload,
  onRemove,
}: Props) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"transferability" | "name" | "status">("transferability");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let items = [...EVIDENCE_ITEMS];

    if (qualFilter) {
      items = items.filter((ev) =>
        ev.unitMappings.some((uc) => {
          const unit = UNITS.find((u) => u.code === uc);
          return unit?.qualification === qualFilter;
        })
      );
    }

    if (categoryFilter) {
      items = items.filter((ev) => ev.category === categoryFilter);
    }

    if (search) {
      const s = search.toLowerCase();
      items = items.filter(
        (ev) =>
          ev.name.toLowerCase().includes(s) ||
          ev.description.toLowerCase().includes(s) ||
          ev.category.toLowerCase().includes(s) ||
          ev.unitMappings.some((u) => u.toLowerCase().includes(s))
      );
    }

    if (sortBy === "name") items.sort((a, b) => a.name.localeCompare(b.name));
    else if (sortBy === "status") {
      items.sort((a, b) => {
        const aUp = evidenceState[a.id]?.status === "uploaded" ? 1 : 0;
        const bUp = evidenceState[b.id]?.status === "uploaded" ? 1 : 0;
        return bUp - aUp;
      });
    }

    return items;
  }, [qualFilter, categoryFilter, search, sortBy, evidenceState]);

  return (
    <div className="py-8 space-y-6 animate-fade-in">
      <div>
        <h2 className="font-display text-4xl font-bold tracking-wide text-white">
          MASTER EVIDENCE LIST
        </h2>
        <p className="text-muted text-base mt-1">
          All evidence items ranked by transferability — items mapping to more units appear first
        </p>
      </div>

      {/* Colour Legend */}
      <div className="bg-surface border border-surface-border p-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-3 flex items-center gap-2">
          <Info size={14} className="text-accent" />
          Colour Code Legend — Transferability Rating
        </h3>
        <div className="flex flex-wrap gap-3">
          {COLOUR_LEGEND.map((c) => {
            const cls = getColourClasses(c.colour);
            return (
              <div key={c.colour} className={`flex items-center gap-2 px-3 py-1.5 border ${cls.border} ${cls.bg}`}>
                <div className={`w-3 h-3 ${cls.dot}`} />
                <span className={`text-sm font-medium ${cls.text}`}>{c.label}</span>
              </div>
            );
          })}
        </div>
        <p className="text-sm text-muted mt-2">
          <span className="text-yellow-400 font-bold">Gold</span> evidence maps to the most units across qualifications — upload these first for maximum carry-over coverage.
          Items highlighted in the <span className="text-yellow-400">same colour</span> share similar transferability and can be used interchangeably across multiple subjects.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Search evidence or unit code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-surface border border-surface-border text-sm text-white pl-9 pr-3 py-2 focus:outline-none focus:border-accent placeholder:text-muted/50"
          />
        </div>

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

        <select
          value={categoryFilter ?? ""}
          onChange={(e) => setCategoryFilter(e.target.value || null)}
          className="bg-surface border border-surface-border text-sm text-muted px-3 py-2 focus:outline-none focus:border-accent"
        >
          <option value="">All Categories</option>
          {EVIDENCE_CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="bg-surface border border-surface-border text-sm text-muted px-3 py-2 focus:outline-none focus:border-accent"
        >
          <option value="transferability">Sort: Most Transferable</option>
          <option value="name">Sort: Name A-Z</option>
          <option value="status">Sort: Uploaded First</option>
        </select>
      </div>

      {/* Results count */}
      <p className="text-sm text-muted">
        Showing {filtered.length} of {EVIDENCE_ITEMS.length} evidence items
      </p>

      {/* Evidence Table */}
      <div className="space-y-2">
        {filtered.map((ev) => {
          const cls = getColourClasses(ev.colourCode);
          const state = evidenceState[ev.id];
          const isUploaded = state?.status === "uploaded";
          const isRejected = state?.assessorVerdict === "rejected";
          const quals = getQualificationsForEvidence(ev);
          const isExpanded = expandedId === ev.id;

          return (
            <div
              key={ev.id}
              className={`bg-surface border ${cls.border} transition-all ${
                isUploaded && !isRejected ? "opacity-100" : "opacity-90 hover:opacity-100"
              }`}
            >
              <div className="flex items-start gap-3 p-4">
                {/* Colour indicator */}
                <div className={`w-1 self-stretch ${cls.dot} shrink-0`} />

                {/* Upload toggle */}
                <button
                  onClick={() => isUploaded ? onRemove(ev.id) : onUpload(ev.id)}
                  className="mt-0.5 shrink-0"
                  aria-label={isUploaded ? "Remove evidence" : "Upload evidence"}
                >
                  {isUploaded && !isRejected ? (
                    <CheckCircle2 size={20} className="text-accent" />
                  ) : isRejected ? (
                    <X size={20} className="text-red-400" />
                  ) : (
                    <Circle size={20} className="text-muted hover:text-accent transition-colors" />
                  )}
                </button>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : ev.id)}
                        className="text-left"
                      >
                        <h4 className={`font-medium text-base ${cls.text} hover:underline`}>
                          {ev.name}
                        </h4>
                      </button>
                      <p className="text-sm text-muted mt-0.5">{ev.description}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-sm font-mono font-bold ${cls.text}`}>
                        {ev.transferabilityScore} units
                      </span>
                      <span className={`w-6 h-6 flex items-center justify-center text-sm font-bold ${cls.bg} ${cls.text} border ${cls.border}`}>
                        {ev.transferabilityScore}
                      </span>
                    </div>
                  </div>

                  {/* Tags row */}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    <span className="text-xs text-muted bg-surface-light px-2 py-0.5 border border-surface-border">
                      {ev.category}
                    </span>
                    {quals.map((q) => (
                      <span key={q} className={`text-xs px-2 py-0.5 border ${QUAL_COLOURS[q]}`}>
                        {QUAL_LABELS[q]}
                      </span>
                    ))}
                    {isUploaded && !isRejected && (
                      <span className="text-xs px-2 py-0.5 bg-accent/20 text-accent border border-accent/30">
                        UPLOADED
                      </span>
                    )}
                    {isRejected && (
                      <span className="text-xs px-2 py-0.5 bg-red-500/20 text-red-400 border border-red-500/30">
                        REJECTED
                      </span>
                    )}
                  </div>

                  {/* Expanded: show unit mappings */}
                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t border-surface-border animate-fade-in">
                      <p className="text-sm font-bold text-white mb-2">Mapped to {ev.unitMappings.length} units:</p>
                      <div className="grid sm:grid-cols-2 gap-1">
                        {ev.unitMappings.map((uc) => {
                          const unit = UNITS.find((u) => u.code === uc);
                          if (!unit) return null;
                          return (
                            <div key={uc} className="flex items-start gap-2 text-sm">
                              <span className={`font-mono shrink-0 ${QUAL_COLOURS[unit.qualification].split(" ")[1]}`}>
                                {uc}
                              </span>
                              <span className="text-muted truncate">{unit.title}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
