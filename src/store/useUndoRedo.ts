import { useAppStore } from "./index";

export const useUndoRedo = () => {
  const canUndo = useAppStore.temporal.getState().pastStates.length > 1;
  const canRedo = useAppStore.temporal.getState().futureStates.length > 0;
  const undo = useAppStore.temporal.getState().undo;
  const redo = useAppStore.temporal.getState().redo;
  const clear = useAppStore.temporal.getState().clear;

  return {
    canUndo,
    canRedo,
    undo,
    redo,
    clear,
  };
};
