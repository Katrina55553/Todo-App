<script setup>
import { ref, onMounted, reactive } from 'vue';

const STORAGE_KEY = 'todo-list';
const value = ref('');
const list = ref([]);
const editingTodo = reactive({
  id: null,
  value: '',
  isEditing: false
});

// 拖拽状态
const dragState = reactive({
  draggingId: null,   // 正在拖拽的 item id
  overId: null         // 拖拽悬停的目标 id
});

function onDragStart(e, item) {
  dragState.draggingId = item.id;
  e.dataTransfer.effectAllowed = 'move';
  // Firefox 需要设置 dataTransfer 数据
  e.dataTransfer.setData('text/plain', String(item.id));
}

function onDragOver(e, item) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
  // 只在目标变化时更新，避免不必要的渲染
  if (dragState.overId !== item.id && dragState.draggingId !== item.id) {
    dragState.overId = item.id;
  }
}

function onDragLeave(item) {
  if (dragState.overId === item.id) {
    dragState.overId = null;
  }
}

function onDrop(e, targetItem) {
  e.preventDefault();
  const fromId = dragState.draggingId;
  const toId = targetItem.id;
  if (fromId === toId || !fromId) return;

  const fromIdx = list.value.findIndex(t => t.id === fromId);
  const toIdx = list.value.findIndex(t => t.id === toId);
  if (fromIdx === -1 || toIdx === -1) return;

  // 从原位置移除，插入到目标位置
  const [moved] = list.value.splice(fromIdx, 1);
  list.value.splice(toIdx, 0, moved);
  saveList();
}

function onDragEnd() {
  dragState.draggingId = null;
  dragState.overId = null;
}

// localStorage 读写工具
function loadList() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    list.value = raw ? JSON.parse(raw) : [];
  } catch {
    list.value = [];
  }
}

function saveList() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list.value));
}

function add() {
  const trimmed = value.value.trim();
  if (!trimmed) return;

  list.value.push({
    id: Date.now(),
    value: trimmed,
    isCompleted: false
  });
  saveList();
  value.value = '';
}

function update(item) {
  item.isCompleted = !item.isCompleted;
  saveList();
}

function del(item) {
  list.value = list.value.filter(t => t.id !== item.id);
  saveList();
}

function startEdit(item) {
  editingTodo.id = item.id;
  editingTodo.value = item.value;
  editingTodo.isEditing = true;
}

function cancelEdit() {
  editingTodo.id = null;
  editingTodo.value = '';
  editingTodo.isEditing = false;
}

function saveEdit() {
  if (!editingTodo.value.trim()) return;

  const target = list.value.find(t => t.id === editingTodo.id);
  if (target) {
    target.value = editingTodo.value.trim();
    saveList();
  }
  cancelEdit();
}

const completedCount = () => list.value.filter(t => t.isCompleted).length;

onMounted(() => loadList());
</script>

