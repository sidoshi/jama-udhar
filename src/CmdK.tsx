import "react-cmdk/dist/cmdk.css";
import CommandPalette, { filterItems, getItemIndex } from "react-cmdk";
import { useEffect, useState } from "react";
import {
  AddBox,
  EditNote,
  PrintOutlined,
  UploadFileRounded,
} from "@mui/icons-material";
import { useAppStore, useEntriesForActiveDate } from "./store";
import { toLocaleRupeeString } from "./utils";
import { useSetAtom } from "jotai";
import {
  creditAddAccountAtom,
  debitAddAccountAtom,
  printPdfAtom,
  setEditBoxIdAtom,
} from "./store/slices/cashBookSlice";
import { handlePDFRestore } from "./pdfRestore";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";

type DeleteActiveCashBookDialogProps = {
  onClose: () => void;
  cashBookToDeleteDate: string | null;
};

const DeleteActiveCashBookDialog = ({
  onClose,
  cashBookToDeleteDate,
}: DeleteActiveCashBookDialogProps) => {
  const isOpen = Boolean(cashBookToDeleteDate);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");

  const enabled = cashBookToDeleteDate && deleteConfirmation === "DELETE";

  function handleDelete() {
    if (enabled) {
      const deleteCashBookByDate = useAppStore.getState().deleteCashBookByDate;
      deleteCashBookByDate(cashBookToDeleteDate);
      setDeleteConfirmation("");
      onClose();
    }
  }

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Delete Hisab</DialogTitle>
      <DialogContent>
        <Typography mb={2} variant="body1">
          Are you sure you want to delete the Hisab for {cashBookToDeleteDate}?
          This action cannot be undone. Type "DELETE" to confirm.
        </Typography>
        <TextField
          autoFocus
          margin="dense"
          value={deleteConfirmation}
          onChange={(e) => setDeleteConfirmation(e.target.value)}
          label="Type DELETE to confirm"
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button
          onClick={handleDelete}
          disabled={!enabled}
          color="error"
          variant="contained"
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export const CmdK = () => {
  const [page] = useState<"root" | "projects">("root");
  const [open, setOpen] = useState<boolean>(false);
  const [search, setSearch] = useState("");
  const entries = useEntriesForActiveDate();
  const setPrintPdfAtom = useSetAtom(printPdfAtom);
  const setEditBoxId = useSetAtom(setEditBoxIdAtom);

  const activeDate = useAppStore((state) => state.activeDate);

  const setDebitAddAccount = useSetAtom(debitAddAccountAtom);
  const setCreditAddAccount = useSetAtom(creditAddAccountAtom);

  const [cashBookToDeleteDate, setCashBookToDeleteDate] = useState<
    string | null
  >(null);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        e.stopPropagation();

        setOpen((currentValue) => {
          return !currentValue;
        });
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const filteredItems = filterItems(
    [
      {
        heading: "Home",
        id: "home",
        items: [
          {
            id: "print",
            children: "Print",
            icon: PrintOutlined,
            onClick: () => {
              setPrintPdfAtom(true);
            },
          },
          {
            id: "restore",
            children: "Restore from PDF",
            icon: UploadFileRounded,
            onClick: handlePDFRestore,
          },
        ],
      },
      {
        heading: "Debit (ઉધાર)",
        id: "debit",
        items: [
          ...entries.debit.map((e) => ({
            id: `debit-${e.id}-edit`,
            children: `${e.account} - ${toLocaleRupeeString(e.amount)}`,
            icon: EditNote,
            onClick: () => {
              setEditBoxId(e.id);
            },
          })),
        ],
      },

      {
        heading: "Credit (જમા)",
        id: "credit",
        items: [
          ...entries.credit.map((e) => ({
            id: `credit-${e.id}-edit`,
            children: `${e.account} - ${toLocaleRupeeString(e.amount)}`,
            icon: EditNote,
            onClick: () => {
              setEditBoxId(e.id);
            },
          })),
        ],
      },
      {
        heading: "Add",
        id: "add",
        items: [
          {
            id: "add-debit",
            children: `Debit (ઉધાર): ${search.toUpperCase()}`,
            icon: AddBox,
            onClick: () => {
              setDebitAddAccount(search.toUpperCase());
            },
          },
          {
            id: "add-credit",
            children: `Credit (જમા): ${search.toUpperCase()}`,
            icon: AddBox,
            onClick: () => {
              setCreditAddAccount(search.toUpperCase());
            },
          },
        ],
      },
      {
        heading: "Danger",
        id: "danger",
        items: [
          {
            id: "delete-book",
            children: `Delete Active Cash Book (${activeDate})`,
            icon: "TrashIcon",
            onClick: () => {
              setCashBookToDeleteDate(activeDate);
            },
          },
        ],
      },
    ],

    search
  );

  return (
    <>
      <CommandPalette
        onChangeSearch={setSearch}
        onChangeOpen={setOpen}
        search={search}
        isOpen={open}
        page={page}
      >
        <CommandPalette.Page id="root">
          {filteredItems.length ? (
            filteredItems.map((list) => (
              <CommandPalette.List key={list.id} heading={list.heading}>
                {list.items.map(({ id, ...rest }) => (
                  <CommandPalette.ListItem
                    key={id}
                    index={getItemIndex(filteredItems, id)}
                    {...rest}
                  />
                ))}
              </CommandPalette.List>
            ))
          ) : (
            <CommandPalette.FreeSearchAction />
          )}
        </CommandPalette.Page>
      </CommandPalette>
      <DeleteActiveCashBookDialog
        onClose={() => setCashBookToDeleteDate(null)}
        cashBookToDeleteDate={cashBookToDeleteDate}
      />
    </>
  );
};

export default CmdK;
