import { createLocalStorageAdapter } from './localStorageAdapter.js';
import { createApiAdapter } from './apiAdapter.js';

export function createStorageAdapterForApp() {
  if (import.meta.env?.DEV) {
    return createApiAdapter();
  }
  return createLocalStorageAdapter();
}

export { createLocalStorageAdapter, createApiAdapter };

