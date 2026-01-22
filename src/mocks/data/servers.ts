/**
 * 服务器Mock数据
 * 5个服务器节点
 */

export interface MockServer {
  id: number;
  hostname: string;
  ip: string;
  port: number;
  role: 'MASTER' | 'WORKER';
  status: 'ONLINE' | 'OFFLINE' | 'BUSY';
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  runningTasks: number;
  totalTasks: number;
  createTime: string;
  updateTime: string;
}

export const mockServers: MockServer[] = [
  {
    id: 1,
    hostname: 'master-1.company.com',
    ip: '192.168.1.10',
    port: 8080,
    role: 'MASTER',
    status: 'ONLINE',
    cpuUsage: 35.5,
    memoryUsage: 62.3,
    diskUsage: 45.8,
    runningTasks: 0,
    totalTasks: 15823,
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-22 10:00:00',
  },
  {
    id: 2,
    hostname: 'worker-1.company.com',
    ip: '192.168.1.11',
    port: 8081,
    role: 'WORKER',
    status: 'ONLINE',
    cpuUsage: 68.2,
    memoryUsage: 75.6,
    diskUsage: 52.3,
    runningTasks: 8,
    totalTasks: 8945,
    createTime: '2024-01-01 10:05:00',
    updateTime: '2024-01-22 10:00:00',
  },
  {
    id: 3,
    hostname: 'worker-2.company.com',
    ip: '192.168.1.12',
    port: 8081,
    role: 'WORKER',
    status: 'ONLINE',
    cpuUsage: 72.8,
    memoryUsage: 81.2,
    diskUsage: 58.7,
    runningTasks: 12,
    totalTasks: 7562,
    createTime: '2024-01-01 10:10:00',
    updateTime: '2024-01-22 10:00:00',
  },
  {
    id: 4,
    hostname: 'worker-3.company.com',
    ip: '192.168.1.13',
    port: 8081,
    role: 'WORKER',
    status: 'BUSY',
    cpuUsage: 89.5,
    memoryUsage: 92.1,
    diskUsage: 65.4,
    runningTasks: 15,
    totalTasks: 6234,
    createTime: '2024-01-01 10:15:00',
    updateTime: '2024-01-22 10:00:00',
  },
  {
    id: 5,
    hostname: 'worker-4.company.com',
    ip: '192.168.1.14',
    port: 8081,
    role: 'WORKER',
    status: 'OFFLINE',
    cpuUsage: 0,
    memoryUsage: 0,
    diskUsage: 0,
    runningTasks: 0,
    totalTasks: 3421,
    createTime: '2024-01-01 10:20:00',
    updateTime: '2024-01-22 10:00:00',
  },
];
