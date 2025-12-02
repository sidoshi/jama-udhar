import { Grid, TextField, Button } from "@mui/material";
import dayjs from "dayjs";
import { useAtom } from "jotai";
import { useState, useRef, useEffect } from "react";
import { useAppStore } from "../store";
import { addAccountAtom } from "../store/slices/cashBookSlice";
import { toLocaleRupeeString } from "../utils";
import { evaluate, isValid } from "../math";

export function AddEntryForm() {
  const addEntry = useAppStore((state) => state.addEntry);
  const [account, setAccount] = useAtom(addAccountAtom);
  const [amount, setAmount] = useState<string>("");
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
    if (account.trim().length < 2) {
      return;
    }

    const numericValue = evaluate(amount);
    if (numericValue != null) {
      addEntry({
        id: `${account.trim()}-${dayjs().unix()}`,
        account: account.trim(),
        amount: numericValue,
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
    }
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
