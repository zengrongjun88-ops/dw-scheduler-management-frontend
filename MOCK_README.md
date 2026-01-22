# Mock演示版本说明

## 概述

本项目提供了完整的Mock演示版本，无需后端服务即可体验所有功能。Mock系统基于axios拦截器实现，所有数据存储在浏览器localStorage中，支持完整的增删改查操作。

## 启动方式

### 1. 使用Mock模式启动

```bash
# 方式1: 使用环境配置文件
npm run dev -- --mode mock

# 方式2: 直接设置环境变量
VITE_ENABLE_MOCK=true npm run dev
```

### 2. 切换到真实API模式

```bash
# 使用生产配置
npm run dev

# 或修改 .env 文件
VITE_ENABLE_MOCK=false
```

## Mock功能特性

### 1. 完整的数据模拟

- **30个任务**: 包含SQL/Shell/Python三种类型
- **5个目录**: 树形结构，支持嵌套
- **10个数据源**: MySQL/Hive/ClickHouse/PostgreSQL/Oracle/Kafka/Redis
- **100个实例**: 覆盖SUCCESS/RUNNING/FAILED/WAITING/KILLED五种状态
- **5个服务器节点**: Master/Worker角色，实时监控数据
- **任务依赖关系**: 构建完整的DAG图

### 2. 网络延迟模拟

- 每个请求随机延迟300-800ms
- 模拟真实网络环境

### 3. 数据持久化

- 所有修改保存到localStorage
- 刷新页面数据不丢失
- 支持清空所有Mock数据

### 4. 错误模拟

- 连接测试有10%失败率
- 删除操作有合理的业务校验
- 循环依赖检测

## 功能清单

### 任务管理 (10个API)

✅ 获取任务列表 (分页、搜索、过滤)
✅ 获取任务详情
✅ 创建任务
✅ 更新任务
✅ 删除任务
✅ 启用/禁用任务
✅ 手动触发任务
✅ 获取任务依赖
✅ 添加任务依赖
✅ 删除任务依赖
✅ 获取任务DAG图

### 数据源管理 (6个API)

✅ 获取数据源列表 (分页、搜索、过滤)
✅ 获取数据源详情
✅ 创建数据源
✅ 更新数据源
✅ 删除数据源
✅ 测试数据源连接

### 实例管理 (6个API)

✅ 获取实例列表 (分页、搜索、过滤)
✅ 获取实例详情
✅ 查看实例日志
✅ 终止实例
✅ 重试实例
✅ 获取实例统计

### 服务器管理 (4个API)

✅ 获取服务器列表 (分页、过滤)
✅ 获取服务器详情
✅ 获取服务器监控数据
✅ 获取服务器统计

### 目录管理 (5个API)

✅ 获取目录树
✅ 获取目录列表
✅ 创建目录
✅ 更新目录
✅ 删除目录

## Mock数据示例

### 任务数据

```typescript
{
  id: 1,
  taskName: 'ods_user_behavior_log',
  taskType: 'SQL',
  taskCode: `
    INSERT OVERWRITE TABLE ods.user_behavior_log 
    PARTITION(dt='\${yyyyMMdd-1}')
    SELECT * FROM mysql_source.user_behavior
    WHERE DATE(event_time) = '\${yyyyMMdd-1}'
  `,
  directoryId: 2,
  status: 'ENABLED',
  owner: 'zhangsan@company.com',
  cronExpr: '0 0 2 * * ?',
  timeout: 3600,
  retryTimes: 3,
  description: '用户行为日志数据采集',
  createTime: '2024-01-10 10:00:00',
  updateTime: '2024-01-15 14:30:00'
}
```

### 实例数据

```typescript
{
  id: 1,
  taskId: 1,
  taskName: 'ods_user_behavior_log',
  status: 'SUCCESS',
  startTime: '2024-01-22 02:00:00',
  endTime: '2024-01-22 02:15:30',
  duration: 930,
  retryTimes: 0,
  executorHost: 'worker-1.company.com',
  logPath: '/logs/task_1/instance_1.log',
  errorMsg: null
}
```

### 监控数据

```typescript
{
  timestamp: '2024-01-22 10:00:00',
  cpuUsage: 68.5,
  memoryUsage: 75.2,
  diskUsage: 45.8,
  networkIn: 850,
  networkOut: 620,
  taskCount: 12
}
```

