import React, { useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../constants/index';

import { Card, Button, DatePicker, Form, Input, Radio, Select, Modal } from 'antd';
import { NavLink, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import Swal from 'sweetalert2';

import styled from 'styled-components';
import '../../styles/EditUser.scss';

const LinkCustom = styled(NavLink)`
  background-color: #ffffff;
  border: 1px solid #d9d9d9;
  box-shadow: 0 2px 0 rgb(0 0 0 / 2%);
  font-size: 14px;
  height: 32px;
  padding: 4px 15px;
  border-radius: 6px;
  outline: none;
  position: relative;
  display: inline-block;
  font-weight: 400;
  white-space: nowrap;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  user-select: none;
  touch-action: manipulation;
  line-height: 1.5714285714285714;
  color: rgba(0, 0, 0, 0.6);
  &:hover {
    color: #4096ff;
    border-color: #4096ff;
  }
`;

const CreateUserPage = ({ title }) => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);

  const handlerChangeDataDate = (DateTimeAntd) => {
    let year = DateTimeAntd.$y;
    let month = '' + (DateTimeAntd.$M + 1);
    let day = '' + DateTimeAntd.$D;

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    const dataDateTime = `${year}-${month}-${day}T00:00:00`;

    return dataDateTime;
  };

  const onFinish = async (values) => {
    const newValues = {
      ...values,
      Location: localStorage.getItem('location'),
      DateOfBirth: handlerChangeDataDate(values.DateOfBirth),
      JoinedDate: handlerChangeDataDate(values.JoinedDate),
    };

    await axios
      .post(`${BASE_URL}/user-management/register`, newValues)
      .then((response) => {
        console.log('check response', response);
        setLoading(false);
        navigate('/user');
        Modal.info({
          title: 'This is information about the user you just created',
          content: (
            <div>
              <p>{`User Name: ${response.data.userName}`}</p>
              <p>{`Password: ${response.data.password}`}</p>
            </div>
          ),
          onOk() {},
          onshowModal() {},
        });
      })
      .catch((err) => {
        setLoading(false);
        Modal.error({
          title: 'Create failed',
        });
      });
  };

  const onFinishFailed = (errorInfo) => {
    const newValues = {
      ...errorInfo.values,
      DateOfBirth: handlerChangeDataDate(errorInfo.values.DateOfBirth),
      JoinedDate: handlerChangeDataDate(errorInfo.values.JoinedDate),
    };
    console.log('Failed:', newValues);
    console.log('Failed:', errorInfo);
  };

  return (
    <Card style={{ width: '100%', maxWidth: 900 }}>
      <div style={{ display: 'flex' }}>
        <div className="edit">
          <div className="top">
            <p>{title}</p>
          </div>
          <Form
            name="basic"
            form={form}
            onFieldsChange={() => setButtonDisabled(form.getFieldsError().some((field) => field.errors.length > 0))}
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 16,
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            initialValues={{
              Gender: 1,
              UserRole: 'Admin',
              TypeStaff: 'Admin',
              Location: localStorage.getItem('location'),
            }}
          >
            <Form.Item
              label="First Name"
              name="FirstName"
              rules={[
                {
                  required: true,
                  message: 'Please enter your First Name',
                },

                {
                  min: 2,
                },
                {
                  max: 25,
                },
              ]}
            >
              <Input placeholder="than" />
            </Form.Item>

            <Form.Item
              label="Last Name"
              name="LastName"
              rules={[
                {
                  required: true,
                  message: 'Please enter your Last Name',
                },
                { whitespace: true },
                { min: 1 },
                {
                  max: 25,
                },
              ]}
            >
              <Input placeholder="nguyen van" />
            </Form.Item>

            <Form.Item
              label="Date of Birth"
              name="DateOfBirth"
              input={false}
              rules={[
                { required: true, message: 'Please enter your date of birth' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('DateOfBirth') < dayjs().endOf('day').subtract(18, 'year')) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('User is under 18. Please select a different date'));
                  },
                }),
              ]}
            >
              <DatePicker />
            </Form.Item>

            <Form.Item
              label="Joined Date"
              name="JoinedDate"
              input={false}
              rules={[
                { required: true, message: 'Please enter your joined date' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('JoinedDate') > getFieldValue('DateOfBirth')) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error('Joined date is not later than Date of Birth. Please select a different date'),
                    );
                  },
                }),
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('JoinedDate') < Date.now()) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Please select a different date not large than date now'));
                  },
                }),
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || (getFieldValue('JoinedDate').day() !== 0 && getFieldValue('JoinedDate').day() !== 6)) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Joined date is Saturday or Sunday. Please select a different date'));
                  },
                }),
              ]}
            >
              <DatePicker />
            </Form.Item>

            <Form.Item label="Gender" name="Gender" shouldUpdate={false}>
              <Radio.Group name="radiogroup" defaultValue={1}>
                <Radio value={0}> Male </Radio>
                <Radio value={1}> Female </Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item label="Type" name="UserRole" shouldUpdate={false}>
              <Select>
                <Select.Option value="Admin">Admin</Select.Option>
                <Select.Option value="Staff">Staff</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              wrapperCol={{
                offset: 8,
                span: 16,
              }}
            >
              <LinkCustom to="/user">Cancel</LinkCustom>
              <Button
                loading={loading}
                type="primary"
                htmlType="submit"
                disabled={buttonDisabled}
                style={{
                  marginLeft: 10,
                }}
              >
                Save
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </Card>
  );
};
export default CreateUserPage;
