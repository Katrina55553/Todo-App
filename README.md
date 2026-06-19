# ✓ Todo-App

一个同时支持 **Web 界面** 与 **终端 TUI** 的 Todo 应用。

Web 端拥有渐变毛玻璃 UI 与动画，TUI 端则可以在终端里用键盘高效管理任务。开发模式下两者共用同一个 `todos.json`，数据实时同步。

[![Vue 3](https://img.shields.io/badge/Vue-3-42b883?logo=vue.js)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-6-646cff?logo=vite)](https://vitejs.dev/)
[![Ink](https://img.shields.io/badge/Ink-7-000?logo=react)](https://github.com/vadimdemedes/ink)
[![GitHub Pages](https://img.shields.io/badge/Deploy-GitHub%20Pages-222?logo=github)](https://katrina55553.github.io/Todo-App/)

---

## ✨ 功能

| Web 端 | TUI 端 |
|--------|--------|
| 增删改查待办 | 增删改查待办 |
| 勾选完成状态 | 空格键切换完成 |
| 内联编辑 | `e` 编辑选中项 |
| 置顶 / 取消置顶 | `p` 置顶 / 取消置顶 |
| 拖拽排序 | `Shift + ↑/↓` 移动排序 |
| 渐变毛玻璃 UI + 动画 | 终端键盘流操作 |
| `localStorage` 持久化（生产） | `todos.json` 本地文件持久化 |

> 💡 **开发模式数据共享**
>
> 运行 `npm run dev` 时，Web 端会通过 Vite dev server 的本地 API `/api/todos` 直接读写 `todos.json`，因此 Web 与 TUI 数据实时同步。
>
> 生产构建部署到 GitHub Pages 后，Web 端回退到 `localStorage`，与 TUI 数据不互通。

---

## 🚀 快速开始

```bash
# 克隆并安装依赖
npm install

# 1. 启动 Web 开发服务器
npm run dev
```

然后访问 http://localhost:5173

```bash
# 2. 在另一个终端启动 TUI
npm run tui
```

---

## 🖥️ TUI 界面

```
Todo TUI    0 / 2 done

a=add  e=edit  space=toggle  p=pin  d=delete  ↑↓=nav  shift+↑↓=move  q=quit

> [ ] * Review PR
  [x]   Update README
```

### 快捷键

| 按键 | 操作 |
|------|------|
| `a` | 新增待办 |
| `e` | 编辑选中待办 |
| `space` | 切换完成状态 |
| `p` | 置顶 / 取消置顶 |
| `d` | 删除选中待办 |
| `↑` / `↓` | 上下导航 |
| `Shift + ↑` / `Shift + ↓` | 在同类（置顶/非置顶）中移动排序 |
| `q` / `Ctrl + C` | 退出 |

---

## 🏗️ 项目结构

```
Todo/
├── .github/workflows/
│   └── deploy.yml                  # GitHub Pages 自动部署
├── src/
│   ├── web/                        # Web 端
│   │   ├── App.vue                 # 主组件（逻辑 + 样式）
│   │   └── main.js                 # Vue 入口
│   └── storage/                    # 可插拔存储层
│       ├── storage.js              # Storage 接口
│       ├── localStorageAdapter.js  # 浏览器 localStorage 实现
│       ├── apiAdapter.js           # Web dev 本地 API 实现
│       └── index.js                # 适配器导出
├── tui/
│   ├── index.jsx                   # TUI 入口
│   ├── App.jsx                     # TUI 主组件
│   └── jsonFileAdapter.js          # Node.js JSON 文件实现
├── public/
│   └── favicon.ico
├── index.html
├── vite.config.js                  # Vite 配置 + /api/todos dev server
├── eslint.config.js
├── package.json
└── README.md
```

---

## 📦 可用命令

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动 Web 开发服务器 |
| `npm run tui` | 启动终端界面 |
| `npm run build` | 生产构建 |
| `npm run preview` | 预览生产构建 |
| `npm run lint` | 代码检查（oxlint + eslint） |
| `npm run format` | 代码格式化（prettier） |

---

## 🌐 部署

项目通过 GitHub Actions 自动部署到 GitHub Pages。push 到 `main` 分支后自动构建并发布。

**在线访问**：https://katrina55553.github.io/Todo-App/
