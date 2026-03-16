"use client";

import { useState, useReducer, useCallback, useEffect } from "react";
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

type EvidenceAction =
  | { type: "UPLOAD"; id: string }
  | { type: "REMOVE"; id: string }
  | { type: "SET_VERDICT"; id: string; verdict: AssessorVerdict }
  | { type: "RESET" };

function evidenceReducer(
  state: EvidenceState,
  action: EvidenceAction
): EvidenceState {
  switch (action.type) {
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

export default function Home() {
  const [view, setView] = useState<ViewMode>("dashboard");
  const [qualFilter, setQualFilter] = useState<QualificationId | null>(null);
  const [evidenceState, dispatch] = useReducer(evidenceReducer, {});
  const [unitCompetency, setUnitCompetency] = useState<UnitCompetencyState>({});

  const handleUpload = useCallback(
    (id: string) => dispatch({ type: "UPLOAD", id }),
    []
  );
  const handleRemove = useCallback(
    (id: string) => dispatch({ type: "REMOVE", id }),
    []
  );
  const handleVerdict = useCallback(
    (id: string, verdict: AssessorVerdict) =>
      dispatch({ type: "SET_VERDICT", id, verdict }),
    []
  );
  const handleReset = useCallback(() => dispatch({ type: "RESET" }), []);

  const handleSetCompetency = useCallback(
    (unitCode: string, status: UnitCompetencyState[string]) => {
      setUnitCompetency((prev) => ({ ...prev, [unitCode]: status }));
    },
    []
  );

  const stats = computeStats(evidenceState);

  return (
    <div className="min-h-screen">
      <Navigation
        currentView={view}
        onNavigate={setView}
        stats={stats}
      />

      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pb-12">
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
          />
        )}
        {view === "gap-analysis" && (
          <GapAnalysis
            evidenceState={evidenceState}
            qualFilter={qualFilter}
            onQualFilter={setQualFilter}
            onUpload={handleUpload}
          />
        )}
        {view === "students" && <StudentManagement />}
      </main>
    </div>
  );
}
