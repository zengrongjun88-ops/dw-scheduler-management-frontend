/**
 * 任务API Mock Handler
 */

import { mockTasks, MockTask } from '../data/tasks';
import { mockDependencies } from '../data/dependencies';
import { paginate } from '../utils/pagination';
import { searchInFields, filterByConditions } from '../utils/filter';
import { generateId, generateTime } from '../utils/generator';
import { saveToStorage, loadFromStorage } from '../utils/storage';

// 从storage加载或使用默认数据
let tasks = loadFromStorage<MockTask[]>('tasks', [...mockTasks]);
let dependencies = loadFromStorage('dependencies', [...mockDependencies]);

/**
 * 获取任务列表
 */
export function getTaskList(params: {
  pageNum?: number;
  pageSize?: number;
  taskName?: string;
  taskType?: string;
  status?: string;
  directoryId?: number;
}) {
  let filtered = [...tasks];
  
  // 搜索过滤
  if (params.taskName) {
    filtered = filtered.filter(task => 
      searchInFields(task, ['taskName', 'description'], params.taskName!)
    );
  }
  
  // 条件过滤
  const conditions: any = {};
  if (params.taskType) conditions.taskType = params.taskType;
  if (params.status) conditions.status = params.status;
  if (params.directoryId) conditions.directoryId = params.directoryId;
  
  filtered = filterByConditions(filtered, conditions);
  
  // 分页
  return paginate(filtered, params.pageNum || 1, params.pageSize || 10);
}

/**
 * 获取任务详情
 */
export function getTaskDetail(taskId: number) {
  const task = tasks.find(t => t.id === taskId);
  if (!task) {
    throw new Error('任务不存在');
  }
  return task;
}

/**
 * 创建任务
 */
export function createTask(data: Omit<MockTask, 'id' | 'createTime' | 'updateTime'>) {
  const newTask: MockTask = {
    ...data,
    id: generateId(),
    createTime: generateTime(),
    updateTime: generateTime(),
  };
  
  tasks.push(newTask);
  saveToStorage('tasks', tasks);
  
  return newTask;
}

/**
 * 更新任务
 */
export function updateTask(taskId: number, data: Partial<MockTask>) {
  const index = tasks.findIndex(t => t.id === taskId);
  if (index === -1) {
    throw new Error('任务不存在');
  }
  
  tasks[index] = {
    ...tasks[index],
    ...data,
    updateTime: generateTime(),
  };
  
  saveToStorage('tasks', tasks);
  return tasks[index];
}

/**
 * 删除任务
 */
export function deleteTask(taskId: number) {
  const index = tasks.findIndex(t => t.id === taskId);
  if (index === -1) {
    throw new Error('任务不存在');
  }
  
  tasks.splice(index, 1);
  
  // 同时删除相关依赖
  dependencies = dependencies.filter(
    dep => dep.taskId !== taskId && dep.dependTaskId !== taskId
  );
  
  saveToStorage('tasks', tasks);
  saveToStorage('dependencies', dependencies);
  
  return { success: true };
}

/**
 * 启用/禁用任务
 */
export function toggleTaskStatus(taskId: number) {
  const index = tasks.findIndex(t => t.id === taskId);
  if (index === -1) {
    throw new Error('任务不存在');
  }
  
  const newStatus = tasks[index].status === 'ENABLED' ? 'DISABLED' : 'ENABLED';
  tasks[index] = {
    ...tasks[index],
    status: newStatus,
    updateTime: generateTime(),
  };
  
  saveToStorage('tasks', tasks);
  return tasks[index];
}

/**
 * 手动触发任务
 */
export function triggerTask(taskId: number) {
  const task = tasks.find(t => t.id === taskId);
  if (!task) {
    throw new Error('任务不存在');
  }
  
  return {
    success: true,
    instanceId: generateId(),
    message: '任务已提交执行',
  };
}

/**
 * 获取任务依赖
 */
export function getTaskDependencies(taskId: number) {
  const upstream = dependencies
    .filter(dep => dep.taskId === taskId)
    .map(dep => dep.dependTaskId);
  
  const downstream = dependencies
    .filter(dep => dep.dependTaskId === taskId)
    .map(dep => dep.taskId);
  
  return {
    upstream,
    downstream,
  };
}

/**
 * 添加任务依赖
 */
export function addTaskDependency(taskId: number, dependTaskId: number) {
  // 检查是否已存在
  const exists = dependencies.some(
    dep => dep.taskId === taskId && dep.dependTaskId === dependTaskId
  );
  
  if (exists) {
    throw new Error('依赖关系已存在');
  }
  
  // 检查循环依赖
  if (hasCircularDependency(taskId, dependTaskId)) {
    throw new Error('不能添加循环依赖');
  }
  
  const newDep = {
    id: generateId(),
    taskId,
    dependTaskId,
    createTime: generateTime(),
  };
  
  dependencies.push(newDep);
  saveToStorage('dependencies', dependencies);
  
  return newDep;
}

/**
 * 删除任务依赖
 */
export function removeTaskDependency(taskId: number, dependTaskId: number) {
  const index = dependencies.findIndex(
    dep => dep.taskId === taskId && dep.dependTaskId === dependTaskId
  );
  
  if (index === -1) {
    throw new Error('依赖关系不存在');
  }
  
  dependencies.splice(index, 1);
  saveToStorage('dependencies', dependencies);
  
  return { success: true };
}

/**
 * 检查循环依赖
 */
function hasCircularDependency(taskId: number, dependTaskId: number): boolean {
  const visited = new Set<number>();
  
  function dfs(currentId: number): boolean {
    if (currentId === taskId) return true;
    if (visited.has(currentId)) return false;
    
    visited.add(currentId);
    
    const deps = dependencies
      .filter(dep => dep.taskId === currentId)
      .map(dep => dep.dependTaskId);
    
    return deps.some(depId => dfs(depId));
  }
  
  return dfs(dependTaskId);
}

/**
 * 获取任务DAG图数据
 */
export function getTaskDAG(taskId: number) {
  const visited = new Set<number>();
  const nodes: any[] = [];
  const edges: any[] = [];
  
  function traverse(id: number, depth: number = 0) {
    if (visited.has(id) || depth > 5) return;
    
    visited.add(id);
    const task = tasks.find(t => t.id === id);
    if (task) {
      nodes.push({
        id: task.id.toString(),
        label: task.taskName,
        data: task,
      });
    }
    
    // 获取上游
    const upstreams = dependencies
      .filter(dep => dep.taskId === id)
      .map(dep => dep.dependTaskId);
    
    upstreams.forEach(upId => {
      edges.push({
        source: upId.toString(),
        target: id.toString(),
      });
      traverse(upId, depth + 1);
    });
    
    // 获取下游
    const downstreams = dependencies
      .filter(dep => dep.dependTaskId === id)
      .map(dep => dep.taskId);
    
    downstreams.forEach(downId => {
      edges.push({
        source: id.toString(),
        target: downId.toString(),
      });
      traverse(downId, depth + 1);
    });
  }
  
  traverse(taskId);
  
  return { nodes, edges };
}
