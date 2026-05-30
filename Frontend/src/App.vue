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
  if (!trimmed) {
    alert('请输入待办内容');
    return;
  }

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
  if (!confirm('确定要删除吗？')) return;
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
  if (!editingTodo.value.trim()) {
    alert('待办内容不能为空');
    return;
  }

  const target = list.value.find(t => t.id === editingTodo.id);
  if (target) {
    target.value = editingTodo.value.trim();
    saveList();
  }
  cancelEdit();
}

onMounted(() => loadList());
</script>

<template>
  <div class="Todo-App">
    <div class="title">Todo App</div>

    <div v-if="editingTodo.isEditing" class="edit-mode">
      <div class="edit-form">
        <input
          v-model="editingTodo.value"
          type="text"
          class="edit-input"
          placeholder="编辑待办内容"
          @keyup.enter="saveEdit"
        >
        <div class="edit-buttons">
          <div @click="saveEdit" class="edit-button save-button">save</div>
          <div @click="cancelEdit" class="edit-button cancel-button">cancel</div>
        </div>
      </div>
    </div>

    <div v-else class="Todo-form">
      <input v-model="value" type="text" class="Todo-input" placeholder="Add a Todo" @keyup.enter="add">
      <div @click="add" class="Todo-button">Add</div>
    </div>

    <div v-for="item in list" :key="item.id" :class="[item.isCompleted ? 'completed' : 'item']">
      <div class="item-content">
        <input type="checkbox" :checked="item.isCompleted" @change="update(item)" class="checkbox">
        <span class="name">{{ item.value }}</span>
      </div>
      <div class="item-actions">
        <div @click="startEdit(item)" class="Edit">Edit</div>
        <div @click="del(item)" class="Del">Del</div>
      </div>
    </div>

    <div v-if="list.length === 0" class="empty-message">No pending tasks, please add</div>
  </div>
</template>

<style scoped>
.Todo-App {
  width: 98%;
  min-height: 500px;
  background: white;
  border-radius: 5px;
  margin: 40px auto;
  padding: 30px 0;
}

.title {
  font-size: 30px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 20px;
}

.Todo-form {
  display: flex;
  margin: 20px auto 30px;
  width: 80%;
  max-width: 600px;
}

.Todo-input {
  border: 1px solid #dfe1e5;
  outline: none;
  width: 70%;
  height: 50px;
  border-radius: 20px 0 0 20px;
  padding-left: 15px;
  font-size: 16px;
  box-sizing: border-box;
}

.Todo-button {
  width: 100px;
  height: 50px;
  line-height: 50px;
  border-radius: 0 20px 20px 0;
  text-align: center;
  background: linear-gradient(to right, rgb(113, 65, 168), rgba(44, 114, 251, 1));
  color: #fff;
  cursor: pointer;
  font-weight: bold;
  transition: opacity 0.3s;
}

.Todo-button:hover {
  opacity: 0.9;
}

.item,
.completed {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 80%;
  max-width: 600px;
  height: 50px;
  margin: 8px auto;
  padding: 0 16px;
  border-radius: 20px;
  box-shadow: rgba(149, 157, 165, 0.2) 0 8px 20px;
  transition: all 0.3s;
}

.item:hover,
.completed:hover {
  transform: translateY(-2px);
  box-shadow: rgba(149, 157, 165, 0.3) 0 12px 24px;
}

.item-content {
  display: flex;
  align-items: center;
  gap: 10px;
}

.checkbox {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.completed .name {
  text-decoration: line-through;
  opacity: 0.6;
}

.Del {
  color: #ff4757;
  cursor: pointer;
  font-weight: bold;
  padding: 5px 10px;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.Del:hover {
  background-color: rgba(255, 71, 87, 0.1);
}

.empty-message {
  text-align: center;
  color: #888;
  margin-top: 30px;
}

/* 编辑模式 */
.edit-mode {
  margin: 20px auto 30px;
  width: 80%;
  max-width: 600px;
}

.edit-form {
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.edit-input {
  border: 2px solid #4dabf7;
  outline: none;
  height: 40px;
  border-radius: 8px;
  padding: 0 15px;
  font-size: 14px;
  box-sizing: border-box;
  transition: border-color 0.3s;
  flex: 1;
}

.edit-input:focus {
  border-color: #228be6;
}

.edit-buttons {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.edit-button {
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  font-size: 13px;
  transition: all 0.2s;
  text-align: center;
  min-width: 60px;
  border: none;
}

.save-button {
  background: linear-gradient(to right, #40c057, #2b8a3e);
  color: white;
}

.save-button:hover {
  background: linear-gradient(to right, #37b24d, #2b8a3e);
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(64, 192, 87, 0.3);
}

.cancel-button {
  background: #f8f9fa;
  color: #495057;
  border: 2px solid #dee2e6;
}

.cancel-button:hover {
  background: #e9ecef;
  border-color: #adb5bd;
  transform: translateY(-1px);
}
/* 操作按钮容器 */
.item-actions {
  display: flex;
  gap: 6px;
  flex-shrink: 0;
  margin-left: 10px;
}

.Edit,
.Del {
  padding: 4px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  font-size: 12px;
  transition: all 0.2s;
  white-space: nowrap;
  border: 1px solid transparent;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.Edit {
  color: #228be6;
  border-color: #d0ebff;
  background-color: #e7f5ff;
  min-width: 40px;
}

.Edit:hover {
  background-color: #d0ebff;
  transform: translateY(-1px);
}

.Del {
  color: #ff4757;
  border-color: #ffe3e3;
  background-color: #fff5f5;
  min-width: 40px;
}

.Del:hover {
  background-color: #ffe3e3;
  transform: translateY(-1px);
}
</style>

<style>
body {
  background: linear-gradient(to right, rgb(135, 5, 168), rgba(44, 114, 251, 1));
  margin: 0;
  padding: 0;
  font-family: Arial, sans-serif;
}
</style>
