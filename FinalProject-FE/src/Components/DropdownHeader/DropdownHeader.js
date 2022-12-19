import { Avatar, Dropdown, Space } from 'antd';
import { Layout } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from 'antd';
import AuthContext from '../../contexts/AuthContext';
import { changePassword } from '../../axiosAPIs';
import UserResetPassword from '../Modal/UserResetPassword';
import FirstResetPassword from '../Modal/FirstResetPassword';


const USER_RESET_PASSWORD = 'user-management/reset-password';

const DropdownHeader = () => {

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
        console.log('Clicked cancel button');
        setOpen(false);
    };

    const items = [
        {
            label: <div onClick={() => {
                setOpenResetModal(true);
            }}>Change Password</div>,
            key: '0',
        },
        {
            type: 'divider',
        },
        {
            label: <div onClick={showModal}>Logout</div>,
            key: '3',
        },
    ];
    return (

        <>
            <Dropdown
                menu={{
                    items,
                }}
                trigger={['click']}
            >
                <a onClick={(e) => e.preventDefault()}>
                <a>{localStorage.getItem('userName')}</a>
                    <Space>
                        <Avatar src="https://joeschmoe.io/api/v1/random" />
                    </Space>
                </a>
            </Dropdown>
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
        </>
    )
};
export default DropdownHeader;
