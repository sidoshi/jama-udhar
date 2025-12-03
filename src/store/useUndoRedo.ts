import { useAppStore } from "./index";

export const useUndoRedo = () => {
  const canUndo = useAppStore.temporal.getState().pastStates.length > 1;
  const canRedo = useAppStore.temporal.getState().futureStates.length > 0;
  const originalUndo = useAppStore.temporal.getState().undo;
  const originalRedo = useAppStore.temporal.getState().redo;
  const clear = useAppStore.temporal.getState().clear;

  // Wrap undo/redo to trigger persistence after the operation
  const undo = () => {
    originalUndo();
    // Trigger persist by getting the current state and setting it back
    const currentState = useAppStore.getState();
    useAppStore.setState(currentState, false, "persist-after-undo");
  };

  const redo = () => {
    originalRedo();
    // Trigger persist by getting the current state and setting it back
    const currentState = useAppStore.getState();
    useAppStore.setState(currentState, false, "persist-after-redo");
  };

  return {
    canUndo,
    canRedo,
    undo,
    redo,
    clear,
  };
};
