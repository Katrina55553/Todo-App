import { createStorageAdapter } from './storage.js';

export function createApiAdapter(baseUrl = '/api/todos') {
  return createStorageAdapter({
    async load() {
      const res = await fetch(baseUrl);
      if (!res.ok) {
        throw new Error(`Failed to load todos: ${res.status} ${res.statusText}`);
      }
      return await res.json();
    },
    async save(todos) {
      const res = await fetch(baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(todos),
      });
      if (!res.ok) {
        throw new Error(`Failed to save todos: ${res.status} ${res.statusText}`);
      }
    },
  });
}
