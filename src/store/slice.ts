import type { StateCreator } from "zustand";

import type { CashBookSlice } from "./slices/cashBookSlice";

export type AppStore = CashBookSlice;

export type SliceStateCreator<T> = StateCreator<
  AppStore,
  [
    ["zustand/immer", never],
    ["zustand/persist", unknown],
    ["zustand/devtools", never]
  ],
  [],
  T
>;
