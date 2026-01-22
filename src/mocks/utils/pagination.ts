/**
 * 分页工具函数
 */

export interface PageResult<T> {
  list: T[];
  total: number;
  pageNum: number;
  pageSize: number;
  totalPages: number;
}

export function paginate<T>(
  data: T[],
  pageNum: number = 1,
  pageSize: number = 10
): PageResult<T> {
  const total = data.length;
  const totalPages = Math.ceil(total / pageSize);
  const start = (pageNum - 1) * pageSize;
  const end = start + pageSize;
  const list = data.slice(start, end);
  
  return {
    list,
    total,
    pageNum,
    pageSize,
    totalPages,
  };
}
