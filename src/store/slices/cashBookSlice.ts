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
  cashBookByDate: {},

  setActiveDate: (date: dayjs.Dayjs) =>
    set((state) => {
      state.activeDate = date.format("YYYY-MM-DD");
    }),
});
