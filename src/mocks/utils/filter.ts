/**
 * 搜索过滤工具
 */

/**
 * 字符串模糊匹配
 */
export function fuzzyMatch(text: string, keyword: string): boolean {
  if (!keyword) return true;
  return text.toLowerCase().includes(keyword.toLowerCase());
}

/**
 * 多字段搜索
 */
export function searchInFields<T extends Record<string, any>>(
  item: T,
  fields: (keyof T)[],
  keyword: string
): boolean {
  if (!keyword) return true;
  
  return fields.some(field => {
    const value = item[field];
    if (typeof value === 'string') {
      return fuzzyMatch(value, keyword);
    }
    if (typeof value === 'number') {
      return value.toString().includes(keyword);
    }
    return false;
  });
}

/**
 * 多条件过滤
 */
export function filterByConditions<T extends Record<string, any>>(
  items: T[],
  conditions: Partial<Record<keyof T, any>>
): T[] {
  return items.filter(item => {
    return Object.entries(conditions).every(([key, value]) => {
      if (value === undefined || value === null || value === '') {
        return true;
      }
      return item[key] === value;
    });
  });
}
