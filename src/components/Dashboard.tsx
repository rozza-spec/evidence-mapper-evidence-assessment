"use client";

import { EvidenceState, QualificationId } from "@/lib/types";
import { computeQualStats } from "@/lib/engine";
import { QUALIFICATIONS, TGA_SOURCE } from "@/lib/data";
import {
  Building2,
  GraduationCap,
  Award,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Upload,
  Percent,
  TrendingUp,
  ExternalLink,
} from "lucide-react";

interface Props {
  stats: {
    totalUnits: number;
    fullyEvidenced: number;
    partiallyEvidenced: number;
    noEvidence: number;
    uploaded: number;
    totalEvidenceItems: number;
    coveragePercent: number;
  };
  evidenceState: EvidenceState;
  qualFilter: QualificationId | null;
  onQualSelect: (q: QualificationId) => void;
}

const QUAL_ICONS: Record<string, React.ReactNode> = {
  CPC40120: <Building2 size={28} className="text-accent" />,
  CPC50220: <GraduationCap size={28} className="text-accent" />,
  CPC60220: <Award size={28} className="text-accent" />,
};

export default function Dashboard({ stats, evidenceState, onQualSelect }: Props) {
  const qualStats = QUALIFICATIONS.map((q) => ({
    ...computeQualStats(evidenceState, q.id),
    tgaUrl: q.tgaUrl,
    coreCount: q.coreUnits.length,
    electiveCount: q.electiveUnits.length,
  }));

  return (
    <div className="py-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-wide text-white">
          RPL EVIDENCE DASHBOARD
        </h2>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
          <p className="text-muted text-base">
            Recognition of Prior Learning — Construction Qualifications
          </p>
          <a
            href={TGA_SOURCE.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-accent/70 hover:text-accent transition-colors"
          >
            <ExternalLink size={10} />
            <span>Source: {TGA_SOURCE.name}</span>
            <span className="text-muted">· verified {TGA_SOURCE.lastVerified}</span>
          </a>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard icon={<TrendingUp size={16} />} label="Total Units" value={stats.totalUnits} />
        <StatCard icon={<Upload size={16} />} label="Evidence Uploaded" value={stats.uploaded} accent />
        <StatCard icon={<CheckCircle2 size={16} />} label="Fully Evidenced" value={stats.fullyEvidenced} accent />
        <StatCard icon={<AlertCircle size={16} />} label="Partial Evidence" value={stats.partiallyEvidenced} />
        <StatCard icon={<XCircle size={16} />} label="No Evidence" value={stats.noEvidence} warn={stats.noEvidence > 0} />
        <StatCard icon={<Percent size={16} />} label="Coverage" value={`${stats.coveragePercent}%`} accent />
      </div>

      {/* Overall Progress */}
      <div className="bg-surface border border-surface-border p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-base font-medium text-white">Overall Evidence Coverage</span>
          <span className="font-display text-3xl font-bold text-accent">{stats.coveragePercent}%</span>
        </div>
        <div className="w-full h-3 bg-surface-light overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-accent-dark to-accent progress-fill"
            style={{ width: `${stats.coveragePercent}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-sm text-muted">
          <span>{stats.fullyEvidenced} of {stats.totalUnits} units complete</span>
          <span>{stats.totalEvidenceItems} evidence items available</span>
        </div>
      </div>

      {/* Qualification Cards */}
      <div>
        <h3 className="font-display text-2xl font-bold tracking-wide text-white mb-4">
          QUALIFICATIONS
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          {qualStats.map((q) => (
            <button
              key={q.id}
              onClick={() => onQualSelect(q.id)}
              className="text-left bg-surface border border-surface-border p-5 card-hover group"
            >
              <div className="flex items-start justify-between mb-4">
                {QUAL_ICONS[q.id]}
                <span className="font-mono text-sm text-accent bg-accent/10 px-2 py-0.5">
                  {q.code}
                </span>
              </div>
              <h4 className="font-display text-xl font-bold text-white group-hover:text-accent transition-colors leading-tight mb-1">
                {q.level}
              </h4>
              <p className="text-sm text-muted mb-1 line-clamp-2">{q.title}</p>
              <p className="text-xs text-muted/60 mb-3">
                {q.coreCount} core · {q.electiveCount} elective
              </p>

              {/* Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted">{q.fullyEvidenced} / {q.totalUnits} units</span>
                  <span className="text-accent font-mono">{q.percent}%</span>
                </div>
                <div className="w-full h-2 bg-surface-light overflow-hidden">
                  <div
                    className="h-full bg-accent progress-fill"
                    style={{ width: `${q.percent}%` }}
                  />
                </div>
              </div>

              <a
                href={q.tgaUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 mt-3 text-xs text-accent/50 hover:text-accent transition-colors"
              >
                <ExternalLink size={9} />
                View on training.gov.au
              </a>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  accent,
  warn,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  accent?: boolean;
  warn?: boolean;
}) {
  return (
    <div className={`bg-surface border p-4 ${warn ? "border-red-500/30" : "border-surface-border"}`}>
      <div className={`mb-2 ${accent ? "text-accent" : warn ? "text-red-400" : "text-muted"}`}>
        {icon}
      </div>
      <div className={`font-display text-3xl font-bold ${accent ? "text-accent" : warn ? "text-red-400" : "text-white"}`}>
        {value}
      </div>
      <div className="text-sm text-muted mt-0.5">{label}</div>
    </div>
  );
}
