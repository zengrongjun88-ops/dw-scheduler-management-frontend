/**
 * 实例Mock数据
 * 生成100个实例记录
 */

export interface MockInstance {
  id: number;
  taskId: number;
  taskName: string;
  status: 'SUCCESS' | 'RUNNING' | 'FAILED' | 'WAITING' | 'KILLED';
  startTime: string;
  endTime: string | null;
  duration: number | null;
  retryTimes: number;
  executorHost: string;
  logPath: string;
  errorMsg: string | null;
}

// 生成实例数据
function generateInstances(): MockInstance[] {
  const instances: MockInstance[] = [];
  const statuses: Array<'SUCCESS' | 'RUNNING' | 'FAILED' | 'WAITING' | 'KILLED'> = 
    ['SUCCESS', 'RUNNING', 'FAILED', 'WAITING', 'KILLED'];
  const statusWeights = [70, 10, 10, 5, 5]; // 成功率70%
  
  const hosts = [
    'worker-1.company.com',
    'worker-2.company.com',
    'worker-3.company.com',
    'worker-4.company.com',
  ];
  
  const errorMessages = [
    'java.sql.SQLException: Connection timeout',
    'Table not found: ods.user_behavior_log',
    'Out of memory: Java heap space',
    'Task killed by user',
    null,
  ];
  
  for (let i = 1; i <= 100; i++) {
    const taskId = Math.floor(Math.random() * 30) + 1;
    const status = weightedRandom(statuses, statusWeights);
    const startTime = generateRandomTime(i);
    const duration = status === 'RUNNING' || status === 'WAITING' 
      ? null 
      : Math.floor(Math.random() * 3600) + 60;
    const endTime = duration ? addSeconds(startTime, duration) : null;
    
    instances.push({
      id: i,
      taskId,
      taskName: `task_${taskId}`,
      status,
      startTime,
      endTime,
      duration,
      retryTimes: status === 'FAILED' ? Math.floor(Math.random() * 3) : 0,
      executorHost: hosts[Math.floor(Math.random() * hosts.length)],
      logPath: `/logs/task_${taskId}/instance_${i}.log`,
      errorMsg: status === 'FAILED' 
        ? errorMessages[Math.floor(Math.random() * (errorMessages.length - 1))] 
        : null,
    });
  }
  
  return instances.sort((a, b) => 
    new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
  );
}

function weightedRandom<T>(items: T[], weights: number[]): T {
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  let random = Math.random() * totalWeight;
  
  for (let i = 0; i < items.length; i++) {
    random -= weights[i];
    if (random <= 0) {
      return items[i];
    }
  }
  
  return items[items.length - 1];
}

function generateRandomTime(offset: number): string {
  const now = new Date();
  const hoursAgo = Math.floor(offset / 4);
  const date = new Date(now.getTime() - hoursAgo * 60 * 60 * 1000);
  return formatDateTime(date);
}

function formatDateTime(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function addSeconds(dateStr: string, seconds: number): string {
  const date = new Date(dateStr);
  date.setSeconds(date.getSeconds() + seconds);
  return formatDateTime(date);
}

export const mockInstances = generateInstances();
