import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../constants/index';

import { Card, Button, DatePicker, Form, Input, Radio, Cascader, Divider, Modal } from 'antd';
import { NavLink, useNavigate } from 'react-router-dom';

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
const { TextArea } = Input;
const CreateAssetPage = ({ title }) => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [form1] = Form.useForm();

  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [buttonModalDisabled, setButtonModalDisabled] = useState(true);
  const [filter, setFilter] = useState([]);
  const [categories, setCategory] = useState([]);
  const [categoryName, setCategoryName] = useState([]);
  const [categoryCode, setCategoryCode] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const options = categories.map((category) => ({
    value: category.id,
    label: category.categoryName,
  }));

  const handlerChangeDataDate = (DateTimeAntd) => {
    let year = DateTimeAntd.$y;
    let month = '' + (DateTimeAntd.$M + 1);
    let day = '' + DateTimeAntd.$D;

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    const dataDateTime = `${year}-${month}-${day}T00:00:00`;

    return dataDateTime;
  };

  const onFinish = (values) => {
    const newValues = {
      ...values,
      categoryId: filter,
      InstalledDate: handlerChangeDataDate(values.InstalledDate),
      Location: localStorage.getItem('location'),
    };
    setLoading(true);
    axios
      .post(`${BASE_URL}/asset-management`, newValues)
      .then((response) => {
        navigate('/asset');
        Modal.success({
          title: 'Create Asset',
          content: `Create Success`,
        });
      })
      .catch((err) => {
        Modal.error({
          title: 'Create Asset',
          content: `The name already exists`,
        });
      });
  };

  const onFinishFailed = (errorInfo) => {
    const newValues = {
      ...errorInfo.values,
      InstalledDate: handlerChangeDataDate(errorInfo.values.InstalledDate),
    };
  };

  const categoryOnFinishFailed = (errorInfo) => {
    const postData = {
      ...errorInfo.values,
    };
  };
  const getAllCategoryFunc = () => {
    axios
      .get(`${BASE_URL}/category-management/categories`)
      .then((response) => {
        setCategory(response.data.$values);
        console.log(response.data.$values);
      })
      .catch((error) => {
        console.error('error_category', error);
      });
  };
  useEffect(() => {
    getAllCategoryFunc();
  }, []);

  function onCreateCategory(e) {
    e.preventDefault();
    const postData = {
      categoryName,
      categoryCode,
    };
    axios
      .post(`${BASE_URL}/category-management/categories`, postData)
      .then((response) => {
        setCategoryCode(response.data.categoryCode);
        setCategoryName(response.data.categoryName);
        Modal.success({
          title: 'Create Category',
          content: `Create Success`,
        });
        navigate('/asset/create');
        handleCancel();
        getAllCategoryFunc();
      })
      .catch((error) => {
        Modal.error({
          title: 'Create Category',
          content: `The name already exists `,
        });
      });
  }

  const dropdownRender = (menus) => (
    <div>
      {menus}
      <Divider
        style={{
          margin: 0,
        }}
      />
      <div
        style={{
          padding: 8,
        }}
        onClick={showModal}
        okButtonProps={{ disabled: buttonDisabled }}
      >
        <Button>Add Category</Button>
      </div>
    </div>
  );

  return (
    <div style={{ width: '100%', maxWidth: 900 }}>
      <Card>
        <div style={{ display: 'flex' }}>
          <div className="edit">
            <div className="top">
              <p>{title}</p>
            </div>

            <Form
              shouldUpdate
              form={form}
              name="basic"
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
                categoryId: filter,
                assetStatus: 0,
                Location: localStorage.getItem('location'),
              }}
              onFieldsChange={() => setButtonDisabled(form.getFieldsError().some((field) => field.errors.length > 0))}
            >
              <Form.Item
                label="Name"
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
                <Input allowClear placeholder="Please input Asset Name" maxLength={20} />
              </Form.Item>

              <Form.Item
                label="Category"
                name="categoryId"
                rules={[
                  {
                    required: true,
                    message: 'Please select Category',
                  },
                ]}
              >
                <Cascader
                  onChange={(data) => {
                    setFilter(data[0]);
                  }}
                  options={options}
                  dropdownRender={dropdownRender}
                  placeholder="Please select Category"
                />
              </Form.Item>

              <Form.Item
                label="Installed  Date"
                name="InstalledDate"
                input={false}
                rules={[
                  { required: true, message: 'Please enter your Installed Date' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('InstalledDate') < Date.now()) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Please select a different date not large than today'));
                    },
                  }),
                ]}
              >
                <DatePicker />
              </Form.Item>

              <Form.Item
                label="Specification"
                name="Specification"
                rules={[{ required: true, message: 'Please enter your Specification' }, { min: 2 }]}
              >
                <TextArea rows={4} showCount maxLength={255} allowClear />
              </Form.Item>

              <Form.Item
                label="State"
                name="assetStatus"
                hidden={true}
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Radio.Group disabled name="radiogroup">
                  <Radio value={0}> Available </Radio>
                  <Radio value={1}> Not Available </Radio>
                </Radio.Group>
              </Form.Item>

              <Form.Item
                shouldUpdate
                wrapperCol={{
                  offset: 8,
                  span: 16,
                }}
              >
                <LinkCustom to="/asset">Cancel</LinkCustom>
                <Button
                  loading={loading}
                  style={{
                    marginLeft: 10,
                  }}
                  type="primary"
                  htmlType="submit"
                  disabled={buttonDisabled}
                >
                  Save
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </Card>
      <>
        <Modal
          title="Create Category"
          open={isModalOpen}
          onOk={onCreateCategory}
          onCancel={handleCancel}
          okButton={{ disabled: buttonModalDisabled }}
        >
          <Form
            form={form1}
            layout="vertical"
            name="form_in_modal"
            onFinishFailed={categoryOnFinishFailed}
            onFieldsChange={() => setButtonModalDisabled(form.getFieldsError().some((field) => field.errors.length > 0))}
          >
            <Form.Item
              shouldUpdate
              name="categoryName"
              label="Category Name"
              rules={[
                {
                  required: true,
                  message: 'Please input the Category Name',
                },
                { min: 5 },
                { max: 50 },
              ]}
            >
              <Input value={categoryName} onChange={(e) => setCategoryName(e.target.value)} />
            </Form.Item>
          </Form>
        </Modal>
      </>
    </div>
  );
};
export default CreateAssetPage;