## 特殊功能说明

### 1. 实时日志模拟

查看实例日志时，会根据任务类型和状态生成相应的日志内容：
- SQL任务：显示Hive查询执行过程
- Shell任务：显示脚本执行输出
- Python任务：显示模块加载和执行过程
- 失败任务：显示错误堆栈信息

### 2. DAG图生成

获取任务DAG图时，会自动遍历上下游依赖关系，最多遍历5层，生成nodes和edges数据供前端渲染。

### 3. 监控数据生成

服务器监控数据按5分钟间隔生成，模拟周期性波动：
- 工作时间(9:00-18:00)：高负载
- 非工作时间：低负载
- 添加随机抖动模拟真实场景

### 4. 数据存储

所有修改都会保存到localStorage，key格式为 `mock_scheduler_*`：
- `mock_scheduler_tasks`: 任务列表
- `mock_scheduler_datasources`: 数据源列表
- `mock_scheduler_dependencies`: 依赖关系
- `mock_scheduler_directories`: 目录列表

清空Mock数据：
```javascript
// 在浏览器控制台执行
Object.keys(localStorage)
  .filter(key => key.startsWith('mock_scheduler_'))
  .forEach(key => localStorage.removeItem(key));
```

## 已知限制

1. **数据仅在浏览器本地**
   - 不同浏览器/设备数据不同步
   - 清除浏览器数据会丢失所有修改

2. **实时功能简化**
   - RUNNING状态的实例不会自动变化
   - 监控数据不会实时更新(需刷新)

3. **文件上传功能**
   - 不支持实际文件上传
   - 可以模拟上传成功的响应

4. **大数据量性能**
   - 建议Mock数据总量不超过1000条
   - 过多数据可能影响浏览器性能

## 技术实现

### 架构设计

```
src/
├── mocks/
│   ├── data/           # Mock数据
│   │   ├── tasks.ts
│   │   ├── datasources.ts
│   │   ├── instances.ts
│   │   ├── servers.ts
│   │   ├── directories.ts
│   │   ├── dependencies.ts
│   │   ├── logs.ts
│   │   └── monitor.ts
│   ├── handlers/       # Mock处理器
│   │   ├── task.ts
│   │   ├── datasource.ts
│   │   ├── instance.ts
│   │   ├── server.ts
│   │   └── directory.ts
│   └── utils/          # 工具函数
│       ├── pagination.ts
│       ├── filter.ts
│       ├── storage.ts
│       └── generator.ts
├── api/
│   ├── mockAdapter.ts  # Mock适配器
│   └── request.ts      # Axios配置
```

### 核心原理

1. **请求拦截**: 在axios请求拦截器中判断是否启用Mock模式
2. **路由匹配**: 根据URL和method匹配对应的handler
3. **数据处理**: handler处理业务逻辑，返回mock数据
4. **响应封装**: 封装成标准的ApiResponse格式
5. **延迟模拟**: 使用setTimeout模拟网络延迟

## 开发指南

### 添加新的Mock API

1. 在 `src/mocks/data/` 中定义数据结构
2. 在 `src/mocks/handlers/` 中实现业务逻辑
3. 在 `src/api/mockAdapter.ts` 中添加路由匹配

示例：
```typescript
// 1. 定义数据 (data/users.ts)
export interface MockUser {
  id: number;
  name: string;
  email: string;
}

export const mockUsers: MockUser[] = [
  { id: 1, name: 'Alice', email: 'alice@example.com' },
];

// 2. 实现handler (handlers/user.ts)
export function getUserList() {
  return mockUsers;
}

// 3. 添加路由 (mockAdapter.ts)
if (url.includes('/user/list')) {
  return success(userHandlers.getUserList());
}
```

## 故障排查

### Mock模式未生效

检查环境变量：
```bash
# 确认VITE_ENABLE_MOCK为true
echo $VITE_ENABLE_MOCK

# 查看控制台是否有"[Mock] Mock mode enabled"日志
```

### 数据修改不生效

1. 检查localStorage是否被禁用
2. 检查浏览器控制台错误
3. 清空localStorage后重试

### 页面报错

1. 检查API路径是否正确
2. 检查handler是否实现
3. 查看浏览器控制台完整错误信息

## 联系方式

如有问题或建议，请联系开发团队。

---

**版本**: 1.0.0
**更新时间**: 2024-01-22
