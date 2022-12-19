import React, { useEffect, useState } from 'react';
import './button.scss';
import { Form, Input, DatePicker, Modal, Table, Button } from 'antd';
import axios from 'axios';
import SearchIcon from '@mui/icons-material/Search';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import dayjs, { Dayjs } from 'dayjs';
import moment from 'moment';
import { SearchOutlined } from '@ant-design/icons';
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
const FormDisabledDemo = () => {
  const [dataUsers, setDataUsers] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ids, setIds] = useState([]);
  const [assignedDate, setAssignedDate] = useState([]);
  const navigate = useNavigate();
  const [dataAssets, setDataAssets] = useState([]);
  const [selectedRows, setSelectedRows] = useState('');
  const [selectedUserRows, setSelectedUserRows] = useState('');
  const [searchAssetResults, setSearchAssetResults] = useState([]);
  const [isModalOpens, setIsModalOpens] = useState(false);
  const [isButtonDisables, setButtonDisables] = useState(true);
  const [isButtonUserDisables, setButtonUserDisables] = useState(true);
  const [notes, setNotes] = useState('');
  const [value, setValue] = useState(dayjs(Date.now()));
  // const [buttonDisabled, setButtonDisabled] = useState(true);
  const isEnable = selectedUserRows != '' && selectedRows != '' && value != '';
  const [assets, setAsset] = useState({
    assetId: '',
    assetCode: '',
    assetName: '',
    assignedTo: '',
    assignedBy: '',
    fullName: '',
  });
  const [form] = Form.useForm();
  const showModals = () => {
    setIsModalOpens(true);
  };
  const LinkCustom = styled(NavLink)`
    background-color: #ffffff;
    margin-left: 30px;
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
  const onFillUser = (value) => {
    form.setFieldsValue({
      userInfor: value,
    });
  };
  const onFillDate = () => {
    form.setFieldsValue({
      assignedDate: value,
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
    let secondsToGo = 2;
    const modal = Modal.success({
      title: 'Create success',
      content: `This modal will be destroyed after ${secondsToGo} second.`,
      onOk: handleBackList(),
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
      .get(
        `https://rookiesb6g5-api.azurewebsites.net/api/asset-management/assets-status?location=${localStorage.getItem(
          'location',
        )}`,
      )
      //.get(`https://localhost:7233/api/asset-management?location=hanoi`)
      .then((data) => {
        setDataAssets(data.data.$values);
        setSearchAssetResults(data.data.$values);
        onFillDate();
        console.log('date neee', value);
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
  const onChangeDate = (date) => {
    console.log('date ne', date);
    setValue(date);
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
    axios({
      method: 'post',
      url: 'https://rookiesb6g5-api.azurewebsites.net/api/assignment-management/assignments',
      //url: 'https://localhost:7233/api/assignment-management/assignments',
      data: {
        assetId: selectedRows[0].assetId,
        assetCode: selectedRows[0].assetCode,
        assetName: selectedRows[0].assetName,
        assignedTo: selectedUserRows[0].userId,
        assignedBy: userId,
        asssignedDate: value,
        note: notes,
        location : localStorage.getItem('location')
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

  useEffect(() => {
    axios
      .get(`https://rookiesb6g5-api.azurewebsites.net/api/user-management?userName=${localStorage.getItem('userName')}`)
      //.get(`https://localhost:7233/api/user-management?userName=phann`)
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
      setButtonUserDisables(false);
    },
  };
  const rowSelections = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedAssetRows: ', selectedRows);
      setSelectedRows(selectedRows);
      setButtonDisables(false);
    },
  };

  return (
    <>
      <div
        style={{
          backgroundColor: '#001529',
          display: 'inline-block',
          paddingTop: 10,
          paddingBottom: 10,
          paddingLeft: 40,
          paddingRight: 40,
          span: 10,
          color: '#fff',
          borderRadius: '6px',
        }}
      >
        Create New Assignment
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
          span: 10,
        }}
        wrapperCol={{
          span: 14,
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
          <DatePicker value={value} onChange={onChangeDate} />
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
          <Button type="primary" htmlType="submit" disabled={!isEnable}>
            Save
          </Button>
          <LinkCustom to="/assignment">Cancel</LinkCustom>
        </Form.Item>
      </Form>

      <Modal
        title="Select Asset "
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
        title="Select User"
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
    </>
  );
};
export default FormDisabledDemo;
