import { Document, Page, Text, View } from "@react-pdf/renderer";
import { styles } from "./styles";

interface Payment {
  id: string;
  amount: number;
  invoiceFilename: string | null;
  note: string | null;
  createdAt: string;
}

interface Props {
  studentName: string;
  qualification: string;
  totalOwing: number;
  totalPaid: number;
  balance: number;
  payments: Payment[];
}

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD" }).format(n);
}

export default function PaymentStatementReport({
  studentName,
  qualification,
  totalOwing,
  totalPaid,
  balance,
  payments,
}: Props) {
  const now = new Date().toLocaleDateString("en-AU");

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Payment Statement</Text>
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
            <Text style={styles.summaryValue}>{formatCurrency(totalOwing)}</Text>
            <Text style={styles.summaryLabel}>Total Fees</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryValue, { color: "#22c55e" }]}>
              {formatCurrency(totalPaid)}
            </Text>
            <Text style={styles.summaryLabel}>Amount Paid</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryValue, { color: balance > 0 ? "#ef4444" : "#22c55e" }]}>
              {formatCurrency(balance)}
            </Text>
            <Text style={styles.summaryLabel}>Balance Remaining</Text>
          </View>
        </View>

        {/* Payment progress */}
        <View style={{ marginBottom: 16 }}>
          <View style={{ height: 8, backgroundColor: "#f0f0f0", width: "100%" }}>
            <View
              style={{
                height: 8,
                backgroundColor: "#FFD700",
                width: `${totalOwing > 0 ? Math.min(100, (totalPaid / totalOwing) * 100) : 0}%`,
              }}
            />
          </View>
          <Text style={{ fontSize: 8, color: "#888", marginTop: 3 }}>
            {totalOwing > 0 ? Math.round((totalPaid / totalOwing) * 100) : 0}% paid
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Payment History</Text>

        {payments.length === 0 ? (
          <Text style={{ fontSize: 10, color: "#888", marginTop: 8 }}>
            No payments recorded.
          </Text>
        ) : (
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.th, { width: "20%" }]}>Date</Text>
              <Text style={[styles.th, { width: "20%" }]}>Amount</Text>
              <Text style={[styles.th, { width: "30%" }]}>Invoice</Text>
              <Text style={[styles.th, { width: "30%" }]}>Note</Text>
            </View>
            {payments.map((p, i) => (
              <View key={p.id} style={i % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
                <Text style={[styles.td, { width: "20%" }]}>
                  {new Date(p.createdAt).toLocaleDateString("en-AU")}
                </Text>
                <Text style={[styles.td, { width: "20%", fontFamily: "Helvetica-Bold" }]}>
                  {formatCurrency(p.amount)}
                </Text>
                <Text style={[styles.td, { width: "30%" }]}>
                  {p.invoiceFilename || "—"}
                </Text>
                <Text style={[styles.td, { width: "30%" }]}>
                  {p.note || "—"}
                </Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.footer}>
          <Text>Prepare Training — RPL Evidence Mapper</Text>
          <Text>Generated {now}</Text>
        </View>
      </Page>
    </Document>
  );
}
