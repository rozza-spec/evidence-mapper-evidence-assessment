import { StyleSheet } from "@react-pdf/renderer";

export const BRAND = {
  gold: "#FFD700",
  dark: "#0a0a0a",
  surface: "#1a1a1a",
  muted: "#888888",
  white: "#ffffff",
  red: "#ef4444",
  green: "#22c55e",
  orange: "#f97316",
};

export const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#333",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 10,
    borderBottom: "2px solid #FFD700",
  },
  title: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    color: "#0a0a0a",
  },
  subtitle: {
    fontSize: 10,
    color: "#888",
    marginTop: 2,
  },
  brandTag: {
    fontSize: 8,
    color: "#FFD700",
    fontFamily: "Helvetica-Bold",
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    color: "#0a0a0a",
    marginTop: 16,
    marginBottom: 8,
    paddingBottom: 4,
    borderBottom: "1px solid #e5e5e5",
  },
  table: {
    width: "100%",
    marginTop: 6,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    borderBottom: "1px solid #ccc",
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1px solid #eee",
    paddingVertical: 5,
    paddingHorizontal: 8,
  },
  tableRowAlt: {
    flexDirection: "row",
    borderBottom: "1px solid #eee",
    paddingVertical: 5,
    paddingHorizontal: 8,
    backgroundColor: "#fafafa",
  },
  th: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
    color: "#555",
  },
  td: {
    fontSize: 9,
    color: "#333",
  },
  summaryBox: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  summaryItem: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f8f8f8",
    border: "1px solid #e5e5e5",
    alignItems: "center" as const,
  },
  summaryValue: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    color: "#0a0a0a",
  },
  summaryLabel: {
    fontSize: 8,
    color: "#888",
    marginTop: 2,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 7,
    color: "#aaa",
    borderTop: "1px solid #eee",
    paddingTop: 6,
  },
  badge: {
    fontSize: 8,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 2,
  },
  badgeGreen: {
    backgroundColor: "#dcfce7",
    color: "#166534",
  },
  badgeRed: {
    backgroundColor: "#fee2e2",
    color: "#991b1b",
  },
  badgeOrange: {
    backgroundColor: "#fff7ed",
    color: "#9a3412",
  },
  badgeGold: {
    backgroundColor: "#fef9c3",
    color: "#854d0e",
  },
});
