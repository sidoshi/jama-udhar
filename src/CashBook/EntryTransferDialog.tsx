import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useAppStore, useEntriesForActiveDate } from "../store";
import { evaluate, isValid } from "../math";
import { useAtom } from "jotai";
import { transferFromAtom, type Entry } from "../store/slices/cashBookSlice";

export function EntryTransferDialog() {
  const [transferFrom, setTransferFrom] = useAtom(transferFromAtom);
  const [amount, setAmount] = useState<string>("");
  const entries = useEntriesForActiveDate();
  const [transferTo, setTransferTo] = useState<Entry | null>(null);
  const updateEntry = useAppStore((state) => state.updateEntry);
  const numericAmount = isValid(amount) ? evaluate(amount) : null;

  const isOpen = transferFrom != null;
  const onClose = () => {
    setTransferFrom(null);
  };

  const handleClose = () => {
    setAmount("");
    onClose();
    setTransferTo(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };

  const handleSubmit = () => {
    if (amount === "" || transferFrom == null || transferTo == null) {
      return;
    }
    if (!isValid(amount)) {
      return;
    }
    const numericAmount = evaluate(amount);

    const fromEntry = transferFrom;
    const toEntry = transferTo;
    updateEntry({
      ...fromEntry,
      amount: fromEntry.amount - numericAmount,
    });
    updateEntry({
      ...toEntry,
      amount: toEntry.amount + numericAmount,
    });

    handleClose();
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Do you want to transfer money?</DialogTitle>
      <DialogContent>
        <Box gap={3} mt={1}>
          <Box display="flex" flexDirection="row" gap={2} mb={2}>
            <TextField
              label="Transfer From"
              value={
                transferFrom?.account
                  ? `${transferFrom.account} (${transferFrom.amount})`
                  : ""
              }
              fullWidth
              slotProps={{
                input: {
                  readOnly: true,
                },
              }}
            />
            <Autocomplete
              value={transferTo}
              fullWidth
              onChange={(_e, value) => setTransferTo(value)}
              renderInput={(params) => (
                <TextField {...params} label="Transfer To" />
              )}
              options={entries.debit
                .concat(entries.credit)
                .filter((e) => e.id !== transferFrom?.id)}
              getOptionLabel={(option) =>
                option != null
                  ? `${(option as Entry).account}  (${
                      (option as Entry).amount
                    })`
                  : ""
              }
              getOptionKey={(option) => option.id}
            />
          </Box>

          {transferFrom != null && transferTo != null && (
            <>
              <Typography variant="body1" my={1}>
                How much money do you want to transfer from{" "}
                {transferFrom?.account} to {transferTo?.account}?
              </Typography>
              <TextField
                fullWidth
                value={amount}
                onChange={handleChange}
                label="Amount"
              ></TextField>

              {numericAmount != null && (
                <Box mt={1} display="flex" flexDirection="column" gap={1}>
                  <Typography variant="subtitle2" color="textDisabled">
                    {transferFrom.account}: {transferFrom.amount} -&gt;{" "}
                    {transferFrom.amount - numericAmount}
                  </Typography>
                  <Typography variant="subtitle2" color="textDisabled">
                    {transferTo.account}: {transferTo.amount} -&gt;{" "}
                    {transferTo.amount + numericAmount}
                  </Typography>
                </Box>
              )}
            </>
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Submit</Button>
      </DialogActions>
    </Dialog>
  );
}
