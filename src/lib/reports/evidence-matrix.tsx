import { Document, Page, Text, View } from "@react-pdf/renderer";
import { styles } from "./styles";
import { EvidenceState, QualificationId } from "@/lib/types";
import { computeUnitCoverage } from "@/lib/engine";
import { EVIDENCE_ITEMS } from "@/lib/data";

interface Props {
  studentName: string;
  qualification: string;
  evidenceState: EvidenceState;
  qualFilter?: QualificationId;
}

export default function EvidenceMatrixReport({
  studentName,
  qualification,
  evidenceState,
  qualFilter,
}: Props) {
  const coverage = computeUnitCoverage(evidenceState, qualFilter);
  const now = new Date().toLocaleDateString("en-AU");

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Evidence Matrix Report</Text>
            <Text style={styles.subtitle}>
              {studentName} — {qualification}
            </Text>
          </View>
          <View style={{ alignItems: "flex-end" as const }}>
            <Text style={styles.brandTag}>PREPARE TRAINING</Text>
            <Text style={styles.subtitle}>{now}</Text>
          </View>
        </View>

        <View style={styles.summaryBox}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{coverage.length}</Text>
            <Text style={styles.summaryLabel}>Total Units</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>
              {coverage.filter((u) => u.isFullyEvidenced).length}
            </Text>
            <Text style={styles.summaryLabel}>Fully Evidenced</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>
              {coverage.filter((u) => u.totalEvidence > 0 && !u.isFullyEvidenced).length}
            </Text>
            <Text style={styles.summaryLabel}>Partial</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>
              {coverage.filter((u) => u.totalEvidence === 0).length}
            </Text>
            <Text style={styles.summaryLabel}>No Evidence</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Unit Coverage Detail</Text>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.th, { width: "18%" }]}>Unit Code</Text>
            <Text style={[styles.th, { width: "42%" }]}>Unit Title</Text>
            <Text style={[styles.th, { width: "15%" }]}>Evidence</Text>
            <Text style={[styles.th, { width: "25%" }]}>Status</Text>
          </View>
          {coverage.map((unit, i) => (
            <View key={unit.unitCode} style={i % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
              <Text style={[styles.td, { width: "18%", fontFamily: "Courier" }]}>
                {unit.unitCode}
              </Text>
              <Text style={[styles.td, { width: "42%" }]}>{unit.unitTitle}</Text>
              <Text style={[styles.td, { width: "15%" }]}>
                {unit.totalEvidence}/3
              </Text>
              <Text
                style={[
                  styles.badge,
                  { width: "25%" },
                  unit.isFullyEvidenced
                    ? styles.badgeGreen
                    : unit.totalEvidence > 0
                    ? styles.badgeOrange
                    : styles.badgeRed,
                ]}
              >
                {unit.isFullyEvidenced ? "COMPLETE" : unit.totalEvidence > 0 ? "PARTIAL" : "NO EVIDENCE"}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <Text>Prepare Training — RPL Evidence Mapper</Text>
          <Text>Generated {now}</Text>
        </View>
      </Page>
    </Document>
  );
}
