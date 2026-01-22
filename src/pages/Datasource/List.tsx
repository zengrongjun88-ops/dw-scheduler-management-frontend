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
  Modal,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ApiOutlined,
} from '@ant-design/icons';
import { datasourceApi } from '@/api/datasource';
import type { Datasource } from '@/types/datasource';
import { DatasourceStatus } from '@/types/datasource';

const { Search } = Input;

/**
 * 数据源列表页面
 */
const DatasourceList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [datasources, setDatasources] = useState<Datasource[]>([]);
  const [total, setTotal] = useState(0);
  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchName, setSearchName] = useState('');

  useEffect(() => {
    loadDatasources();
  }, [pageNum, pageSize, searchName]);

  const loadDatasources = async () => {
    setLoading(true);
    try {
      const result = await datasourceApi.getList({
        pageNum,
        pageSize,
        name: searchName,
      });
      setDatasources(result.list);
      setTotal(result.total);
    } catch (error) {
      console.error('Failed to load datasources:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTestConnection = async (record: Datasource) => {
    try {
      const result = await datasourceApi.testConnection(record);
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
      await datasourceApi.delete(id);
      message.success('数据源已删除');
      loadDatasources();
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
      title: '类型',
      dataIndex: 'type',
      width: 120,
      render: (type: string) => <Tag color="blue">{type}</Tag>,
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
      title: '数据库',
      dataIndex: ['config', 'database'],
      width: 150,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (status: DatasourceStatus) => (
        <Tag color={status === DatasourceStatus.ENABLED ? 'success' : 'default'}>
          {status}
        </Tag>
      ),
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      width: 180,
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right' as const,
      render: (_: any, record: Datasource) => (
        <Space size="small">
          <Tooltip title="测试连接">
            <Button
              type="link"
              size="small"
              icon={<ApiOutlined />}
              onClick={() => handleTestConnection(record)}
            />
          </Tooltip>
          <Tooltip title="编辑">
            <Button type="link" size="small" icon={<EditOutlined />} />
          </Tooltip>
          <Popconfirm
            title="确定要删除这个数据源吗?"
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
          placeholder="搜索数据源名称"
          onSearch={setSearchName}
          style={{ width: 300 }}
          allowClear
        />
        <Button type="primary" icon={<PlusOutlined />}>
          新建数据源
        </Button>
      </Space>
      <Table
        loading={loading}
        dataSource={datasources}
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

export default DatasourceList;
