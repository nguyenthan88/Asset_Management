import React, { useEffect, useState } from 'react';
import { Card, Button, DatePicker, Form, Input, Radio, Select, Skeleton, Modal } from 'antd';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../constants/index';
import dayjs from 'dayjs';
import Swal from 'sweetalert2';
import styled from 'styled-components';
import '../../styles/EditUser.scss';
import TextArea from 'antd/es/input/TextArea';

const EditAssetPage = ({ title }) => {
  const param = useParams();
  console.log(param);
  const navigate = useNavigate();

  const [asset, setAsset] = useState(null);

  const getAssetByAssetCode = async () => {
    const res = await axios.get(`${BASE_URL}/asset-management/assets/${param.slug}`);
    console.log(res.data);
    setAsset(res.data);
  };
  useEffect(() => {
    getAssetByAssetCode();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    console.log(values);
    setLoading(true);
    const newValues = {
      ...values,
      installedDate: handlerChangeDataDate(values.installedDate),
    };
    console.log(newValues);
    await axios
      .put(`${BASE_URL}/asset-management/${param.slug}`, newValues)
      .then((response) => {
        setLoading(false);
        navigate('/asset');
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

  return (
    <Card style={{ width: '100%', maxWidth: 900 }}>
      <div style={{ display: 'flex' }}>
        <div className="edit">
          <div className="top">
            <p>{title}</p>
          </div>

          {!asset && (
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
          {asset && (
            <Form
              name="basic"
              labelCol={{
                span: 8,
              }}
              wrapperCol={{
                span: 16,
              }}
              initialValues={{
                assetName: asset.assetName,
                categoryName: asset.categoryName,
                specification: asset.specification,
                installedDate: dayjs(asset.installedDate, 'YYYY/MM/DD'),
                assetStatus: asset.assetStatus,
              }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
            >
              <Form.Item
                label="Asset Name"
                name="assetName"
                rules={[
                  {
                    required: true,
                    message: 'Please enter your Asset Name',
                  },
                  { whitespace: true },
                  {
                    pattern: /^(?=.*[a-z])[A-Za-z\d!-\/:-@\[-`{-~\s*$]{5,20}$/,
                    message: 'Please enter your Asset Name not only special characters',
                  },
                  {
                    min: 5,
                  },
                  { max: 20 },
                ]}
              >
                <Input placeholder="Please enter your Asset Name" maxLength={20} />
              </Form.Item>

              <Form.Item label="Category" name="categoryName">
                <Input disabled />
              </Form.Item>

              <Form.Item
                label="Specification"
                name="specification"
                rules={[
                  { required: true, message: 'Please enter your Specification' },
                  { min: 2 },
                  { whitespace: true },
                  { max: 255 },
                ]}
              >
                <TextArea rows={4} showCount maxLength={255} allowClear />
              </Form.Item>

              <Form.Item
                label="Installed Date"
                name="installedDate"
                rules={[
                  { required: true, message: 'Please enter your installed date' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('installedDate') < dayjs().endOf('day')) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error(`Please don't select day in the future`));
                    },
                  }),
                ]}
              >
                <DatePicker />
              </Form.Item>

              {asset.assetStatus === 1 && (
                <Form.Item label="Asset Status" name="assetStatus">
                  <Radio.Group disabled>
                    <Radio value={0}> Available </Radio>
                    <Radio value={1}> NotAvailable </Radio>
                    <Radio value={3}> Waiting for recycling </Radio>
                    <Radio value={4}> Recycled </Radio>
                  </Radio.Group>
                </Form.Item>
              )}
              {asset.assetStatus !== 1 && (
                <Form.Item label="Asset Status" name="assetStatus">
                  <Radio.Group>
                    <Radio value={0}> Available </Radio>
                    <Radio disabled value={1}> NotAvailable </Radio>
                    <Radio value={3}> Waiting for recycling </Radio>
                    <Radio value={4}> Recycled </Radio>
                  </Radio.Group>
                </Form.Item>
              )}
              <Form.Item
                wrapperCol={{
                  offset: 8,
                  span: 16,
                }}
              >
                <LinkCustom to="/asset">Cancel</LinkCustom>
                <Button
                  loading={loading}
                  style={{
                    marginLeft: 20,
                    paddingRight: 20,
                    paddingLeft: 20,
                  }}
                  type="primary"
                  htmlType="submit"
                >
                  Save
                </Button>
              </Form.Item>
            </Form>
          )}
        </div>
      </div>
    </Card>
  );
};
export default EditAssetPage;
