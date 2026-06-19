# Todo-App

Vue 3 Todo 应用，支持 Web UI 和终端 TUI 两种界面。Web 端使用 localStorage 持久化，TUI 端使用本地 JSON 文件持久化。

## 技术栈

- **Vue 3** — Composition API + `<script setup>`
- **Vite** — 构建工具
- **Ink + React** — 终端用户界面（TUI）
- **CSS3** — 渐变背景、毛玻璃效果、动画
- **localStorage / JSON 文件** — 数据持久化
- **可插拔 Storage Adapter** — Web 与 TUI 共享统一存储接口

## 功能

- 增删改查待办事项
- 勾选标记完成状态
- 内联编辑已有待办
- 置顶/取消置顶
- 拖拽排序（Web）/ 键盘移动排序（TUI）
- 数据持久化（刷新不丢失）
- 响应式设计，动画效果

## 项目结构

```
Todo/
├── .github/workflows/
│   └── deploy.yml             # GitHub Pages 自动部署
├── src/
│   ├── App.vue                # 主应用组件（全部逻辑 + 样式）
│   ├── main.js                # Vue 入口
│   └── storage/               # 可插拔存储层
│       ├── storage.js         # Storage 接口
│       ├── localStorageAdapter.js   # 浏览器 localStorage 实现
│       └── index.js           # 适配器导出
├── tui/
│   ├── index.jsx              # TUI 入口
│   ├── App.jsx                # TUI 主组件
│   └── jsonFileAdapter.js     # Node.js JSON 文件实现
├── public/
│   └── favicon.ico
├── index.html
├── vite.config.js
├── eslint.config.js
├── package.json
├── CLAUDE.md
└── README.md
```

## 快速开始

```bash
# 安装依赖
npm install

# 启动 Web 开发服务器
npm run dev
```

访问 http://localhost:5173

### 启动 TUI

```bash
npm run tui
```

TUI 快捷键：

| 按键 | 操作 |
|------|------|
| `a` | 新增待办 |
| `e` | 编辑选中待办 |
| `space` | 切换完成状态 |
| `p` | 置顶/取消置顶 |
| `d` | 删除选中待办 |
| `↑` / `↓` | 上下导航 |
| `Shift + ↑` / `Shift + ↓` | 在同类（置顶/非置顶）中移动排序 |
| `q` / `Ctrl + C` | 退出 |

TUI 数据默认保存在项目根目录的 `todos.json`。当前 Web 端与 TUI 使用独立的持久化实现（localStorage vs JSON 文件），两者数据暂不互通。

## 可用命令

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动 Web 开发服务器 |
| `npm run build` | 生产构建 |
| `npm run preview` | 预览生产构建 |
| `npm run tui` | 启动终端界面 |
| `npm run lint` | 代码检查（oxlint + eslint） |
| `npm run format` | 代码格式化（prettier） |

## 部署

项目通过 GitHub Actions 自动部署到 GitHub Pages。push 到 `main` 分支后自动构建并发布。

在线访问：https://katrina55553.github.io/Todo-App/
