"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  EvidenceState,
  UnitCompetencyState,
  QualificationId,
} from "@/lib/types";
import { EVIDENCE_ITEMS, QUALIFICATIONS, UNITS } from "@/lib/data";
import { computeStats, computeUnitCoverage } from "@/lib/engine";
import {
  GraduationCap,
  Upload,
  CheckCircle2,
  XCircle,
  Clock,
  DollarSign,
  FileText,
  Shield,
  TrendingUp,
  Paperclip,
} from "lucide-react";
import { toast } from "sonner";

interface StudentInfo {
  id: string;
  name: string;
  qualification: string;
  totalOwing: number;
  totalPaid: number;
  balance: number;
  evidenceCount: number;
  verifiedCount: number;
  competentCount: number;
  totalCompetency: number;
  payments: { id: string; amount: number; note: string | null; createdAt: string }[];
}

export default function StudentPortal() {
  const { data: session } = useSession();
  const [student, setStudent] = useState<StudentInfo | null>(null);
  const [evidenceState, setEvidenceState] = useState<EvidenceState>({});
  const [competency, setCompetency] = useState<UnitCompetencyState>({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "evidence" | "units" | "payments">("overview");

  useEffect(() => {
    async function load() {
      const meRes = await fetch("/api/me");
      if (!meRes.ok) { setLoading(false); return; }
      const me = await meRes.json();

      if (!me.student) { setLoading(false); return; }
      setStudent(me.student);

      const [evRes, compRes] = await Promise.all([
        fetch(`/api/students/${me.student.id}/evidence`),
        fetch(`/api/students/${me.student.id}/competency`),
      ]);

      if (evRes.ok) setEvidenceState(await evRes.json());
      if (compRes.ok) setCompetency(await compRes.json());
      setLoading(false);
    }
    load();
  }, []);

  async function handleUpload(evidenceItemId: string) {
    if (!student) return;
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const formData = new FormData();
      formData.append("evidenceItemId", evidenceItemId);
      formData.append("status", "uploaded");
      formData.append("file", file);

      const res = await fetch(`/api/students/${student.id}/evidence`, {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        toast.success(`Uploaded: ${file.name}`);
        setEvidenceState((prev) => ({
          ...prev,
          [evidenceItemId]: { status: "uploaded", assessorVerdict: null },
        }));
      } else {
        const data = await res.json();
        toast.error(data.error || "Upload failed");
      }
    };
    input.click();
  }

  if (loading) {
    return (
      <div className="py-16 text-center">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-surface-light rounded w-1/3 mx-auto" />
          <div className="h-4 bg-surface-light rounded w-1/2 mx-auto" />
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="py-16 text-center">
        <GraduationCap size={48} className="mx-auto text-muted mb-4" />
        <h2 className="font-display text-2xl font-bold text-white mb-2">No Student Record Found</h2>
        <p className="text-muted">Your account isn&apos;t linked to a student enrolment yet. Contact your trainer.</p>
      </div>
    );
  }

  const qual = QUALIFICATIONS.find((q) => q.id === student.qualification || q.code === student.qualification);
  const qualId = qual?.id as QualificationId | undefined;
  const qualUnits = qualId ? UNITS.filter((u) => u.qualification === qualId) : [];
  const stats = computeStats(evidenceState);
  const coverage = qualId ? computeUnitCoverage(evidenceState, qualId) : [];

  const uploadedCount = Object.values(evidenceState).filter((e) => e.status === "uploaded").length;
  const verifiedCount = Object.values(evidenceState).filter((e) => e.assessorVerdict === "verified").length;
  const rejectedCount = Object.values(evidenceState).filter((e) => e.assessorVerdict === "rejected").length;
  const pendingReviewCount = uploadedCount - verifiedCount - rejectedCount;

  const tabs = [
    { id: "overview" as const, label: "Overview", icon: <TrendingUp size={16} /> },
    { id: "evidence" as const, label: "My Evidence", icon: <FileText size={16} /> },
    { id: "units" as const, label: "Units", icon: <Shield size={16} /> },
    { id: "payments" as const, label: "Payments", icon: <DollarSign size={16} /> },
  ];

  return (
    <div className="py-8 space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="font-display text-4xl font-bold tracking-wide text-white">
          Welcome, {session?.user?.name || student.name}
        </h2>
        <p className="text-muted text-base mt-1">
          {qual?.title || student.qualification} &middot; Student Portal
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-surface-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold transition-all border-b-2 ${
              activeTab === tab.id
                ? "text-accent border-accent"
                : "text-muted border-transparent hover:text-white"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Stats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatBox icon={<Upload size={18} />} label="Evidence Uploaded" value={uploadedCount} accent />
            <StatBox icon={<CheckCircle2 size={18} />} label="Verified" value={verifiedCount} accent />
            <StatBox icon={<Clock size={18} />} label="Pending Review" value={pendingReviewCount} />
            <StatBox icon={<XCircle size={18} />} label="Rejected" value={rejectedCount} warn={rejectedCount > 0} />
          </div>

          {/* Progress */}
          <div className="bg-surface border border-surface-border p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-base font-medium text-white">Overall Progress</span>
              <span className="font-display text-3xl font-bold text-accent">{stats.coveragePercent}%</span>
            </div>
            <div className="w-full h-3 bg-surface-light overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-accent-dark to-accent progress-fill"
                style={{ width: `${stats.coveragePercent}%` }}
              />
            </div>
            <div className="flex justify-between mt-2 text-sm text-muted">
              <span>{stats.fullyEvidenced} of {stats.totalUnits} units fully evidenced</span>
              <span>{verifiedCount} items verified by assessor</span>
            </div>
          </div>

          {/* Financial summary */}
          <div className="bg-surface border border-surface-border p-4">
            <h3 className="font-display text-lg font-bold text-white mb-3">Financial Summary</h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center">
                <div className="font-display text-xl font-bold text-white">${student.totalOwing.toLocaleString()}</div>
                <div className="text-xs text-muted">Total Fees</div>
              </div>
              <div className="text-center">
                <div className="font-display text-xl font-bold text-accent">${student.totalPaid.toLocaleString()}</div>
                <div className="text-xs text-accent">Paid</div>
              </div>
              <div className="text-center">
                <div className={`font-display text-xl font-bold ${student.balance > 0 ? "text-red-400" : "text-accent"}`}>
                  ${student.balance.toLocaleString()}
                </div>
                <div className={`text-xs ${student.balance > 0 ? "text-red-400" : "text-accent"}`}>
                  {student.balance <= 0 ? "Paid in Full" : "Remaining"}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Evidence tab */}
      {activeTab === "evidence" && (
        <div className="space-y-3">
          <p className="text-sm text-muted mb-2">Upload PDF evidence documents for your qualification units.</p>
          {EVIDENCE_ITEMS.filter((ev) =>
            qualId ? ev.unitMappings.some((u) => qualUnits.some((qu) => qu.code === u)) : true
          ).map((ev) => {
            const state = evidenceState[ev.id];
            const isUploaded = state?.status === "uploaded";
            const verdict = state?.assessorVerdict;

            return (
              <div
                key={ev.id}
                className="bg-surface border border-surface-border p-4 flex items-start gap-4"
              >
                <div
                  className="w-1 h-12 shrink-0 rounded-full"
                  style={{ backgroundColor: ev.colourCode }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-white text-sm">{ev.name}</span>
                    {isUploaded && verdict === "verified" && (
                      <span className="text-[10px] px-1.5 py-0.5 bg-green-500/20 text-green-400 font-semibold">VERIFIED</span>
                    )}
                    {isUploaded && verdict === "rejected" && (
                      <span className="text-[10px] px-1.5 py-0.5 bg-red-500/20 text-red-400 font-semibold">REJECTED</span>
                    )}
                    {isUploaded && !verdict && (
                      <span className="text-[10px] px-1.5 py-0.5 bg-yellow-500/20 text-yellow-400 font-semibold">PENDING REVIEW</span>
                    )}
                  </div>
                  <p className="text-xs text-muted mt-0.5 line-clamp-1">{ev.description}</p>
                  {state?.fileName && (
                    <div className="flex items-center gap-1 mt-1 text-xs text-accent">
                      <Paperclip size={10} />
                      {state.fileName}
                    </div>
                  )}
                </div>

                {!isUploaded && (
                  <button
                    onClick={() => handleUpload(ev.id)}
                    className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-accent text-primary hover:brightness-110 transition-all"
                  >
                    <Upload size={12} />
                    Upload PDF
                  </button>
                )}
                {isUploaded && verdict === "rejected" && (
                  <button
                    onClick={() => handleUpload(ev.id)}
                    className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all"
                  >
                    <Upload size={12} />
                    Re-upload
                  </button>
                )}
                {isUploaded && verdict !== "rejected" && (
                  <CheckCircle2 size={20} className="shrink-0 text-accent" />
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Units tab */}
      {activeTab === "units" && (
        <div className="space-y-3">
          <p className="text-sm text-muted mb-2">Your unit competency status as assessed by your trainer.</p>
          {coverage.map((unit) => {
            const comp = competency[unit.unitCode];
            const unitInfo = UNITS.find((u) => u.code === unit.unitCode);

            return (
              <div
                key={`${unit.qualification}-${unit.unitCode}`}
                className="bg-surface border border-surface-border p-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-accent">{unit.unitCode}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 font-semibold ${
                        unitInfo?.isCore
                          ? "bg-accent/20 text-accent"
                          : "bg-surface-light text-muted"
                      }`}>
                        {unitInfo?.isCore ? "CORE" : "ELECTIVE"}
                      </span>
                    </div>
                    <p className="text-sm text-white mt-0.5">{unit.unitTitle}</p>
                    <p className="text-xs text-muted mt-1">
                      {unit.totalEvidence} evidence items &middot; {unit.mappedEvidence.filter((e) => e.isVerified).length} verified
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    {comp === "competent" && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-400 bg-green-500/20 px-2 py-1">
                        <CheckCircle2 size={12} />
                        Competent
                      </span>
                    )}
                    {comp === "not_yet_competent" && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-yellow-400 bg-yellow-500/20 px-2 py-1">
                        <Clock size={12} />
                        Not Yet Competent
                      </span>
                    )}
                    {comp === "gap_training" && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-400 bg-red-500/20 px-2 py-1">
                        <XCircle size={12} />
                        Gap Training
                      </span>
                    )}
                    {!comp && (
                      <span className="text-xs text-muted">Awaiting Assessment</span>
                    )}
                  </div>
                </div>

                {/* Evidence progress bar */}
                <div className="mt-2">
                  <div className="w-full h-1.5 bg-surface-light overflow-hidden">
                    <div
                      className={`h-full ${unit.isFullyEvidenced ? "bg-accent" : "bg-accent/50"}`}
                      style={{ width: `${Math.min(100, (unit.totalEvidence / unit.needed) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Payments tab */}
      {activeTab === "payments" && (
        <div className="space-y-4">
          {/* Balance card */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-surface border border-surface-border p-4 text-center">
              <div className="font-display text-2xl font-bold text-white">${student.totalOwing.toLocaleString()}</div>
              <div className="text-xs text-muted mt-1">Total Fees</div>
            </div>
            <div className="bg-accent/10 border border-accent/30 p-4 text-center">
              <div className="font-display text-2xl font-bold text-accent">${student.totalPaid.toLocaleString()}</div>
              <div className="text-xs text-accent mt-1">Amount Paid</div>
            </div>
            <div className={`border p-4 text-center ${student.balance > 0 ? "bg-red-500/10 border-red-500/30" : "bg-accent/10 border-accent/30"}`}>
              <div className={`font-display text-2xl font-bold ${student.balance > 0 ? "text-red-400" : "text-accent"}`}>
                ${student.balance.toLocaleString()}
              </div>
              <div className={`text-xs mt-1 ${student.balance > 0 ? "text-red-400" : "text-accent"}`}>
                {student.balance <= 0 ? "Paid in Full" : "Remaining"}
              </div>
            </div>
          </div>

          {/* Payment balance bar */}
          {student.totalOwing > 0 && (
            <div className="bg-surface border border-surface-border p-4">
              <div className="w-full h-3 bg-surface-light overflow-hidden">
                <div
                  className="h-full bg-accent"
                  style={{ width: `${Math.min(100, (student.totalPaid / student.totalOwing) * 100)}%` }}
                />
              </div>
              <p className="text-xs text-muted mt-2 text-center">
                {Math.round((student.totalPaid / student.totalOwing) * 100)}% paid
              </p>
            </div>
          )}

          {/* Payment history */}
          <div className="bg-surface border border-surface-border p-4">
            <h3 className="font-display text-lg font-bold text-white mb-3">Payment History</h3>
            {student.payments.length === 0 ? (
              <p className="text-sm text-muted">No payments recorded yet.</p>
            ) : (
              <div className="space-y-2">
                {student.payments.map((p) => (
                  <div key={p.id} className="flex items-center justify-between py-2.5 border-b border-surface-border last:border-0">
                    <div>
                      <span className="text-sm text-white font-medium">${p.amount.toLocaleString()}</span>
                      {p.note && <span className="text-xs text-muted ml-2">{p.note}</span>}
                    </div>
                    <span className="text-xs text-muted">
                      {new Date(p.createdAt).toLocaleDateString("en-AU")}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function StatBox({
  icon,
  label,
  value,
  accent,
  warn,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  accent?: boolean;
  warn?: boolean;
}) {
  return (
    <div className={`bg-surface border p-4 ${warn ? "border-red-500/30" : "border-surface-border"}`}>
      <div className={`mb-2 ${accent ? "text-accent" : warn ? "text-red-400" : "text-muted"}`}>
        {icon}
      </div>
      <div className={`font-display text-2xl font-bold ${accent ? "text-accent" : warn ? "text-red-400" : "text-white"}`}>
        {value}
      </div>
      <div className="text-xs text-muted mt-0.5">{label}</div>
    </div>
  );
}
