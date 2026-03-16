import { Document, Page, Text, View } from "@react-pdf/renderer";
import { styles } from "./styles";
import { UnitCompetencyState, QualificationId } from "@/lib/types";
import { UNITS } from "@/lib/data";

interface Props {
  studentName: string;
  qualification: string;
  unitCompetency: UnitCompetencyState;
  qualFilter?: QualificationId;
}

const COMPETENCY_LABELS: Record<string, string> = {
  competent: "COMPETENT",
  not_yet_competent: "NOT YET COMPETENT",
  gap_training: "REQUIRES GAP TRAINING",
};

export default function CompetencyRecordReport({
  studentName,
  qualification,
  unitCompetency,
  qualFilter,
}: Props) {
  const units = qualFilter
    ? UNITS.filter((u) => u.qualification === qualFilter)
    : UNITS;

  const now = new Date().toLocaleDateString("en-AU");
  const decided = units.filter((u) => unitCompetency[u.code]);
  const competent = decided.filter((u) => unitCompetency[u.code] === "competent");
  const nyc = decided.filter((u) => unitCompetency[u.code] === "not_yet_competent");
  const gap = decided.filter((u) => unitCompetency[u.code] === "gap_training");
  const pending = units.filter((u) => !unitCompetency[u.code]);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Competency Record</Text>
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
            <Text style={styles.summaryValue}>{competent.length}</Text>
            <Text style={styles.summaryLabel}>Competent</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{nyc.length}</Text>
            <Text style={styles.summaryLabel}>Not Yet Competent</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{gap.length}</Text>
            <Text style={styles.summaryLabel}>Gap Training</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{pending.length}</Text>
            <Text style={styles.summaryLabel}>Pending</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Unit Competency Decisions</Text>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.th, { width: "18%" }]}>Unit Code</Text>
            <Text style={[styles.th, { width: "45%" }]}>Unit Title</Text>
            <Text style={[styles.th, { width: "12%" }]}>Core/Elec</Text>
            <Text style={[styles.th, { width: "25%" }]}>Decision</Text>
          </View>
          {units.map((unit, i) => {
            const comp = unitCompetency[unit.code];
            return (
              <View key={unit.code} style={i % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
                <Text style={[styles.td, { width: "18%", fontFamily: "Courier" }]}>
                  {unit.code}
                </Text>
                <Text style={[styles.td, { width: "45%" }]}>{unit.title}</Text>
                <Text style={[styles.td, { width: "12%" }]}>
                  {unit.isCore ? "Core" : "Elective"}
                </Text>
                <Text
                  style={[
                    styles.badge,
                    { width: "25%" },
                    comp === "competent"
                      ? styles.badgeGreen
                      : comp === "not_yet_competent"
                      ? styles.badgeOrange
                      : comp === "gap_training"
                      ? styles.badgeRed
                      : { backgroundColor: "#f5f5f5", color: "#999" },
                  ]}
                >
                  {comp ? COMPETENCY_LABELS[comp] : "PENDING"}
                </Text>
              </View>
            );
          })}
        </View>

        <View style={{ marginTop: 30 }}>
          <Text style={styles.sectionTitle}>Assessor Sign-off</Text>
          <View style={{ flexDirection: "row", gap: 40, marginTop: 12 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 9, color: "#888" }}>Assessor Name</Text>
              <View style={{ borderBottom: "1px solid #ccc", height: 20, marginTop: 4 }} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 9, color: "#888" }}>Signature</Text>
              <View style={{ borderBottom: "1px solid #ccc", height: 20, marginTop: 4 }} />
            </View>
            <View style={{ width: 100 }}>
              <Text style={{ fontSize: 9, color: "#888" }}>Date</Text>
              <View style={{ borderBottom: "1px solid #ccc", height: 20, marginTop: 4 }} />
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Text>Prepare Training — RPL Evidence Mapper</Text>
          <Text>Generated {now}</Text>
        </View>
      </Page>
    </Document>
  );
}
