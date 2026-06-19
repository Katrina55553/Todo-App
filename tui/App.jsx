import React, { useCallback, useEffect, useState } from 'react';
import { Box, Text, useApp, useInput } from 'ink';
import { TextInput } from '@inkjs/ui';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createJsonFileAdapter } from './jsonFileAdapter.js';

const DATA_PATH = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'todos.json');
const storage = createJsonFileAdapter(DATA_PATH);

function useTodos() {
  const [todos, setTodos] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    storage.load().then(data => {
      setTodos(data);
      setLoaded(true);
    });
  }, []);

  const persist = useCallback(async next => {
    setTodos(next);
    await storage.save(next);
  }, []);

  return { todos, loaded, persist };
}

export default function App() {
  const { exit } = useApp();
  const { todos, loaded, persist } = useTodos();
  const [cursor, setCursor] = useState(0);
  const [mode, setMode] = useState('normal'); // normal | add | edit
  const [inputValue, setInputValue] = useState('');
  const [editId, setEditId] = useState(null);

  const sortedTodos = todos.filter(t => t.isPinned).concat(todos.filter(t => !t.isPinned));

  // Keep cursor inside list bounds.
  useEffect(() => {
    if (cursor >= sortedTodos.length && sortedTodos.length > 0) {
      setCursor(sortedTodos.length - 1);
    }
  }, [sortedTodos.length, cursor]);

  function moveItem(dir) {
    const item = sortedTodos[cursor];
    if (!item) return;
    const idx = todos.findIndex(t => t.id === item.id);
    const targetIdx = idx + dir;
    if (targetIdx < 0 || targetIdx >= todos.length) return;
    const targetItem = todos[targetIdx];
    if (targetItem.isPinned !== item.isPinned) return;

    const next = [...todos];
    [next[idx], next[targetIdx]] = [next[targetIdx], next[idx]];
    persist(next);
    setCursor(c => Math.max(0, Math.min(sortedTodos.length - 1, c + dir)));
  }

  useInput((input, key) => {
    if (mode === 'normal') {
      if (input === 'q' || (key.ctrl && input === 'c')) {
        exit();
        return;
      }

      if (input === 'a') {
        setMode('add');
        setInputValue('');
        return;
      }

      const item = sortedTodos[cursor];
      if (!item) return;

      if (input === 'e') {
        setEditId(item.id);
        setInputValue(item.value);
        setMode('edit');
      } else if (input === 'd') {
        persist(todos.filter(t => t.id !== item.id));
      } else if (input === ' ') {
        persist(todos.map(t => (t.id === item.id ? { ...t, isCompleted: !t.isCompleted } : t)));
      } else if (input === 'p') {
        persist(todos.map(t => (t.id === item.id ? { ...t, isPinned: !t.isPinned } : t)));
      } else if (key.shift && key.upArrow) {
        moveItem(-1);
      } else if (key.shift && key.downArrow) {
        moveItem(1);
      } else if (key.upArrow) {
        setCursor(c => Math.max(0, c - 1));
      } else if (key.downArrow) {
        setCursor(c => Math.min(sortedTodos.length - 1, c + 1));
      }
    } else if (mode === 'add' || mode === 'edit') {
      if (key.escape) {
        setMode('normal');
        setInputValue('');
        setEditId(null);
      }
    }
  });

  function handleAddSubmit(value) {
    const trimmed = value.trim();
    if (trimmed) {
      persist([
        ...todos,
        {
          id: crypto.randomUUID(),
          value: trimmed,
          isCompleted: false,
          isPinned: false,
        },
      ]);
    }
    setMode('normal');
    setInputValue('');
  }

  function handleEditSubmit(value) {
    const trimmed = value.trim();
    if (trimmed) {
      persist(todos.map(t => (t.id === editId ? { ...t, value: trimmed } : t)));
    }
    setMode('normal');
    setInputValue('');
    setEditId(null);
  }

  const completedCount = todos.filter(t => t.isCompleted).length;

  return (
    <Box flexDirection="column" padding={1}>
      <Box marginBottom={1}>
        <Text bold color="magenta">
          Todo TUI
        </Text>
        <Text dimColor>
          {'  '}
          {completedCount} / {todos.length} done
        </Text>
      </Box>

      {mode === 'normal' && (
        <Text dimColor>
          a=add  e=edit  space=toggle  p=pin  d=delete  ↑↓=nav  shift+↑↓=move  q=quit
        </Text>
      )}

      {mode === 'add' && (
        <Box>
          <Text bold color="green">
            New:{' '}
          </Text>
          <TextInput value={inputValue} onChange={setInputValue} onSubmit={handleAddSubmit} />
        </Box>
      )}

      {mode === 'edit' && (
        <Box>
          <Text bold color="blue">
            Edit:{' '}
          </Text>
          <TextInput value={inputValue} onChange={setInputValue} onSubmit={handleEditSubmit} />
        </Box>
      )}

      <Box flexDirection="column" marginTop={1}>
        {!loaded && <Text dimColor>Loading...</Text>}
        {loaded && sortedTodos.length === 0 && (
          <Text dimColor>No todos yet. Press &apos;a&apos; to add one.</Text>
        )}
        {sortedTodos.map((item, i) => {
          const isSelected = i === cursor;
          const textColor = item.isCompleted ? 'gray' : item.isPinned ? 'magenta' : 'white';
          return (
            <Box key={item.id}>
              <Text bold color={isSelected ? 'cyan' : undefined}>
                {isSelected ? '> ' : '  '}
              </Text>
              <Text color={textColor} strikethrough={item.isCompleted}>
                [{item.isCompleted ? 'x' : ' '}] {item.isPinned ? '* ' : ''}
                {item.value}
              </Text>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
