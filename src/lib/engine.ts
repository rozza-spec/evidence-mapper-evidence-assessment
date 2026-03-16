import {
  EvidenceState,
  EvidenceItem,
  UnitCoverage,
  QualificationId,
} from "./types";
import { EVIDENCE_ITEMS, UNITS, QUALIFICATIONS } from "./data";

const REQUIRED_EVIDENCE_COUNT = 3;

export function computeUnitCoverage(
  evidenceState: EvidenceState,
  qualFilter?: QualificationId
): UnitCoverage[] {
  const units = qualFilter
    ? UNITS.filter((u) => u.qualification === qualFilter)
    : UNITS;

  return units.map((unit) => {
    const mappedEvidence = EVIDENCE_ITEMS.filter((ev) =>
      ev.unitMappings.includes(unit.code)
    ).map((ev) => {
      const state = evidenceState[ev.id];
      const isUploaded = state?.status === "uploaded";
      const isVerified = state?.assessorVerdict === "verified";
      const isRejected = state?.assessorVerdict === "rejected";

      return {
        evidenceId: ev.id,
        evidenceName: ev.name,
        isUploaded: isUploaded && !isRejected,
        isVerified,
        isRejected,
        source: "carry-over" as "direct" | "carry-over",
      };
    });

    const activeEvidence = mappedEvidence.filter(
      (e) => e.isUploaded && !e.isRejected
    );
    const totalEvidence = activeEvidence.length;
    const needed = Math.max(0, REQUIRED_EVIDENCE_COUNT - totalEvidence);

    return {
      unitCode: unit.code,
      unitTitle: unit.title,
      qualification: unit.qualification,
      totalEvidence,
      carryOverCount: totalEvidence,
      directUploadCount: 0,
      needed,
      isFullyEvidenced: totalEvidence >= REQUIRED_EVIDENCE_COUNT,
      mappedEvidence,
    };
  });
}

export function computeStats(evidenceState: EvidenceState) {
  const allCoverage = computeUnitCoverage(evidenceState);
  const totalUnits = allCoverage.length;
  const fullyEvidenced = allCoverage.filter((u) => u.isFullyEvidenced).length;
  const partiallyEvidenced = allCoverage.filter(
    (u) => u.totalEvidence > 0 && !u.isFullyEvidenced
  ).length;
  const noEvidence = allCoverage.filter((u) => u.totalEvidence === 0).length;

  const uploaded = Object.values(evidenceState).filter(
    (s) => s.status === "uploaded" && s.assessorVerdict !== "rejected"
  ).length;

  const totalPossible = totalUnits * REQUIRED_EVIDENCE_COUNT;
  const totalCovered = allCoverage.reduce(
    (sum, u) => sum + Math.min(u.totalEvidence, REQUIRED_EVIDENCE_COUNT),
    0
  );
  const coveragePercent =
    totalPossible > 0 ? Math.round((totalCovered / totalPossible) * 100) : 0;

  return {
    totalUnits,
    fullyEvidenced,
    partiallyEvidenced,
    noEvidence,
    uploaded,
    totalEvidenceItems: EVIDENCE_ITEMS.length,
    coveragePercent,
  };
}

export function computeQualStats(
  evidenceState: EvidenceState,
  qualId: QualificationId
) {
  const coverage = computeUnitCoverage(evidenceState, qualId);
  const qual = QUALIFICATIONS.find((q) => q.id === qualId)!;
  const totalUnits = coverage.length;
  const fullyEvidenced = coverage.filter((u) => u.isFullyEvidenced).length;
  const percent =
    totalUnits > 0 ? Math.round((fullyEvidenced / totalUnits) * 100) : 0;

  return { ...qual, totalUnits, fullyEvidenced, percent, coverage };
}

export function getUploadImpact(
  evidenceId: string,
  evidenceState: EvidenceState
): { completesUnits: number; partiallyFills: number; totalAffected: number } {
  const ev = EVIDENCE_ITEMS.find((e) => e.id === evidenceId);
  if (!ev) return { completesUnits: 0, partiallyFills: 0, totalAffected: 0 };

  const beforeCoverage = computeUnitCoverage(evidenceState);
  const simulated = {
    ...evidenceState,
    [evidenceId]: { status: "uploaded" as const, assessorVerdict: null },
  };
  const afterCoverage = computeUnitCoverage(simulated);

  let completesUnits = 0;
  let partiallyFills = 0;

  for (const unit of afterCoverage) {
    const before = beforeCoverage.find((u) => u.unitCode === unit.unitCode);
    if (!before) continue;

    if (unit.isFullyEvidenced && !before.isFullyEvidenced) {
      completesUnits++;
    } else if (unit.totalEvidence > before.totalEvidence && !unit.isFullyEvidenced) {
      partiallyFills++;
    }
  }

  return {
    completesUnits,
    partiallyFills,
    totalAffected: completesUnits + partiallyFills,
  };
}

export function getGapAnalysis(evidenceState: EvidenceState) {
  const coverage = computeUnitCoverage(evidenceState);
  const gapUnits = coverage.filter((u) => !u.isFullyEvidenced);

  const suggestions: {
    unitCode: string;
    unitTitle: string;
    qualification: QualificationId;
    needed: number;
    currentCount: number;
    suggestedEvidence: EvidenceItem[];
  }[] = gapUnits.map((unit) => {
    const uploadedIds = new Set(
      unit.mappedEvidence
        .filter((e) => e.isUploaded && !e.isRejected)
        .map((e) => e.evidenceId)
    );

    const available = EVIDENCE_ITEMS.filter(
      (ev) =>
        ev.unitMappings.includes(unit.unitCode) &&
        !uploadedIds.has(ev.id) &&
        evidenceState[ev.id]?.assessorVerdict !== "rejected"
    ).sort((a, b) => b.transferabilityScore - a.transferabilityScore);

    return {
      unitCode: unit.unitCode,
      unitTitle: unit.unitTitle,
      qualification: unit.qualification,
      needed: unit.needed,
      currentCount: unit.totalEvidence,
      suggestedEvidence: available.slice(0, unit.needed + 2),
    };
  });

  const totalGapItems = suggestions.reduce((sum, s) => sum + s.needed, 0);

  return { gapUnits: suggestions, totalGapItems, totalGapUnits: gapUnits.length };
}

export function getPriorityChecklist(evidenceState: EvidenceState): EvidenceItem[] {
  return EVIDENCE_ITEMS.filter(
    (ev) =>
      evidenceState[ev.id]?.status !== "uploaded" ||
      evidenceState[ev.id]?.assessorVerdict === "rejected"
  );
}
