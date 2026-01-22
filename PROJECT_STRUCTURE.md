# 前端项目结构说明

## 项目概述
这是一个基于 React 18 + TypeScript + Vite + Ant Design 5 的任务调度系统前端项目。

## 目录结构

```
frontend/
├── index.html                      # 入口 HTML 文件
├── package.json                    # 项目依赖配置
├── tsconfig.json                   # TypeScript 配置
├── tsconfig.node.json              # Node.js TypeScript 配置
├── vite.config.ts                  # Vite 配置文件
├── .gitignore                      # Git 忽略文件配置
│
├── src/
│   ├── main.tsx                    # 应用入口文件
│   ├── App.tsx                     # 根组件(路由配置)
│   ├── App.css                     # 全局样式
│   │
│   ├── api/                        # API 接口封装
│   │   ├── request.ts              # Axios 封装(请求/响应拦截器)
│   │   ├── task.ts                 # 任务 API
│   │   ├── directory.ts            # 目录 API
│   │   ├── datasource.ts           # 数据源 API
│   │   ├── instance.ts             # 实例 API
│   │   └── server.ts               # 服务器 API
│   │
│   ├── types/                      # TypeScript 类型定义
│   │   ├── common.ts               # 通用类型
│   │   ├── task.ts                 # 任务相关类型
│   │   ├── datasource.ts           # 数据源类型
│   │   ├── instance.ts             # 实例类型
│   │   └── server.ts               # 服务器类型
│   │
│   ├── components/                 # 通用组件
│   │   ├── CodeEditor/             # Monaco 代码编辑器组件
│   │   │   └── index.tsx
│   │   ├── DagGraph/               # G6 DAG 图组件
│   │   │   └── index.tsx
│   │   └── LogViewer/              # 日志查看器组件
│   │       └── index.tsx
│   │
│   └── pages/                      # 页面组件
│       ├── Layout/                 # 主布局
│       │   └── index.tsx
│       ├── Task/                   # 任务管理
│       │   ├── List.tsx            # 任务列表
│       │   ├── Form.tsx            # 任务表单
│       │   └── Detail.tsx          # 任务详情
│       ├── Datasource/             # 数据源管理
│       │   ├── List.tsx            # 数据源列表
│       │   └── Form.tsx            # 数据源表单
│       ├── Instance/               # 实例监控
│       │   ├── List.tsx            # 实例列表
│       │   └── Detail.tsx          # 实例详情
│       └── Server/                 # 服务器管理
│           ├── List.tsx            # 服务器列表
│           └── Detail.tsx          # 服务器详情
```

## 技术栈

- **React 18**: 使用最新的 React 特性
- **TypeScript**: 类型安全的 JavaScript 超集
- **Vite**: 快速的前端构建工具
- **Ant Design 5**: 企业级 UI 组件库
- **React Router v6**: 路由管理
- **Axios**: HTTP 客户端
- **Monaco Editor**: 代码编辑器(VS Code 同款)
- **AntV G6**: 图可视化引擎(用于 DAG 图)

## 主要功能

### 1. 任务管理
- 任务列表查看(支持搜索、分页)
- 任务创建/编辑(支持 SQL/Shell/Python/Spark/Flink)
- 任务详情查看
- 任务执行
- 任务启用/禁用
- 任务依赖关系可视化(DAG 图)

### 2. 实例监控
- 实例列表查看(支持状态筛选)
- 实例详情查看
- 实时日志查看
- 实例终止/重试

### 3. 数据源管理
- 数据源列表查看
- 数据源创建/编辑
- 连接测试
- 支持多种数据库类型(MySQL/PostgreSQL/Oracle 等)

### 4. 服务器管理
- 服务器列表查看
- 服务器创建/编辑
- 连接测试
- 资源使用情况监控

## API 配置

默认 API 基础 URL: `http://localhost:8080/api`

可以通过 vite.config.ts 中的 proxy 配置修改:

```typescript
server: {
  port: 3000,
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true,
    },
  },
}
```

## 安装和运行

### 1. 安装依赖
```bash
npm install
# 或
yarn install
# 或
pnpm install
```

### 2. 启动开发服务器
```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
```

访问 http://localhost:3000

### 3. 构建生产版本
```bash
npm run build
# 或
yarn build
# 或
pnpm build
```

### 4. 预览生产版本
```bash
npm run preview
# 或
yarn preview
# 或
pnpm preview
```

## 代码规范

### 文件命名
- 组件文件: PascalCase (如: `TaskList.tsx`)
- 工具文件: camelCase (如: `request.ts`)
- 类型文件: camelCase (如: `task.ts`)

### 组件规范
- 使用函数组件 + Hooks
- 使用 TypeScript 进行类型定义
- 组件导出使用 `export default`
- Props 接口使用 `ComponentNameProps` 命名

### API 调用规范
- 所有 API 调用都通过封装的 API 模块
- 错误处理在 Axios 拦截器中统一处理
- 使用 async/await 语法

### 样式规范
- 优先使用 Ant Design 组件的内置样式
- 全局样式放在 `App.css`
- 组件特定样式使用内联样式或 CSS Modules

## 路由配置

```
/ - 重定向到 /tasks
/tasks - 任务列表
/tasks/new - 新建任务
/tasks/:id - 任务详情
/tasks/:id/edit - 编辑任务
/instances - 实例列表
/instances/:id - 实例详情
/datasources - 数据源列表
/datasources/new - 新建数据源
/datasources/:id/edit - 编辑数据源
/servers - 服务器列表
/servers/:id - 服务器详情
```

## 开发建议

1. **组件复用**: 充分利用 Ant Design 组件库,避免重复造轮子
2. **类型安全**: 确保所有 API 返回值和组件 Props 都有类型定义
3. **错误处理**: 在关键操作处添加 try-catch 和用户友好的错误提示
4. **性能优化**: 使用 React.memo、useMemo、useCallback 优化性能
5. **代码注释**: 为复杂逻辑添加清晰的注释

## 待实现功能

- [ ] 数据源表单详细实现
- [ ] 服务器详情页面实现
- [ ] 用户认证和权限管理
- [ ] 任务执行历史统计图表
- [ ] 实时监控大屏
- [ ] 国际化支持
- [ ] 主题切换(暗黑模式)

## 注意事项

1. Monaco Editor 需要配置 worker,确保编辑器正常工作
2. G6 图表在使用时需要注意容器尺寸
3. 日志查看器支持自动刷新,注意控制刷新频率避免性能问题
4. 所有时间显示使用后端返回的格式,保持一致性
