#!/usr/bin/env node
import React from 'react';
import { render } from 'ink';
import App from './App.jsx';

if (!process.stdin.isTTY) {
  console.error('This TUI must be run in an interactive terminal.');
  process.exit(1);
}

render(<App />);
