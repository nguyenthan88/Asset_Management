import React, { useEffect, useState } from 'react';
import { Modal, Space, Table } from 'antd';
import { DeleteOutlined, EditOutlined, InfoCircleOutlined } from '@ant-design/icons';
import ResponsiveAppBar from '../../Components/Navbar/Navbar';
import SearchIcon from '@mui/icons-material/Search';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import { Button, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { Box } from '@mui/system';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import moment from 'moment';
import { Navigate } from 'react-router-dom';
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
    width: '300px',
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

const onChange = (pagination, filters, sorter, extra) => {};

const ListUser = () => {
  const [dataUsers, setDataUsers] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [modalText, setModalText] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState('');
  useEffect(() => {
    axios
      .get(`${BASE_URL}/user-management?userName=${localStorage.getItem('userName')}`)
      .then((data) => {
        setDataUsers(data.data.$values);
        setSearchResults(data.data.$values);
      })
      .catch((error) => console.log(error));
  }, []);

  function isEmptyOrSpaces(str) {
    return str === null || str.match(/^ *$/) !== null;
  }

  const handleSubmit = (e) => e.preventDefault();
  const handleSearchChange = (e) => {
    if (isEmptyOrSpaces(e.target.value)) {
      return setSearchResults(dataUsers);
    } else {
      const resultsArray = dataUsers.filter(
        (dataUsers) =>
          dataUsers.userName.trim().toLowerCase().includes(e.target.value.toLowerCase()) ||
          //  && dataUsers.type.includes(filters)
          dataUsers.staffCode.trim().toLowerCase().includes(e.target.value.toLowerCase()),
      );
      //  && dataUsers.type.includes(filters))
      setSearchResults(resultsArray);
    }
  };
  const handleAdminChange = (e) => {
    const resultsArray = dataUsers.filter((dataUsers) => dataUsers.type.includes('Admin'));
    setSearchResults(resultsArray);
  };
  const handleStaffChange = (e) => {
    const resultsArray = dataUsers.filter((dataUsers) => dataUsers.type.includes('Staff'));
    setSearchResults(resultsArray);
  };
  const handleNoneChange = () => {
    const resultsArray = dataUsers.filter((dataUsers) => dataUsers.staffCode.toLowerCase().includes('sd'));
    setSearchResults(resultsArray);
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
            <p>{moment(record.joinedDate).format('DD-MM-YYYY')}</p>
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
          <InfoCircleOutlined onClick={() => handleInfo(record)} />
          <EditOutlined onClick={() => handleEdit(record.userName)} />
          <DeleteOutlined onClick={() => handleInfo(record)} type="primary" danger />
        </Space>
      ),
    },
  ];

  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handleChange = (value) => {
    setFilters(value);
  };
  const handleInfo = (record) => {
    setModalText(record);
    setIsModalOpen(true);
  };
  const handleEdit = (userName) => {
    navigate(`/user/edit/${userName}`);
  };
  const navigate = useNavigate();
  return (
    <>
      <div style={{ display: 'flex' }}>
        <ResponsiveAppBar />
        <div style={{ width: '2000px' }}>
          <div>
            <Box style={{ float: 'left', width: '100px', marginLeft: 100, height: 5 }}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Type</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Type"
                  defaultValue="sd"
                  //  onChange={handleChange}
                >
                  <MenuItem value="Admin" onClick={handleAdminChange}>
                    Admin
                  </MenuItem>
                  <MenuItem value="Staff" onClick={handleStaffChange}>
                    Staff
                  </MenuItem>
                  <MenuItem value="sd" onClick={handleNoneChange}>
                    None
                  </MenuItem>
                </Select>
              </FormControl>
            </Box>
          </div>
          <div style={{ float: 'right', display: 'flex' }}>
            <Search>
              <SearchIconWrapper>
                <SearchIcon onSubmit={handleSubmit} />
              </SearchIconWrapper>
              <StyledInputBase placeholder="Search…" inputProps={{ 'aria-label': 'search' }} onChange={handleSearchChange} />
            </Search>
            <Link style={{ listStyle: 'none', textDecoration: 'none' }} to={`/usercreate`}>
              <Button variant="contained" style={{ height: '40px', marginTop: '10px' }}>
                Create new user
              </Button>
            </Link>
          </div>
          {modalText && (
            <Modal
              title="Information User"
              open={isModalOpen}
              onOk={handleOk}
              onCancel={handleCancel}
              footer={[
                <Button key="back" type="primary" onClick={handleCancel}>
                  Ok
                </Button>,
              ]}
            >
              <p>{`Staff Code: ${modalText.staffCode}`}</p>
              <p>{`Full Name: ${modalText.fullName}`}</p>
              <p>{`User Name: ${modalText.userName}`}</p>
              <p>{`Date of birth: ${moment(modalText.dateOfBirth).format('DD-MM-YYYY')}`}</p>
              <p>{`Gender: ${(modalText.gender = 0 ? 'Male' : (modalText.gender = 1 ? 'Female' : 'Other'))}`}</p>
              <p>{`Type: ${modalText.type}`}</p>
              <p>{`Location: ${modalText.location}`}</p>
            </Modal>
          )}
          <Table
            style={{ width: '100%' }}
            columns={columns}
            dataSource={searchResults}
            onChange={onChange}
            pagination={{ defaultPageSize: 10, showSizeChanger: true, pageSizeOptions: ['10'] }}
          />
        </div>
      </div>
    </>
  );
};
export default ListUser;
