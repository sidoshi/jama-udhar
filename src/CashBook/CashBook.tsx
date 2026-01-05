import { useRef, useEffect } from "react";
import { Typography, Box } from "@mui/material";
import { zip } from "lodash-es";
import generatePDF from "react-to-pdf";
import { useAppStore, useEntriesForActiveDate } from "../store";
import dayjs from "dayjs";
import { printPdfAtom, type CashBook } from "../store/slices/cashBookSlice";

import { EntryTransferDialog } from "./EntryTransferDialog";
import { useAtom } from "jotai";
import { PDFLedger } from "./PDFLedger";
import { EntriesTable } from "./EntriesTable";
import { AddEntryDialog } from "./AddEntryDialog";

export function CashBook() {
  const activeDate = useAppStore((state) => state.activeDate);
  const entries = useEntriesForActiveDate();

  const [isPrinting, setIsPrinting] = useAtom(printPdfAtom);
  const printTargetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function printPDF() {
      if (printTargetRef.current) {
        const pdf = await generatePDF(printTargetRef, {
          method: "build",
          resolution: 2,
          page: {
            margin: 8,
          },
          canvas: {
            mimeType: "image/png",
            qualityRatio: 1,
          },
          overrides: {
            pdf: {
              compress: true,
            },
          },
        });

        const totalPages = pdf.getNumberOfPages();
        console.log("tota", totalPages);
        for (let i = 1; i <= totalPages; i++) {
          pdf.setPage(i);
          pdf.setFontSize(10);
          pdf.text(`Page ${i} of ${totalPages}`, 18, 12);
        }

        const hidden: CashBook = {
          id: activeDate,
          date: activeDate,
          entries: [...entries.debit, ...entries.credit],
          activityLog: [],
        };
        pdf.setProperties({
          title: JSON.stringify(hidden),
        });

        // pdf.save(`CashBook-${dayjs(activeDate).format("DD-MM-YYYY")}.pdf`);
        const blob = pdf.output("blob");
        const url = URL.createObjectURL(blob);
        window.open(url, "_blank");
      }

      setIsPrinting(false);
    }

    if (isPrinting) {
      printPDF().catch(console.log);
    }
  }, [isPrinting, printTargetRef, activeDate, entries, setIsPrinting]);

  const debitTotal = entries.debit.reduce((sum, e) => sum + e.amount, 0);
  const creditTotal = entries.credit.reduce((sum, e) => sum + e.amount, 0);
  const entryPairs = zip(
    entries.credit.filter((e) => e.amount !== 0),
    entries.debit.filter((e) => e.amount !== 0),
  );

  return (
    <Box>
      {isPrinting && (
        <PDFLedger
          balance={debitTotal + creditTotal}
          entries={entryPairs}
          debitTotal={debitTotal}
          creditTotal={creditTotal}
          targetRef={printTargetRef}
        />
      )}
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
