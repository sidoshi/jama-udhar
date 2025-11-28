import { useState } from "react";
import { Paper, Typography, Box, Grid, Divider } from "@mui/material";
import {
  DndContext,
  closestCenter,
  DragOverlay,
  type DragStartEvent,
  type UniqueIdentifier,
  type DragEndEvent,
} from "@dnd-kit/core";
import { useDraggable, useDroppable } from "@dnd-kit/core";

type DNDRowProps = {
  id: string;
  account: string;
  amount: number;
  type: string;
};
function DNDRow({ id, account, amount, type }: DNDRowProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,
    data: { account, amount, type },
  });
  const { setNodeRef: setDroppableRef, isOver } = useDroppable({ id });

  return (
    <Grid
      ref={setDroppableRef}
      sx={{
        backgroundColor: isOver ? "action.selected" : "inherit",
      }}
      container
      size={12}
      key={id}
    >
      <Grid
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        sx={{
          cursor: "grab",
          opacity: isDragging ? 0.5 : 1,
          "&:hover": { backgroundColor: "action.hover" },
        }}
        container
        px={1}
        size={12}
      >
        <Grid size={8} py={1}>
          <Typography variant="body1">{account}</Typography>
        </Grid>
        <Grid size={4} py={1} textAlign="right">
          <Typography variant="h6">{`$${amount.toFixed(2)}`}</Typography>
        </Grid>
      </Grid>
    </Grid>
  );
}

type TableProps = {
  id: string;
  title: string;
  entries: { id: string; account: string; amount: number; type: string }[];
};
function Table({ title, entries }: TableProps) {
  return (
    <Box sx={{ flex: 1, minWidth: 300 }}>
      <Paper
        sx={{
          p: 2,
          minHeight: 400,
        }}
      >
        <Grid container>
          <Grid container size={12} px={1}>
            <Grid size={8}>
              <Typography variant="subtitle1" fontWeight="bold">
                {title}
              </Typography>
            </Grid>
            <Grid size={4} textAlign="right">
              <Typography variant="subtitle1" fontWeight="bold">
                Amount
              </Typography>
            </Grid>
          </Grid>

          <Grid size={12}>
            <Divider sx={{ my: 1 }} />
          </Grid>
          {entries.length === 0 && (
            <Grid size={12} py={10} textAlign="center">
              <Typography variant="body2" color="textSecondary">
                No entries available.
              </Typography>
            </Grid>
          )}

          {entries.map((entry) => (
            <DNDRow
              key={entry.id}
              id={entry.id}
              account={entry.account}
              amount={entry.amount}
              type={entry.type}
            />
          ))}
        </Grid>

        <Box sx={{ mt: 2, textAlign: "right" }}>
          <Typography variant="subtitle1" fontWeight="bold">
            Total: ${entries.reduce((sum, e) => sum + e.amount, 0).toFixed(2)}
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}

export function CashBook() {
  const [entries] = useState({
    debit: [
      { id: "d1", account: "Cash", amount: 5000, type: "debit" },
      { id: "d2", account: "Accounts Receivable", amount: 3000, type: "debit" },
      { id: "d3", account: "Equipment", amount: 10000, type: "debit" },
    ],
    credit: [
      { id: "c1", account: "Accounts Payable", amount: 2000, type: "credit" },
      { id: "c2", account: "Capital", amount: 16000, type: "credit" },
    ],
  });

  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id);
  }

  function handleDragEnd(event: DragEndEvent) {
    console.log(event);
  }

  const activeEntry = activeId
    ? [...entries.debit, ...entries.credit].find((e) => e.id === activeId)
    : null;

  const debitTotal = entries.debit.reduce((sum, e) => sum + e.amount, 0);
  const creditTotal = entries.credit.reduce((sum, e) => sum + e.amount, 0);

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Accounting Sheet
        </Typography>

        <Box sx={{ display: "flex", gap: 3, mb: 3 }}>
          <Table id="debit" title="Debit" entries={entries.debit} />
          <Table id="credit" title="Credit" entries={entries.credit} />
        </Box>

        <Paper sx={{ p: 2 }}>
          <Typography variant="h6">
            Balance: ${(debitTotal - creditTotal).toFixed(2)}
          </Typography>
        </Paper>
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
