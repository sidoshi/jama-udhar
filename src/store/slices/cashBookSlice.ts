import dayjs from "dayjs";
import type { SliceStateCreator } from "../slice";
import { DATE_FORMAT } from "../../utils";
import { getCopiedFromMostRecentCashBook } from "../selectors";

const EntryType = {
  debit: "debit",
  credit: "credit",
} as const;

type EntryType = (typeof EntryType)[keyof typeof EntryType];

export type Entry = {
  id: string;
  account: string;
  previousAmmount: number;
  amount: number;
  type: EntryType;
};

export type CashBook = {
  id: string;
  date: string;
  entries: Entry[];
};

export type CashBookSlice = {
  activeDate: string;
  cashBookByDate: Record<string, CashBook>;

  setActiveDate: (date: dayjs.Dayjs) => void;
  deleteEntry: (entryId: string) => void;
  addEntry: (entry: Entry) => void;
  updateEntry: (entry: Entry) => void;

  editBoxId?: string;
  setEditBoxId: (entryId: string | undefined) => void;
};

export const createCashBookSlice: SliceStateCreator<CashBookSlice> = (set) => ({
  activeDate: dayjs().format("YYYY-MM-DD"),
  cashBookByDate: {},

  setActiveDate: (date: dayjs.Dayjs) =>
    set((state) => {
      state.activeDate = date.format(DATE_FORMAT);
    }),

  deleteEntry: (entryId: string) =>
    set((state) => {
      if (state.cashBookByDate[state.activeDate] == null) {
        const copiedCashBook = getCopiedFromMostRecentCashBook(
          state.activeDate
        );
        if (copiedCashBook) {
          state.cashBookByDate[state.activeDate] = copiedCashBook;
        }
      }
      const cashBook = state.cashBookByDate[state.activeDate];
      if (cashBook) {
        cashBook.entries = cashBook.entries.filter((e) => e.id !== entryId);
      }
    }),

  addEntry: (entry: Entry) =>
    set((state) => {
      if (state.cashBookByDate[state.activeDate] == null) {
        const copiedCashBook = getCopiedFromMostRecentCashBook(
          state.activeDate
        );
        if (copiedCashBook) {
          state.cashBookByDate[state.activeDate] = copiedCashBook;
        } else {
          state.cashBookByDate[state.activeDate] = {
            id: state.activeDate,
            date: state.activeDate,
            entries: [],
          };
        }
      }

      const cashBook = state.cashBookByDate[state.activeDate];
      if (cashBook) {
        cashBook.entries.push(entry);
      }
    }),

  updateEntry: (entry: Entry) =>
    set((state) => {
      if (state.cashBookByDate[state.activeDate] == null) {
        const copiedCashBook = getCopiedFromMostRecentCashBook(
          state.activeDate
        );
        if (copiedCashBook) {
          state.cashBookByDate[state.activeDate] = copiedCashBook;
        }
      }
      const cashBook = state.cashBookByDate[state.activeDate];
      if (cashBook) {
        const entryToUpdate = cashBook.entries.find((e) => e.id === entry.id);
        if (entryToUpdate != null) {
          entryToUpdate.amount = entry.amount;
          entryToUpdate.account = entry.account;
          entryToUpdate.type = entry.type;
        }
      }
    }),

  setEditBoxId: (entryId: string | undefined) =>
    set((state) => {
      if (entryId == null) {
        state.editBoxId = undefined;
      } else {
        state.editBoxId = `${state.activeDate}-${entryId}`;
      }
    }),
});
