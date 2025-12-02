import dayjs from "dayjs";

import { useAppStore } from "..";
import { DATE_FORMAT } from "../../utils";
import type { CashBook } from "../slices/cashBookSlice";
import { useShallow } from "zustand/shallow";

function findMostRecentDateBefore(activeDate: string, dates: string[]) {
  if (dates.length === 0) {
    return null;
  }

  const today = dayjs(activeDate).format(DATE_FORMAT);
  const sortedDates = dates.sort((a, b) => dayjs(b).diff(dayjs(a)));

  if (dayjs(sortedDates[0]).isBefore(dayjs(today))) {
    return sortedDates[0];
  }
  if (dayjs(sortedDates[sortedDates.length - 1]).isAfter(dayjs(today))) {
    return null;
  }
  for (let i = 1; i < sortedDates.length; i++) {
    const date = sortedDates[i];
    if (dayjs(date).isBefore(dayjs(today))) {
      return date;
    }
  }

  return null;
}

export const getEntriesForCashBook = (cashBook?: CashBook) => {
  const entries = cashBook ? cashBook.entries : [];
  const debitEntries = entries.filter(
    (e) => e.type === "debit" && e.amount !== 0
  );
  const creditEntries = entries.filter(
    (e) => e.type === "credit" && e.amount !== 0
  );

  return {
    debit: debitEntries.reverse(),
    credit: creditEntries.reverse(),
    date: cashBook?.date,
  };
};

export const getMostRecentCashBook = (activeDate: string) => {
  const allDates = Object.keys(useAppStore.getState().cashBookByDate);

  // Find the most recent date before activeDate, if any
  const recentDate = findMostRecentDateBefore(activeDate, allDates);
  if (recentDate) {
    return useAppStore.getState().cashBookByDate[recentDate];
  }
};

export const getCopiedFromMostRecentCashBook = (activeDate: string) => {
  const mostRecentCashBook = getMostRecentCashBook(activeDate);
  if (mostRecentCashBook) {
    return {
      ...mostRecentCashBook,
      entries: mostRecentCashBook.entries.map((entry) => ({
        ...entry,
        previousAmmount: entry.amount,
      })),
      date: activeDate,
      id: activeDate,
    };
  }
};

export const useEntriesForActiveDate = () => {
  const activeDate = useAppStore((state) => state.activeDate);
  let cashBook: CashBook | undefined = useAppStore(
    useShallow((state) => state.cashBookByDate[activeDate])
  );

  if (cashBook == null) {
    cashBook = getMostRecentCashBook(activeDate);
  }

  return getEntriesForCashBook(cashBook);
};
