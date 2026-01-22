import type { BaseEntity } from './common';

/**
 * 任务类型
 */
export enum TaskType {
  SQL = 'SQL',
  SHELL = 'SHELL',
  PYTHON = 'PYTHON',
  SPARK = 'SPARK',
  FLINK = 'FLINK',
}

/**
 * 调度类型
 */
export enum ScheduleType {
  NONE = 'NONE',
  CRON = 'CRON',
  INTERVAL = 'INTERVAL',
  MANUAL = 'MANUAL',
}

/**
 * 任务状态
 */
export enum TaskStatus {
  ENABLED = 'ENABLED',
  DISABLED = 'DISABLED',
}

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
 * 任务配置
 */
export interface TaskConfig {
  timeout?: number; // 超时时间(秒)
  retryCount?: number; // 重试次数
  retryInterval?: number; // 重试间隔(秒)
  maxConcurrency?: number; // 最大并发数
  priority?: number; // 优先级
  params?: Record<string, any>; // 任务参数
}

/**
 * 任务
 */
export interface Task extends BaseEntity {
  name: string;
  description?: string;
  type: TaskType;
  scheduleType: ScheduleType;
  scheduleConfig?: string; // Cron 表达式或间隔配置
  directoryId?: number;
  directoryPath?: string;
  content: string; // SQL/Shell/Python 代码
  datasourceId?: number;
  datasourceName?: string;
  serverId?: number;
  serverName?: string;
  config?: TaskConfig;
  status: TaskStatus;
  dependencyIds?: number[]; // 依赖的任务ID列表
  dependencies?: Task[]; // 依赖的任务列表
  lastInstanceStatus?: InstanceStatus;
  lastInstanceTime?: string;
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
  triggerType: 'MANUAL' | 'SCHEDULE' | 'DEPENDENCY'; // 触发类型
  params?: Record<string, any>; // 执行参数
}

/**
 * 任务执行参数
 */
export interface TaskExecuteParams {
  params?: Record<string, any>;
  async?: boolean; // 是否异步执行
}

/**
 * DAG 节点
 */
export interface DagNode {
  id: string;
  label: string;
  taskId: number;
  status?: InstanceStatus;
}

/**
 * DAG 边
 */
export interface DagEdge {
  source: string;
  target: string;
}

/**
 * DAG 图数据
 */
export interface DagData {
  nodes: DagNode[];
  edges: DagEdge[];
}
