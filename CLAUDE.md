# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

纯前端 Todo 应用，使用 Vue 3 + localStorage 存储，无需后端服务。中文 UI 文本，代码使用英文。

## 常用命令

```bash
# 安装依赖
npm install

# 启动开发服务器（http://localhost:5173）
npm run dev

# 生产构建
npm run build

# 预览生产构建
npm run preview

# 代码检查与格式化
npm run lint       # oxlint + eslint 顺序执行
npm run format     # prettier --write src/
```

## 架构

项目结构扁平，所有应用逻辑集中在两个文件中：

- **`src/main.js`** — Vue 3 启动入口，挂载 App 到 `#app`
- **`src/App.vue`** — 整个 SPA（Composition API + `<script setup>`），包含全部状态管理、localStorage 读写、内联编辑、样式

### 数据存储

使用浏览器 **localStorage**，key 为 `todo-list`，值为 JSON 数组。每个 todo 对象结构：

```js
{ id: number, value: string, isCompleted: boolean }
```

`id` 使用 `Date.now()` 生成，足以满足纯前端场景。

## 代码风格

ESLint flat config + oxlint + Prettier；无分号、单引号、100 字符行宽、2 空格缩进、LF 换行。ES Modules (`"type": "module"`)。

## 注意事项

- 无测试套件
- 数据仅存于当前浏览器，不同设备间不同步
- `index.html` 中 `<html lang="">` 应改为 `zh-CN`
