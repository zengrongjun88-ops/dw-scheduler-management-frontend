/**
 * Mock适配器 - 使用axios拦截器
 */

import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { simulateDelay } from '../mocks/utils/generator';
import * as taskHandlers from '../mocks/handlers/task';
import * as datasourceHandlers from '../mocks/handlers/datasource';
import * as instanceHandlers from '../mocks/handlers/instance';
import * as serverHandlers from '../mocks/handlers/server';
import * as directoryHandlers from '../mocks/handlers/directory';

interface MockResponse {
  code: number;
  message: string;
  data: any;
}

/**
 * 启用Mock拦截器
 */
export function enableMockAdapter(axiosInstance: AxiosInstance) {
  axiosInstance.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
    // 模拟网络延迟
    await simulateDelay(300, 800);
    
    const { method = 'get', url = '', data, params } = config;
    
    console.log('[Mock] Request:', method.toUpperCase(), url, { data, params });
    
    try {
      const response = await handleMockRequest(method, url, data, params);
      
      // 直接修改config,让axios返回mock数据
      config.adapter = () => {
        return Promise.resolve({
          data: response,
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
        });
      };
      
      return config;
    } catch (error: any) {
      // 返回错误响应
      config.adapter = () => {
        return Promise.resolve({
          data: {
            code: 500,
            message: error.message || '请求失败',
            data: null,
          },
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
        });
      };
      
      return config;
    }
  });
}

/**
 * 处理Mock请求
 */
async function handleMockRequest(
  method: string,
  url: string,
  data: any,
  params: any
): Promise<MockResponse> {
  method = method.toLowerCase();
  
  // 任务相关API
  if (url.includes('/task/list')) {
    return success(taskHandlers.getTaskList(params));
  }
  if (url.match(/\/task\/\d+$/)) {
    const taskId = extractId(url);
    if (method === 'get') {
      return success(taskHandlers.getTaskDetail(taskId));
    }
    if (method === 'put') {
      return success(taskHandlers.updateTask(taskId, data));
    }
    if (method === 'delete') {
      return success(taskHandlers.deleteTask(taskId));
    }
  }
  if (url.includes('/task') && method === 'post') {
    return success(taskHandlers.createTask(data));
  }
  if (url.includes('/task/') && url.includes('/trigger')) {
    const taskId = extractId(url);
    return success(taskHandlers.triggerTask(taskId));
  }
  if (url.includes('/task/') && url.includes('/toggle')) {
    const taskId = extractId(url);
    return success(taskHandlers.toggleTaskStatus(taskId));
  }
  if (url.includes('/task/') && url.includes('/dependencies')) {
    const taskId = extractId(url);
    if (method === 'get') {
      return success(taskHandlers.getTaskDependencies(taskId));
    }
    if (method === 'post') {
      return success(taskHandlers.addTaskDependency(taskId, data.dependTaskId));
    }
    if (method === 'delete') {
      return success(taskHandlers.removeTaskDependency(taskId, data.dependTaskId));
    }
  }
  if (url.includes('/task/') && url.includes('/dag')) {
    const taskId = extractId(url);
    return success(taskHandlers.getTaskDAG(taskId));
  }
  
  // 数据源相关API
  if (url.includes('/datasource/list')) {
    return success(datasourceHandlers.getDatasourceList(params));
  }
  if (url.match(/\/datasource\/\d+$/)) {
    const id = extractId(url);
    if (method === 'get') {
      return success(datasourceHandlers.getDatasourceDetail(id));
    }
    if (method === 'put') {
      return success(datasourceHandlers.updateDatasource(id, data));
    }
    if (method === 'delete') {
      return success(datasourceHandlers.deleteDatasource(id));
    }
  }
  if (url.includes('/datasource') && method === 'post' && !url.includes('/test')) {
    return success(datasourceHandlers.createDatasource(data));
  }
  if (url.includes('/datasource/') && url.includes('/test')) {
    const id = extractId(url);
    return success(datasourceHandlers.testDatasourceConnection(id));
  }
  
  // 实例相关API
  if (url.includes('/instance/list')) {
    return success(instanceHandlers.getInstanceList(params));
  }
  if (url.match(/\/instance\/\d+$/)) {
    const id = extractId(url);
    return success(instanceHandlers.getInstanceDetail(id));
  }
  if (url.includes('/instance/') && url.includes('/log')) {
    const id = extractId(url);
    return success(instanceHandlers.getInstanceLog(id));
  }
  if (url.includes('/instance/') && url.includes('/kill')) {
    const id = extractId(url);
    return success(instanceHandlers.killInstance(id));
  }
  if (url.includes('/instance/') && url.includes('/retry')) {
    const id = extractId(url);
    return success(instanceHandlers.retryInstance(id));
  }
  if (url.includes('/instance/statistics')) {
    return success(instanceHandlers.getInstanceStatistics(params));
  }
  
  // 服务器相关API
  if (url.includes('/server/list')) {
    return success(serverHandlers.getServerList(params));
  }
  if (url.match(/\/server\/\d+$/)) {
    const id = extractId(url);
    return success(serverHandlers.getServerDetail(id));
  }
  if (url.includes('/server/') && url.includes('/monitor')) {
    const id = extractId(url);
    const hours = params?.hours || 24;
    return success(serverHandlers.getServerMonitor(id, hours));
  }
  if (url.includes('/server/statistics')) {
    return success(serverHandlers.getServerStatistics());
  }
  
  // 目录相关API
  if (url.includes('/directory/tree')) {
    return success(directoryHandlers.getDirectoryTree());
  }
  if (url.includes('/directory/list')) {
    return success(directoryHandlers.getDirectoryList());
  }
  if (url.match(/\/directory\/\d+$/)) {
    const id = extractId(url);
    if (method === 'put') {
      return success(directoryHandlers.updateDirectory(id, data));
    }
    if (method === 'delete') {
      return success(directoryHandlers.deleteDirectory(id));
    }
  }
  if (url.includes('/directory') && method === 'post') {
    return success(directoryHandlers.createDirectory(data));
  }
  
  // 未匹配的请求
  return error('API not found: ' + url);
}

/**
 * 从URL中提取ID
 */
function extractId(url: string): number {
  const match = url.match(/\/(\d+)/);
  return match ? parseInt(match[1]) : 0;
}

/**
 * 成功响应
 */
function success(data: any): MockResponse {
  return {
    code: 200,
    message: 'success',
    data,
  };
}

/**
 * 错误响应
 */
function error(message: string): MockResponse {
  return {
    code: 500,
    message,
    data: null,
  };
}
