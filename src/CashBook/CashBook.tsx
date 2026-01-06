import { useEffect } from "react";
import { Typography, Box } from "@mui/material";
import { zip } from "lodash-es";
import { useAppStore, useEntriesForActiveDate } from "../store";
import dayjs from "dayjs";
import {
  printPdfAtom,
  type CashBook,
  type Entry,
} from "../store/slices/cashBookSlice";

import { EntryTransferDialog } from "./EntryTransferDialog";
import { useAtom } from "jotai";
import { PDFLedger } from "./PDFLedger";
import { EntriesTable } from "./EntriesTable";
import { AddEntryDialog } from "./AddEntryDialog";
import { pdf } from "@react-pdf/renderer";

const generatePDFLedger = async (
  entries: Array<[Entry | undefined, Entry | undefined]>,
  debitTotal: number,
  creditTotal: number,
  activeDate: string
) => {
  const pdfDoc = (
    <PDFLedger
      entries={entries}
      debitTotal={debitTotal}
      creditTotal={creditTotal}
      activeDate={activeDate}
    />
  );

  const blob = await pdf(pdfDoc).toBlob();
  const url = URL.createObjectURL(blob);

  // Create a temporary link to download the PDF
  const link = document.createElement("a");
  link.href = url;
  link.download = `CashBook-${dayjs(activeDate).format("DD-MM-YYYY")}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Clean up the URL
  URL.revokeObjectURL(url);

  return blob;
};

export function CashBook() {
  const activeDate = useAppStore((state) => state.activeDate);
  const entries = useEntriesForActiveDate();

  const [isPrinting, setIsPrinting] = useAtom(printPdfAtom);

  useEffect(() => {
    async function printPDF() {
      const debitTotal = entries.debit.reduce((sum, e) => sum + e.amount, 0);
      const creditTotal = entries.credit.reduce((sum, e) => sum + e.amount, 0);
      const entryPairs = zip(
        entries.credit.filter((e) => e.amount !== 0),
        entries.debit.filter((e) => e.amount !== 0)
      );

      try {
        await generatePDFLedger(
          entryPairs,
          debitTotal,
          creditTotal,
          activeDate
        );
      } catch (error) {
        console.error("Error generating PDF:", error);
      } finally {
        setIsPrinting(false);
      }
    }

    if (isPrinting) {
      printPDF();
    }
  }, [isPrinting, activeDate, entries, setIsPrinting]);

  return (
    <Box>
      <EntryTransferDialog />
      <Box py={2}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <AddEntryDialog />
          {entries.date != null && entries.date !== activeDate && (
            <Typography variant="subtitle2" color="info.main" gutterBottom>
              Showing entries from {dayjs(entries.date).format("DD MMM YYYY")}
            </Typography>
          )}
        </Box>

        <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
          <EntriesTable
            type="credit"
            id="credit"
            title="Credit (જમા)"
            entries={entries.credit}
          />
          <EntriesTable
            type="debit"
            id="debit"
            title="Debit (ઉધાર)"
            entries={entries.debit}
          />
        </Box>
      </Box>
    </Box>
  );
}
