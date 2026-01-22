/**
 * 服务器API Mock Handler
 */

import { mockServers, MockServer } from '../data/servers';
import { generateMonitorData } from '../data/monitor';
import { paginate } from '../utils/pagination';

export function getServerList(params: {
  pageNum?: number;
  pageSize?: number;
  role?: string;
  status?: string;
}) {
  let filtered = [...mockServers];
  
  if (params.role) {
    filtered = filtered.filter(s => s.role === params.role);
  }
  
  if (params.status) {
    filtered = filtered.filter(s => s.status === params.status);
  }
  
  return paginate(filtered, params.pageNum || 1, params.pageSize || 10);
}

export function getServerDetail(serverId: number) {
  const server = mockServers.find(s => s.id === serverId);
  if (!server) {
    throw new Error('服务器不存在');
  }
  return server;
}

export function getServerMonitor(serverId: number, hours: number = 24) {
  const server = mockServers.find(s => s.id === serverId);
  if (!server) {
    throw new Error('服务器不存在');
  }
  
  return generateMonitorData(hours);
}

export function getServerStatistics() {
  const total = mockServers.length;
  const online = mockServers.filter(s => s.status === 'ONLINE').length;
  const offline = mockServers.filter(s => s.status === 'OFFLINE').length;
  const busy = mockServers.filter(s => s.status === 'BUSY').length;
  
  const totalRunningTasks = mockServers.reduce((sum, s) => sum + s.runningTasks, 0);
  const totalTasks = mockServers.reduce((sum, s) => sum + s.totalTasks, 0);
  
  const avgCpuUsage = mockServers
    .filter(s => s.status !== 'OFFLINE')
    .reduce((sum, s) => sum + s.cpuUsage, 0) / online;
  
  const avgMemoryUsage = mockServers
    .filter(s => s.status !== 'OFFLINE')
    .reduce((sum, s) => sum + s.memoryUsage, 0) / online;
  
  return {
    total,
    online,
    offline,
    busy,
    totalRunningTasks,
    totalTasks,
    avgCpuUsage: avgCpuUsage.toFixed(2),
    avgMemoryUsage: avgMemoryUsage.toFixed(2),
  };
}
