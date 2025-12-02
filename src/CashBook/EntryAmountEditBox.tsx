import { TextField, Box, Typography } from "@mui/material";
import { useAtomValue, useSetAtom } from "jotai";
import { useRef, useState, useCallback, useEffect } from "react";
import { evaluate, isValid } from "../math";
import { useAppStore } from "../store";
import {
  type Entry,
  editBoxIdAtom,
  setEditBoxIdAtom,
} from "../store/slices/cashBookSlice";
import { toLocaleRupeeString } from "../utils";

type EntryAmountEditBoxProps = {
  entry: Entry;
};

export function EntryAmountEditBox({ entry }: EntryAmountEditBoxProps) {
  const updateEntry = useAppStore((state) => state.updateEntry);
  const setEditBoxId = useSetAtom(setEditBoxIdAtom);
  const activeDate = useAppStore((state) => state.activeDate);
  const inputRef = useRef<HTMLInputElement>(null);

  const [editValue, setEditValue] = useState(entry.amount.toString());
  const editBoxId = useAtomValue(editBoxIdAtom);
  const isEntryEditActive = editBoxId === `${activeDate}-${entry.id}`;

  const onClickEdit = () => {
    setEditBoxId(entry.id);
    setEditValue(entry.amount.toString());
  };

  const closeEditBox = useCallback(() => {
    setEditBoxId(undefined);
    setEditValue(entry.amount.toString());
  }, [entry.amount, setEditBoxId]);

  const onSubmitOrBlur = useCallback(() => {
    if (!isValid(editValue)) {
      return;
    }

    const numericValue = evaluate(editValue);
    if (numericValue != null) {
      updateEntry({
        ...entry,
        amount: numericValue,
      });
    }
    // Use setTimeout to ensure the blur event completes before unmounting
    setTimeout(() => {
      closeEditBox();
    }, 0);
  }, [editValue, entry, updateEntry, closeEditBox]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditValue(e.target.value);
  };

  useEffect(() => {
    if (isEntryEditActive) {
      setEditValue(entry.amount.toString());
      requestAnimationFrame(() => {
        setTimeout(() => {
          inputRef.current?.focus();
          inputRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }, 300);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEntryEditActive]);

  return isEntryEditActive ? (
    <TextField
      size="small"
      value={editValue}
      fullWidth
      inputRef={inputRef}
      onChange={onChange}
      onBlur={onSubmitOrBlur}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          onSubmitOrBlur();
        }
        if (e.key === "Escape") {
          closeEditBox();
        }
      }}
    />
  ) : (
    <Box
      onClick={onClickEdit}
      sx={{
        width: "100%",
        padding: "8px 14px",
        minHeight: "40px",
        display: "flex",
        alignItems: "center",
        color: entry.amount < 0 ? "error.dark" : "success.dark",
        justifyContent: "flex-start",
        cursor: "pointer",
        border: "1px solid transparent",
        borderRadius: "4px",
        backgroundColor: "transparent",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          backgroundColor: "action.hover",
          border: "1px solid",
          borderColor: "divider",
        },
        "&:focus": {
          outline: "2px solid",
          outlineColor: "primary.main",
          outlineOffset: "1px",
        },
      }}
      tabIndex={0}
    >
      <Typography variant="h6">{toLocaleRupeeString(entry.amount)}</Typography>
    </Box>
  );
}
