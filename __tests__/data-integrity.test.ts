import { describe, it, expect } from "vitest";
import { QUALIFICATIONS, UNITS, EVIDENCE_ITEMS } from "@/lib/data";
import { computeStats, computeUnitCoverage } from "@/lib/engine";
import { EvidenceState } from "@/lib/types";

describe("data integrity", () => {
  it("has exactly 3 qualifications", () => {
    expect(QUALIFICATIONS).toHaveLength(3);
  });

  it("all qualifications have required fields", () => {
    for (const q of QUALIFICATIONS) {
      expect(q.id).toBeTruthy();
      expect(q.code).toBeTruthy();
      expect(q.title).toBeTruthy();
      expect(q.tgaUrl).toContain("training.gov.au");
      expect(q.coreUnits.length + q.electiveUnits.length).toBe(q.units.length);
    }
  });

  it("every unit references a valid qualification", () => {
    const qualIds = new Set(QUALIFICATIONS.map((q) => q.id));
    for (const unit of UNITS) {
      expect(qualIds.has(unit.qualification)).toBe(true);
    }
  });

  it("every evidence item maps to at least one unit", () => {
    for (const ev of EVIDENCE_ITEMS) {
      expect(ev.unitMappings.length).toBeGreaterThan(0);
    }
  });

  it("evidence unit mappings reference existing units", () => {
    const unitCodes = new Set(UNITS.map((u) => u.code));
    for (const ev of EVIDENCE_ITEMS) {
      for (const code of ev.unitMappings) {
        expect(unitCodes.has(code)).toBe(true);
      }
    }
  });

  it("unit codes follow standard pattern", () => {
    for (const unit of UNITS) {
      expect(unit.code).toMatch(/^[A-Z]{4,10}\d{3,5}$/);
    }
  });
});

describe("engine computations", () => {
  it("empty state produces 0% coverage", () => {
    const stats = computeStats({});
    expect(stats.coveragePercent).toBe(0);
    expect(stats.uploaded).toBe(0);
    expect(stats.totalUnits).toBeGreaterThan(0);
  });

  it("uploaded evidence increases stats", () => {
    const state: EvidenceState = {};
    for (const ev of EVIDENCE_ITEMS.slice(0, 5)) {
      state[ev.id] = { status: "uploaded", assessorVerdict: null };
    }
    const stats = computeStats(state);
    expect(stats.uploaded).toBe(5);
  });

  it("unit coverage returns correct unit count per qualification", () => {
    const coverage = computeUnitCoverage({}, "CPC40120");
    const expectedCount = UNITS.filter((u) => u.qualification === "CPC40120").length;
    expect(coverage).toHaveLength(expectedCount);
  });

  it("verified evidence is reflected in coverage", () => {
    const firstUnit = UNITS[0];
    const mappedEvidence = EVIDENCE_ITEMS.filter((ev) =>
      ev.unitMappings.includes(firstUnit.code)
    );

    if (mappedEvidence.length === 0) return;

    const state: EvidenceState = {
      [mappedEvidence[0].id]: { status: "uploaded", assessorVerdict: "verified" },
    };

    const coverage = computeUnitCoverage(state, firstUnit.qualification);
    const unitCov = coverage.find((c) => c.unitCode === firstUnit.code);
    expect(unitCov).toBeDefined();
    expect(unitCov!.mappedEvidence.some((e) => e.isVerified)).toBe(true);
  });
});
