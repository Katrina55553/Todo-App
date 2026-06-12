# Todo-App

纯前端 Vue 3 Todo 应用，使用 localStorage 持久化存储，无需后端服务。

## 技术栈

- **Vue 3** — Composition API + `<script setup>`
- **Vite** — 构建工具
- **CSS3** — 渐变背景、毛玻璃效果、动画
- **localStorage** — 数据持久化

## 功能

- 增删改查待办事项
- 勾选标记完成状态
- 内联编辑已有待办
- 置顶/取消置顶
- 拖拽排序
- 数据持久化（刷新不丢失）
- 响应式设计，动画效果

## 项目结构

```
Todo/
├── src/
│   ├── App.vue          # 主应用组件（全部逻辑 + 样式）
│   └── main.js          # Vue 入口
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

# 启动开发服务器
npm run dev
```

访问 http://localhost:5173

## 可用命令

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动开发服务器 |
| `npm run build` | 生产构建 |
| `npm run preview` | 预览生产构建 |
| `npm run lint` | 代码检查（oxlint + eslint） |
| `npm run format` | 代码格式化（prettier） |

## Docker 部署

```bash
# 构建镜像
docker build -t todo-app .

# 运行容器
docker run -d -p 8080:80 --name todo todo-app
```

访问 http://localhost:8080

