import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  DesktopOutlined,
  FileOutlined,
  HomeOutlined,
  UndoOutlined,
  UserOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import { Input, Layout, Menu } from 'antd';
import { Button, Modal } from 'antd';
import AuthContext from '../../contexts/AuthContext';
import { changePassword } from '../../axiosAPIs';
import UserResetPassword from '../Modal/UserResetPassword';
import FirstResetPassword from '../Modal/FirstResetPassword';
const { Sider } = Layout;
function getItem(label, key, icon, children, hidden) {
  return {
    key,
    icon,
    children,
    label,
    hidden,
  };
}

const USER_RESET_PASSWORD = 'Users/reset-password';

const ResponsiveAppBar = () => {
  const navigate = useNavigate();
  const { auth, setAuth } = useContext(AuthContext);

  const [openResetModal, setOpenResetModal] = useState(false);
  const [openFirstResetModal, setOpenFirstResetModal] = useState(false);

  const onCreate = async (values) => {
    console.log('Received values of form: ', values);
    const response = await changePassword(USER_RESET_PASSWORD, values);

    setOpenResetModal(false);
  };

  console.log("check login", localStorage.getItem("isFirstTime"));
  let check = localStorage.getItem("isFirstTime");

  useEffect(() => {
    if (check === "true") {
      setOpenFirstResetModal(true)
    }

  }, [])

  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState('Do you want to log out');
  const showModal = () => {
    setOpen(true);
  };
  const handleOk = () => {
    setModalText('Do you want to log out ?');
    setConfirmLoading(true);
    onLogOut();
  };

  const onLogOut = () => {
    sessionStorage.clear();
    localStorage.clear();
    setAuth(null);
    navigate('/');
  };
  const handleCancel = () => {
    setOpen(false);
  };

  const [collapsed, setCollapsed] = useState(false);
  const items = [
    getItem(
      'Home',
      '1',
      <Link to="/">
        <HomeOutlined />
      </Link>,
    ),
    getItem(
      'Asset',
      '2',
      <DesktopOutlined />,
      [],
      auth?.roles?.find((roleasd) => auth?.roles?.includes(roleasd)) === 'Admin' ? false : true,
    ),

    getItem(
      'User',
      'sub1',
      <Link to="/user">
        <UserOutlined />
      </Link>,
      [
        getItem('User Manager', '31', <Link style={{ marginLeft: -24 }} to="/user"></Link>),
        getItem(<div onClick={() => {
          setOpenResetModal(true);
        }}>ChangePassword</div>, '32'),
        getItem(<div onClick={showModal}>Logout</div>, '4'),
      ],
    ),
    getItem(
      'Assigment',
      '10',
      <UnorderedListOutlined />,
      [],
      auth?.roles?.find((roleasd) => auth?.roles?.includes(roleasd)) === 'Admin' ? false : true,
    ),
    getItem(
      'Request returning',
      'sub2',
      <UndoOutlined />,
      [],
      auth?.roles?.find((roleasd) => auth?.roles?.includes(roleasd)) === 'Admin' ? false : true,
    ),
    getItem(
      'Report',
      '9',
      <FileOutlined />,
      [],
      auth?.roles?.find((roleasd) => auth?.roles?.includes(roleasd)) === 'Admin' ? false : true,
    ),
  ];
  return (
    <Layout
      style={{
        minHeight: '100vh',
      }}
    >
      <Modal title="Are You Sure" open={open} onOk={handleOk} confirmLoading={confirmLoading} onCancel={handleCancel}>
        <p>{modalText}</p>
      </Modal>

      <UserResetPassword
        open={openResetModal}
        onCreate={onCreate}
        onCancel={() => {
          setOpenResetModal(false);
        }}
      />

      <FirstResetPassword
        open={openFirstResetModal}
        onCreate={onCreate}
        onCancel={() => {
          setOpenFirstResetModal(false);
        }}
      />

      <Sider
        style={{ backgroundColor: '#778899', minHeight: '100vh' }}
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="logo" />
        <Menu
          style={{ backgroundColor: '#778899', color: 'white', fontSize: '16px' }}
          defaultSelectedKeys={['1']}
          mode="inline"
          items={items}
        />
      </Sider>
    </Layout>
  );
};
export default ResponsiveAppBar;
