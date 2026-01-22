import React, { useEffect, useState } from 'react';
import { Card, Descriptions, Tag, Button, Space, Tabs } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { EditOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { taskApi } from '@/api/task';
import type { Task } from '@/types/task';
import CodeEditor from '@/components/CodeEditor';
import DagGraph from '@/components/DagGraph';

/**
 * 任务详情页面
 */
const TaskDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [task, setTask] = useState<Task | null>(null);
  const [dagData, setDagData] = useState<any>(null);

  useEffect(() => {
    if (id) {
      loadTaskDetail(Number(id));
      loadDagData(Number(id));
    }
  }, [id]);

  const loadTaskDetail = async (taskId: number) => {
    setLoading(true);
    try {
      const result = await taskApi.getDetail(taskId);
      setTask(result);
    } catch (error) {
      console.error('Failed to load task:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadDagData = async (taskId: number) => {
    try {
      const result = await taskApi.getDagData(taskId);
      setDagData(result);
    } catch (error) {
      console.error('Failed to load DAG data:', error);
    }
  };

  const handleExecute = async () => {
    if (!id) return;
    try {
      await taskApi.execute(Number(id));
      loadTaskDetail(Number(id));
    } catch (error) {
      // 错误已在拦截器中处理
    }
  };

  if (!task) {
    return <Card loading={loading}>加载中...</Card>;
  }

  const tabItems = [
    {
      key: 'basic',
      label: '基本信息',
      children: (
        <Descriptions column={2} bordered>
          <Descriptions.Item label="任务ID">{task.id}</Descriptions.Item>
          <Descriptions.Item label="任务名称">{task.name}</Descriptions.Item>
          <Descriptions.Item label="任务类型">
            <Tag color="blue">{task.type}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="调度类型">
            {task.scheduleType}
          </Descriptions.Item>
          <Descriptions.Item label="状态">
            <Tag color={task.status === 'ENABLED' ? 'success' : 'default'}>
              {task.status}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="数据源">
            {task.datasourceName || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="执行服务器">
            {task.serverName || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="创建时间">
            {task.createTime}
          </Descriptions.Item>
          <Descriptions.Item label="更新时间" span={2}>
            {task.updateTime}
          </Descriptions.Item>
          <Descriptions.Item label="任务描述" span={2}>
            {task.description || '-'}
          </Descriptions.Item>
        </Descriptions>
      ),
    },
    {
      key: 'content',
      label: '任务内容',
      children: (
        <CodeEditor
          value={task.content}
          language={task.type.toLowerCase()}
          readOnly
          height={400}
        />
      ),
    },
    {
      key: 'dag',
      label: '依赖关系',
      children: dagData ? (
        <DagGraph data={dagData} />
      ) : (
        <div>暂无依赖关系</div>
      ),
    },
  ];

  return (
    <div>
      <Card
        title="任务详情"
        extra={
          <Space>
            <Button
              type="primary"
              icon={<PlayCircleOutlined />}
              onClick={handleExecute}
            >
              执行任务
            </Button>
            <Button
              icon={<EditOutlined />}
              onClick={() => navigate('/tasks/' + id + '/edit')}
            >
              编辑
            </Button>
          </Space>
        }
      >
        <Tabs items={tabItems} />
      </Card>
    </div>
  );
};

export default TaskDetail;
