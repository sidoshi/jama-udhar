import type { StateCreator } from "zustand";

import type { CashBookSlice } from "./slices/cashBookSlice";

export type AppStore = CashBookSlice;

export type SliceStateCreator<T> = StateCreator<
  AppStore,
  [["zustand/immer", never], ["zustand/devtools", never]],
  [],
  T
>;
