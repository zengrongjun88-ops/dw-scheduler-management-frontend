/**
 * 实例API Mock Handler
 */

import { mockInstances, MockInstance } from '../data/instances';
import { mockTasks } from '../data/tasks';
import { generateTaskLog } from '../data/logs';
import { paginate } from '../utils/pagination';
import { searchInFields } from '../utils/filter';

export function getInstanceList(params: {
  pageNum?: number;
  pageSize?: number;
  taskName?: string;
  status?: string;
  startTime?: string;
  endTime?: string;
}) {
  let filtered = [...mockInstances];
  
  if (params.taskName) {
    filtered = filtered.filter(inst => 
      searchInFields(inst, ['taskName'], params.taskName!)
    );
  }
  
  if (params.status) {
    filtered = filtered.filter(inst => inst.status === params.status);
  }
  
  if (params.startTime) {
    filtered = filtered.filter(inst => inst.startTime >= params.startTime!);
  }
  
  if (params.endTime) {
    filtered = filtered.filter(inst => 
      inst.startTime <= params.endTime!
    );
  }
  
  // 关联任务名称
  filtered = filtered.map(inst => {
    const task = mockTasks.find(t => t.id === inst.taskId);
    return {
      ...inst,
      taskName: task?.taskName || inst.taskName,
    };
  });
  
  return paginate(filtered, params.pageNum || 1, params.pageSize || 10);
}

export function getInstanceDetail(instanceId: number) {
  const instance = mockInstances.find(inst => inst.id === instanceId);
  if (!instance) {
    throw new Error('实例不存在');
  }
  
  const task = mockTasks.find(t => t.id === instance.taskId);
  
  return {
    ...instance,
    taskName: task?.taskName || instance.taskName,
    taskType: task?.taskType || 'SQL',
  };
}

export function getInstanceLog(instanceId: number) {
  const instance = mockInstances.find(inst => inst.id === instanceId);
  if (!instance) {
    throw new Error('实例不存在');
  }
  
  const task = mockTasks.find(t => t.id === instance.taskId);
  const taskType = task?.taskType || 'SQL';
  const status = instance.status === 'FAILED' ? 'FAILED' : 'SUCCESS';
  const duration = instance.duration || 300;
  
  const logs = generateTaskLog(
    instance.id,
    instance.taskId,
    taskType,
    status,
    duration
  );
  
  return {
    content: logs.join('\n'),
    lines: logs,
  };
}

export function killInstance(instanceId: number) {
  const instance = mockInstances.find(inst => inst.id === instanceId);
  if (!instance) {
    throw new Error('实例不存在');
  }
  
  if (instance.status !== 'RUNNING' && instance.status !== 'WAITING') {
    throw new Error('只能终止运行中或等待中的实例');
  }
  
  instance.status = 'KILLED';
  instance.endTime = new Date().toISOString();
  
  return { success: true, message: '实例已终止' };
}

export function retryInstance(instanceId: number) {
  const instance = mockInstances.find(inst => inst.id === instanceId);
  if (!instance) {
    throw new Error('实例不存在');
  }
  
  if (instance.status !== 'FAILED') {
    throw new Error('只能重试失败的实例');
  }
  
  return {
    success: true,
    newInstanceId: Math.max(...mockInstances.map(i => i.id)) + 1,
    message: '实例已重新提交',
  };
}

export function getInstanceStatistics(params: { startTime?: string; endTime?: string }) {
  let filtered = [...mockInstances];
  
  if (params.startTime) {
    filtered = filtered.filter(inst => inst.startTime >= params.startTime!);
  }
  
  if (params.endTime) {
    filtered = filtered.filter(inst => inst.startTime <= params.endTime!);
  }
  
  const total = filtered.length;
  const success = filtered.filter(i => i.status === 'SUCCESS').length;
  const failed = filtered.filter(i => i.status === 'FAILED').length;
  const running = filtered.filter(i => i.status === 'RUNNING').length;
  
  return {
    total,
    success,
    failed,
    running,
    successRate: total > 0 ? (success / total * 100).toFixed(2) : '0',
  };
}
