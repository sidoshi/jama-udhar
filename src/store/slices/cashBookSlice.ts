import dayjs from "dayjs";
import type { SliceStateCreator } from "../slice";
import { DATE_FORMAT } from "../../utils";
import { getCopiedFromMostRecentCashBook } from "../selectors";
import { atom } from "jotai";
import { useAppStore } from "..";

export const printPdfAtom = atom<boolean>(false);

export const transferFromAtom = atom<Entry | null>(null);

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

export const addAccountAtom = atom<string | null>(null);
export const celebrationEnabledAtom = atom<boolean>(true);

export type Entry = {
  id: string;
  account: string;
  previousAmmount: number;
  amount: number;
  checked: boolean;
  updatedAt: string;
};

export type ActivityLog =
  | {
      id: string;
      timestamp: string;
      kind: "add";
      account: string;
      amount: number;
    }
  | {
      id: string;
      timestamp: string;
      kind: "delete";
      account: string;
      amount: number;
    }
  | {
      id: string;
      timestamp: string;
      kind: "update";
      account: string;
      oldAmount: number;
      newAmount: number;
    }
  | {
      id: string;
      timestamp: string;
      kind: "init";
      date: string;
    };

export type CashBook = {
  id: string;
  date: string;
  entries: Entry[];
  activityLog: ActivityLog[];
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
        const entryToDelete = cashBook.entries.find((e) => e.id === entryId);
        if (entryToDelete == null) {
          return;
        }
        cashBook.entries = cashBook.entries.filter((e) => e.id !== entryId);
        cashBook.activityLog = cashBook.activityLog || [];
        cashBook.activityLog.push({
          id: `${entryToDelete.id}-delete-${dayjs().unix()}`,
          timestamp: dayjs().unix().toString(),
          kind: "delete" as const,
          account: entryToDelete.account,
          amount: entryToDelete.amount,
        });
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
            activityLog: [
              {
                id: `init-${dayjs().unix()}`,
                timestamp: dayjs().unix().toString(),
                kind: "init" as const,
                date: state.activeDate,
              },
            ],
          };
        }
      }

      const cashBook = state.cashBookByDate[state.activeDate];
      if (cashBook) {
        cashBook.entries.push(entry);
        cashBook.activityLog = cashBook.activityLog || [];
        cashBook.activityLog.push({
          id: `${entry.id}-add-${dayjs().unix()}`,
          timestamp: dayjs().unix().toString(),
          kind: "add" as const,
          account: entry.account,
          amount: entry.amount,
        });
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
          const oldAmount = entryToUpdate.amount;

          entryToUpdate.amount = entry.amount;
          entryToUpdate.account = entry.account;
          entryToUpdate.checked = entry.checked;
          entryToUpdate.updatedAt = dayjs().toISOString();

          cashBook.activityLog = cashBook.activityLog || [];
          if (oldAmount !== entry.amount) {
            cashBook.activityLog.push({
              id: `${entry.id}-update-${dayjs().unix()}`,
              timestamp: dayjs().unix().toString(),
              kind: "update" as const,
              account: entry.account,
              oldAmount,
              newAmount: entry.amount,
            });
          }
        }
      }
    }),
});
