import { useRef, useState, useCallback } from "react";
import {
  Paper,
  Typography,
  Box,
  Grid,
  Divider,
  IconButton,
  Button,
  TextField,
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

function parseNumber(value: string): number | null {
  const numberValue = Number(value.toString().replace(/[₹,]/g, ""));
  if (isNaN(numberValue)) {
    return null;
  }
  return numberValue;
}

type EntryAmountEditBoxProps = {
  entry: Entry;
};

function EntryAmountEditBox({ entry }: EntryAmountEditBoxProps) {
  const setEditBoxId = useAppStore((state) => state.setEditBoxId);
  const updateEntry = useAppStore((state) => state.updateEntry);
  const editBoxId = useAppStore((state) => state.editBoxId);
  const activeDate = useAppStore((state) => state.activeDate);

  const [editValue, setEditValue] = useState(entry.amount.toString());
  const isEntryEditActive = editBoxId === `${activeDate}-${entry.id}`;

  const onClickEdit = () => {
    setEditBoxId(entry.id);
    setEditValue(entry.amount.toString());
  };

  const onSubmitOrBlur = useCallback(() => {
    const numericValue = parseNumber(editValue);
    if (numericValue != null) {
      updateEntry({
        ...entry,
        amount: numericValue,
      });
    }
    // Use setTimeout to ensure the blur event completes before unmounting
    setTimeout(() => {
      setEditBoxId(undefined);
    }, 0);
  }, [editValue, entry, updateEntry, setEditBoxId]);

  return isEntryEditActive ? (
    <TextField
      size="small"
      value={editValue}
      onChange={(e) => setEditValue(e.target.value)}
      onBlur={onSubmitOrBlur}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          onSubmitOrBlur();
        }
        if (e.key === "Escape") {
          setEditBoxId(undefined);
        }
      }}
      autoFocus
    />
  ) : (
    <Button fullWidth size="large" onClick={onClickEdit} variant="outlined">
      {toLocaleRupeeString(entry.amount)}
    </Button>
  );
}

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
              <EntryAmountEditBox entry={entry} />
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

type AddEntryFormProps = {
  type: Entry["type"];
};

function AddEntryForm({ type }: AddEntryFormProps) {
  const addEntry = useAppStore((state) => state.addEntry);
  const [account, setAccount] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const accountRef = useRef<HTMLInputElement>(null);

  const onAccountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value || "";
    setAccount(newValue.toUpperCase());
  };

  const onAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    const numberValue = parseNumber(value);
    setAmount(numberValue || "");
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (account.trim().length < 2) {
      return;
    }
    if (amount === "" || amount === 0) {
      return;
    }

    addEntry({
      id: `${type}-${dayjs().unix()}`,
      type,
      account: account.trim(),
      amount: amount,
      previousAmmount: 0,
    });

    setAccount("");
    setAmount("");
    requestAnimationFrame(() => {
      setTimeout(() => {
        accountRef.current?.focus();
      }, 0);
    });
  };

  return (
    <form onSubmit={onSubmit}>
      <Grid container size={12} gap={1} alignItems="center" mb={2}>
        <Grid size={5}>
          <TextField
            fullWidth
            inputRef={accountRef}
            label="Account Name"
            variant="outlined"
            size="small"
            value={account}
            onChange={onAccountChange}
          />
        </Grid>
        <Grid size={5}>
          <TextField
            fullWidth
            label="Amount (₹)"
            variant="outlined"
            size="small"
            value={amount ? toLocaleRupeeString(amount) : ""}
            onChange={onAmountChange}
          />
        </Grid>
        <Grid size={1}>
          <Button type="submit" fullWidth size="small" variant="contained">
            Add
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}

type TableProps = {
  id: string;
  title: string;
  type: Entry["type"];
  entries: Entry[];
};

function Table({ title, entries, type }: TableProps) {
  return (
    <Box sx={{ flex: 1, minWidth: 300 }}>
      <Paper
        sx={{
          p: 2,
          minHeight: 400,
        }}
      >
        <AddEntryForm type={type} />
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

          {entries.reverse().map((entry) => (
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
          <Table
            type="debit"
            id="debit"
            title="Debit"
            entries={entries.debit}
          />
          <Table
            type="credit"
            id="credit"
            title="Credit"
            entries={entries.credit}
          />
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
