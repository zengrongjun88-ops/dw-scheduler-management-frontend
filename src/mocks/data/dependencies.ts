/**
 * 任务依赖Mock数据
 * 构建DAG图
 */

export interface MockDependency {
  id: number;
  taskId: number;
  dependTaskId: number;
  createTime: string;
}

export const mockDependencies: MockDependency[] = [
  // ODS -> DWD 依赖
  { id: 1, taskId: 5, dependTaskId: 1, createTime: '2024-01-11 10:00:00' },
  { id: 2, taskId: 5, dependTaskId: 4, createTime: '2024-01-11 10:00:00' },
  { id: 3, taskId: 5, dependTaskId: 3, createTime: '2024-01-11 10:00:00' },
  
  { id: 4, taskId: 6, dependTaskId: 2, createTime: '2024-01-11 10:05:00' },
  { id: 5, taskId: 6, dependTaskId: 4, createTime: '2024-01-11 10:05:00' },
  { id: 6, taskId: 6, dependTaskId: 3, createTime: '2024-01-11 10:05:00' },
  
  // DWD -> Report 依赖
  { id: 7, taskId: 12, dependTaskId: 5, createTime: '2024-01-14 10:00:00' },
  { id: 8, taskId: 13, dependTaskId: 6, createTime: '2024-01-14 10:05:00' },
  { id: 9, taskId: 14, dependTaskId: 5, createTime: '2024-01-14 10:10:00' },
  
  { id: 10, taskId: 18, dependTaskId: 6, createTime: '2024-01-16 10:00:00' },
  { id: 11, taskId: 19, dependTaskId: 5, createTime: '2024-01-16 10:05:00' },
  { id: 12, taskId: 20, dependTaskId: 5, createTime: '2024-01-17 10:00:00' },
  
  // 数据质量检查依赖
  { id: 13, taskId: 16, dependTaskId: 5, createTime: '2024-01-15 10:05:00' },
  { id: 14, taskId: 16, dependTaskId: 6, createTime: '2024-01-15 10:05:00' },
  
  // 导出依赖报表
  { id: 15, taskId: 17, dependTaskId: 12, createTime: '2024-01-15 10:10:00' },
  { id: 16, taskId: 17, dependTaskId: 13, createTime: '2024-01-15 10:10:00' },
  
  // 邮件发送依赖报表
  { id: 17, taskId: 30, dependTaskId: 12, createTime: '2024-01-20 10:05:00' },
  { id: 18, taskId: 30, dependTaskId: 13, createTime: '2024-01-20 10:05:00' },
  { id: 19, taskId: 30, dependTaskId: 14, createTime: '2024-01-20 10:05:00' },
];

/**
 * 获取任务的上游依赖
 */
export function getUpstreamTasks(taskId: number): number[] {
  return mockDependencies
    .filter(dep => dep.taskId === taskId)
    .map(dep => dep.dependTaskId);
}

/**
 * 获取任务的下游任务
 */
export function getDownstreamTasks(taskId: number): number[] {
  return mockDependencies
    .filter(dep => dep.dependTaskId === taskId)
    .map(dep => dep.taskId);
}
