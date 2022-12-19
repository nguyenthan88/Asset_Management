import React, { useState } from 'react';
import { Form, Input, Modal } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import countDown from './ChangePasswordSuccess';
const UserResetPassword = ({ open, onCreate, onCancel }) => {
  const [form] = Form.useForm();
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const onFill = () => {
    form.setFieldsValue({
      userName: localStorage.getItem('userName'),
    });
  };

  return (
    <Modal
      open={open}
      title="Change Password"
      okText="Save"
      cancelText="Cancel"
      onCancel={onCancel}
      okButtonProps={{ disabled: buttonDisabled }}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            form.resetFields();
            onCreate(values);
            localStorage.removeItem('password');
            localStorage.setItem('password', values.newPassword);
            onCancel();
            countDown();
          })
          .catch((info) => {
            console.log('Validate Failed:', info);
          });
        onFill();
      }}
    >
      <Form
        form={form}
        layout="vertical"
        name="form_in_modal"
        initialValues={{
          modifier: 'public',
        }}
        onFieldsChange={() => setButtonDisabled(form.getFieldsError().some((field) => field.errors.length > 0))}
      >
        <Form.Item
          label="Old Password"
          name="oldPassword"
          rules={[
            {
              required: true,
              message: 'Please input the Old Password',
            },
            {
              max: localStorage.getItem('password').length,
              pattern: localStorage.getItem('password'),
              message: 'Old Password is incorrect',
            },
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          name="newPassword"
          label="New Password"
          rules={[
            {
              required: true,
              message: 'Please input the New Password',
            },
            {
              pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!-\/:-@\[-`{-~])[A-Za-z\d!-\/:-@\[-`{-~]{8,}$/,
              message:
                'Your password must be at least 8 characters long, contain at least one number and have a mixture of uppercase and lowercase letters.',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (getFieldValue('oldPassword') === value) {
                  return Promise.reject(new Error('New password should be different with Old password'));
                }
                return Promise.resolve();
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item name="userName" label="User Name" hidden="true">
          <Input type="textarea" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserResetPassword;
