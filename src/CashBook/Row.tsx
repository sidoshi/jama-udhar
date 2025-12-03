import {
  Cancel,
  DriveFileRenameOutline,
  MoreVert,
  SwitchAccount,
} from "@mui/icons-material";
import {
  Grid,
  IconButton,
  Typography,
  Box,
  Checkbox,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useState } from "react";
import { useAppStore } from "../store";
import {
  editBoxIdAtom,
  transferFromAtom,
  type Entry,
} from "../store/slices/cashBookSlice";
import { toLocaleRupeeString } from "../utils";
import { DeleteEntryDialog } from "./DeleteEntryDialog";
import { EditEntryDialog } from "./EditEntryDialog";
import { EntryAmountEditBox } from "./EntryAmountEditBox";
import { useAtom, useAtomValue } from "jotai";

type RowProps = {
  entry: Entry;
};

export function Row({ entry }: RowProps) {
  const { id, account } = entry;
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const updateEntry = useAppStore((state) => state.updateEntry);
  const activeDate = useAppStore((state) => state.activeDate);
  const [, setTransferFrom] = useAtom(transferFromAtom);

  const editBoxId = useAtomValue(editBoxIdAtom);
  const isEntryEditActive = editBoxId === `${activeDate}-${entry.id}`;

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  function handleMenuOpen(event: React.MouseEvent<HTMLElement>) {
    setAnchorEl(event.currentTarget);
  }
  function handleMenuClose() {
    setAnchorEl(null);
  }

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
      label: "Edit Entry",
      icon: <DriveFileRenameOutline />,
      onClick: onClickEdit,
    },

    {
      label: "Transfer Money",
      icon: <SwitchAccount />,
      onClick: () => setTransferFrom(entry),
    },
  ];

  const isHidden = entry.amount === 0 && !isEntryEditActive;

  if (isHidden) {
    return null;
  }

  return (
    <>
      <Grid container px={1} size={12} key={id}>
        <Grid size={6} py={1} alignContent="center">
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
            <Menu anchorEl={anchorEl} open={menuOpen} onClose={handleMenuClose}>
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
