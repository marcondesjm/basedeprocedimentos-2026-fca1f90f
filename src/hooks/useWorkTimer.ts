import { useWorkTimerContext } from "@/providers/WorkTimerProvider";
export type { WorkOrder, NoteEntry } from "@/providers/WorkTimerProvider";

/**
 * Hook wrapper around WorkTimerContext to maintain backward compatibility
 * with existing components while providing global state and background counting.
 */
export const useWorkTimer = () => {
  const context = useWorkTimerContext();
  return context;
};
