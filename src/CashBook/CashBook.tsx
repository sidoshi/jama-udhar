import { useRef, useState, useEffect } from "react";
import { Paper, Typography, Box } from "@mui/material";
import { zip } from "lodash-es";
import generatePDF from "react-to-pdf";
import {
  DndContext,
  closestCenter,
  DragOverlay,
  type DragStartEvent,
  type UniqueIdentifier,
  type DragEndEvent,
} from "@dnd-kit/core";
import { useAppStore, useEntriesForActiveDate } from "../store";
import dayjs from "dayjs";
import {
  printPdfAtom,
  type CashBook,
  type Entry,
} from "../store/slices/cashBookSlice";

import {
  EntryTransferDialog,
  type EntryTransferDialogProps,
} from "./EntryTransferDialog";
import { useAtom } from "jotai";
import { PDFLedger } from "./PDFLedger";
import { EntriesTable } from "./EntriesTable";
import { AddEntryForm } from "./AddEntryForm";

export function CashBook() {
  const activeDate = useAppStore((state) => state.activeDate);
  const entries = useEntriesForActiveDate();
  const [transfer, setTransfer] =
    useState<EntryTransferDialogProps["transfer"]>();

  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);

  const [isPrinting, setIsPrinting] = useAtom(printPdfAtom);
  const printTargetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function printPDF() {
      if (printTargetRef.current) {
        const pdf = await generatePDF(printTargetRef, {
          method: "build",
        });
        const hidden: CashBook = {
          id: activeDate,
          date: activeDate,
          entries: [...entries.debit, ...entries.credit],
        };
        pdf.setProperties({
          title: JSON.stringify(hidden),
        });
        pdf.save(`Accounting_Sheet_${activeDate}.pdf`);
      }

      setIsPrinting(false);
    }

    if (isPrinting) {
      printPDF();
    }
  }, [isPrinting, printTargetRef, activeDate, entries, setIsPrinting]);

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id);
  }

  function handleDragEnd(event: DragEndEvent) {
    if (event.over != null && event.over.id !== event.active.id) {
      setTransfer({
        fromEntry: event.active.data.current as Entry,
        toEntry: event.over?.data.current as Entry,
      });
    }
  }

  const activeEntry = activeId
    ? [...entries.debit, ...entries.credit].find((e) => e.id === activeId)
    : null;

  const debitTotal = entries.debit.reduce((sum, e) => sum + e.amount, 0);
  const creditTotal = entries.credit.reduce((sum, e) => sum + e.amount, 0);
  const entryPairs = zip(
    entries.credit.filter((e) => e.amount !== 0),
    entries.debit.filter((e) => e.amount !== 0)
  );

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {isPrinting && (
        <PDFLedger
          balance={debitTotal + creditTotal}
          entries={entryPairs}
          debitTotal={debitTotal}
          creditTotal={creditTotal}
          targetRef={printTargetRef}
        />
      )}
      <EntryTransferDialog
        transfer={transfer}
        onClose={() => setTransfer(undefined)}
      />
      <Box p={2}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <AddEntryForm />
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

      <DragOverlay>
        {activeEntry ? (
          <Paper sx={{ p: 1, opacity: 0.9 }}>
            <Typography variant="body2">
              {activeEntry.account} - ${activeEntry.amount.toFixed(2)}
            </Typography>
          </Paper>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
