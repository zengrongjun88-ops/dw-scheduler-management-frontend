# Mock演示版本补充说明

## 快速开始

### 启动Mock演示版（无需后端）

```bash
# 1. 安装依赖
npm install

# 2. 启动Mock模式
npm run dev:mock

# 3. 访问
浏览器打开: http://localhost:5173
```

启动后会看到控制台输出：
```
[Mock] Mock mode enabled
```

### 启动完整版（需要后端API）

```bash
npm run dev
```

## Mock功能说明

Mock演示版提供了以下功能：

### 1. 完整数据
- 30个预置任务（SQL/Shell/Python类型）
- 10个数据源（MySQL/Hive/ClickHouse等）
- 100个实例记录（各种状态）
- 5个服务器节点（监控数据）
- 5个目录（树形结构）
- 完整的依赖关系（DAG图）

### 2. 完整功能
- ✅ 任务管理：创建、编辑、删除、触发
- ✅ 依赖管理：添加、删除、查看DAG
- ✅ 实例管理：查看、日志、终止、重试
- ✅ 数据源管理：CRUD、连接测试
- ✅ 服务器监控：实时监控图表
- ✅ 目录管理：树形结构

### 3. 数据持久化
- 所有修改保存到浏览器localStorage
- 刷新页面数据不丢失
- 支持重置恢复初始数据

## 详细文档

- [快速启动指南](./MOCK_QUICKSTART.md) - 5分钟快速上手
- [完整说明文档](./MOCK_README.md) - 详细功能和技术说明
- [实现总结](./MOCK_IMPLEMENTATION.md) - 技术实现细节

## 目录结构

```
src/
├── mocks/                    # Mock系统
│   ├── data/                 # Mock数据（8个文件）
│   ├── handlers/             # API处理器（5个文件）
│   ├── utils/                # 工具函数（4个文件）
│   ├── index.ts              # 模块入口
│   └── test.ts               # 功能测试
├── api/
│   ├── mockAdapter.ts        # Mock适配器
│   └── request.ts            # Axios配置
```

## 使用场景

Mock演示版适用于：
- 前端独立开发（后端API未就绪）
- 产品功能演示（销售/客户演示）
- 用户体验测试（UI/UX测试）
- 功能验收演示（项目验收）
- 离线环境演示（无网络环境）

## 环境切换

### Mock模式 → 真实API
修改 `.env.mock` 文件：
```bash
VITE_ENABLE_MOCK=false
VITE_API_BASE_URL=http://your-backend-api.com/api
```

或直接使用：
```bash
npm run dev  # 使用真实API
```

### 真实API → Mock模式
```bash
npm run dev:mock  # 使用Mock
```

## 常见问题

### Q: Mock数据可以修改吗？
A: 可以！所有修改都会保存到localStorage，刷新不会丢失。

### Q: 如何重置Mock数据？
A: 在浏览器控制台执行：
```javascript
Object.keys(localStorage)
  .filter(key => key.startsWith('mock_scheduler_'))
  .forEach(key => localStorage.removeItem(key));
location.reload();
```

### Q: Mock模式下能上传文件吗？
A: 暂不支持实际文件上传，但会模拟上传成功响应。

## 技术支持

遇到问题请查看详细文档或提Issue。

---

**版本**: 1.0.0
**更新**: 2024-01-22
