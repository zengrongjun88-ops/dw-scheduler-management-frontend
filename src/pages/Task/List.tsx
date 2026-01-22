import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Space,
  Input,
  Tag,
  Modal,
  message,
  Tooltip,
  Popconfirm,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  PlayCircleOutlined,
  EyeOutlined,
  PoweroffOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { taskApi } from '@/api/task';
import type { Task } from '@/types/task';
import { TaskStatus, InstanceStatus } from '@/types/task';

const { Search } = Input;

/**
 * 任务列表页面
 */
const TaskList: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [total, setTotal] = useState(0);
  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchName, setSearchName] = useState('');

  // 加载任务列表
  const loadTasks = async () => {
    setLoading(true);
    try {
      const result = await taskApi.getList({
        pageNum,
        pageSize,
        name: searchName,
      });
      setTasks(result.list);
      setTotal(result.total);
    } catch (error) {
      console.error('Failed to load tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [pageNum, pageSize, searchName]);

  // 执行任务
  const handleExecute = async (id: number) => {
    try {
      await taskApi.execute(id);
      message.success('任务已开始执行');
      loadTasks();
    } catch (error) {
      // 错误已在拦截器中处理
    }
  };

  // 启用/禁用任务
  const handleToggleStatus = async (id: number, enabled: boolean) => {
    try {
      await taskApi.toggleStatus(id, enabled);
      const statusText = enabled ? '启用' : '禁用';
      message.success('任务已' + statusText);
      loadTasks();
    } catch (error) {
      // 错误已在拦截器中处理
    }
  };

  // 删除任务
  const handleDelete = async (id: number) => {
    try {
      await taskApi.delete(id);
      message.success('任务已删除');
      loadTasks();
    } catch (error) {
      // 错误已在拦截器中处理
    }
  };

  // 表格列定义
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 80,
    },
    {
      title: '任务名称',
      dataIndex: 'name',
      width: 200,
    },
    {
      title: '类型',
      dataIndex: 'type',
      width: 100,
      render: (type: string) => <Tag color="blue">{type}</Tag>,
    },
    {
      title: '调度类型',
      dataIndex: 'scheduleType',
      width: 120,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (status: TaskStatus) => (
        <Tag color={status === TaskStatus.ENABLED ? 'success' : 'default'}>
          {status === TaskStatus.ENABLED ? '启用' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '最后执行状态',
      dataIndex: 'lastInstanceStatus',
      width: 120,
      render: (status?: InstanceStatus) => {
        if (!status) return '-';
        const colors = {
          PENDING: 'default',
          RUNNING: 'processing',
          SUCCESS: 'success',
          FAILED: 'error',
          TERMINATED: 'warning',
        };
        return <Tag color={colors[status]}>{status}</Tag>;
      },
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      width: 180,
    },
    {
      title: '操作',
      key: 'action',
      width: 300,
      fixed: 'right' as const,
      render: (_: any, record: Task) => (
        <Space size="small">
          <Tooltip title="查看">
            <Button
              type="link"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => navigate('/tasks/' + record.id.toString())}
            />
          </Tooltip>
          <Tooltip title="编辑">
            <Button
              type="link"
              size="small"
              icon={<EditOutlined />}
              onClick={() => navigate('/tasks/' + record.id.toString() + '/edit')}
            />
          </Tooltip>
          <Tooltip title="执行">
            <Button
              type="link"
              size="small"
              icon={<PlayCircleOutlined />}
              onClick={() => handleExecute(record.id)}
              disabled={record.status === TaskStatus.DISABLED}
            />
          </Tooltip>
          <Tooltip title={record.status === TaskStatus.ENABLED ? '禁用' : '启用'}>
            <Button
              type="link"
              size="small"
              icon={
                record.status === TaskStatus.ENABLED ? (
                  <PoweroffOutlined />
                ) : (
                  <CheckCircleOutlined />
                )
              }
              onClick={() =>
                handleToggleStatus(
                  record.id,
                  record.status === TaskStatus.DISABLED
                )
              }
            />
          </Tooltip>
          <Popconfirm
            title="确定要删除这个任务吗?"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Tooltip title="删除">
              <Button
                type="link"
                size="small"
                danger
                icon={<DeleteOutlined />}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Search
          placeholder="搜索任务名称"
          onSearch={setSearchName}
          style={{ width: 300 }}
          allowClear
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('/tasks/new')}
        >
          新建任务
        </Button>
      </Space>
      <Table
        loading={loading}
        dataSource={tasks}
        columns={columns}
        rowKey="id"
        scroll={{ x: 1300 }}
        pagination={{
          current: pageNum,
          pageSize,
          total,
          showSizeChanger: true,
          showTotal: (total) => '共 ' + total.toString() + ' 条',
          onChange: (page, size) => {
            setPageNum(page);
            setPageSize(size);
          },
        }}
      />
    </div>
  );
};

export default TaskList;
