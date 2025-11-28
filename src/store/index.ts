import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { temporal } from "zundo";
import {
  createCashBookSlice,
  type CashBookSlice,
} from "./slices/cashBookSlice";

export type AppStore = CashBookSlice;

export const useAppStore = create<AppStore>()(
  devtools(
    temporal(
      persist(
        immer((...a) => ({
          ...createCashBookSlice(...a),
        })),
        {
          name: "jama-udhar-storage",
          partialize: (state) => ({
            activeDate: state.activeDate,
            cashBookByDate: state.cashBookByDate,
          }),
        }
      )
    ),
    { name: "app-store" }
  )
);

export * from "./selectors";
export { useUndoRedo } from "./useUndoRedo";
