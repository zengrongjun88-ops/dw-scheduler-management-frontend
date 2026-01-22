# 调度管理系统前端项目

## 项目简介

基于 React 18 + TypeScript + Vite 5 + Ant Design 5 开发的现代化调度管理系统前端应用。

## 技术栈

- **框架**: React 18.2.0 (稳定版本)
- **语言**: TypeScript 5.3+
- **构建工具**: Vite 5.0
- **UI组件库**: Ant Design 5.12
- **路由**: React Router v6
- **HTTP客户端**: Axios
- **状态管理**: Redux Toolkit + React Query
- **代码编辑器**: Monaco Editor
- **图表库**: ECharts 5.4
- **DAG可视化**: AntV G6 4.8

## 功能模块

### 1. 任务管理
- ✅ 任务目录树形结构管理
- ✅ 任务列表（分页、搜索、排序）
- ✅ 任务创建/编辑（表单验证）
- ✅ 代码编辑器（SQL/Shell语法高亮）
- ✅ 任务依赖管理
- ✅ DAG依赖图可视化
- ✅ 任务状态切换

### 2. 数据源管理
- ✅ 数据源列表
- ✅ 数据源CRUD操作
- ✅ 数据源连接测试
- ✅ 支持多种数据源类型

### 3. 实例管理
- ✅ 实例列表（搜索、筛选）
- ✅ 实例详情查看
- ✅ 实例日志查看（实时滚动）
- ✅ 实例DAG图展示
- ✅ 实例操作（重跑、取消）

### 4. 服务器管理
- ✅ 服务器列表
- ✅ 服务器详情
- ✅ 资源监控（CPU、内存、磁盘）
- ✅ 运行任务列表

## 项目结构

```
frontend/
├── public/                     # 静态资源
├── src/
│   ├── api/                   # API接口封装
│   │   ├── request.ts         # Axios封装
│   │   ├── task.ts           # 任务API
│   │   ├── directory.ts      # 目录API
│   │   ├── datasource.ts     # 数据源API
│   │   ├── instance.ts       # 实例API
│   │   └── server.ts         # 服务器API
│   ├── components/            # 通用组件
│   │   ├── CodeEditor/       # 代码编辑器
│   │   ├── DagGraph/         # DAG图组件
│   │   └── LogViewer/        # 日志查看器
│   ├── pages/                 # 页面组件
│   │   ├── Layout/           # 主布局
│   │   ├── Task/             # 任务管理
│   │   ├── Datasource/       # 数据源管理
│   │   ├── Instance/         # 实例管理
│   │   └── Server/           # 服务器管理
│   ├── types/                 # 类型定义
│   ├── App.tsx               # 根组件
│   └── main.tsx              # 入口文件
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

访问: http://localhost:5173

### 3. 构建生产版本

```bash
npm run build
```

### 4. 预览生产构建

```bash
npm run preview
```

## 环境配置

### 开发环境 (.env.development)
```
VITE_API_BASE_URL=http://localhost:8080/api
VITE_APP_TITLE=调度管理系统
```

### 生产环境 (.env.production)
```
VITE_API_BASE_URL=/api
VITE_APP_TITLE=调度管理系统
```

## API配置

后端API基础地址: `http://localhost:8080/api`

### 已对接的API接口

#### 任务管理 (10个)
- GET /api/v1/tasks - 查询任务列表
- GET /api/v1/tasks/{id} - 查询任务详情
- POST /api/v1/tasks - 创建任务
- PUT /api/v1/tasks/{id} - 更新任务
- DELETE /api/v1/tasks/{id} - 删除任务
- PUT /api/v1/tasks/{id}/status - 修改任务状态
- GET /api/v1/tasks/{id}/dependencies - 查询任务依赖
- POST /api/v1/tasks/{id}/dependencies - 添加任务依赖
- DELETE /api/v1/tasks/{id}/dependencies/{depId} - 删除依赖
- GET /api/v1/tasks/{id}/dag - 查询任务DAG图

#### 数据源管理 (6个)
- GET /api/v1/datasources - 查询数据源列表
- GET /api/v1/datasources/{id} - 查询数据源详情
- POST /api/v1/datasources - 创建数据源
- PUT /api/v1/datasources/{id} - 更新数据源
- DELETE /api/v1/datasources/{id} - 删除数据源
- POST /api/v1/datasources/{id}/test - 测试数据源连接

#### 实例管理 (6个)
- GET /api/v1/instances - 查询实例列表
- GET /api/v1/instances/{id} - 查询实例详情
- GET /api/v1/instances/{id}/logs - 查询实例日志
- GET /api/v1/instances/{id}/dag - 查询实例DAG图
- POST /api/v1/instances/{id}/rerun - 重跑实例
- POST /api/v1/instances/{id}/cancel - 取消实例

#### 服务器管理 (6个)
- GET /api/v1/servers - 查询服务器列表
- GET /api/v1/servers/{id} - 查询服务器详情
- POST /api/v1/servers - 注册服务器
- PUT /api/v1/servers/{id} - 更新服务器信息
- DELETE /api/v1/servers/{id} - 删除服务器
- GET /api/v1/servers/{id}/monitor - 查询服务器监控数据

#### 目录管理 (5个)
- GET /api/v1/directories/tree - 获取目录树
- GET /api/v1/directories/{id} - 获取目录详情
- POST /api/v1/directories - 创建目录
- PUT /api/v1/directories/{id} - 更新目录
- DELETE /api/v1/directories/{id} - 删除目录

## 核心特性

### 1. 统一的请求封装
- 请求/响应拦截器
- 统一错误处理
- 统一Loading提示
- Token自动携带

### 2. 完整的类型定义
- 所有API请求/响应都有TypeScript类型
- 组件Props完整类型定义
- 避免类型错误

### 3. 通用组件封装
- CodeEditor: Monaco编辑器封装，支持SQL/Shell/Python语法高亮
- DagGraph: G6图可视化组件，支持缩放、拖拽、搜索
- LogViewer: 日志查看器，支持关键字高亮、自动滚动

### 4. 路由配置
- 基于React Router v6
- 懒加载优化
- 嵌套路由

## 开发规范

### 命名规范
- 组件文件: PascalCase (TaskList.tsx)
- 普通文件: camelCase (request.ts)
- 样式文件: kebab-case (task-list.module.css)

### 代码规范
- 使用ESLint + Prettier
- 严格的TypeScript检查
- 组件必须有类型定义

### Git提交规范
- feat: 新功能
- fix: 修复bug
- docs: 文档更新
- style: 代码格式
- refactor: 重构
- test: 测试
- chore: 构建/工具

## 浏览器兼容性

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 常见问题

### Q1: 启动后无法访问后端API？
A: 检查后端服务是否启动在 http://localhost:8080，检查Vite proxy配置。

### Q2: 安装依赖报错？
A: 尝试清除缓存: `rm -rf node_modules package-lock.json && npm install`

### Q3: 构建后页面空白？
A: 检查路由配置的basename，检查静态资源路径。

## 许可证

MIT

## 相关文档

- [需求文档](../dw-scheduler-management-system/claude/REQUIREMENT.md)
- [后端API文档](http://localhost:8080/api/doc.html)
- [前端实现计划](../dw-scheduler-management-system/claude/FRONTEND_IMPLEMENTATION_PLAN.md)
