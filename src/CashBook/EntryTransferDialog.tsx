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
  const [amount, setAmount] = useState<number | "">("");
  const updateEntry = useAppStore((state) => state.updateEntry);

  const handleClose = () => {
    setAmount("");
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = Number(e.target.value);
    if (!isNaN(num) && num !== 0) {
      setAmount(num);
    }
  };

  const handleSubmit = () => {
    if (amount === "" || transfer == null) {
      return;
    }

    const { fromEntry, toEntry } = transfer;
    updateEntry({
      ...fromEntry,
      amount: fromEntry.amount - amount,
    });
    updateEntry({
      ...toEntry,
      amount: toEntry.amount + amount,
    });

    onClose();
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
          {amount && transfer != null && (
            <Box mt={1} display="flex" flexDirection="row" gap={1}>
              <Typography variant="subtitle2" color="textDisabled">
                {transfer.fromEntry.account}:{" "}
                {transfer.fromEntry.amount - amount}
              </Typography>
              <Typography variant="subtitle2" color="textDisabled">
                {transfer.toEntry.account}: {transfer.toEntry.amount + amount}
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
