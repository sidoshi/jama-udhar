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

  const entriesAtEnd = [/sp ang/i, /hm ang/i, /rok/i, /commission/i];

  const debitEntries = entries
    .filter((e) => e.amount < 0)
    .reverse()
    .sort((a, b) => {
      // modify the sort so that entries matching entriesAtEnd come last
      // but since commission is at the very end, it should come last among them

      const aEnds = entriesAtEnd.some((regex) => regex.test(a.account));
      const bEnds = entriesAtEnd.some((regex) => regex.test(b.account));

      if (aEnds && !bEnds) {
        return 1;
      } else if (!aEnds && bEnds) {
        return -1;
      } else if (aEnds && bEnds) {
        // both end, so check for commission
        const aIsCommission = /commission/i.test(a.account);
        const bIsCommission = /commission/i.test(b.account);
        if (aIsCommission && !bIsCommission) {
          return 1;
        } else if (!aIsCommission && bIsCommission) {
          return -1;
        } else {
          return 0;
        }
      } else {
        return 0;
      }
    });
  const creditEntries = entries
    .filter((e) => e.amount >= 0)
    .reverse()
    .sort((a, b) => {
      // modify the sort so that entries matching entriesAtEnd come last
      // but since commission is at the very end, it should come last among them

      const aEnds = entriesAtEnd.some((regex) => regex.test(a.account));
      const bEnds = entriesAtEnd.some((regex) => regex.test(b.account));

      if (aEnds && !bEnds) {
        return 1;
      } else if (!aEnds && bEnds) {
        return -1;
      } else if (aEnds && bEnds) {
        // both end, so check for commission
        const aIsCommission = /commission/i.test(a.account);
        const bIsCommission = /commission/i.test(b.account);
        if (aIsCommission && !bIsCommission) {
          return 1;
        } else if (!aIsCommission && bIsCommission) {
          return -1;
        } else {
          return 0;
        }
      } else {
        return 0;
      }
    });

  return {
    debit: debitEntries,
    credit: creditEntries,
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
        checked: false,
      })),
      activityLog: [
        {
          id: `init-${dayjs().unix()}`,
          timestamp: dayjs().unix().toString(),
          kind: "init" as const,
          date: mostRecentCashBook.date,
        },
      ],
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

export const useActivityLogForActiveDate = () => {
  const activeDate = useAppStore((state) => state.activeDate);
  const cashBook: CashBook | undefined = useAppStore(
    useShallow((state) => state.cashBookByDate[activeDate])
  );

  const log = cashBook?.activityLog ?? [];
  return [...log].reverse();
};
