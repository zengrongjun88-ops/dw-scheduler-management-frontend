import React, { useEffect, useState } from 'react';
import { Card, Descriptions, Tag, Space } from 'antd';
import { useParams } from 'react-router-dom';
import { instanceApi } from '@/api/instance';
import LogViewer from '@/components/LogViewer';
import type { TaskInstance } from '@/types/instance';

/**
 * 实例详情页面
 */
const InstanceDetail: React.FC = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [instance, setInstance] = useState<TaskInstance | null>(null);

  useEffect(() => {
    if (id) {
      loadInstanceDetail(Number(id));
    }
  }, [id]);

  const loadInstanceDetail = async (instanceId: number) => {
    setLoading(true);
    try {
      const result = await instanceApi.getDetail(instanceId);
      setInstance(result);
    } catch (error) {
      console.error('Failed to load instance:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!instance) {
    return <Card loading={loading}>加载中...</Card>;
  }

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Card title="实例详情" loading={loading}>
        <Descriptions column={2} bordered>
          <Descriptions.Item label="实例ID">{instance.id}</Descriptions.Item>
          <Descriptions.Item label="任务ID">{instance.taskId}</Descriptions.Item>
          <Descriptions.Item label="任务名称">
            {instance.taskName}
          </Descriptions.Item>
          <Descriptions.Item label="任务类型">
            <Tag color="blue">{instance.taskType}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="状态">
            <Tag
              color={
                instance.status === 'SUCCESS'
                  ? 'success'
                  : instance.status === 'FAILED'
                  ? 'error'
                  : 'processing'
              }
            >
              {instance.status}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="触发类型">
            {instance.triggerType}
          </Descriptions.Item>
          <Descriptions.Item label="执行服务器">
            {instance.serverName}
          </Descriptions.Item>
          <Descriptions.Item label="开始时间">
            {instance.startTime}
          </Descriptions.Item>
          <Descriptions.Item label="结束时间">
            {instance.endTime || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="执行耗时">
            {instance.duration ? instance.duration + ' ms' : '-'}
          </Descriptions.Item>
          {instance.errorMessage && (
            <Descriptions.Item label="错误信息" span={2}>
              <span style={{ color: 'red' }}>{instance.errorMessage}</span>
            </Descriptions.Item>
          )}
        </Descriptions>
      </Card>

      <LogViewer
        instanceId={Number(id)}
        onLoadLogs={instanceApi.getLogs}
        autoRefresh={instance.status === 'RUNNING'}
      />
    </Space>
  );
};

export default InstanceDetail;
