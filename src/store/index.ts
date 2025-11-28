import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createCashBookSlice } from "./slices/cashBookSlice";
import type { AppStore } from "./slice";

export const useAppStore = create<AppStore>()(
  devtools(
    immer((...a) => ({
      ...createCashBookSlice(...a),
    })),
    { name: "app-store" }
  )
);

export * from "./selectors";
