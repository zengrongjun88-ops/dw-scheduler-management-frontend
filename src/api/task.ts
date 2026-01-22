import request from './request';
import type { Task, TaskInstance, TaskExecuteParams } from '@/types/task';

// 分页参数
export interface PageParams {
  pageNum: number;
  pageSize: number;
}

// 分页响应
export interface PageResult<T> {
  list: T[];
  total: number;
  pageNum: number;
  pageSize: number;
}

/**
 * 任务 API
 */
export const taskApi = {
  // 获取任务列表
  getList(params: PageParams & { name?: string }): Promise<PageResult<Task>> {
    return request.get('/tasks', { params });
  },

  // 获取任务详情
  getDetail(id: number): Promise<Task> {
    return request.get(`/tasks/${id}`);
  },

  // 创建任务
  create(data: Partial<Task>): Promise<Task> {
    return request.post('/tasks', data);
  },

  // 更新任务
  update(id: number, data: Partial<Task>): Promise<Task> {
    return request.put(`/tasks/${id}`, data);
  },

  // 删除任务
  delete(id: number): Promise<void> {
    return request.delete(`/tasks/${id}`);
  },

  // 执行任务
  execute(id: number, params?: TaskExecuteParams): Promise<TaskInstance> {
    return request.post(`/tasks/${id}/execute`, params);
  },

  // 启用/禁用任务
  toggleStatus(id: number, enabled: boolean): Promise<void> {
    return request.patch(`/tasks/${id}/status`, { enabled });
  },

  // 获取任务实例列表
  getInstances(taskId: number, params: PageParams): Promise<PageResult<TaskInstance>> {
    return request.get(`/tasks/${taskId}/instances`, { params });
  },

  // 获取任务依赖关系
  getDependencies(id: number): Promise<{ upstream: Task[]; downstream: Task[] }> {
    return request.get(`/tasks/${id}/dependencies`);
  },

  // 获取任务 DAG 图数据
  getDagData(id: number): Promise<any> {
    return request.get(`/tasks/${id}/dag`);
  },
};
