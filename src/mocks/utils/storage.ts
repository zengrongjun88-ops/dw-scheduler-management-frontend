/**
 * LocalStorage持久化工具
 */

const STORAGE_PREFIX = 'mock_scheduler_';

export function saveToStorage<T>(key: string, data: T): void {
  try {
    const json = JSON.stringify(data);
    localStorage.setItem(STORAGE_PREFIX + key, json);
  } catch (error) {
    console.error('Save to storage failed:', error);
  }
}

export function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const json = localStorage.getItem(STORAGE_PREFIX + key);
    if (json) {
      return JSON.parse(json);
    }
  } catch (error) {
    console.error('Load from storage failed:', error);
  }
  return defaultValue;
}

export function removeFromStorage(key: string): void {
  localStorage.removeItem(STORAGE_PREFIX + key);
}

export function clearAllStorage(): void {
  const keys = Object.keys(localStorage);
  keys.forEach(key => {
    if (key.startsWith(STORAGE_PREFIX)) {
      localStorage.removeItem(key);
    }
  });
}
