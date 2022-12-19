import React, { useEffect, useState } from 'react';
import { BASE_URL } from '../../constants/index';
import { message, Modal, Space, Table } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
import SearchIcon from '@mui/icons-material/Search';
import { styled } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import { Button, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { Box } from '@mui/system';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { checkValidUser, deleteData } from '../../axiosAPIs';
import moment from 'moment';
import EditIcon from '@mui/icons-material/Edit';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { USER } from '../../constants';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  height: '38px',
  borderRadius: '6px',
  backgroundColor: 'white',
  border: '1px solid #d9d9d9',
  '&:hover': {
    borderColor: '#4096ff',
  },
  [theme.breakpoints.up('sm')]: {
    display: 'flex',
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
      width: '500px',
      '&:focus': {
        width: '500px',
      },
    },
  },
}));

const onChange = (pagination, filters, sorter, extra) => {
  console.log('params', pagination, filters, sorter, extra);
};

const UserListPage = () => {
  const [dataUsers, setDataUsers] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [filter, setFilter] = useState('');
  const [message1, setMessage] = useState('');

  function isEmptyOrSpaces(str) {
    return str === null || str.match(/^ *$/) !== null;
  }

  const getAllUserFunc = () => {
    axios
      .get(`${BASE_URL}/user-management?userName=${localStorage.getItem('userName')}`)
      .then((data) => {
        setDataUsers(data.data.$values);
        setSearchResults(data.data.$values);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    getAllUserFunc();
  }, []);

  const handleSubmit = (e) => e.preventDefault();
  const handleSearchChange = (e) => {
    if (isEmptyOrSpaces(e.target.value)) {
      return setSearchResults(dataUsers);
    } else {
      const resultsArray = dataUsers.filter(
        (dataUsers) =>
          (dataUsers.userName.trim().toLowerCase().includes(e.target.value.toLowerCase().trim()) ||
            dataUsers.staffCode.trim().toLowerCase().includes(e.target.value.toLowerCase().trim()) ||
            dataUsers.fullName.trim().toLowerCase().includes(e.target.value.toLowerCase().trim())) &&
          dataUsers.type.toLowerCase().includes(filter),
      );
      setMessage(e.value);
      setSearchResults(resultsArray);
    }
  };
  const handleAdminChange = (e) => {
    const resultsArray = dataUsers.filter((dataUsers) => dataUsers.type.includes('Admin'));
    setSearchResults(resultsArray);
    setMessage('');
  };
  const handleStaffChange = (e) => {
    const resultsArray = dataUsers.filter((dataUsers) => dataUsers.type.includes('Staff'));
    setSearchResults(resultsArray);
    setMessage('');
  };
  const handleNoneChange = () => {
    const resultsArray = dataUsers.filter((dataUsers) => dataUsers.type.toLowerCase().includes('a'));
    setSearchResults(resultsArray);
    setMessage('');
  };

  const columns = [
    {
      title: 'Staff Code',
      dataIndex: 'staffCode',
      key: 'staffCode',
      sorter: (a, b) => a.staffCode.localeCompare(b.staffCode),
    },
    {
      title: 'Full Name',
      dataIndex: 'fullName',
      key: 'fullName',
      sorter: (a, b) => a.fullName.localeCompare(b.fullName),
    },
    {
      title: 'User Name',
      dataIndex: 'userName',
      key: 'userName',
      sorter: (a, b) => a.userName.localeCompare(b.userName),
    },
    {
      title: 'Joined Date',
      dataIndex: 'joinedDate',
      key: 'joinedDate',
      render: (_, record) => {
        return (
          <div>
            <p>{moment(record.joinedDate).format('YYYY-MM-DD')}</p>
          </div>
        );
      },
      sorter: (a, b) => a.joinedDate.localeCompare(b.joinedDate),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      sorter: (a, b) => a.type.localeCompare(b.type),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <EditIcon
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(record.userName);
            }}
            style={{ fontSize: 22 }}
          />
          <HighlightOffIcon
            onClick={(e) => {
              e.stopPropagation();
              handleDisableUser(record.userName);
            }}
            color="action"
            style={{ color: 'red', fontSize: 22 }}
          />
        </Space>
      ),
    },
  ];

  const handleInfo = (userInfo) => {
    Modal.info({
      title: 'This is information about the user you choose',
      content: (
        <div>
          <p>{`Staff Code: ${userInfo.staffCode}`}</p>
          <p>{`Full Name: ${userInfo.fullName}`}</p>
          <p>{`User Name: ${userInfo.userName}`}</p>
          <p>{`Date of birth: ${moment(userInfo.dateOfBirth).format('YYYY-MM-DD')}`}</p>
          <p>{`Gender: ${userInfo.gender === 0 ? 'Male' : userInfo.gender === 1 ? 'Female' : 'Other'}`}</p>
          <p>{`Type: ${userInfo.type}`}</p>
          <p>{`Location: ${userInfo.location}`}</p>
        </div>
      ),
      onOk() {},
      onshowModal() {},
    });
  };

  const handleEdit = (userName) => {
    navigate(`/user/edit/${userName}`);
  };
  const navigate = useNavigate();

  // DisableUser
  const { confirm } = Modal;

  const handleDisableUser = async (userName) => {
    console.log('check', userName);
    console.log('check', localStorage.getItem('userName'));

    const res = await checkValidUser(USER, userName);
    if (res.status === 'Error1') {
      Modal.error({
        title: res.message,
      });
    }
    if (res.status === 'Error2') {
      Modal.error({
        title: res.message,
      });
    }
    if (res.status === 'Success') {
      if (userName != localStorage.getItem('userName')) {
        confirm({
          title: 'Are you sure ?',
          icon: <ExclamationCircleFilled />,
          content: 'Do you Want to disable this user ?',
          okText: 'Disable',
          okType: 'danger',
          cancelText: 'Cancel',
          onOk() {
            onDisableUser(userName);
          },
          onCancel() {
            console.log('Cancel');
          },
        });
      } else {
        message.error("You can't disable yourself");
      }
    }

    const onDisableUser = async (userName) => {
      console.log('disable user 234', userName);
      const res = await deleteData(USER, userName);

      if (res.status === 'Success') {
        Modal.success({
          title: res.message,
        });
      }
      console.log('check res of disable user', res);

      getAllUserFunc();
    };
  };

  //End DisableUser

  return (
    <div style={{ width: '100%' }}>
      <div
        style={{
          backgroundColor: '#001529',
          display: 'inline-block',
          paddingTop: 10,
          paddingBottom: 10,
          paddingLeft: 40,
          paddingRight: 40,
          color: '#fff',
          borderRadius: '6px',
        }}
      >
        User list
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          marginBottom: '40px',
          marginTop: '30px',
        }}
      >
        <Box>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Type</InputLabel>
            <Select
              style={{ height: '38px' }}
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Type"
              defaultValue="a"
              onChange={({ target: { value } }) => {
                setFilter(value);
              }}
            >
              <MenuItem value="admin" onClick={handleAdminChange}>
                Admin
              </MenuItem>
              <MenuItem value="staff" onClick={handleStaffChange}>
                Staff
              </MenuItem>
              <MenuItem value="a" onClick={handleNoneChange}>
                None
              </MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Search>
          <SearchIconWrapper>
            <SearchIcon onSubmit={handleSubmit} />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search username, fullname or code"
            inputProps={{ 'aria-label': 'search' }}
            onChange={handleSearchChange}
            value={message1}
          />
        </Search>
        <Link style={{ listStyle: 'none', textDecoration: 'none' }} to={`/user/create`}>
          <Button variant="contained" style={{ height: '38px' }}>
            Create new user
          </Button>
        </Link>
      </div>

      <Table
        onRow={(record) => {
          return {
            onClick: () => handleInfo(record),
          };
        }}
        style={{ width: '100%' }}
        columns={columns}
        dataSource={searchResults}
        onChange={onChange}
        pagination={{ defaultPageSize: 10, showSizeChanger: true, pageSizeOptions: ['10'] }}
      />
    </div>
  );
};
export default UserListPage;