<template>
  <div class="app-bg">
    <div class="todo-card">
      <!-- 标题区 -->
      <header class="header">
        <h1 class="title">
          <svg class="title-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 11l3 3L22 4" />
            <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
          </svg>
          Todo
        </h1>
        <span class="counter" v-if="list.length">
          {{ completedCount() }} / {{ list.length }} done
        </span>
      </header>

      <!-- 输入区 -->
      <div class="input-row">
        <input
          v-model="value"
          type="text"
          class="input"
          placeholder="What needs to be done?"
          @keyup.enter="add"
        />
        <button class="btn-add" @click="add" :disabled="!value.trim()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      </div>

      <!-- 编辑模式 -->
      <div v-if="editingTodo.isEditing" class="edit-bar">
        <input
          v-model="editingTodo.value"
          type="text"
          class="edit-input"
          placeholder="Edit todo..."
          @keyup.enter="saveEdit"
          @keyup.escape="cancelEdit"
          ref="editInput"
        />
        <button class="btn-save" @click="saveEdit">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </button>
        <button class="btn-cancel" @click="cancelEdit">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <!-- 列表 -->
      <TransitionGroup name="list" tag="ul" class="todo-list">
        <li
          v-for="item in list"
          :key="item.id"
          class="todo-item"
          :class="{
            done: item.isCompleted,
            dragging: dragState.draggingId === item.id,
            'drag-over': dragState.overId === item.id && dragState.draggingId !== item.id
          }"
          draggable="true"
          @dragstart="onDragStart($event, item)"
          @dragover="onDragOver($event, item)"
          @dragleave="onDragLeave(item)"
          @drop="onDrop($event, item)"
          @dragend="onDragEnd"
        >
          <!-- 拖拽手柄 -->
          <span class="drag-handle" title="Drag to reorder">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <circle cx="9" cy="6" r="1.5" />
              <circle cx="15" cy="6" r="1.5" />
              <circle cx="9" cy="12" r="1.5" />
              <circle cx="15" cy="12" r="1.5" />
              <circle cx="9" cy="18" r="1.5" />
              <circle cx="15" cy="18" r="1.5" />
            </svg>
          </span>

          <label class="check-label">
            <input
              type="checkbox"
              :checked="item.isCompleted"
              @change="update(item)"
              class="check-input"
            />
            <span class="check-box">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </span>
          </label>

          <span class="todo-text">{{ item.value }}</span>

          <div class="actions">
            <button class="btn-icon btn-edit" @click="startEdit(item)" title="Edit">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </button>
            <button class="btn-icon btn-del" @click="del(item)" title="Delete">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
              </svg>
            </button>
          </div>
        </li>
      </TransitionGroup>

      <!-- 空状态 -->
      <div v-if="list.length === 0" class="empty">
        <svg class="empty-icon" viewBox="0 0 120 120" fill="none">
          <circle cx="60" cy="60" r="50" stroke="#e2e8f0" stroke-width="2" stroke-dasharray="8 4" />
          <path d="M45 55 L55 65 L75 45" stroke="#a0aec0" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
          <line x1="42" y1="75" x2="78" y2="75" stroke="#cbd5e0" stroke-width="2" stroke-linecap="round" />
          <line x1="48" y1="83" x2="72" y2="83" stroke="#e2e8f0" stroke-width="2" stroke-linecap="round" />
        </svg>
        <p class="empty-text">All clear! Add a new task above.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ── 全局背景 ── */
.app-bg {
  min-height: 100vh;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 60px 16px 40px;
  box-sizing: border-box;
}

/* ── 主卡片 ── */
.todo-card {
  width: 100%;
  max-width: 560px;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 36px 32px 28px;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.08),
    0 1px 4px rgba(0, 0, 0, 0.04);
}

/* ── 头部 ── */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 28px;
}

.title {
  margin: 0;
  font-size: 28px;
  font-weight: 800;
  color: #1a202c;
  display: flex;
  align-items: center;
  gap: 10px;
  letter-spacing: -0.5px;
}

.title-icon {
  width: 28px;
  height: 28px;
  color: #7c3aed;
}

.counter {
  font-size: 13px;
  color: #a0aec0;
  font-weight: 500;
  background: #f7fafc;
  padding: 4px 12px;
  border-radius: 20px;
}

/* ── 输入区 ── */
.input-row {
  display: flex;
  gap: 10px;
  margin-bottom: 24px;
}

.input {
  flex: 1;
  height: 48px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 0 18px;
  font-size: 15px;
  color: #2d3748;
  background: #fff;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  box-sizing: border-box;
}

.input::placeholder {
  color: #a0aec0;
}

.input:focus {
  border-color: #7c3aed;
  box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.12);
}

.btn-add {
  width: 48px;
  height: 48px;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, #7c3aed, #6d28d9);
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: transform 0.15s, box-shadow 0.2s, opacity 0.2s;
}

.btn-add svg {
  width: 22px;
  height: 22px;
}

.btn-add:hover:not(:disabled) {
  transform: scale(1.05);
  box-shadow: 0 4px 14px rgba(124, 58, 237, 0.35);
}

.btn-add:active:not(:disabled) {
  transform: scale(0.97);
}

.btn-add:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* ── 编辑栏 ── */
.edit-bar {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  padding: 12px 14px;
  background: #f0f5ff;
  border-radius: 14px;
  border: 2px solid #c3dafe;
}

