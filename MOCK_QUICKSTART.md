# Mock版本快速启动指南

## 1. 安装依赖

```bash
npm install
```

## 2. 启动Mock演示版

```bash
npm run dev:mock
```

启动后访问: http://localhost:5173

## 3. 验证Mock模式

打开浏览器控制台，应该看到：

```
[Mock] Mock mode enabled
```

## 4. 测试功能

### 任务管理
- 访问"任务管理"页面
- 查看30个预置任务
- 尝试创建、编辑、删除任务
- 查看任务依赖关系和DAG图

### 数据源管理
- 访问"数据源管理"页面
- 查看10个预置数据源
- 测试数据源连接
- 创建新数据源

### 实例管理
- 访问"实例管理"页面
- 查看100个预置实例
- 查看实例日志
- 尝试终止/重试实例

### 服务器监控
- 访问"服务器管理"页面
- 查看5个服务器节点
- 查看实时监控图表

## 5. 数据持久化

所有修改会保存到浏览器localStorage中：
- 创建的任务会永久保存
- 编辑的数据会立即生效
- 删除操作会同步删除

## 6. 重置数据

如果想恢复初始Mock数据：

### 方法1: 控制台执行
```javascript
Object.keys(localStorage)
  .filter(key => key.startsWith('mock_scheduler_'))
  .forEach(key => localStorage.removeItem(key));
location.reload();
```

### 方法2: 清除浏览器数据
在浏览器中清除站点数据后刷新页面

## 7. 常见问题

### Q: Mock模式未生效？
A: 确认启动命令使用了 `npm run dev:mock`，并检查控制台日志

### Q: 数据修改不生效？
A: 检查浏览器是否禁用了localStorage，尝试使用无痕模式

### Q: 页面报错？
A: 查看控制台完整错误信息，可能是API路径不匹配

## 8. 切换到真实API

修改 `.env.mock` 文件：
```
VITE_ENABLE_MOCK=false
VITE_API_BASE_URL=http://your-backend-api.com/api
```

或直接使用：
```bash
npm run dev
```

## 9. 功能演示建议

### 完整流程演示
1. 创建目录"测试目录"
2. 在目录下创建SQL任务
3. 添加任务依赖关系
4. 查看DAG图
5. 手动触发任务
6. 查看实例执行情况
7. 查看实例日志

### 数据源演示
1. 创建MySQL数据源
2. 测试连接
3. 在任务中引用该数据源

### 监控演示
1. 查看服务器列表
2. 进入服务器详情
3. 查看24小时监控曲线

## 10. 技术支持

遇到问题请查看 `MOCK_README.md` 详细文档
