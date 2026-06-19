import { createStorageAdapter } from './storage.js';

const STORAGE_KEY = 'todo-list';

export function createLocalStorageAdapter() {
  return createStorageAdapter({
    async load() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        return JSON.parse(raw).map(t => ({ isPinned: false, ...t }));
      } catch {
        return [];
      }
    },
    async save(todos) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    },
  });
}