.edit-input {
  flex: 1;
  height: 40px;
  border: 2px solid #a3bffa;
  border-radius: 8px;
  padding: 0 14px;
  font-size: 14px;
  color: #2d3748;
  background: #fff;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.2s;
}

.edit-input:focus {
  border-color: #7c3aed;
}

.btn-save,
.btn-cancel {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: transform 0.15s, background 0.2s;
}

.btn-save svg,
.btn-cancel svg {
  width: 18px;
  height: 18px;
}

.btn-save {
  background: #7c3aed;
  color: #fff;
}

.btn-save:hover {
  background: #6d28d9;
  transform: scale(1.05);
}

.btn-cancel {
  background: #e2e8f0;
  color: #718096;
}

.btn-cancel:hover {
  background: #cbd5e0;
  transform: scale(1.05);
}

/* ── 列表 ── */
.todo-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.todo-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  background: #fff;
  border-radius: 14px;
  border: 1.5px solid #edf2f7;
  transition: all 0.25s ease;
}

.todo-item:hover {
  border-color: #e2e8f0;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  transform: translateY(-1px);
}

.todo-item.done {
  background: #f7fafc;
  border-color: #edf2f7;
}

/* ── 拖拽 ── */
.drag-handle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 24px;
  cursor: grab;
  color: #cbd5e0;
  flex-shrink: 0;
  transition: color 0.2s;
  touch-action: none;
}

.drag-handle:hover {
  color: #a0aec0;
}

.drag-handle:active {
  cursor: grabbing;
}

.drag-handle svg {
  width: 16px;
  height: 16px;
}

.todo-item.dragging {
  opacity: 0.4;
  transform: scale(0.98);
}

.todo-item.drag-over {
  border-color: #7c3aed;
  box-shadow: 0 0 0 2px rgba(124, 58, 237, 0.15);
  transform: translateY(-2px);
}

/* ── 自定义 checkbox ── */
.check-label {
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.check-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.check-box {
  width: 22px;
  height: 22px;
  border: 2px solid #d1d5db;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  background: #fff;
}

.check-box svg {
  width: 14px;
  height: 14px;
  opacity: 0;
  transform: scale(0.5);
  transition: all 0.2s;
  color: #fff;
  stroke-width: 3;
}

.check-input:checked + .check-box {
  background: linear-gradient(135deg, #7c3aed, #6d28d9);
  border-color: #7c3aed;
}

.check-input:checked + .check-box svg {
  opacity: 1;
  transform: scale(1);
}

.check-input:focus-visible + .check-box {
  box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.2);
}

/* ── 文字 ── */
.todo-text {
  flex: 1;
  font-size: 15px;
  color: #2d3748;
  line-height: 1.4;
  word-break: break-word;
  transition: all 0.25s;
}

.done .todo-text {
  color: #a0aec0;
  text-decoration: line-through;
  text-decoration-color: #cbd5e0;
}

/* ── 操作按钮 ── */
.actions {
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s;
  flex-shrink: 0;
}

.todo-item:hover .actions {
  opacity: 1;
}

.btn-icon {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 8px;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
}

.btn-icon svg {
  width: 16px;
  height: 16px;
}

.btn-edit {
  color: #718096;
}

.btn-edit:hover {
  background: #edf2f7;
  color: #4a5568;
}

.btn-del {
  color: #e53e3e;
}

.btn-del:hover {
  background: #fff5f5;
  color: #c53030;
}

/* ── 空状态 ── */
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px 20px;
}

.empty-icon {
  width: 100px;
  height: 100px;
  margin-bottom: 16px;
  opacity: 0.7;
}

.empty-text {
  color: #a0aec0;
  font-size: 14px;
  margin: 0;
}

/* ── 列表动画 ── */
.list-enter-active {
  transition: all 0.3s ease;
}

.list-leave-active {
  transition: all 0.25s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateY(-10px) scale(0.97);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(30px) scale(0.95);
}

.list-move {
  transition: transform 0.3s ease;
}
</style>

<style>
*,
*::before,
*::after {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
