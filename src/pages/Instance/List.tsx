import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Input, Tag, Select, DatePicker } from 'antd';
import { EyeOutlined, ReloadOutlined, StopOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { instanceApi } from '@/api/instance';
import type { TaskInstance } from '@/types/instance';
import { InstanceStatus } from '@/types/instance';

const { Search } = Input;
const { RangePicker } = DatePicker;

/**
 * 实例列表页面
 */
const InstanceList: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [instances, setInstances] = useState<TaskInstance[]>([]);
  const [total, setTotal] = useState(0);
  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [status, setStatus] = useState<string>();

  useEffect(() => {
    loadInstances();
  }, [pageNum, pageSize, status]);

  const loadInstances = async () => {
    setLoading(true);
    try {
      const result = await instanceApi.getList({
        pageNum,
        pageSize,
        status,
      });
      setInstances(result.list);
      setTotal(result.total);
    } catch (error) {
      console.error('Failed to load instances:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 80,
    },
    {
      title: '任务名称',
      dataIndex: 'taskName',
      width: 200,
    },
    {
      title: '任务类型',
      dataIndex: 'taskType',
      width: 100,
      render: (type: string) => <Tag color="blue">{type}</Tag>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 120,
      render: (status: InstanceStatus) => {
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
      title: '触发类型',
      dataIndex: 'triggerType',
      width: 120,
    },
    {
      title: '执行服务器',
      dataIndex: 'serverName',
      width: 150,
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
      width: 180,
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      width: 180,
    },
    {
      title: '耗时(ms)',
      dataIndex: 'duration',
      width: 120,
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      fixed: 'right' as const,
      render: (_: any, record: TaskInstance) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => navigate('/instances/' + record.id.toString())}
          >
            查看
          </Button>
          {record.status === InstanceStatus.RUNNING && (
            <Button
              type="link"
              size="small"
              danger
              icon={<StopOutlined />}
            >
              终止
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Select
          placeholder="选择状态"
          style={{ width: 150 }}
          allowClear
          onChange={setStatus}
        >
          <Select.Option value={InstanceStatus.PENDING}>待执行</Select.Option>
          <Select.Option value={InstanceStatus.RUNNING}>执行中</Select.Option>
          <Select.Option value={InstanceStatus.SUCCESS}>成功</Select.Option>
          <Select.Option value={InstanceStatus.FAILED}>失败</Select.Option>
          <Select.Option value={InstanceStatus.TERMINATED}>已终止</Select.Option>
        </Select>
        <Button icon={<ReloadOutlined />} onClick={loadInstances}>
          刷新
        </Button>
      </Space>
      <Table
        loading={loading}
        dataSource={instances}
        columns={columns}
        rowKey="id"
        scroll={{ x: 1500 }}
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

export default InstanceList;
