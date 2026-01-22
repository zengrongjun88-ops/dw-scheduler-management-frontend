/**
 * 数据源API Mock Handler
 */

import { mockDatasources, MockDatasource } from '../data/datasources';
import { paginate } from '../utils/pagination';
import { searchInFields } from '../utils/filter';
import { generateId, generateTime } from '../utils/generator';
import { saveToStorage, loadFromStorage } from '../utils/storage';

let datasources = loadFromStorage<MockDatasource[]>('datasources', [...mockDatasources]);

export function getDatasourceList(params: {
  pageNum?: number;
  pageSize?: number;
  name?: string;
  type?: string;
  status?: string;
}) {
  let filtered = [...datasources];
  
  if (params.name) {
    filtered = filtered.filter(ds => 
      searchInFields(ds, ['name', 'description'], params.name!)
    );
  }
  
  if (params.type) {
    filtered = filtered.filter(ds => ds.type === params.type);
  }
  
  if (params.status) {
    filtered = filtered.filter(ds => ds.status === params.status);
  }
  
  return paginate(filtered, params.pageNum || 1, params.pageSize || 10);
}

export function getDatasourceDetail(id: number) {
  const datasource = datasources.find(ds => ds.id === id);
  if (!datasource) {
    throw new Error('数据源不存在');
  }
  return datasource;
}

export function createDatasource(data: Omit<MockDatasource, 'id' | 'createTime' | 'updateTime'>) {
  const newDatasource: MockDatasource = {
    ...data,
    id: generateId(),
    createTime: generateTime(),
    updateTime: generateTime(),
  };
  
  datasources.push(newDatasource);
  saveToStorage('datasources', datasources);
  
  return newDatasource;
}

export function updateDatasource(id: number, data: Partial<MockDatasource>) {
  const index = datasources.findIndex(ds => ds.id === id);
  if (index === -1) {
    throw new Error('数据源不存在');
  }
  
  datasources[index] = {
    ...datasources[index],
    ...data,
    updateTime: generateTime(),
  };
  
  saveToStorage('datasources', datasources);
  return datasources[index];
}

export function deleteDatasource(id: number) {
  const index = datasources.findIndex(ds => ds.id === id);
  if (index === -1) {
    throw new Error('数据源不存在');
  }
  
  datasources.splice(index, 1);
  saveToStorage('datasources', datasources);
  
  return { success: true };
}

export function testDatasourceConnection(id: number) {
  const datasource = datasources.find(ds => ds.id === id);
  if (!datasource) {
    throw new Error('数据源不存在');
  }
  
  // 模拟连接测试
  const success = Math.random() > 0.1; // 90%成功率
  
  return {
    success,
    message: success ? '连接成功' : '连接失败: Connection timeout',
    duration: Math.floor(Math.random() * 1000) + 500,
  };
}
