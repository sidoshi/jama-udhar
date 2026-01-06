import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import dayjs from "dayjs";
import type { Entry } from "../store/slices/cashBookSlice";

// Simple rupee formatter for PDF (avoids unicode issues)
const formatRupees = (amount: number) => {
  if (amount == null || isNaN(amount)) {
    return "0";
  }

  const absAmount = Math.abs(amount).toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  return absAmount;
};

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 30,
    fontSize: 12,
    fontFamily: "Helvetica",
  },
  header: {
    textAlign: "center",
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: "#333333",
  },
  dateText: {
    fontSize: 14,
    color: "#333333",
    fontWeight: "bold",
  },
  table: {
    width: "100%",
    marginBottom: 40,
    borderWidth: 0.5,
    borderColor: "#cccccc",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: "#cccccc",
    borderTopWidth: 0.5,
    borderTopColor: "#cccccc",
  },
  tableRowEven: {
    backgroundColor: "#f9f9f9",
  },
  tableColHeader: {
    width: "25%",
    backgroundColor: "#f5f5f5",
    padding: 10,
    borderRightWidth: 0.5,
    borderRightColor: "#cccccc",
  },
  tableCol: {
    width: "25%",
    padding: 8,
    borderRightWidth: 0.5,
    borderRightColor: "#cccccc",
  },
  tableColLast: {
    width: "25%",
    padding: 8,
  },
  tableCellHeader: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#000000",
    fontFamily: "Helvetica-Bold",
  },
  tableCell: {
    fontSize: 10,
    color: "#000000",
    fontFamily: "Helvetica",
  },
  tableCellRight: {
    textAlign: "right",
  },
  tableCellLeft: {
    textAlign: "left",
  },
  footer: {
    position: "absolute",
    bottom: 15,
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 10,
    color: "#666666",
  },
});

type PDFLedgerProps = {
  entries: Array<[Entry | undefined, Entry | undefined]>;
  debitTotal: number;
  creditTotal: number;
  activeDate: string;
};

export const PDFLedger: React.FC<PDFLedgerProps> = ({
  entries,
  debitTotal,
  creditTotal,
  activeDate,
}) => {
  // Add total row to entries
  const entriesWithTotal = [
    ...entries,
    [
      { id: "creditTotal", account: "Total", amount: creditTotal } as Entry,
      { id: "debitTotal", account: "Total", amount: debitTotal } as Entry,
    ] as [Entry, Entry],
  ];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.dateText}>
            ({dayjs(activeDate).format("YYYY-MM-DD")})
          </Text>
        </View>

        {/* Table */}
        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableRow}>
            <View style={styles.tableColHeader}>
              <Text style={[styles.tableCellHeader, styles.tableCellRight]}>
                Account
              </Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={[styles.tableCellHeader, styles.tableCellLeft]}>
                Credit + Jama
              </Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={[styles.tableCellHeader, styles.tableCellRight]}>
                Account
              </Text>
            </View>
            <View style={[styles.tableColHeader, { borderRightWidth: 0 }]}>
              <Text style={[styles.tableCellHeader, styles.tableCellLeft]}>
                Debit - Udhar
              </Text>
            </View>
          </View>

          {/* Table Body */}
          {entriesWithTotal.map(([creditAccount, debitAccount], index) => (
            <View
              key={index}
              style={[
                styles.tableRow,
                ...(index % 2 === 1 ? [styles.tableRowEven] : []),
              ]}
              wrap={false} // Prevent breaking rows across pages
            >
              <View style={styles.tableCol}>
                <Text style={[styles.tableCell, styles.tableCellRight]}>
                  {creditAccount?.account || ""}
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={[styles.tableCell, styles.tableCellLeft]}>
                  {creditAccount ? formatRupees(creditAccount.amount) : ""}
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={[styles.tableCell, styles.tableCellRight]}>
                  {debitAccount?.account || ""}
                </Text>
              </View>
              <View style={[styles.tableCol, { borderRightWidth: 0 }]}>
                <Text style={[styles.tableCell, styles.tableCellLeft]}>
                  {debitAccount
                    ? `- ${formatRupees(Math.abs(debitAccount.amount))}`
                    : ""}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Footer with page numbers */}
        <Text
          style={styles.footer}
          render={({ pageNumber, totalPages }) =>
            `Page ${pageNumber} of ${totalPages}`
          }
          fixed
        />
      </Page>
    </Document>
  );
};
