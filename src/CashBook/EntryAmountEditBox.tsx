import { TextField, Box, Typography } from "@mui/material";
import { useAtomValue, useSetAtom } from "jotai";
import { evaluate } from "mathjs";
import { useRef, useState, useCallback, useEffect } from "react";
import { isValid } from "../math";
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
  const editBoxId = useAtomValue(editBoxIdAtom);
  const setEditBoxId = useSetAtom(setEditBoxIdAtom);
  const activeDate = useAppStore((state) => state.activeDate);
  const inputRef = useRef<HTMLInputElement>(null);

  const [editValue, setEditValue] = useState(entry.amount.toString());
  const isEntryEditActive = editBoxId === `${activeDate}-${entry.id}`;

  const onClickEdit = () => {
    setEditBoxId(entry.id);
    setEditValue(entry.amount.toString());
  };

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
      setEditBoxId(undefined);
    }, 0);
  }, [editValue, entry, updateEntry, setEditBoxId]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditValue(e.target.value);
  };

  useEffect(() => {
    if (isEntryEditActive) {
      requestAnimationFrame(() => {
        setTimeout(() => {
          inputRef.current?.focus();
        }, 300);
      });
    }
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
          setEditBoxId(undefined);
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
        color: entry.type === "debit" ? "error.dark" : "success.dark",
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
