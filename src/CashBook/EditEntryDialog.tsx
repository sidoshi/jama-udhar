import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Box,
} from "@mui/material";
import { useState } from "react";
import { useAppStore } from "../store";
import type { Entry } from "../store/slices/cashBookSlice";
import { evaluate, isValid } from "../math";

export type EditEntryDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  entry: Entry;
};

export function EditEntryDialog({
  isOpen,
  onClose,
  entry,
}: EditEntryDialogProps) {
  const updateEntry = useAppStore((state) => state.updateEntry);

  const [account, setAccount] = useState(entry.account);
  const [amount, setAmount] = useState(entry.amount.toString());
  const [type, setType] = useState<Entry["type"]>(entry.type);
  const [checked, setChecked] = useState(entry.checked);

  const handleDialogEnter = () => {
    setAccount(entry.account);
    setAmount(entry.amount.toString());
    setType(entry.type);
    setChecked(entry.checked);
  };

  const handleSave = () => {
    if (account.trim().length < 2) {
      return;
    }

    if (!isValid(amount)) {
      return;
    }

    const numericAmount = evaluate(amount);
    if (numericAmount == null) {
      return;
    }

    updateEntry({
      ...entry,
      account: account.trim(),
      amount: numericAmount,
      type,
      checked,
    });

    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleCancel}
      onTransitionEnter={handleDialogEnter}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Edit Entry</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField
            label="Account Name"
            value={account}
            onChange={(e) => setAccount(e.target.value.toUpperCase())}
            fullWidth
            required
            autoFocus
          />

          <TextField
            label="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            fullWidth
            required
            helperText="You can enter mathematical expressions like 100+50"
          />

          <FormControl fullWidth>
            <InputLabel>Type</InputLabel>
            <Select
              value={type}
              label="Type"
              onChange={(e) => setType(e.target.value as Entry["type"])}
            >
              <MenuItem value="debit">Debit</MenuItem>
              <MenuItem value="credit">Credit</MenuItem>
            </Select>
          </FormControl>

          <FormControlLabel
            control={
              <Checkbox
                checked={checked}
                onChange={(e) => setChecked(e.target.checked)}
              />
            }
            label="Checked"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button onClick={handleSave} color="primary" variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
