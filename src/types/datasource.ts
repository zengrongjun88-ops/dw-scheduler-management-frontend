import type { BaseEntity } from './common';

/**
 * 数据源类型
 */
export enum DatasourceType {
  MYSQL = 'MYSQL',
  POSTGRESQL = 'POSTGRESQL',
  ORACLE = 'ORACLE',
  SQLSERVER = 'SQLSERVER',
  CLICKHOUSE = 'CLICKHOUSE',
  HIVE = 'HIVE',
  SPARK = 'SPARK',
}

/**
 * 数据源状态
 */
export enum DatasourceStatus {
  ENABLED = 'ENABLED',
  DISABLED = 'DISABLED',
}

/**
 * 数据源配置
 */
export interface DatasourceConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  params?: Record<string, string>; // 额外连接参数
  poolSize?: number; // 连接池大小
  maxWaitTime?: number; // 最大等待时间(秒)
}

/**
 * 数据源
 */
export interface Datasource extends BaseEntity {
  name: string;
  type: DatasourceType;
  description?: string;
  config: DatasourceConfig;
  status: DatasourceStatus;
  lastTestTime?: string;
  lastTestResult?: boolean;
}

/**
 * 数据源测试结果
 */
export interface DatasourceTestResult {
  success: boolean;
  message: string;
  duration?: number; // 连接耗时(毫秒)
}
