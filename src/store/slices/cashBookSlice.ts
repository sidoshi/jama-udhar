import dayjs from "dayjs";
import type { SliceStateCreator } from "../slice";

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
};

export const createCashBookSlice: SliceStateCreator<CashBookSlice> = (set) => ({
  activeDate: dayjs().format("YYYY-MM-DD"),
  cashBookByDate: {
    // Sample data
    "2025-11-28": {
      id: "2025-11-28",
      date: "2025-11-28",
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
  },

  setActiveDate: (date: dayjs.Dayjs) =>
    set((state) => {
      state.activeDate = date.format("YYYY-MM-DD");
    }),
});
