import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Form, Input, DatePicker, Modal, Table, Button } from 'antd';
import SearchIcon from '@mui/icons-material/Search';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import { useNavigate } from 'react-router-dom';
import { SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

import './button.scss';
import { BASE_URL } from '../../constants/index';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  height: '40px',
  margin: '10px',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: 'white',
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.black, 0.25),
  },
  marginLeft: -10,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    display: 'flex',
    width: '200px',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '500px',
    [theme.breakpoints.up('sm')]: {
      width: '444px',
      '&:focus': {
        width: '444px',
      },
    },
  },
}));

const { RangePicker } = DatePicker;
const { TextArea } = Input;

const EditAssignment = () => {
  const url = window.location.pathname;
  const lastSegment = url.split('/').pop();
  const [form] = Form.useForm();
  const [dataUsers, setDataUsers] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ids, setIds] = useState([]);
  const navigate = useNavigate();
  const [dataAssets, setDataAssets] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedUserRows, setSelectedUserRows] = useState([]);
  const [searchAssetResults, setSearchAssetResults] = useState([]);
  const [isModalOpens, setIsModalOpens] = useState(false);
  const [isButtonDisables, setButtonDisables] = useState(true);
  const [isButtonUserDisables, setButtonUserDisables] = useState(true);
  const [notes, setNotes] = useState('null');
  const [loading, setLoading] = useState(false);
  const [assets, setAsset] = useState({
    assetId: '',
    assetCode: '',
    assetName: '',
    assignedTo: '',
    assignedBy: '',
    assignedToId: '',
    assignedById: '',
    note: '',
    assignedDate: '',
  });

  const showModals = () => {
    setIsModalOpens(true);
  };

  const onFillUser = (value) => {
    form.setFieldsValue({
      userInfor: value,
    });
  };

  const onFillAsset = (values) => {
    form.setFieldsValue({
      assetInfor: values,
    });
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = (value) => {
    setIsModalOpen(false);
    setIsModalOpens(false);
    onFillUser(selectedUserRows[0].fullName);
    onFillAsset(selectedRows[0].assetName);
  };

  const handleOkModalAsset = (value) => {
    setIsModalOpens(false);
    onFillAsset(selectedRows[0].assetName);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setIsModalOpens(false);
  };

  function isEmptyOrSpaces(str) {
    return str === null || str.match(/^ *$/) !== null;
  }

  function getPreviousDay(date = new Date()) {
    const previous = new Date(date.getTime());
    previous.setDate(date.getDate() - 1);
    return previous;
  }

  const countDown = () => {
    let secondsToGo = 3;
    const modal = Modal.success({
      title: 'Edit success',
      content: `This modal will be destroyed after ${secondsToGo} second.`,
    });
    const timer = setInterval(() => {
      secondsToGo -= 1;
      modal.update({
        content: `This modal will be destroyed after ${secondsToGo} second.`,
      });
    }, 1000);
    setTimeout(() => {
      clearInterval(timer);
      modal.destroy();
    }, secondsToGo * 1000);
    navigate(`/assignment`);
  };

  const handleSearchAssetChange = (e) => {
    if (isEmptyOrSpaces(e.target.value)) {
      return setSearchAssetResults(dataAssets);
    } else {
      const resultsArray = dataAssets.filter(
        (dataAssets) =>
          dataAssets.assetCode.trim().toLowerCase().includes(e.target.value.toLowerCase().trim()) ||
          dataAssets.assetName.trim().toLowerCase().includes(e.target.value.toLowerCase().trim()),
      );
      setSearchAssetResults(resultsArray);
    }
  };

  useEffect(() => {
    axios
      .get(`${BASE_URL}/asset-management/assets-status?location=${localStorage.getItem('location')}`)
      .then((data) => {
        setDataAssets(data.data.$values);
        setSearchAssetResults(data.data.$values);
      })
      .catch((error) => console.log(error));
  }, []);

  const handleSubmit = (e) => e.preventDefault();

  const handleSearchChange = (e) => {
    if (isEmptyOrSpaces(e.target.value)) {
      return setSearchResults(dataUsers);
    } else {
      const resultsArray = dataUsers.filter(
        (dataUsers) =>
          dataUsers.staffCode.trim().toLowerCase().includes(e.target.value.toLowerCase().trim()) ||
          dataUsers.fullName.trim().toLowerCase().includes(e.target.value.toLowerCase().trim()),
      );
      setSearchResults(resultsArray);
    }
  };

  const handleChangeNote = (Input) => {
    setNotes(Input.target.value);
  };

  const handleBackToList = () => {
    countDown();
  };

  const handleBackList = () => {
    navigate(`/assignment`);
  };

  const handleOnSubmit = (evt) => {
    const userId = localStorage.getItem('userId');
    setLoading(true);
    axios({
      method: 'put',
      url: `${BASE_URL}/assignment-management/assignments?id=${lastSegment}`,
      data: {
        assetId: assets.assetId,
        assetCode: assets.assetCode,
        assetName: assets.assetName,
        assignedTo: assets.assignedToId,
        assignedBy: userId,
        assignedDate: evt.assignedDate,
        note: evt.note,
      },
    })
      .then((response) => {
        console.log(response);
        handleBackToList();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getAssignmentById = async () => {
    const res = await axios.get(`${BASE_URL}/assignment-management/assignments-id/${lastSegment}`);
    setAsset(res.data);
    form.setFieldsValue({
      userInfor: res.data.assignedTo,
      assetInfor: res.data.assetName,
      assignedDate: dayjs(res.data.assignedDate),
      note: res.data.note,
    });
  };

  useEffect(() => {
    getAssignmentById();
  }, []);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/user-management?userName=${localStorage.getItem('userName')}`)
      .then((data) => {
        setDataUsers(data.data.$values);
        setSearchResults(data.data.$values);
        setIds(data.data.$id);
      })
      .catch((error) => console.log(error));
  }, []);

  const comlunms = [
    {
      title: 'Asset Code',
      dataIndex: 'assetCode',
      key: 'assetCode',
      sorter: (a, b) => a.assetCode.localeCompare(b.assetCode),
      defaultSortOrder: 'ascend',
    },
    {
      title: 'Asset Name',
      dataIndex: 'assetName',
      key: 'assetName',
      sorter: (a, b) => a.assetName.localeCompare(b.assetName),
    },
    {
      title: 'Category',
      dataIndex: 'categoryName',
      key: 'categoryName',
      sorter: (a, b) => a.categoryName.localeCompare(b.categoryName),
    },
  ];

  const data = [
    {
      title: 'Staff Code',
      dataIndex: 'staffCode',
      key: 'staffCode',
      sorter: (a, b) => a.staffCode.localeCompare(b.staffCode),
      defaultSortOrder: 'ascend',
    },
    {
      title: 'Full Name',
      dataIndex: 'fullName',
      key: 'fullName',
      sorter: (a, b) => a.fullName.localeCompare(b.fullName),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      sorter: (a, b) => a.type.localeCompare(b.type),
    },
  ];

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedUserRows: ', selectedRows);
      setSelectedUserRows(selectedRows);
      setAsset({
        ...assets,
        assignedToId: selectedRows[0].userId,
      });
      setButtonUserDisables(false);
    },
  };
  const rowSelections = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedAssetRows: ', selectedRows);
      setSelectedRows(selectedRows);
      setAsset({
        ...assets,
        assetId: selectedRows[0].assetId,
        assetName: selectedRows[0].assetName,
        assetCode: selectedRows[0].assetCode,
      });
      setButtonDisables(false);
    },
  };

  return (
    <div style={{ width: 600, marginLeft: -700 }}>
      <div
        style={{
          backgroundColor: '#001529',
          display: 'inline-block',
          marginLeft: 350,
          marginBottom: 50,
          paddingTop: 10,
          paddingBottom: 10,
          paddingLeft: 50,
          paddingRight: 40,
          span: 10,
          color: '#fff',
          borderRadius: '6px',
        }}
      >
        Edit assignment
      </div>
      <div
        style={{
          span: 10,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '10px',
          marginTop: '25px',
          float: 'left',
        }}
      ></div>

      <Form
        onFinish={handleOnSubmit}
        form={form}
        labelCol={{
          span: 12,
        }}
        wrapperCol={{
          span: 36,
        }}
        layout="horizontal"
      >
        <Form.Item
          label="User"
          name="userInfor"
          rules={[
            {
              required: true,
              message: 'Please choose your User',
            },
          ]}
        >
          <Input suffix={<SearchOutlined onClick={showModal} />} disabled={true} />
        </Form.Item>
        <Form.Item
          label="Asset"
          name="assetInfor"
          rules={[
            {
              required: true,
              message: 'Please choose your User',
            },
          ]}
        >
          <Input suffix={<SearchOutlined onClick={showModals} />} disabled={true} />
        </Form.Item>

        <Form.Item
          label="Assigned Date"
          name="assignedDate"
          rules={[
            { required: true, message: 'Please enter your Assigned Date' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('assignedDate') > getPreviousDay()) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Please select only the current or future date'));
              },
            }),
          ]}
        >
          <DatePicker style={{ marginLeft: 10 }} />
        </Form.Item>
        <Form.Item label="Note" name="note">
          <TextArea rows={4} onChange={handleChangeNote} />
        </Form.Item>
        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Button type="primary" htmlType="submit" style={{ marginLeft: 100 }} loading={loading}>
            Save
          </Button>

          <Button style={{ marginLeft: 30 }} type="primary" danger onClick={() => handleBackList()}>
            Cancel
          </Button>
        </Form.Item>
      </Form>

      <Modal
        title="Asset list"
        open={isModalOpens}
        onOk={handleOkModalAsset}
        onCancel={handleCancel}
        okText="Save"
        okButtonProps={{ disabled: isButtonDisables }}
        closable={false}
      >
        <Search style={{ float: 'right' }}>
          <SearchIconWrapper>
            <SearchIcon onSubmit={handleSubmit} />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search..."
            inputProps={{ 'aria-label': 'search' }}
            onChange={handleSearchAssetChange}
          />
        </Search>
        <Table
          rowKey="$id"
          rowSelection={{
            type: 'radio',
            ...rowSelections,
          }}
          style={{ width: '100%' }}
          columns={comlunms}
          dataSource={searchAssetResults}
          pagination={{ defaultPageSize: 10, showSizeChanger: true, pageSizeOptions: ['10'] }}
        />
      </Modal>
      <Modal
        title="User list"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Save"
        closable={false}
        okButtonProps={{ disabled: isButtonUserDisables }}
      >
        <Search style={{ float: 'right' }}>
          <SearchIconWrapper>
            <SearchIcon onSubmit={handleSubmit} />
          </SearchIconWrapper>
          <StyledInputBase placeholder="Search..." inputProps={{ 'aria-label': 'search' }} onChange={handleSearchChange} />
        </Search>
        <Table
          rowKey="$id"
          rowSelection={{
            type: 'radio',
            ...rowSelection,
          }}
          style={{ width: '100%' }}
          columns={data}
          dataSource={searchResults}
          pagination={{ defaultPageSize: 10, showSizeChanger: true, pageSizeOptions: ['10'] }}
        />
      </Modal>
    </div>
  );
};
export default EditAssignment;
