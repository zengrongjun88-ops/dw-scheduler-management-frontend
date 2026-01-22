import React, { useEffect, useState } from 'react';
import {
  Form,
  Input,
  Select,
  Button,
  Card,
  Space,
  InputNumber,
  message,
} from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import CodeEditor from '@/components/CodeEditor';
import { taskApi } from '@/api/task';
import { datasourceApi } from '@/api/datasource';
import { serverApi } from '@/api/server';
import type { Task } from '@/types/task';
import { TaskType, ScheduleType, TaskStatus } from '@/types/task';

const { TextArea } = Input;
const { Option } = Select;

/**
 * 任务表单页面
 */
const TaskForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [datasources, setDatasources] = useState<any[]>([]);
  const [servers, setServers] = useState<any[]>([]);
  const [taskType, setTaskType] = useState<TaskType>(TaskType.SQL);

  // 加载数据源和服务器列表
  useEffect(() => {
    loadDatasources();
    loadServers();
  }, []);

  // 如果是编辑模式,加载任务详情
  useEffect(() => {
    if (id && id !== 'new') {
      loadTaskDetail(Number(id));
    }
  }, [id]);

  const loadDatasources = async () => {
    try {
      const result = await datasourceApi.getAll();
      setDatasources(result);
    } catch (error) {
      console.error('Failed to load datasources:', error);
    }
  };

  const loadServers = async () => {
    try {
      const result = await serverApi.getAll();
      setServers(result);
    } catch (error) {
      console.error('Failed to load servers:', error);
    }
  };

  const loadTaskDetail = async (taskId: number) => {
    setLoading(true);
    try {
      const task = await taskApi.getDetail(taskId);
      form.setFieldsValue(task);
      setTaskType(task.type);
    } catch (error) {
      console.error('Failed to load task:', error);
    } finally {
      setLoading(false);
    }
  };

  // 提交表单
  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      if (id && id !== 'new') {
        await taskApi.update(Number(id), values);
        message.success('任务更新成功');
      } else {
        await taskApi.create(values);
        message.success('任务创建成功');
      }
      navigate('/tasks');
    } catch (error) {
      // 错误已在拦截器中处理
    } finally {
      setLoading(false);
    }
  };

  // 获取编辑器语言
  const getEditorLanguage = (type: TaskType) => {
    switch (type) {
      case TaskType.SQL:
        return 'sql';
      case TaskType.SHELL:
        return 'shell';
      case TaskType.PYTHON:
        return 'python';
      default:
        return 'plaintext';
    }
  };

  return (
    <Card title={id === 'new' ? '新建任务' : '编辑任务'}>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          type: TaskType.SQL,
          scheduleType: ScheduleType.MANUAL,
          status: TaskStatus.ENABLED,
        }}
      >
        <Form.Item
          name="name"
          label="任务名称"
          rules={[{ required: true, message: '请输入任务名称' }]}
        >
          <Input placeholder="请输入任务名称" />
        </Form.Item>

        <Form.Item name="description" label="任务描述">
          <TextArea rows={3} placeholder="请输入任务描述" />
        </Form.Item>

        <Form.Item
          name="type"
          label="任务类型"
          rules={[{ required: true, message: '请选择任务类型' }]}
        >
          <Select onChange={(value) => setTaskType(value as TaskType)}>
            <Option value={TaskType.SQL}>SQL</Option>
            <Option value={TaskType.SHELL}>Shell</Option>
            <Option value={TaskType.PYTHON}>Python</Option>
            <Option value={TaskType.SPARK}>Spark</Option>
            <Option value={TaskType.FLINK}>Flink</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="scheduleType"
          label="调度类型"
          rules={[{ required: true, message: '请选择调度类型' }]}
        >
          <Select>
            <Option value={ScheduleType.MANUAL}>手动执行</Option>
            <Option value={ScheduleType.CRON}>Cron表达式</Option>
            <Option value={ScheduleType.INTERVAL}>固定间隔</Option>
          </Select>
        </Form.Item>

        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) =>
            prevValues.scheduleType !== currentValues.scheduleType
          }
        >
          {({ getFieldValue }) =>
            getFieldValue('scheduleType') === ScheduleType.CRON ? (
              <Form.Item
                name="scheduleConfig"
                label="Cron表达式"
                rules={[{ required: true, message: '请输入Cron表达式' }]}
              >
                <Input placeholder="0 0 * * * ?" />
              </Form.Item>
            ) : getFieldValue('scheduleType') === ScheduleType.INTERVAL ? (
              <Form.Item
                name="scheduleConfig"
                label="执行间隔(秒)"
                rules={[{ required: true, message: '请输入执行间隔' }]}
              >
                <InputNumber min={1} style={{ width: '100%' }} />
              </Form.Item>
            ) : null
          }
        </Form.Item>

        {taskType === TaskType.SQL && (
          <Form.Item
            name="datasourceId"
            label="数据源"
            rules={[{ required: true, message: '请选择数据源' }]}
          >
            <Select placeholder="请选择数据源">
              {datasources.map((ds) => (
                <Option key={ds.id} value={ds.id}>
                  {ds.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        )}

        <Form.Item
          name="serverId"
          label="执行服务器"
          rules={[{ required: true, message: '请选择执行服务器' }]}
        >
          <Select placeholder="请选择执行服务器">
            {servers.map((server) => (
              <Option key={server.id} value={server.id}>
                {server.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="content"
          label="任务内容"
          rules={[{ required: true, message: '请输入任务内容' }]}
        >
          <CodeEditor
            value={form.getFieldValue('content') || ''}
            language={getEditorLanguage(taskType)}
            onChange={(value) => form.setFieldValue('content', value)}
            height={300}
          />
        </Form.Item>

        <Form.Item name="status" label="状态">
          <Select>
            <Option value={TaskStatus.ENABLED}>启用</Option>
            <Option value={TaskStatus.DISABLED}>禁用</Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" loading={loading}>
              提交
            </Button>
            <Button onClick={() => navigate('/tasks')}>取消</Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default TaskForm;
