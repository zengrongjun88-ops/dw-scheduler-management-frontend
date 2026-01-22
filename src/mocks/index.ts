/**
 * Mock模块入口
 */

export * from './data/tasks';
export * from './data/datasources';
export * from './data/instances';
export * from './data/servers';
export * from './data/directories';
export * from './data/dependencies';
export * from './data/logs';
export * from './data/monitor';

export * from './utils/pagination';
export * from './utils/filter';
export * from './utils/storage';
export * from './utils/generator';

export * as taskHandlers from './handlers/task';
export * as datasourceHandlers from './handlers/datasource';
export * as instanceHandlers from './handlers/instance';
export * as serverHandlers from './handlers/server';
export * as directoryHandlers from './handlers/directory';

// 重置Mock数据
export function resetMockData() {
  const keys = Object.keys(localStorage);
  keys.forEach(key => {
    if (key.startsWith('mock_scheduler_')) {
      localStorage.removeItem(key);
    }
  });
  console.log('[Mock] All mock data has been reset');
}
