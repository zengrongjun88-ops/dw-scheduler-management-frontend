import React, { useState } from 'react';
import { Layout, Menu, theme } from 'antd';
import {
  ScheduleOutlined,
  DatabaseOutlined,
  CloudServerOutlined,
  DesktopOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const { Header, Sider, Content } = Layout;

/**
 * 主布局组件
 */
const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // 菜单项
  const menuItems = [
    {
      key: '/tasks',
      icon: <ScheduleOutlined />,
      label: '任务管理',
    },
    {
      key: '/instances',
      icon: <AppstoreOutlined />,
      label: '实例监控',
    },
    {
      key: '/datasources',
      icon: <DatabaseOutlined />,
      label: '数据源管理',
    },
    {
      key: '/servers',
      icon: <CloudServerOutlined />,
      label: '服务器管理',
    },
  ];

  // 获取当前选中的菜单项
  const getSelectedKey = () => {
    const path = location.pathname;
    for (const item of menuItems) {
      if (path.startsWith(item.key)) {
        return item.key;
      }
    }
    return '/tasks';
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        <div
          style={{
            height: 32,
            margin: 16,
            color: '#fff',
            fontSize: 18,
            fontWeight: 'bold',
            textAlign: 'center',
          }}
        >
          {collapsed ? 'TMS' : '任务调度系统'}
        </div>
        <Menu
          theme="dark"
          selectedKeys={[getSelectedKey()]}
          mode="inline"
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <div style={{ padding: '0 24px', fontSize: 20, fontWeight: 'bold' }}>
            任务调度管理系统
          </div>
        </Header>
        <Content style={{ margin: '16px' }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
