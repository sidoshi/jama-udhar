import dayjs from "dayjs";
import type { SliceStateCreator } from "../slice";
import { DATE_FORMAT } from "../../utils";
import { getCopiedFromMostRecentCashBook } from "../selectors";
import { atom } from "jotai";
import { useAppStore } from "..";

export const printPdfAtom = atom<boolean>(false);

export const editBoxIdAtom = atom<string | undefined>(undefined);
export const setEditBoxIdAtom = atom(
  null,
  (_get, set, update: string | undefined) => {
    const activeDate = useAppStore.getState().activeDate;
    if (update == null) {
      set(editBoxIdAtom, undefined);
    } else {
      const editBoxId = `${activeDate}-${update}`;
      set(editBoxIdAtom, editBoxId);
    }
  }
);

export const addAccountAtom = atom<string>("");
export const celebrationEnabledAtom = atom<boolean>(true);

export type Entry = {
  id: string;
  account: string;
  previousAmmount: number;
  amount: number;
  checked: boolean;
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

  loadToCleanStateFromPDF: (cashBook: CashBook) => void;

  deleteCashBookByDate: (date: string) => void;
};

export const createCashBookSlice: SliceStateCreator<CashBookSlice> = (set) => ({
  activeDate: dayjs().format("YYYY-MM-DD"),
  cashBookByDate: {},

  loadToCleanStateFromPDF: (cashBook: CashBook) =>
    set(() => {
      return {
        activeDate: cashBook.date,
        cashBookByDate: {
          [cashBook.date]: cashBook,
        },
      };
    }),

  deleteCashBookByDate: (date: string) =>
    set((state) => {
      delete state.cashBookByDate[date];
    }),

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
          entryToUpdate.checked = entry.checked;
        }
      }
    }),
});
