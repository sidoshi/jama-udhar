import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { useAppStore } from "../store";
import type { Entry } from "../store/slices/cashBookSlice";

export type DeleteEntryDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  entry: Entry;
};

export function DeleteEntryDialog({
  isOpen,
  onClose,
  entry,
}: DeleteEntryDialogProps) {
  const deleteEntry = useAppStore((state) => state.deleteEntry);

  const handleDelete = () => {
    deleteEntry(entry.id);
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Confirm Deletion</DialogTitle>
      <DialogContent>
        <Typography variant="body1">
          Are you sure you want to delete this entry?
        </Typography>
        <Typography variant="body2" color="textSecondary" mt={2}>
          Account: {entry.account}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Amount: {entry.amount}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleDelete} color="error">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
