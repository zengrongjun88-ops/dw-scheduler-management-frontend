import type { BaseEntity } from './common';

/**
 * 服务器状态
 */
export enum ServerStatus {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
  DISABLED = 'DISABLED',
}

/**
 * 服务器配置
 */
export interface ServerConfig {
  host: string;
  port: number;
  username: string;
  password?: string;
  privateKey?: string; // SSH 私钥
  workDir?: string; // 工作目录
  env?: Record<string, string>; // 环境变量
}

/**
 * 服务器
 */
export interface Server extends BaseEntity {
  name: string;
  description?: string;
  config: ServerConfig;
  status: ServerStatus;
  tags?: string[];
  cpu?: number; // CPU 核心数
  memory?: number; // 内存大小(GB)
  lastHeartbeatTime?: string; // 最后心跳时间
}

/**
 * 服务器资源使用情况
 */
export interface ServerResource {
  cpu: number; // CPU 使用率(%)
  memory: number; // 内存使用率(%)
  disk: number; // 磁盘使用率(%)
  timestamp: string;
}
