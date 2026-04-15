import {
  Grid,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
} from "@mui/material";
import dayjs from "dayjs";
import { useAtom } from "jotai";
import { useState, useRef, useEffect } from "react";
import { useAppStore } from "../store";
import { addAccountAtom } from "../store/slices/cashBookSlice";
import { toLocaleRupeeString } from "../utils";
import { evaluate, isValid } from "../math";

export function AddEntryDialog() {
  const [account, setAccount] = useAtom(addAccountAtom);
  const isOpen = account != null;
  const handleClose = () => {
    setAccount(null);
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add New Entry</DialogTitle>

      {isOpen && <AddEntryForm />}
    </Dialog>
  );
}

function AddEntryForm() {
  const addEntry = useAppStore((state) => state.addEntry);
  const [account, setAccount] = useAtom(addAccountAtom);
  const [amount, setAmount] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const accountRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (accountRef.current && document.activeElement !== accountRef.current) {
      requestAnimationFrame(() => {
        setTimeout(() => {
          accountRef.current?.focus();
        }, 0);
      });
    }
  }, [account]);

  const onAccountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value || "";
    setAccount(newValue.toUpperCase());
  };

  const onAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid(amount)) {
      return;
    }
    if (account!.trim().length < 2) {
      return;
    }

    const numericValue = evaluate(amount);
    if (numericValue != null) {
      addEntry({
        id: `${account!.trim()}-${dayjs().unix()}`,
        account: account!.trim(),
        amount: numericValue,
        previousAmmount: 0,
        checked: false,
        updatedAt: dayjs().toISOString(),
        notes: notes.trim() || undefined,
      });

      setAccount(null);
      setAmount("");
      setNotes("");
      requestAnimationFrame(() => {
        setTimeout(() => {
          accountRef.current?.focus();
        }, 0);
      });
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <DialogContent>
        <Grid spacing={2} container size={12} alignItems="center">
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
                typeof amount === "number"
                  ? toLocaleRupeeString(amount)
                  : amount
              }
              onChange={onAmountChange}
            />
          </Grid>
          <Grid size={10}>
            <TextField
              fullWidth
              label="Notes (optional)"
              variant="outlined"
              size="small"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              multiline
              minRows={2}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={() => setAccount(null)} color="primary">
          Cancel
        </Button>
        <Button type="submit" color="primary" variant="contained">
          Add Entry
        </Button>
      </DialogActions>
    </form>
  );
}
