import { Document, Page, Text, View } from "@react-pdf/renderer";
import { styles } from "./styles";
import { EvidenceState } from "@/lib/types";
import { getGapAnalysis } from "@/lib/engine";

interface Props {
  studentName: string;
  qualification: string;
  evidenceState: EvidenceState;
}

export default function GapAnalysisReport({
  studentName,
  qualification,
  evidenceState,
}: Props) {
  const analysis = getGapAnalysis(evidenceState);
  const now = new Date().toLocaleDateString("en-AU");

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Gap Analysis Report</Text>
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
            <Text style={styles.summaryValue}>{analysis.totalGapUnits}</Text>
            <Text style={styles.summaryLabel}>Units with Gaps</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{analysis.totalGapItems}</Text>
            <Text style={styles.summaryLabel}>Evidence Items Needed</Text>
          </View>
        </View>

        {analysis.gapUnits.length === 0 ? (
          <View style={{ padding: 20, backgroundColor: "#dcfce7", marginTop: 12 }}>
            <Text style={{ fontFamily: "Helvetica-Bold", color: "#166534" }}>
              All units are fully evidenced. No gaps found.
            </Text>
          </View>
        ) : (
          <>
            <Text style={styles.sectionTitle}>Gap Units Requiring Action</Text>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={[styles.th, { width: "18%" }]}>Unit Code</Text>
                <Text style={[styles.th, { width: "40%" }]}>Unit Title</Text>
                <Text style={[styles.th, { width: "12%" }]}>Current</Text>
                <Text style={[styles.th, { width: "12%" }]}>Needed</Text>
                <Text style={[styles.th, { width: "18%" }]}>Suggested</Text>
              </View>
              {analysis.gapUnits.map((gap, i) => (
                <View key={gap.unitCode} style={i % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
                  <Text style={[styles.td, { width: "18%", fontFamily: "Courier" }]}>
                    {gap.unitCode}
                  </Text>
                  <Text style={[styles.td, { width: "40%" }]}>{gap.unitTitle}</Text>
                  <Text style={[styles.td, { width: "12%" }]}>{gap.currentCount}/3</Text>
                  <Text style={[styles.td, { width: "12%", color: "#ef4444" }]}>
                    {gap.needed} more
                  </Text>
                  <Text style={[styles.td, { width: "18%" }]}>
                    {gap.suggestedEvidence.length > 0
                      ? `${gap.suggestedEvidence.length} available`
                      : "None available"}
                  </Text>
                </View>
              ))}
            </View>

            <Text style={styles.sectionTitle}>Recommended Evidence Items</Text>
            {analysis.gapUnits
              .filter((g) => g.suggestedEvidence.length > 0)
              .slice(0, 10)
              .map((gap) => (
                <View key={gap.unitCode} style={{ marginBottom: 8 }}>
                  <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 9, marginBottom: 3 }}>
                    {gap.unitCode} — {gap.unitTitle}
                  </Text>
                  {gap.suggestedEvidence.slice(0, 3).map((ev) => (
                    <Text key={ev.id} style={{ fontSize: 8, color: "#555", marginLeft: 12, marginBottom: 1 }}>
                      • {ev.name} (covers {ev.transferabilityScore} units)
                    </Text>
                  ))}
                </View>
              ))}
          </>
        )}

        <View style={styles.footer}>
          <Text>Prepare Training — RPL Evidence Mapper</Text>
          <Text>Generated {now}</Text>
        </View>
      </Page>
    </Document>
  );
}
