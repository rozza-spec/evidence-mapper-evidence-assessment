export type QualificationId = "CPC40120" | "CPC50220" | "CPC60220";

export interface Qualification {
  id: QualificationId;
  code: string;
  title: string;
  level: string;
  coreUnits: string[];
  electiveUnits: string[];
  units: string[];
  tgaUrl: string;
}

export interface Unit {
  code: string;
  title: string;
  qualification: QualificationId;
  isCore: boolean;
}

export type EvidenceStatus = "uploaded" | "pending" | "missing";
export type AssessorVerdict = "verified" | "queried" | "rejected" | null;
export type UnitCompetency = "competent" | "not_yet_competent" | "gap_training" | null;

export interface EvidenceItem {
  id: string;
  name: string;
  description: string;
  category: string;
  unitMappings: string[];
  colourCode: string;
  colourLabel: string;
  transferabilityScore: number;
}

export interface EvidenceState {
  [evidenceId: string]: {
    status: EvidenceStatus;
    assessorVerdict: AssessorVerdict;
    filePath?: string | null;
    fileName?: string | null;
  };
}

export interface UnitCompetencyState {
  [unitCode: string]: UnitCompetency;
}

export interface UnitCoverage {
  unitCode: string;
  unitTitle: string;
  qualification: QualificationId;
  totalEvidence: number;
  carryOverCount: number;
  directUploadCount: number;
  needed: number;
  isFullyEvidenced: boolean;
  mappedEvidence: {
    evidenceId: string;
    evidenceName: string;
    isUploaded: boolean;
    isVerified: boolean;
    isRejected: boolean;
    source: "direct" | "carry-over";
  }[];
}

export type ViewMode =
  | "dashboard"
  | "evidence-list"
  | "coverage-map"
  | "student-checklist"
  | "assessor-panel"
  | "gap-analysis"
  | "students";
