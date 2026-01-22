# 快速启动指南

## 前置要求

- Node.js 16+ 
- npm / yarn / pnpm

## 快速开始

### 1. 安装依赖

```bash
cd /Users/zengrongjun/claudespace/frontend
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

浏览器访问: http://localhost:3000

### 3. 构建生产版本

```bash
npm run build
```

## 主要依赖说明

### 核心依赖
- `react`: ^18.2.0 - React 核心库
- `react-dom`: ^18.2.0 - React DOM 渲染
- `react-router-dom`: ^6.20.0 - 路由管理
- `antd`: ^5.12.0 - UI 组件库
- `axios`: ^1.6.2 - HTTP 客户端
- `monaco-editor`: ^0.45.0 - 代码编辑器
- `@antv/g6`: ^4.8.20 - 图可视化

### 开发依赖
- `typescript`: ^5.3.3 - TypeScript 编译器
- `vite`: ^5.0.8 - 构建工具
- `@vitejs/plugin-react`: ^4.2.1 - React 插件

## 项目特性

✅ React 18 + TypeScript
✅ Vite 5 快速构建
✅ Ant Design 5 UI
✅ React Router v6 路由
✅ Axios 请求封装
✅ Monaco 代码编辑器
✅ G6 图可视化
✅ 完整的类型定义
✅ 路径别名配置(@/)

## API 配置

后端 API 地址: `http://localhost:8080/api`

如需修改,请编辑:
- `src/api/request.ts` - BASE_URL
- `vite.config.ts` - proxy 配置

## 目录说明

```
src/
├── api/          # API 接口封装
├── types/        # TypeScript 类型定义
├── components/   # 通用组件
├── pages/        # 页面组件
├── App.tsx       # 根组件
└── main.tsx      # 入口文件
```

## 开发规范

1. 组件使用 TypeScript + 函数组件
2. API 调用统一通过封装的模块
3. 类型定义放在 types/ 目录
4. 公共组件放在 components/ 目录
5. 页面组件放在 pages/ 目录

## 常见问题

### Q: 端口被占用?
A: 修改 vite.config.ts 中的 port 配置

### Q: API 请求失败?
A: 检查后端服务是否启动,确认 API 地址配置正确

### Q: Monaco Editor 不显示?
A: 检查 worker 配置,确保相关资源加载正常

### Q: 类型错误?
A: 运行 `npm run build` 检查 TypeScript 类型错误

## 推荐 VS Code 插件

- ESLint
- Prettier
- TypeScript Vue Plugin (Volar)
- Path Intellisense

## 技术支持

如有问题,请查看:
- PROJECT_STRUCTURE.md - 详细的项目结构说明
- 各个模块的代码注释
