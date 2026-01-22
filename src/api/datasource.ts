import request from './request';
import type { Datasource, DatasourceTestResult } from '@/types/datasource';
import type { PageParams, PageResult } from './task';

/**
 * 数据源 API
 */
export const datasourceApi = {
  // 获取数据源列表
  getList(params: PageParams & { name?: string; type?: string }): Promise<PageResult<Datasource>> {
    return request.get('/datasources', { params });
  },

  // 获取所有数据源(不分页)
  getAll(): Promise<Datasource[]> {
    return request.get('/datasources/all');
  },

  // 获取数据源详情
  getDetail(id: number): Promise<Datasource> {
    return request.get(`/datasources/${id}`);
  },

  // 创建数据源
  create(data: Partial<Datasource>): Promise<Datasource> {
    return request.post('/datasources', data);
  },

  // 更新数据源
  update(id: number, data: Partial<Datasource>): Promise<Datasource> {
    return request.put(`/datasources/${id}`, data);
  },

  // 删除数据源
  delete(id: number): Promise<void> {
    return request.delete(`/datasources/${id}`);
  },

  // 测试连接
  testConnection(data: Partial<Datasource>): Promise<DatasourceTestResult> {
    return request.post('/datasources/test', data);
  },

  // 获取支持的数据源类型
  getTypes(): Promise<string[]> {
    return request.get('/datasources/types');
  },
};
