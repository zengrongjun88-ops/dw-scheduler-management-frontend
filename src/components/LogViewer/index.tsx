import React, { useEffect, useRef, useState } from 'react';
import { Card, Button, Space, Spin } from 'antd';
import { ReloadOutlined, DownloadOutlined } from '@ant-design/icons';

/**
 * 日志查看器属性
 */
interface LogViewerProps {
  instanceId: number;
  onLoadLogs: (instanceId: number, offset: number, limit: number) => Promise<{
    content: string;
    offset: number;
    hasMore: boolean;
  }>;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

/**
 * 日志查看器组件
 */
const LogViewer: React.FC<LogViewerProps> = ({
  instanceId,
  onLoadLogs,
  autoRefresh = false,
  refreshInterval = 3000,
}) => {
  const [logs, setLogs] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const logContainerRef = useRef<HTMLDivElement>(null);
  const autoScrollRef = useRef(true);

  // 加载日志
  const loadLogs = async (reset = false) => {
    setLoading(true);
    try {
      const result = await onLoadLogs(
        instanceId,
        reset ? 0 : offset,
        1000
      );
      
      if (reset) {
        setLogs(result.content);
        setOffset(result.offset);
      } else {
        setLogs((prev) => prev + result.content);
        setOffset(result.offset);
      }
      
      setHasMore(result.hasMore);
      
      // 自动滚动到底部
      if (autoScrollRef.current && logContainerRef.current) {
        logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
      }
    } catch (error) {
      console.error('Failed to load logs:', error);
    } finally {
      setLoading(false);
    }
  };

  // 初始加载
  useEffect(() => {
    loadLogs(true);
  }, [instanceId]);

  // 自动刷新
  useEffect(() => {
    if (autoRefresh && hasMore) {
      const timer = setInterval(() => {
        loadLogs(false);
      }, refreshInterval);
      return () => clearInterval(timer);
    }
  }, [autoRefresh, hasMore, offset]);

  // 监听滚动,判断是否需要自动滚动
  const handleScroll = () => {
    if (logContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = logContainerRef.current;
      autoScrollRef.current = scrollTop + clientHeight >= scrollHeight - 10;
    }
  };

  // 下载日志
  const downloadLogs = () => {
    const blob = new Blob([logs], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `instance_${instanceId}_logs.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card
      title="执行日志"
      extra={
        <Space>
          <Button
            icon={<ReloadOutlined />}
            onClick={() => loadLogs(true)}
            loading={loading}
          >
            刷新
          </Button>
          <Button
            icon={<DownloadOutlined />}
            onClick={downloadLogs}
            disabled={!logs}
          >
            下载
          </Button>
        </Space>
      }
    >
      <Spin spinning={loading}>
        <div
          ref={logContainerRef}
          onScroll={handleScroll}
          style={{
            height: 500,
            overflow: 'auto',
            backgroundColor: '#1e1e1e',
            color: '#d4d4d4',
            padding: 16,
            fontFamily: 'Consolas, Monaco, monospace',
            fontSize: 12,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-all',
          }}
        >
          {logs || '暂无日志'}
        </div>
      </Spin>
    </Card>
  );
};

export default LogViewer;
