import request from './request';

export interface DirectoryNode {
  id: number;
  name: string;
  path: string;
  type: 'directory' | 'task';
  parentId?: number;
  children?: DirectoryNode[];
}

/**
 * 目录 API
 */
export const directoryApi = {
  // 获取目录树
  getTree(): Promise<DirectoryNode[]> {
    return request.get('/directories/tree');
  },

  // 创建目录
  create(data: { name: string; parentId?: number }): Promise<DirectoryNode> {
    return request.post('/directories', data);
  },

  // 更新目录
  update(id: number, data: { name: string }): Promise<DirectoryNode> {
    return request.put(`/directories/${id}`, data);
  },

  // 删除目录
  delete(id: number): Promise<void> {
    return request.delete(`/directories/${id}`);
  },

  // 移动节点
  move(id: number, targetParentId?: number): Promise<void> {
    return request.post(`/directories/${id}/move`, { targetParentId });
  },
};
