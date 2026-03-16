"use client";

import { useState, useReducer, useCallback, useEffect } from "react";
import { toast } from "sonner";
import {
  EvidenceState,
  UnitCompetencyState,
  ViewMode,
  AssessorVerdict,
  QualificationId,
} from "@/lib/types";
import { EVIDENCE_ITEMS, QUALIFICATIONS, UNITS } from "@/lib/data";
import {
  computeStats,
  computeQualStats,
  computeUnitCoverage,
} from "@/lib/engine";
import Navigation from "@/components/Navigation";
import Dashboard from "@/components/Dashboard";
import MasterEvidenceList from "@/components/MasterEvidenceList";
import CarryOverMap from "@/components/CarryOverMap";
import StudentChecklist from "@/components/StudentChecklist";
import AssessorPanel from "@/components/AssessorPanel";
import GapAnalysis from "@/components/GapAnalysis";
import StudentManagement from "@/components/StudentManagement";
import StudentSelector from "@/components/StudentSelector";
import MobileBottomNav from "@/components/MobileBottomNav";

type EvidenceAction =
  | { type: "LOAD"; state: EvidenceState }
  | { type: "UPLOAD"; id: string }
  | { type: "REMOVE"; id: string }
  | { type: "SET_VERDICT"; id: string; verdict: AssessorVerdict }
  | { type: "RESET" };

function evidenceReducer(
  state: EvidenceState,
  action: EvidenceAction
): EvidenceState {
  switch (action.type) {
    case "LOAD":
      return action.state;
    case "UPLOAD":
      return {
        ...state,
        [action.id]: {
          status: "uploaded",
          assessorVerdict: state[action.id]?.assessorVerdict ?? null,
        },
      };
    case "REMOVE": {
      const next = { ...state };
      delete next[action.id];
      return next;
    }
    case "SET_VERDICT":
      return {
        ...state,
        [action.id]: {
          ...state[action.id],
          status: state[action.id]?.status ?? "missing",
          assessorVerdict: action.verdict,
        },
      };
    case "RESET":
      return {};
    default:
      return state;
  }
}

interface SelectedStudent {
  id: string;
  name: string;
  qualification: string;
}

export default function Home() {
  const [view, setView] = useState<ViewMode>("dashboard");
  const [qualFilter, setQualFilter] = useState<QualificationId | null>(null);
  const [evidenceState, dispatch] = useReducer(evidenceReducer, {});
  const [unitCompetency, setUnitCompetency] = useState<UnitCompetencyState>({});
  const [selectedStudent, setSelectedStudent] = useState<SelectedStudent | null>(null);

  useEffect(() => {
    if (!selectedStudent) {
      dispatch({ type: "RESET" });
      setUnitCompetency({});
      return;
    }

    async function loadStudentData() {
      const [evRes, compRes] = await Promise.all([
        fetch(`/api/students/${selectedStudent!.id}/evidence`),
        fetch(`/api/students/${selectedStudent!.id}/competency`),
      ]);

      if (evRes.ok) {
        const evState = await evRes.json();
        dispatch({ type: "LOAD", state: evState });
      }

      if (compRes.ok) {
        const compState = await compRes.json();
        setUnitCompetency(compState);
      }
    }

    loadStudentData();
  }, [selectedStudent]);

  const handleUpload = useCallback(
    async (id: string, file?: File) => {
      dispatch({ type: "UPLOAD", id });
      if (selectedStudent) {
        if (file) {
          const formData = new FormData();
          formData.append("evidenceItemId", id);
          formData.append("status", "uploaded");
          formData.append("file", file);
          const res = await fetch(`/api/students/${selectedStudent.id}/evidence`, {
            method: "POST",
            body: formData,
          });
          if (res.ok) {
            toast.success(`Evidence uploaded: ${file.name}`);
          } else {
            const data = await res.json();
            toast.error(data.error || "Upload failed");
          }
        } else {
          await fetch(`/api/students/${selectedStudent.id}/evidence`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ evidenceItemId: id, status: "uploaded" }),
          });
          toast.success("Evidence marked as uploaded");
        }
      }
    },
    [selectedStudent]
  );

  const handleRemove = useCallback(
    async (id: string) => {
      dispatch({ type: "REMOVE", id });
      if (selectedStudent) {
        await fetch(
          `/api/students/${selectedStudent.id}/evidence?evidenceItemId=${id}`,
          { method: "DELETE" }
        );
      }
    },
    [selectedStudent]
  );

  const handleVerdict = useCallback(
    async (id: string, verdict: AssessorVerdict) => {
      dispatch({ type: "SET_VERDICT", id, verdict });
      if (selectedStudent) {
        await fetch(`/api/students/${selectedStudent.id}/evidence`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            evidenceItemId: id,
            assessorVerdict: verdict,
          }),
        });
      }
    },
    [selectedStudent]
  );

  const handleReset = useCallback(() => dispatch({ type: "RESET" }), []);

  const handleSetCompetency = useCallback(
    async (unitCode: string, status: UnitCompetencyState[string]) => {
      setUnitCompetency((prev) => ({ ...prev, [unitCode]: status }));
      if (selectedStudent && status) {
        await fetch(`/api/students/${selectedStudent.id}/competency`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ unitCode, status }),
        });
      } else if (selectedStudent && !status) {
        await fetch(
          `/api/students/${selectedStudent.id}/competency?unitCode=${unitCode}`,
          { method: "DELETE" }
        );
      }
    },
    [selectedStudent]
  );

  const stats = computeStats(evidenceState);

  const needsStudent =
    view !== "dashboard" && view !== "students";

  return (
    <div className="min-h-screen">
      <Navigation
        currentView={view}
        onNavigate={setView}
        stats={stats}
      />

      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {needsStudent && (
          <StudentSelector
            selected={selectedStudent}
            onSelect={setSelectedStudent}
          />
        )}

        {view === "dashboard" && (
          <Dashboard
            stats={stats}
            evidenceState={evidenceState}
            qualFilter={qualFilter}
            onQualSelect={(q) => {
              setQualFilter(q);
              setView("evidence-list");
            }}
          />
        )}
        {view === "evidence-list" && (
          <MasterEvidenceList
            evidenceState={evidenceState}
            qualFilter={qualFilter}
            onQualFilter={setQualFilter}
            onUpload={handleUpload}
            onRemove={handleRemove}
          />
        )}
        {view === "coverage-map" && (
          <CarryOverMap
            evidenceState={evidenceState}
            qualFilter={qualFilter}
            onQualFilter={setQualFilter}
          />
        )}
        {view === "student-checklist" && (
          <StudentChecklist
            evidenceState={evidenceState}
            onUpload={handleUpload}
            onRemove={handleRemove}
          />
        )}
        {view === "assessor-panel" && (
          <AssessorPanel
            evidenceState={evidenceState}
            unitCompetency={unitCompetency}
            qualFilter={qualFilter}
            onQualFilter={setQualFilter}
            onVerdict={handleVerdict}
            onSetCompetency={handleSetCompetency}
            selectedStudent={selectedStudent}
          />
        )}
        {view === "gap-analysis" && (
          <GapAnalysis
            evidenceState={evidenceState}
            qualFilter={qualFilter}
            onQualFilter={setQualFilter}
            onUpload={handleUpload}
            selectedStudent={selectedStudent}
          />
        )}
        {view === "students" && <StudentManagement />}
      </main>

      <MobileBottomNav currentView={view} onNavigate={setView} />
      {/* Spacer for mobile bottom nav */}
      <div className="h-14 lg:hidden" />
    </div>
  );
}
