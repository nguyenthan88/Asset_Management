import { Layout, Menu } from 'antd';
import React, { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  DesktopOutlined,
  FileOutlined,
  HomeOutlined,
  UndoOutlined,
  UserOutlined,
  UnorderedListOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import DropdownHeader from '../DropdownHeader/DropdownHeader';
import AuthContext from '../../contexts/AuthContext';

const { Header, Sider, Content } = Layout;
function getItem(label, key, icon, hidden) {
  return {
    key,
    icon,
    label,
    hidden,
  };
}

const USER_RESET_PASSWORD = 'user-management/reset-password';

const SideBar = ({ children }) => {
  const { auth, setAuth } = useContext(AuthContext);
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const URL = window.location.pathname;
  const arr =URL.split('/');
  console.log("check arr", arr[1])
  const itemsForStaff = [
    getItem(
      'Home',
      '1',
      <Link to="/">
        <HomeOutlined />
      </Link>,
    ),
  ];

  const itemsForAdmin = [
    getItem(
      'Home',
      'home',
      <Link to="/home">
        <HomeOutlined />
      </Link>,
    ),
    getItem(
      'Manage Asset',
      'asset',
      <Link to="/asset" >
        <DesktopOutlined />
      </Link>,
    ),

    getItem(
      'Manage User',
      'user',
      <Link to="/user">
        <UserOutlined />
      </Link>,
    ),

    getItem(
      'Manage Assignment',
      'assignment',
      <Link to="/assignment">
        <UnorderedListOutlined />
      </Link>,
    ),
    getItem(
      'Request returning',
      'request',
      <Link to="/request">
        {' '}
        <UndoOutlined />
      </Link>,
    ),
    getItem(
      'Report',
      'report',
      <Link to="/report">
        <FileOutlined />
      </Link>,),
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className="logo" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={arr[1]}
          items={auth?.roles?.find((roleasd) => auth?.roles?.includes(roleasd)) === 'Admin' ? itemsForAdmin : itemsForStaff}
        />
      </Sider>
      <Layout className="site-layout">
        <Header
          className="site-layout-background"
          style={{
            paddingLeft: 20,
            color: 'white',
            fontSize: 20,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <div>
            {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
              className: 'trigger',
              onClick: () => setCollapsed(!collapsed),
            })}
          </div>
          <DropdownHeader />
        </Header>

        <Content
          className="site-layout-background"
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            minWidth: 900,
            maxWidth: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'start',
            alignItems: 'center',
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};
export default SideBar;
