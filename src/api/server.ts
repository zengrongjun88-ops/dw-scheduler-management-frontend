import request from './request';
import type { Server } from '@/types/server';
import type { PageParams, PageResult } from './task';

/**
 * 服务器 API
 */
export const serverApi = {
  // 获取服务器列表
  getList(params: PageParams & { name?: string; status?: string }): Promise<PageResult<Server>> {
    return request.get('/servers', { params });
  },

  // 获取所有服务器(不分页)
  getAll(): Promise<Server[]> {
    return request.get('/servers/all');
  },

  // 获取服务器详情
  getDetail(id: number): Promise<Server> {
    return request.get(`/servers/${id}`);
  },

  // 创建服务器
  create(data: Partial<Server>): Promise<Server> {
    return request.post('/servers', data);
  },

  // 更新服务器
  update(id: number, data: Partial<Server>): Promise<Server> {
    return request.put(`/servers/${id}`, data);
  },

  // 删除服务器
  delete(id: number): Promise<void> {
    return request.delete(`/servers/${id}`);
  },

  // 测试连接
  testConnection(id: number): Promise<{ success: boolean; message: string }> {
    return request.post(`/servers/${id}/test`);
  },

  // 获取服务器资源使用情况
  getResourceUsage(id: number): Promise<{
    cpu: number;
    memory: number;
    disk: number;
  }> {
    return request.get(`/servers/${id}/resources`);
  },

  // 启用/禁用服务器
  toggleStatus(id: number, enabled: boolean): Promise<void> {
    return request.patch(`/servers/${id}/status`, { enabled });
  },
};
