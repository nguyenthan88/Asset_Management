import React, { useEffect, useState } from 'react';
import { Card, Button, DatePicker, Form, Input, Radio, Select, Skeleton, Modal } from 'antd';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../constants/index';
import dayjs from 'dayjs';
import Swal from 'sweetalert2';
import styled from 'styled-components';
import '../../styles/EditUser.scss';

const EditUserPage = ({ title }) => {
  const param = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUserByUserName = async () => {
      const res = await axios.get(`${BASE_URL}/user-management/${param.slug}`);
      setUser(res.data);
    };
    getUserByUserName();
  }, []);

  const handlerChangeDataDate = (DateTimeAntd) => {
    let year = DateTimeAntd.$y;
    let month = '' + (DateTimeAntd.$M + 1);
    let day = '' + DateTimeAntd.$D;

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    const dataDateTime = `${year}-${month}-${day}T00:00:00`;

    return dataDateTime;
  };

  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    console.log(values);
    setLoading(true);
    const newValues = {
      ...values,
      DateOfBirth: handlerChangeDataDate(values.DateOfBirth),
      JoinedDate: handlerChangeDataDate(values.JoinedDate),
    };
    console.log(newValues);
    await axios
      .put(`${BASE_URL}/user-management`, newValues)
      .then((response) => {
        setLoading(false);
        navigate('/user');
        console.log('Success:', response);
      })
      .catch((err) => {
        setLoading(false);
        Modal.error({
          title: 'Edit failed',
        });
      });
  };
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

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

  const CheckDate = () => {
    const d = new Date();
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    let year = d.getFullYear();
    let yearBigger18 = d.getFullYear() - 18;

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    const CheckDateNow = [year, month, day].join('-');
    const CheckDateBiggerAge18 = [yearBigger18, month, day].join('-');
    //console.log(CheckDateNow, CheckDateBiggerAge18);
    return { CheckDateNow, CheckDateBiggerAge18 };
  };

  return (
    <Card style={{ width: '100%', maxWidth: 900 }}>
      <div style={{ display: 'flex' }}>
        <div className="edit">
          <div className="top">
            <p>{title}</p>
          </div>

          {!user && (
            <Form
              wrapperCol={{
                offset: 8,
                span: 16,
              }}
            >
              <Form.Item>
                <Skeleton
                  paragraph={{
                    rows: 4,
                  }}
                />
              </Form.Item>
            </Form>
          )}
          {user && (
            <Form
              name="basic"
              labelCol={{
                span: 8,
              }}
              wrapperCol={{
                span: 16,
              }}
              initialValues={{
                UserName: user.userName,
                FirstName: user.firstName,
                LastName: user.lastName,
                DateOfBirth: dayjs(user.dateOfBirth, 'YYYY/MM/DD'),
                Gender: user.gender,
                JoinedDate: dayjs(user.joinedDate, 'YYYY/MM/DD'),
                UserRole: user.type,
              }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
            >
              <Form.Item label="User Name" name="UserName">
                <Input disabled={true} />
              </Form.Item>
              <Form.Item label="First Name" name="FirstName">
                <Input disabled={true} />
              </Form.Item>

              <Form.Item label="Last Name" name="LastName">
                <Input disabled={true} />
              </Form.Item>

              <Form.Item
                label="Date of Birth"
                name="DateOfBirth"
                rules={[{ required: true, message: 'Please enter your joined date' }]}
              >
                <DatePicker disabledDate={(d) => d.isAfter(CheckDate().CheckDateBiggerAge18)} />
              </Form.Item>

              <Form.Item label="Gender" name="Gender" rules={[{ required: true, message: 'Please enter your gender' }]}>
                <Radio.Group>
                  <Radio value={0}> Male </Radio>
                  <Radio value={1}> Female </Radio>
                </Radio.Group>
              </Form.Item>

              <Form.Item
                label="Joined Date"
                name="JoinedDate"
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
                      if (!value || (getFieldValue('JoinedDate').day() !== 0 && getFieldValue('JoinedDate').day() !== 6)) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Joined date is Saturday or Sunday. Please select a different date'));
                    },
                  }),
                ]}
              >
                <DatePicker disabledDate={(d) => d.isAfter(CheckDate().CheckDateNow)} />
              </Form.Item>

              <Form.Item label="Type" name="UserRole" rules={[{ required: true, message: 'Please enter your type' }]}>
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
                  style={{
                    marginLeft: 10,
                  }}
                  type="primary"
                  htmlType="submit"
                >
                  Submit
                </Button>
              </Form.Item>
            </Form>
          )}
        </div>
      </div>
    </Card>
  );
};
export default EditUserPage;
