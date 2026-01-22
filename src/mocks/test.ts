/**
 * Mock功能测试
 * 在浏览器控制台运行: import('./mocks/test').then(m => m.runTests())
 */

import * as taskHandlers from './handlers/task';
import * as datasourceHandlers from './handlers/datasource';
import * as instanceHandlers from './handlers/instance';
import * as serverHandlers from './handlers/server';
import * as directoryHandlers from './handlers/directory';

export async function runTests() {
  console.group('Mock功能测试');
  
  try {
    // 测试任务API
    console.group('1. 任务API测试');
    const taskList = taskHandlers.getTaskList({ pageNum: 1, pageSize: 5 });
    console.log('✅ 获取任务列表:', taskList);
    
    const taskDetail = taskHandlers.getTaskDetail(1);
    console.log('✅ 获取任务详情:', taskDetail);
    
    const taskDeps = taskHandlers.getTaskDependencies(5);
    console.log('✅ 获取任务依赖:', taskDeps);
    
    const taskDAG = taskHandlers.getTaskDAG(5);
    console.log('✅ 获取任务DAG:', taskDAG);
    console.groupEnd();
    
    // 测试数据源API
    console.group('2. 数据源API测试');
    const dsList = datasourceHandlers.getDatasourceList({ pageNum: 1, pageSize: 5 });
    console.log('✅ 获取数据源列表:', dsList);
    
    const dsDetail = datasourceHandlers.getDatasourceDetail(1);
    console.log('✅ 获取数据源详情:', dsDetail);
    
    const dsTest = datasourceHandlers.testDatasourceConnection(1);
    console.log('✅ 测试数据源连接:', dsTest);
    console.groupEnd();
    
    // 测试实例API
    console.group('3. 实例API测试');
    const instList = instanceHandlers.getInstanceList({ pageNum: 1, pageSize: 5 });
    console.log('✅ 获取实例列表:', instList);
    
    const instDetail = instanceHandlers.getInstanceDetail(1);
    console.log('✅ 获取实例详情:', instDetail);
    
    const instLog = instanceHandlers.getInstanceLog(1);
    console.log('✅ 获取实例日志:', instLog);
    
    const instStats = instanceHandlers.getInstanceStatistics({});
    console.log('✅ 获取实例统计:', instStats);
    console.groupEnd();
    
    // 测试服务器API
    console.group('4. 服务器API测试');
    const serverList = serverHandlers.getServerList({ pageNum: 1, pageSize: 5 });
    console.log('✅ 获取服务器列表:', serverList);
    
    const serverDetail = serverHandlers.getServerDetail(1);
    console.log('✅ 获取服务器详情:', serverDetail);
    
    const serverMonitor = serverHandlers.getServerMonitor(1, 6);
    console.log('✅ 获取服务器监控:', serverMonitor);
    
    const serverStats = serverHandlers.getServerStatistics();
    console.log('✅ 获取服务器统计:', serverStats);
    console.groupEnd();
    
    // 测试目录API
    console.group('5. 目录API测试');
    const dirTree = directoryHandlers.getDirectoryTree();
    console.log('✅ 获取目录树:', dirTree);
    
    const dirList = directoryHandlers.getDirectoryList();
    console.log('✅ 获取目录列表:', dirList);
    console.groupEnd();
    
    console.log('\n🎉 所有测试通过!');
  } catch (error) {
    console.error('❌ 测试失败:', error);
  }
  
  console.groupEnd();
}

// 自动运行测试
if (import.meta.env.DEV) {
  console.log('[Mock Test] 可以在控制台运行 runTests() 来测试Mock功能');
  (window as any).runMockTests = runTests;
}
