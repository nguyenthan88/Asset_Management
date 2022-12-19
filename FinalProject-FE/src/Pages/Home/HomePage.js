import React, { useEffect, useState } from 'react';
import { ACCEPT_ASSIGMENT, BASE_URL, DECLINE_ASSIGMENT, REQUEST } from '../../constants/index';
import { DatePicker, message, Modal, Space, Table, Tag } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
import SearchIcon from '@mui/icons-material/Search';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import { Button, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { Box } from '@mui/system';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { acceptAssignment, createRequest, deleteData } from '../../axiosAPIs';
import moment from 'moment';
import EditIcon from '@mui/icons-material/Edit';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { USER } from '../../constants';
import DoneOutlinedIcon from '@mui/icons-material/DoneOutlined';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import ReplayOutlinedIcon from '@mui/icons-material/ReplayOutlined';
import ReplayIcon from '@mui/icons-material/Replay';
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

const HomePage = () => {
  const [dataAssignments, setDataAssignments] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [filter, setFilter] = useState('');
  const [message1, setMessage] = useState('');
  const [value, setValue] = useState();
  const [datevalue, setDateValue] = useState([]);

  function isEmptyOrSpaces(str) {
    return str === null || str.match(/^ *$/) !== null;
  }

  const getAllAssignmentFunc = () => {
    axios
      .get(
        `https://rookiesb6g5-api.azurewebsites.net/api/assignment-management/assignments/${localStorage.getItem('userId')}`,
      )
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
      return setSearchResults(dataAssignments) && setDateValue();
    } else {
      if (filter < 4) {
        const resultsArray = dataAssignments.filter(
          (dataAssignments) =>
            (dataAssignments.assetCode.trim().toLowerCase().includes(e.target.value.toLowerCase().trim()) ||
              dataAssignments.assetName.trim().toLowerCase().includes(e.target.value.toLowerCase().trim()) ||
              dataAssignments.assignedTo.trim().toLowerCase().includes(e.target.value.toLowerCase().trim()) ||
              dataAssignments.assignedBy.trim().toLowerCase().includes(e.target.value.toLowerCase().trim())) &&
            (dataAssignments.assignmentState === filter || dataAssignments.assignedDate.includes(datevalue)),
        );
        setSearchResults(resultsArray);
      } else if (filter === 5) {
        const resultsArray = dataAssignments.filter(
          (dataAssignments) =>
            dataAssignments.assetCode.trim().toLowerCase().includes(e.target.value.toLowerCase().trim()) ||
            dataAssignments.assetName.trim().toLowerCase().includes(e.target.value.toLowerCase().trim()) ||
            dataAssignments.assignedTo.trim().toLowerCase().includes(e.target.value.toLowerCase().trim()) ||
            (dataAssignments.assignedBy.trim().toLowerCase().includes(e.target.value.toLowerCase().trim()) &&
              dataAssignments.assignedDate === datevalue),
        );
        setSearchResults(resultsArray);
      }
      setMessage(e.value);
    }
  };
  const onclick = () => { };
  const handleChange = (e) => {
    if (e <= 4) {
      const resultsArray = dataAssignments.filter((dataUsers) => dataUsers.assignmentState === e);
      console.log(resultsArray);
      setSearchResults(resultsArray);
      setMessage('');
    } else {
      getAllAssignmentFunc();
    }
  };
  const handleFilterDateChange = (e) => {
    const resultsArray = dataAssignments.filter((dataUsers) => dataUsers.assignedDate.includes(e));
    setSearchResults(resultsArray);
    setMessage('');
  };

  const columns = [
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
                    ? 'pink'
                    : assignmentState === 2
                      ? 'red'
                      : assignmentState === 3
                        ? '#36cfc9'
                        : 'green'
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
          {record.assignmentState === 0 ? (
            <DoneOutlinedIcon
              onClick={(e) => {
                e.stopPropagation();
                handleAccept(record.id);
              }}
              style={{ stroke: 'red', strokeWidth: 1, fontSize: '22px', cursor: 'pointer' }}
            />
          ) : (
            <DoneOutlinedIcon
              onClick={(e) => {
                e.stopPropagation();
              }}
              style={{ stroke: '#919191', strokeWidth: 1, fontSize: '22px' }}
            />
          )}

          {record.assignmentState === 0 ? (
            <ClearOutlinedIcon
              onClick={(e) => {
                e.stopPropagation();
                handleDecline(record.id);
              }}
              style={{ stroke: 'black', strokeWidth: 1, fontSize: '22px', cursor: 'pointer' }}
            />
          ) : (
            <ClearOutlinedIcon
              onClick={(e) => {
                e.stopPropagation();
              }}
              style={{ stroke: '#919191', strokeWidth: 1, fontSize: '22px' }}
            />
          )}

          {record.assignmentState === 1 ? (
            <ReplayOutlinedIcon
              onClick={(e) => {
                handleCreateRequest(record);
                e.stopPropagation();
              }}
              style={{ stroke: 'blue', strokeWidth: 1, fontSize: '22px', cursor: 'pointer' }}
            />
          ) : (
            <ReplayOutlinedIcon
              // sx={{ stroke: record.assignmentState === 1 ? "blue": '#919191', strokeWidth: 1 }}
              onClick={(e) => {
                e.stopPropagation();
              }}
              style={{ stroke: '#919191', strokeWidth: 1, fontSize: '22px' }}
            />
          )}
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

          <p>{`State: ${userInfo.assignmentState === 0
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
      onshowModal() { },
    });
  };
  const onChangeDate = (date) => {
    setValue(date);
    const formateDates = date.format('YYYY-MM-DD');
    handleFilterDateChange(formateDates);
    setDateValue(formateDates);
  };
  const navigate = useNavigate();

  // Accept Assignment
  const handleAccept = (record) => {
    const onAcceptAssignment = async (record) => {
      console.log('check create request', record);
      const res = await acceptAssignment(ACCEPT_ASSIGMENT, record);
      getAllAssignmentFunc();
      Modal.success({
        title: 'Accept Assignmennt Successfully',
      });
    };

    if (true) {
      confirm({
        title: 'Are you sure ?',
        icon: <ExclamationCircleFilled />,
        content: 'Do you Want to accept this assignment ?',
        okText: 'Accept',
        okType: 'primary',
        cancelText: 'Cancel',
        onOk() {
          onAcceptAssignment(record);
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    } else {
      message.error("You can't disable yourself");
    }
  };

  //End Accept Assignment

  // Decline Assignment
  const handleDecline = (record) => {
    const onDeclineAssignment = async (record) => {
      console.log('check decline', record);
      const res = await acceptAssignment(DECLINE_ASSIGMENT, record);
      getAllAssignmentFunc();
      Modal.success({
        title: 'Decline Assignmennt Successfully',
      });
    };

    if (true) {
      confirm({
        title: 'Are you sure ?',
        icon: <ExclamationCircleFilled />,
        content: 'Do you Want to decline this assignment ?',
        okText: 'Decline',
        okType: 'danger',
        cancelText: 'Cancel',
        onOk() {
          onDeclineAssignment(record);
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    } else {
      message.error("You can't disable yourself");
    }
  };

  //End Decline Assignment

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
        My Assignment
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-around', margin: '25px 0px' }}>
        <Table


          onRow={(record) => {
            if (record.assignmentState === 1) {
              return {
                onClick: () => handleInfo(record),
              };
            }
          }}
          style={{ width: '100%' }}
          columns={columns}
          dataSource={searchResults}
          onChange={onChange}
          pagination={{ defaultPageSize: 10, showSizeChanger: true, pageSizeOptions: ['10'] }}
        />
      </div>
    </div>
  );
};

export default HomePage;
