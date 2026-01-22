import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Space,
  Input,
  Tag,
  message,
  Tooltip,
  Popconfirm,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ApiOutlined,
} from '@ant-design/icons';
import { serverApi } from '@/api/server';
import type { Server } from '@/types/server';
import { ServerStatus } from '@/types/server';

const { Search } = Input;

/**
 * 服务器列表页面
 */
const ServerList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [servers, setServers] = useState<Server[]>([]);
  const [total, setTotal] = useState(0);
  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchName, setSearchName] = useState('');

  useEffect(() => {
    loadServers();
  }, [pageNum, pageSize, searchName]);

  const loadServers = async () => {
    setLoading(true);
    try {
      const result = await serverApi.getList({
        pageNum,
        pageSize,
        name: searchName,
      });
      setServers(result.list);
      setTotal(result.total);
    } catch (error) {
      console.error('Failed to load servers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTestConnection = async (id: number) => {
    try {
      const result = await serverApi.testConnection(id);
      if (result.success) {
        message.success('连接测试成功');
      } else {
        message.error('连接测试失败: ' + result.message);
      }
    } catch (error) {
      // 错误已在拦截器中处理
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await serverApi.delete(id);
      message.success('服务器已删除');
      loadServers();
    } catch (error) {
      // 错误已在拦截器中处理
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 80,
    },
    {
      title: '名称',
      dataIndex: 'name',
      width: 200,
    },
    {
      title: '主机',
      dataIndex: ['config', 'host'],
      width: 150,
    },
    {
      title: '端口',
      dataIndex: ['config', 'port'],
      width: 100,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (status: ServerStatus) => {
        const colors = {
          ONLINE: 'success',
          OFFLINE: 'error',
          DISABLED: 'default',
        };
        return <Tag color={colors[status]}>{status}</Tag>;
      },
    },
    {
      title: 'CPU',
      dataIndex: 'cpu',
      width: 100,
      render: (cpu?: number) => (cpu ? cpu + ' 核' : '-'),
    },
    {
      title: '内存',
      dataIndex: 'memory',
      width: 100,
      render: (memory?: number) => (memory ? memory + ' GB' : '-'),
    },
    {
      title: '最后心跳',
      dataIndex: 'lastHeartbeatTime',
      width: 180,
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right' as const,
      render: (_: any, record: Server) => (
        <Space size="small">
          <Tooltip title="测试连接">
            <Button
              type="link"
              size="small"
              icon={<ApiOutlined />}
              onClick={() => handleTestConnection(record.id)}
            />
          </Tooltip>
          <Tooltip title="编辑">
            <Button type="link" size="small" icon={<EditOutlined />} />
          </Tooltip>
          <Popconfirm
            title="确定要删除这个服务器吗?"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Tooltip title="删除">
              <Button type="link" size="small" danger icon={<DeleteOutlined />} />
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
          placeholder="搜索服务器名称"
          onSearch={setSearchName}
          style={{ width: 300 }}
          allowClear
        />
        <Button type="primary" icon={<PlusOutlined />}>
          新建服务器
        </Button>
      </Space>
      <Table
        loading={loading}
        dataSource={servers}
        columns={columns}
        rowKey="id"
        scroll={{ x: 1200 }}
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

export default ServerList;
