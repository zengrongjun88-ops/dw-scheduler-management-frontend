import request from './request';
import type { TaskInstance } from '@/types/instance';
import type { PageParams, PageResult } from './task';

/**
 * 任务实例 API
 */
export const instanceApi = {
  // 获取实例列表
  getList(params: PageParams & { 
    taskId?: number; 
    status?: string;
    startTime?: string;
    endTime?: string;
  }): Promise<PageResult<TaskInstance>> {
    return request.get('/instances', { params });
  },

  // 获取实例详情
  getDetail(id: number): Promise<TaskInstance> {
    return request.get(`/instances/${id}`);
  },

  // 获取实例日志
  getLogs(id: number, offset?: number, limit?: number): Promise<{
    content: string;
    offset: number;
    hasMore: boolean;
  }> {
    return request.get(`/instances/${id}/logs`, { 
      params: { offset, limit } 
    });
  },

  // 终止实例
  terminate(id: number): Promise<void> {
    return request.post(`/instances/${id}/terminate`);
  },

  // 重试实例
  retry(id: number): Promise<TaskInstance> {
    return request.post(`/instances/${id}/retry`);
  },

  // 获取实例统计信息
  getStats(params?: { startTime?: string; endTime?: string }): Promise<{
    total: number;
    success: number;
    failed: number;
    running: number;
  }> {
    return request.get('/instances/stats', { params });
  },
};
