import { readFile, writeFile } from 'node:fs/promises';
import { createStorageAdapter } from '../src/storage/storage.js';

export function createJsonFileAdapter(filePath) {
  return createStorageAdapter({
    async load() {
      try {
        const raw = await readFile(filePath, 'utf-8');
        return JSON.parse(raw).map(t => ({ isPinned: false, ...t }));
      } catch (err) {
        if (err.code === 'ENOENT') return [];
        throw err;
      }
    },
    async save(todos) {
      await writeFile(filePath, JSON.stringify(todos, null, 2), 'utf-8');
    },
  });
}
