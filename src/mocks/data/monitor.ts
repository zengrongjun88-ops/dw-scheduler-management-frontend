/**
 * 监控数据生成器
 * 生成时序监控数据
 */

export interface MonitorData {
  timestamp: string;
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  networkIn: number;
  networkOut: number;
  taskCount: number;
}

/**
 * 生成最近N小时的监控数据
 */
export function generateMonitorData(hours: number = 24): MonitorData[] {
  const data: MonitorData[] = [];
  const now = Date.now();
  const interval = 5 * 60 * 1000; // 5分钟间隔
  
  for (let i = hours * 12; i >= 0; i--) {
    const timestamp = new Date(now - i * interval);
    
    // 模拟周期性波动
    const hourOfDay = timestamp.getHours();
    const baseLoad = hourOfDay >= 9 && hourOfDay <= 18 ? 0.7 : 0.3;
    
    data.push({
      timestamp: formatTime(timestamp),
      cpuUsage: Math.max(0, Math.min(100, baseLoad * 100 + (Math.random() - 0.5) * 30)),
      memoryUsage: Math.max(0, Math.min(100, baseLoad * 100 + (Math.random() - 0.5) * 20)),
      diskUsage: 45 + (Math.random() - 0.5) * 5,
      networkIn: Math.max(0, baseLoad * 1000 + (Math.random() - 0.5) * 500),
      networkOut: Math.max(0, baseLoad * 800 + (Math.random() - 0.5) * 400),
      taskCount: Math.floor(Math.max(0, baseLoad * 20 + (Math.random() - 0.5) * 10)),
    });
  }
  
  return data;
}

function formatTime(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
