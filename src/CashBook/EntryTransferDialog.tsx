import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import type { Entry } from "../store/slices/cashBookSlice";
import React, { useState } from "react";
import { useAppStore } from "../store";
import { evaluate, isValid } from "../math";

export type EntryTransferDialogProps = {
  transfer?: {
    fromEntry: Entry;
    toEntry: Entry;
  };
  onClose: () => void;
};

export function EntryTransferDialog({
  transfer,
  onClose,
}: EntryTransferDialogProps) {
  const [amount, setAmount] = useState<string>("");
  const updateEntry = useAppStore((state) => state.updateEntry);
  const numericAmount = isValid(amount) ? evaluate(amount) : null;

  const handleClose = () => {
    setAmount("");
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };

  const handleSubmit = () => {
    if (amount === "" || transfer == null) {
      return;
    }
    if (!isValid(amount)) {
      return;
    }
    const numericAmount = evaluate(amount);

    const { fromEntry, toEntry } = transfer;
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
    <Dialog open={transfer != null} onClose={handleClose}>
      <DialogTitle>Do you want to transfer money?</DialogTitle>
      <DialogContent>
        <Box gap={3}>
          <Typography variant="body1" my={1}>
            How much money do you want to transfer from{" "}
            {transfer?.fromEntry.account} to {transfer?.toEntry.account}?
          </Typography>
          <TextField
            fullWidth
            value={amount}
            onChange={handleChange}
            label="Amount"
          ></TextField>
          {numericAmount && transfer != null && (
            <Box mt={1} display="flex" flexDirection="row" gap={1}>
              <Typography variant="subtitle2" color="textDisabled">
                {transfer.fromEntry.account}:{" "}
                {transfer.fromEntry.amount - numericAmount}
              </Typography>
              <Typography variant="subtitle2" color="textDisabled">
                {transfer.toEntry.account}:{" "}
                {transfer.toEntry.amount + numericAmount}
              </Typography>
            </Box>
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
