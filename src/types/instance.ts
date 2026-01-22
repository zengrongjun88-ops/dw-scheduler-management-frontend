import type { BaseEntity } from './common';
import type { TaskType } from './task';

/**
 * 任务实例状态
 */
export enum InstanceStatus {
  PENDING = 'PENDING',
  RUNNING = 'RUNNING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  TERMINATED = 'TERMINATED',
}

/**
 * 触发类型
 */
export enum TriggerType {
  MANUAL = 'MANUAL',
  SCHEDULE = 'SCHEDULE',
  DEPENDENCY = 'DEPENDENCY',
}

/**
 * 任务实例
 */
export interface TaskInstance extends BaseEntity {
  taskId: number;
  taskName: string;
  taskType: TaskType;
  status: InstanceStatus;
  startTime?: string;
  endTime?: string;
  duration?: number; // 执行时长(毫秒)
  logPath?: string;
  errorMessage?: string;
  serverId?: number;
  serverName?: string;
  triggerType: TriggerType;
  params?: Record<string, any>;
  retryCount?: number; // 已重试次数
  maxRetryCount?: number; // 最大重试次数
}

/**
 * 实例统计
 */
export interface InstanceStats {
  total: number;
  success: number;
  failed: number;
  running: number;
  successRate: number;
}
