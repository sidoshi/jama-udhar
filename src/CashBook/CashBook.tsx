import { useRef, useState, useCallback, useEffect } from "react";
import {
  Paper,
  Typography,
  Box,
  Grid,
  Divider,
  IconButton,
  Button,
  TextField,
  ButtonGroup,
  Checkbox,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
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
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { useAppStore, useEntriesForActiveDate, useUndoRedo } from "../store";
import { toLocaleRupeeString } from "../utils";
import dayjs from "dayjs";
import {
  Cancel,
  DragHandle,
  Undo,
  Redo,
  MoreVert,
  DriveFileRenameOutline,
  CompareArrows,
} from "@mui/icons-material";
import { DeleteEntryDialog } from "./DeleteEntryDialog";
import { EditEntryDialog } from "./EditEntryDialog";
import {
  creditAddAccountAtom,
  debitAddAccountAtom,
  editBoxIdAtom,
  printPdfAtom,
  setEditBoxIdAtom,
  type CashBook,
  type Entry,
} from "../store/slices/cashBookSlice";
import { evaluate, isValid } from "../math";
import {
  EntryTransferDialog,
  type EntryTransferDialogProps,
} from "./EntryTransferDialog";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { PDFLedger } from "./PDFLedger";
import { handlePDFRestore } from "../pdfRestore";

function parseNumber(value: string): number | null {
  const numberValue = Number(value.toString().replace(/[₹, ]/g, ""));
  if (isNaN(numberValue)) {
    return null;
  }
  return numberValue;
}

type EntryAmountEditBoxProps = {
  entry: Entry;
};

function EntryAmountEditBox({ entry }: EntryAmountEditBoxProps) {
  const updateEntry = useAppStore((state) => state.updateEntry);
  const editBoxId = useAtomValue(editBoxIdAtom);
  const setEditBoxId = useSetAtom(setEditBoxIdAtom);
  const activeDate = useAppStore((state) => state.activeDate);
  const inputRef = useRef<HTMLInputElement>(null);

  const [editValue, setEditValue] = useState(entry.amount.toString());
  const isEntryEditActive = editBoxId === `${activeDate}-${entry.id}`;

  const onClickEdit = () => {
    setEditBoxId(entry.id);
    setEditValue(entry.amount.toString());
  };

  const onSubmitOrBlur = useCallback(() => {
    if (!isValid(editValue)) {
      return;
    }

    const numericValue = evaluate(editValue);
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

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditValue(e.target.value);
  };

  useEffect(() => {
    if (isEntryEditActive) {
      requestAnimationFrame(() => {
        setTimeout(() => {
          inputRef.current?.focus();
        }, 300);
      });
    }
  }, [isEntryEditActive]);

  return isEntryEditActive ? (
    <TextField
      size="small"
      value={editValue}
      fullWidth
      inputRef={inputRef}
      onChange={onChange}
      onBlur={onSubmitOrBlur}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          onSubmitOrBlur();
        }
        if (e.key === "Escape") {
          setEditBoxId(undefined);
        }
      }}
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
  const { id, account } = entry;
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const updateEntry = useAppStore((state) => state.updateEntry);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  function handleMenuOpen(event: React.MouseEvent<HTMLElement>) {
    setAnchorEl(event.currentTarget);
  }
  function handleMenuClose() {
    setAnchorEl(null);
  }

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,
    data: entry,
  });
  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id,
    data: entry,
  });

  const onClickDelete = () => {
    setDeleteDialogOpen(true);
  };

  const onClickEdit = () => {
    setEditDialogOpen(true);
  };

  const options = [
    {
      label: "Delete Entry",
      icon: <Cancel color="error" />,
      onClick: onClickDelete,
    },
    {
      label: `Move to ${entry.type === "debit" ? "Credit" : "Debit"}`,
      icon: <CompareArrows />,
      onClick: () => {
        updateEntry({
          ...entry,
          type: entry.type === "debit" ? "credit" : "debit",
        });
      },
    },
    {
      label: "Edit Entry",
      icon: <DriveFileRenameOutline />,
      onClick: onClickEdit,
    },
  ];

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
          <Grid size={1} py={1} alignContent="center">
            <IconButton size="small" {...listeners} {...attributes}>
              <DragHandle sx={{ cursor: "grab" }} fontSize="small" />
            </IconButton>
          </Grid>
          <Grid size={5} py={1} alignContent="center">
            <Typography
              variant="body1"
              sx={{
                textDecoration: entry.checked ? "underline" : "none",
                textDecorationThickness: "2px",
                textDecorationStyle: "wavy",
              }}
            >
              {account}
            </Typography>
            {entry.previousAmmount != null &&
              entry.previousAmmount !== entry.amount &&
              entry.previousAmmount !== 0 && (
                <Typography color="textDisabled" variant="subtitle2">
                  Previous Balance: {toLocaleRupeeString(entry.previousAmmount)}
                </Typography>
              )}
          </Grid>
          <Grid size={6} py={1} textAlign="right">
            <Box display="flex" alignItems="center" justifyContent="flex-end">
              <EntryAmountEditBox entry={entry} />
              <Checkbox
                checked={entry.checked}
                onChange={(_e, checked) => updateEntry({ ...entry, checked })}
              />
              <IconButton onClick={handleMenuOpen} size="small">
                <MoreVert />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={menuOpen}
                onClose={handleMenuClose}
              >
                {options.map((option) => (
                  <MenuItem
                    key={option.label}
                    onClick={() => {
                      option.onClick();
                      handleMenuClose();
                    }}
                  >
                    <ListItemIcon>{option.icon}</ListItemIcon>
                    <ListItemText>{option.label}</ListItemText>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Grid>
        </Grid>
      </Grid>

      <DeleteEntryDialog
        isOpen={isDeleteDialogOpen}
        entry={entry}
        onClose={() => setDeleteDialogOpen(false)}
      />

      <EditEntryDialog
        isOpen={isEditDialogOpen}
        entry={entry}
        onClose={() => setEditDialogOpen(false)}
      />
    </>
  );
}

type AddEntryFormProps = {
  type: Entry["type"];
};

function AddEntryForm({ type }: AddEntryFormProps) {
  const addEntry = useAppStore((state) => state.addEntry);
  const [account, setAccount] = useAtom(
    type === "debit" ? debitAddAccountAtom : creditAddAccountAtom
  );
  const [amount, setAmount] = useState<number | "" | "-">("");
  const accountRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    requestAnimationFrame(() => {
      setTimeout(() => {
        accountRef.current?.focus();
      }, 300);
    });
  }, [account]);

  const onAccountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value || "";
    setAccount(newValue.toUpperCase());
  };

  const onAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value.trim() === "-") {
      setAmount("-");
      return;
    }

    const numberValue = parseNumber(value);
    setAmount(numberValue || "");
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (account.trim().length < 2) {
      return;
    }
    if (amount === "" || amount === 0 || amount === "-") {
      return;
    }

    addEntry({
      id: `${type}-${dayjs().unix()}`,
      type,
      account: account.trim(),
      amount: amount,
      previousAmmount: 0,
      checked: false,
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
      <Grid spacing={2} container size={12} alignItems="center" mb={2}>
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
            value={
              typeof amount === "number" ? toLocaleRupeeString(amount) : amount
            }
            onChange={onAmountChange}
          />
        </Grid>
        <Grid size={2}>
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
          <Typography variant="h4" fontWeight="bold">
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
  const { canUndo, canRedo, undo, redo } = useUndoRedo();
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
  const entryPairs = zip(entries.debit, entries.credit);

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {isPrinting && (
        <PDFLedger
          balance={debitTotal - creditTotal}
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
        <Box
          mb={4}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box>
            <Typography variant="h4">Accounting Sheet</Typography>
            {entries.date != null && entries.date !== activeDate && (
              <Typography
                variant="subtitle2"
                color="textSecondary"
                gutterBottom
              >
                Showing last recent entries from{" "}
                {dayjs(entries.date).format("DD MMM YYYY")}
              </Typography>
            )}
          </Box>
          <Box display="flex" gap={1}>
            <ButtonGroup variant="outlined" aria-label="Basic button group">
              <Button
                variant="outlined"
                onClick={handlePDFRestore}
                color="primary"
              >
                Restore from PDF
              </Button>
              <Button
                variant="outlined"
                onClick={() => setIsPrinting(true)}
                color="primary"
              >
                Print / Export PDF
              </Button>
            </ButtonGroup>

            <ButtonGroup variant="outlined" aria-label="Basic button group">
              <Button
                onClick={() => undo()}
                disabled={!canUndo}
                color="primary"
              >
                <Undo />
              </Button>

              <Button
                onClick={() => redo()}
                disabled={!canRedo}
                color="primary"
              >
                <Redo />
              </Button>
            </ButtonGroup>
          </Box>
        </Box>

        <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
          <Table
            type="credit"
            id="credit"
            title="Credit"
            entries={entries.credit}
          />
          <Table
            type="debit"
            id="debit"
            title="Debit"
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
