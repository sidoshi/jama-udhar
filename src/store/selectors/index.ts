import { useShallow } from "zustand/shallow";
import { useAppStore } from "..";

export const useEntriesForActiveDate = () => {
  const cashBook = useAppStore(
    useShallow((state) => state.cashBookByDate[state.activeDate])
  );

  const entries = cashBook ? cashBook.entries : [];
  const debitEntries = entries.filter((e) => e.type === "debit");
  const creditEntries = entries.filter((e) => e.type === "credit");

  return { debit: debitEntries, credit: creditEntries };
};
