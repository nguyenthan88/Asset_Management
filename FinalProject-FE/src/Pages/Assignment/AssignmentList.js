import React, { useEffect, useState } from 'react';
import { BASE_URL, DELETE_ASSIGMENT, REQUEST, TOKEN_KEY } from '../../constants/index';
import { DatePicker, message, Modal, Space, Table, Tag } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
import SearchIcon from '@mui/icons-material/Search';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import { Button, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { Box } from '@mui/system';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { createRequest } from '../../axiosAPIs';
import moment from 'moment';
import EditIcon from '@mui/icons-material/Edit';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import ReplayIcon from '@mui/icons-material/Replay';
const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  height: '40px',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: 'white',
  border: '1px solid #d9d9d9',
  '&:hover': {
    borderColor: '#4096ff',
  },
  [theme.breakpoints.up('sm')]: {
    display: 'flex',
    width: '400px',
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

const onChange = (pagination, filters, sorter, extra) => {
  console.log('params', pagination, filters, sorter, extra);
};

const AssignmentListPage = () => {
  const [dataAssignments, setDataAssignments] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [filter, setFilter] = useState('');
  const [message1, setMessage] = useState('');
  const [value, setValue] = useState();
  const [datevalue, setDateValue] = useState(null);

  function isEmptyOrSpaces(str) {
    return str === null || str.match(/^ *$/) !== null;
  }

  const getAllAssignmentFunc = () => {
    axios
      .get(`${BASE_URL}/assignment-management/assignments/location/${localStorage.getItem('location')}`)
      .then((data) => {
        setDataAssignments(data.data.$values);
        setSearchResults(data.data.$values);
        console.log(data.data.$values);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    getAllAssignmentFunc();
  }, []);

  const handleSubmit = (e) => e.preventDefault();
  const handleSearchChange = (e) => {
    if (isEmptyOrSpaces(e.target.value)) {
      return setSearchResults(dataAssignments);
    } else {
      if (filter < 4) {
        console.log('loi filter', filter);
        const resultsArray = dataAssignments.filter(
          (dataAssignments) =>
            (dataAssignments.assetCode.trim().toLowerCase().includes(e.target.value.toLowerCase().trim()) ||
              dataAssignments.assetName.trim().toLowerCase().includes(e.target.value.toLowerCase().trim()) ||
              dataAssignments.assignedTo.trim().toLowerCase().includes(e.target.value.toLowerCase().trim()) ||
              dataAssignments.assignedBy.trim().toLowerCase().includes(e.target.value.toLowerCase().trim())) &&
            dataAssignments.assignmentState === filter,
        );
        setSearchResults(resultsArray);
      } else if (filter === 5) {
        if (datevalue != null) {
          const resultsArray = dataAssignments.filter(
            (dataAssignments) =>
              (dataAssignments.assetCode.trim().toLowerCase().includes(e.target.value.toLowerCase().trim()) ||
                dataAssignments.assetName.trim().toLowerCase().includes(e.target.value.toLowerCase().trim()) ||
                dataAssignments.assignedTo.trim().toLowerCase().includes(e.target.value.toLowerCase().trim()) ||
                dataAssignments.assignedBy.trim().toLowerCase().includes(e.target.value.toLowerCase().trim())) &&
              dataAssignments.assignedDate.includes(datevalue),
          );
          setSearchResults(resultsArray);
        } else {
          const resultsArray = dataAssignments.filter(
            (dataAssignments) =>
              dataAssignments.assetCode.trim().toLowerCase().includes(e.target.value.toLowerCase().trim()) ||
              dataAssignments.assetName.trim().toLowerCase().includes(e.target.value.toLowerCase().trim()) ||
              dataAssignments.assignedTo.trim().toLowerCase().includes(e.target.value.toLowerCase().trim()) ||
              dataAssignments.assignedBy.trim().toLowerCase().includes(e.target.value.toLowerCase().trim()),
          );
          setSearchResults(resultsArray);
        }
      }
      setMessage(e.value);
    }
  };
  const onclick = () => {};
  const handleChange = (e) => {
    if (e <= 4) {
      if (datevalue != null) {
        const resultsArray = dataAssignments.filter((dataUsers) => dataUsers.assignmentState === e);
        console.log(resultsArray);
        setSearchResults(resultsArray);
        setMessage('');
      } else {
        const resultsArray = dataAssignments.filter((dataUsers) => dataUsers.assignmentState === e);
        console.log(resultsArray);
        setSearchResults(resultsArray);
        setMessage('');
      }
    } else {
      setSearchResults(dataAssignments);
    }
  };

  const handleFilterDateChange = (e) => {
    const resultsArray = dataAssignments.filter((dataUsers) => dataUsers.assignedDate.includes(e));
    setSearchResults(resultsArray);
    setMessage('');
  };

  const columns = [
    {
      title: 'No.',
      dataIndex: '$id',
      key: '$id',
      sorter: (a, b) => a.$id.localeCompare(b.$id),
    },
    {
      title: 'Asset Code',
      dataIndex: 'assetCode',
      key: 'assetCode',
      sorter: (a, b) => a.assetCode.localeCompare(b.assetCode),
    },
    {
      title: 'Asset Name',
      dataIndex: 'assetName',
      key: 'assetName',
      sorter: (a, b) => a.assetName.localeCompare(b.assetName),
    },
    {
      title: 'Assigned To',
      dataIndex: 'assignedTo',
      key: 'assignedTo',
      sorter: (a, b) => a.assignedTo.localeCompare(b.assignedTo),
    },
    {
      title: 'Assigned By',
      dataIndex: 'assignedBy',
      key: 'assignedBy',
      sorter: (a, b) => a.assignedBy.localeCompare(b.assignedBy),
    },
    {
      title: 'Assigned Date',
      dataIndex: 'assignedDate',
      key: 'assignedDate',
      render: (_, record) => {
        return (
          <div>
            <p>{moment(record.assignedDate).format('YYYY-MM-DD')}</p>
          </div>
        );
      },
      sorter: (a, b) => a.assignedDate.localeCompare(b.assignedDate),
    },
    {
      title: 'State',
      dataIndex: 'assignmentState',
      key: 'assignmentState',
      render: (_, { assignmentState }) => (
        <>
          {
            <Tag
              color={
                assignmentState === 1
                  ? 'geekblue'
                  : assignmentState === 0
                  ? 'green'
                  : assignmentState === 2
                  ? 'red'
                  : assignmentState === 3
                  ? 'violet'
                  : 'volcano'
              }
            >
              {assignmentState === 0
                ? 'Waiting for acceptance'
                : assignmentState === 1
                ? 'Accepted'
                : assignmentState === 2
                ? 'Decline'
                : assignmentState === 3
                ? 'Waiting For Returning'
                : 'Completed'}
            </Tag>
          }
        </>
      ),
      sorter: (a, b) => a.assignmentState - b.assignmentState,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <EditIcon
            onClick={(e) => {
              record.assignmentState === 0 ? handleEdit(record.id) : onclick();
              e.stopPropagation();
            }}
            style={{ fontSize: 22, color: record.assignmentState === 0 ? 'blue' : 'black' }}
          />

          {record.assignmentState === 0 || record.assignmentState === 2 ? (
            <HighlightOffIcon
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteAssignment(record);
                console.log(record);
              }}
              color="action"
              style={{ color: 'red', cursor: 'pointer', fontSize: 22 }}
            />
          ) : (
            <HighlightOffIcon
              onClick={(e) => {
                e.stopPropagation();
              }}
              color="action"
              style={{ color: 'red', cursor: 'pointer', opacity: 0.3, fontSize: 22 }}
            />
          )}

          <ReplayIcon
            onClick={(e) => {
              record.assignmentState === 1 ? handleCreateRequest(record) : onclick();
              e.stopPropagation();
            }}
            style={{ color: record.assignmentState === 1 ? 'blue' : 'black', fontSize: 22 }}
          />
        </Space>
      ),
    },
  ];

  const handleInfo = (userInfo) => {
    Modal.info({
      title: 'Detailed Assignment Information',
      closable: true,
      okButtonProps: { style: { display: 'none' } },

      content: (
        <div>
          <p>{`Asset Code: ${userInfo.assetCode}`}</p>
          <p>{`Asset Name: ${userInfo.assetName}`}</p>
          <p>{`Assigned to: ${userInfo.assignedTo}`}</p>
          <p>{`Assigned by: ${userInfo.assignedBy}`}</p>
          <p>{`Assigned Date: ${moment(userInfo.assignedDate).format('YYYY-MM-DD')}`}</p>
          <p>{`State: ${
            userInfo.assignmentState === 0
              ? 'Waiting for acceptance'
              : userInfo.assignmentState === 1
              ? 'Accepted'
              : userInfo.assignmentState === 2
              ? 'Decline'
              : userInfo.assignmentState === 3
              ? 'Waiting For Returning'
              : 'Completed'
          }`}</p>
          <p>{`Note: ${userInfo.note}`}</p>
          <p>{`Specification: ${userInfo.specification}`}</p>
        </div>
      ),
      onOk() {},
      onshowModal() {},
    });
  };
  const onChangeDate = (date) => {
    if (date == null) {
      setSearchResults(dataAssignments);
      setValue(date);
      setDateValue(null);
    } else {
      setValue(date);
      console.log('value ne', value);
      console.log('date ne', date);
      const formateDates = date.format('YYYY-MM-DD');
      console.log('formates', formateDates);
      handleFilterDateChange(formateDates);
      setDateValue(formateDates);
    }
    console.log('date value ne', datevalue);
  };
  const handleEdit = (id) => {
    navigate(`/assignment/edit/${id}`);
  };
  const navigate = useNavigate();

  // Create Request
  const { confirm } = Modal;

  const handleCreateRequest = (record) => {
    const onCreateRequest = async (record) => {
      console.log('check create request', record);
      const res = await createRequest(REQUEST, record);
      getAllAssignmentFunc();
      Modal.success({
        title: 'Create Request For Returning Successfully',
      });
    };

    if (true) {
      confirm({
        title: 'Are you sure ?',
        icon: <ExclamationCircleFilled />,
        content: 'Do you Want to create request returning for this assignment ?',
        okText: 'Accept',
        okType: 'primary',
        cancelText: 'Cancel',
        onOk() {
          onCreateRequest(record);
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    } else {
      message.error("You can't disable yourself");
    }
  };

  //End Create Request

  //start Modal Delete Assignment
  const handleDeleteAssignment = (record) => {
    confirm({
      title: 'Are you sure ?',
      icon: <ExclamationCircleFilled />,
      content: 'Do you want to delete this assignment?',
      okText: 'Delete',
      okType: 'primary',
      cancelText: 'Cancel',
      maskClosable: true,
      async onOk() {
        try {
          const response = await axios({
            method: 'delete',
            url: `${BASE_URL}/${DELETE_ASSIGMENT}/${record.assetCode}?id=${record.id}`,
            headers: { Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}` },
            data: null,
          });
          getAllAssignmentFunc();
          Modal.success({
            title: 'Delete Assignment Successfully',
            maskClosable: true,
          });
        } catch (err) {
          console.error(err);
        }
      },
      onCancel() {},
    });
  };
  //end Model Delete Asignments

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
        Assigment list
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-around', margin: '25px 0px' }}>
        <Box>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">State</InputLabel>
            <Select
              style={{ height: '38px' }}
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="State"
              defaultValue="5"
              onChange={({ target: { value } }) => {
                setFilter(value);
                handleChange(value);
              }}
            >
              <MenuItem value={0}>Waiting for acceptance</MenuItem>
              <MenuItem value={1}>Accepted</MenuItem>
              <MenuItem value={2}>Decline</MenuItem>
              <MenuItem value={3}>Waiting For Returning</MenuItem>
              <MenuItem value={4}>Completed</MenuItem>
              <MenuItem value={5}>None</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <DatePicker placeholder="Assigned Date" style={{ height: '38px' }} value={value} onChange={onChangeDate} />
        <Search>
          <SearchIconWrapper>
            <SearchIcon onSubmit={handleSubmit} />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search asset name, assigned to or asset code"
            inputProps={{ 'aria-label': 'search' }}
            onChange={handleSearchChange}
            value={message1}
          />
        </Search>
        <Link style={{ listStyle: 'none', textDecoration: 'none' }} to={`/assignment/create`}>
          <Button variant="contained" style={{ height: '38px' }}>
            Create new assignment
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
export default AssignmentListPage;
