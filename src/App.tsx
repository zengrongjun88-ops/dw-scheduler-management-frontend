import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import Layout from './pages/Layout';
import TaskList from './pages/Task/List';
import TaskForm from './pages/Task/Form';
import TaskDetail from './pages/Task/Detail';
import DatasourceList from './pages/Datasource/List';
import DatasourceForm from './pages/Datasource/Form';
import InstanceList from './pages/Instance/List';
import InstanceDetail from './pages/Instance/Detail';
import ServerList from './pages/Server/List';
import ServerDetail from './pages/Server/Detail';
import './App.css';

/**
 * 根组件
 */
const App: React.FC = () => {
  return (
    <ConfigProvider locale={zhCN}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/tasks" replace />} />
            
            {/* 任务管理 */}
            <Route path="tasks" element={<TaskList />} />
            <Route path="tasks/new" element={<TaskForm />} />
            <Route path="tasks/:id" element={<TaskDetail />} />
            <Route path="tasks/:id/edit" element={<TaskForm />} />
            
            {/* 实例监控 */}
            <Route path="instances" element={<InstanceList />} />
            <Route path="instances/:id" element={<InstanceDetail />} />
            
            {/* 数据源管理 */}
            <Route path="datasources" element={<DatasourceList />} />
            <Route path="datasources/new" element={<DatasourceForm />} />
            <Route path="datasources/:id/edit" element={<DatasourceForm />} />
            
            {/* 服务器管理 */}
            <Route path="servers" element={<ServerList />} />
            <Route path="servers/:id" element={<ServerDetail />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
};

export default App;
