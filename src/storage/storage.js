/**
 * Storage adapter interface.
 * All adapters must return and accept the same todo shape:
 * { id: string, value: string, isCompleted: boolean, isPinned: boolean }
 */
export function createStorageAdapter({ load, save }) {
  return { load, save };
}
