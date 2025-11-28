import { useState } from "react";
import {
  Paper,
  Typography,
  Box,
  Grid,
  Divider,
  IconButton,
  Button,
} from "@mui/material";
import {
  DndContext,
  closestCenter,
  DragOverlay,
  type DragStartEvent,
  type UniqueIdentifier,
  type DragEndEvent,
} from "@dnd-kit/core";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { useAppStore, useEntriesForActiveDate } from "../store";
import { toLocaleRupeeString } from "../utils";
import dayjs from "dayjs";
import { Cancel, DragHandle } from "@mui/icons-material";
import { DeleteEntryDialog } from "./DeleteEntryDialog";
import type { Entry } from "../store/slices/cashBookSlice";

type DNDRowProps = {
  entry: Entry;
};

function DNDRow({ entry }: DNDRowProps) {
  const { id, account, amount, type } = entry;
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,
    data: { account, amount, type },
  });
  const { setNodeRef: setDroppableRef, isOver } = useDroppable({ id });

  const onClickEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
  };

  const onClickDelete = () => {
    setDeleteDialogOpen(true);
  };

  return (
    <>
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
          sx={{
            opacity: isDragging ? 0.5 : 1,
            "&:hover": { backgroundColor: "action.hover" },
          }}
          container
          px={1}
          size={12}
        >
          <Grid size={1} py={1} alignContent="center" direction="row">
            <IconButton size="small" {...listeners} {...attributes}>
              <DragHandle sx={{ cursor: "grab" }} fontSize="small" />
            </IconButton>
          </Grid>
          <Grid size={6} py={1} alignContent="center">
            <Typography variant="body1">{account}</Typography>
          </Grid>
          <Grid size={5} py={1} textAlign="right">
            <Box
              display="flex"
              alignItems="center"
              justifyContent="flex-end"
              gap={1}
            >
              <Button
                fullWidth
                size="large"
                onClick={onClickEdit}
                variant="outlined"
              >
                {toLocaleRupeeString(amount)}
              </Button>
              <IconButton onClick={onClickDelete} color="error" size="small">
                <Cancel fontSize="small" />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
      </Grid>

      <DeleteEntryDialog
        isOpen={isDeleteDialogOpen}
        entry={entry}
        onClose={() => setDeleteDialogOpen(false)}
      />
    </>
  );
}

type TableProps = {
  id: string;
  title: string;
  entries: Entry[];
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
            <DNDRow key={entry.id} entry={entry} />
          ))}
        </Grid>

        <Box sx={{ mt: 2, textAlign: "right" }}>
          <Typography variant="subtitle1" fontWeight="bold">
            Total:{" "}
            {toLocaleRupeeString(entries.reduce((sum, e) => sum + e.amount, 0))}
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}

export function CashBook() {
  const activeDate = useAppStore((state) => state.activeDate);
  const entries = useEntriesForActiveDate();

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
        <Box mb={4}>
          <Typography variant="h4">Accounting Sheet</Typography>
          {entries.date != null && entries.date !== activeDate && (
            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
              Showing last recent entries from{" "}
              {dayjs(entries.date).format("DD MMM YYYY")}
            </Typography>
          )}
        </Box>

        <Box sx={{ display: "flex", gap: 3, mb: 3 }}>
          <Table id="debit" title="Debit" entries={entries.debit} />
          <Table id="credit" title="Credit" entries={entries.credit} />
        </Box>

        <Paper sx={{ p: 2 }}>
          <Typography variant="h6">
            Balance: {toLocaleRupeeString(debitTotal - creditTotal)}
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
