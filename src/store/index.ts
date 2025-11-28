import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createCashBookSlice } from "./slices/cashBookSlice";
import type { AppStore } from "./slice";

export const useAppStore = create<AppStore>()(
  devtools(
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
    ),
    { name: "app-store" }
  )
);

export * from "./selectors";
