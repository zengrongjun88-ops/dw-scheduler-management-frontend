/**
 * 通用类型定义
 */

// 基础实体
export interface BaseEntity {
  id: number;
  createTime: string;
  updateTime: string;
}

// 分页参数
export interface PaginationParams {
  pageNum: number;
  pageSize: number;
}

// 分页结果
export interface PaginationResult<T> {
  list: T[];
  total: number;
  pageNum: number;
  pageSize: number;
}

// 选项类型
export interface Option {
  label: string;
  value: string | number;
}

// 状态类型
export enum Status {
  ENABLED = 'ENABLED',
  DISABLED = 'DISABLED',
}

// 时间范围
export interface TimeRange {
  startTime: string;
  endTime: string;
}
