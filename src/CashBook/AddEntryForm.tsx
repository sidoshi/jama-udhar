import { Grid, TextField, Button } from "@mui/material";
import dayjs from "dayjs";
import { useAtom } from "jotai";
import { useState, useRef, useEffect } from "react";
import { useAppStore } from "../store";
import {
  type Entry,
  debitAddAccountAtom,
  creditAddAccountAtom,
} from "../store/slices/cashBookSlice";
import { toLocaleRupeeString } from "../utils";

function parseNumber(value: string): number | null {
  const numberValue = Number(value.toString().replace(/[₹, ]/g, ""));
  if (isNaN(numberValue)) {
    return null;
  }
  return numberValue;
}

type AddEntryFormProps = {
  type: Entry["type"];
};

export function AddEntryForm({ type }: AddEntryFormProps) {
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
