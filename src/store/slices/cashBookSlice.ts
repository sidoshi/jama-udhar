import dayjs from "dayjs";
import type { SliceStateCreator } from "../slice";
import { DATE_FORMAT } from "../../utils";
import { getMostRecentCashBook } from "../selectors";

const EntryType = {
  debit: "debit",
  credit: "credit",
} as const;

type EntryType = (typeof EntryType)[keyof typeof EntryType];

export type Entry = {
  id: string;
  account: string;
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
};

export const createCashBookSlice: SliceStateCreator<CashBookSlice> = (set) => ({
  activeDate: dayjs().format("YYYY-MM-DD"),
  cashBookByDate: {
    "2025-11-20": {
      id: "2025-11-20",
      date: "2025-11-20",
      entries: [
        { id: "e1", account: "Cash", amount: 1000, type: "debit" },
        { id: "e2", account: "Sales Revenue", amount: 1000, type: "credit" },
        {
          id: "e3",
          account: "Accounts Receivable",
          amount: 553400,
          type: "debit",
        },
        {
          id: "e4",
          account: "Service Revenue",
          amount: 5053240,
          type: "credit",
        },
        {
          id: "e5",
          account: "Equipment",
          amount: 205400,
          type: "debit",
        },
        {
          id: "e6",
          account: "Cash",
          amount: 23000,
          type: "credit",
        },
      ],
    },
    // Sample data
    "2025-11-26": {
      id: "2025-11-26",
      date: "2025-11-26",
      entries: [
        { id: "e1", account: "Cash", amount: 1000, type: "debit" },
        { id: "e2", account: "Sales Revenue", amount: 1000, type: "credit" },
        {
          id: "e3",
          account: "Accounts Receivable",
          amount: 500,
          type: "debit",
        },
        {
          id: "e4",
          account: "Service Revenue",
          amount: 500,
          type: "credit",
        },
        {
          id: "e5",
          account: "Equipment",
          amount: 2000,
          type: "debit",
        },
        {
          id: "e6",
          account: "Cash",
          amount: 2000,
          type: "credit",
        },
      ],
    },

    "2025-11-27": {
      id: "2025-11-27",
      date: "2025-11-27",
      entries: [
        { id: "e1", account: "Cash", amount: 1000, type: "debit" },
        { id: "e2", account: "Sales Revenue", amount: 1000, type: "credit" },
        {
          id: "e3",
          account: "Accounts Receivable",
          amount: 553400,
          type: "debit",
        },
        {
          id: "e4",
          account: "Service Revenue",
          amount: 5053240,
          type: "credit",
        },
        {
          id: "e5",
          account: "Equipment",
          amount: 205400,
          type: "debit",
        },
        {
          id: "e6",
          account: "Cash",
          amount: 23000,
          type: "credit",
        },
      ],
    },

    "2025-11-28": {
      id: "2025-11-28",
      date: "2025-11-28",
      entries: [
        { id: "e1", account: "Cash", amount: 1000, type: "debit" },
        { id: "e2", account: "Sales Revenue", amount: 1000, type: "credit" },
        {
          id: "e3",
          account: "Accounts Receivable",
          amount: 50320,
          type: "debit",
        },
        {
          id: "e4",
          account: "Service Revenue",
          amount: 50340,
          type: "credit",
        },
        {
          id: "e5",
          account: "Equipment",
          amount: 2004230,
          type: "debit",
        },
        {
          id: "e6",
          account: "Cash",
          amount: 202300,
          type: "credit",
        },
      ],
    },
  },

  setActiveDate: (date: dayjs.Dayjs) =>
    set((state) => {
      state.activeDate = date.format(DATE_FORMAT);
    }),

  deleteEntry: (entryId: string) =>
    set((state) => {
      if (state.cashBookByDate[state.activeDate] == null) {
        const copiedCashBook = getMostRecentCashBook(state.activeDate);
        if (copiedCashBook) {
          state.cashBookByDate[state.activeDate] = {
            ...copiedCashBook,
            date: state.activeDate,
          };
        }
      }
      const cashBook = state.cashBookByDate[state.activeDate];
      if (cashBook) {
        cashBook.entries = cashBook.entries.filter((e) => e.id !== entryId);
      }
    }),
});
