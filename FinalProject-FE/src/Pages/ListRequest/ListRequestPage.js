import React, { useEffect, useState } from 'react';
import { Modal, Space, Table, Button, Tag, Skeleton, DatePicker, Select } from 'antd';
import SearchIcon from '@mui/icons-material/Search';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import { BASE_URL, TOKEN_KEY } from '../../constants';
import ClearIcon from '@mui/icons-material/Clear';
import CheckIcon from '@mui/icons-material/Check';
import { ExclamationCircleFilled } from '@ant-design/icons';
import axios from 'axios';
import dayjs from 'dayjs';

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

const ListRequestPage = () => {
  const [dataRequest, setDataRequest] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const onChange = (pagination, filters, sorter, extra, record, current) => {
    //console.log('params', pagination, filters, sorter, extra, record);
    if (extra.action === 'sort') {
      setCurrentPage(1);
    } else {
      setCurrentPage(current);
    }
  };

  function isEmptyOrSpaces(str) {
    return str === null || str.match(/^ *$/) !== null;
  }

  const getRequestList = async () => {
    const res = await axios.get(`${BASE_URL}/request-returning-management/returning-request`);
    // console.log(res.data);
    // console.log(res.data.$values);
    setDataRequest(res.data.$values);
    setSearchAndFilterResults(res.data.$values);
    // console.log('data SaF', searchAndFilterResults);
    // console.log('get request', filterStatus);
  };

  const handleSubmit = (e) => e.preventDefault();

  const [searchAndFilterResults, setSearchAndFilterResults] = useState([]);
  const [inputSearch, setInputSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState(2);
  const [filterReturnDate, setFilterReturnDate] = useState(null);

  const handleChangeFilterStatus = (value) => {
    setFilterStatus(value);
  };

  const handleChangeFilterReturnDate = (date) => {
    // console.log('date:', date);
    if (date === null) {
      setFilterReturnDate(null);
    } else {
      const formateDates = date.format('YYYY-MM-DD');
      setFilterReturnDate(formateDates);
      // console.log('formateDates:', formateDates);
    }
    // console.log('formateDates:', typeof formateDates);
  };

  const handleSearchAndFilterChange = () => {
    console.log('setFilterStatus', filterStatus);
    console.log('setFilterReturnDate', filterReturnDate);
    setCurrentPage(1);
    //khong search gi ca
    if (isEmptyOrSpaces(inputSearch)) {
      // console.log('empty search ans filter', filterStatus);
      //co filter status + khong filter date
      if ((filterStatus === 0 || filterStatus === 1) && filterReturnDate === null) {
        const resultsArray = dataRequest.filter((dataRequest) => dataRequest.requestStatus === filterStatus);
        console.log(resultsArray);
        setSearchAndFilterResults(resultsArray);
      } else if (filterStatus === 2 && filterReturnDate === null) {
        //khong filter status + khong filter date
        const resultsArray = dataRequest.filter((dataRequest) => dataRequest);
        console.log(resultsArray);
        setSearchAndFilterResults(resultsArray);
      }

      //co filter status + co filter date
      if ((filterStatus === 0 || filterStatus === 1) && filterReturnDate) {
        const resultsArray = dataRequest.filter(
          (dataRequest) => dataRequest.requestStatus === filterStatus && dataRequest.returnDate === filterReturnDate,
        );
        console.log(resultsArray);
        setSearchAndFilterResults(resultsArray);
      } else if (filterStatus === 2 && filterReturnDate) {
        //khong filter status +  co filter date
        const resultsArray = dataRequest.filter((dataRequest) => dataRequest.returnDate === filterReturnDate);
        console.log(resultsArray);
        setSearchAndFilterResults(resultsArray);
      }
    } else {
      //co search
      if (filterStatus === 0 || (filterStatus === 1 && filterReturnDate === null)) {
        //co filter status + khong filter date
        const resultsArray = dataRequest.filter(
          (request) =>
            request.requestStatus === filterStatus &&
            (request.assetCode.trim().toLowerCase().includes(inputSearch.toLowerCase().trim()) ||
              request.assetName.trim().toLowerCase().includes(inputSearch.toLowerCase().trim()) ||
              request.acceptedBy.trim().toLowerCase().includes(inputSearch.toLowerCase().trim())),
        );
        console.log(resultsArray);
        setSearchAndFilterResults(resultsArray);
      } else if (filterStatus === 2 && filterReturnDate === null) {
        //khong filter status + khong filter date
        const resultsArray = dataRequest.filter(
          (request) =>
            request.assetCode.trim().toLowerCase().includes(inputSearch.toLowerCase().trim()) ||
            request.assetName.trim().toLowerCase().includes(inputSearch.toLowerCase().trim()) ||
            request.acceptedBy.trim().toLowerCase().includes(inputSearch.toLowerCase().trim()),
        );
        console.log(resultsArray);
        setSearchAndFilterResults(resultsArray);
      }

      if (filterStatus === 0 || (filterStatus === 1 && filterReturnDate)) {
        //co filter status + co filter date
        const resultsArray = dataRequest.filter(
          (request) =>
            request.requestStatus === filterStatus &&
            request.returnDate === filterReturnDate &&
            (request.assetCode.trim().toLowerCase().includes(inputSearch.toLowerCase().trim()) ||
              request.assetName.trim().toLowerCase().includes(inputSearch.toLowerCase().trim()) ||
              request.acceptedBy.trim().toLowerCase().includes(inputSearch.toLowerCase().trim())),
        );
        console.log(resultsArray);
        setSearchAndFilterResults(resultsArray);
      } else if (filterStatus === 2 && filterReturnDate) {
        //khong filter status + co filter date
        const resultsArray = dataRequest.filter(
          (request) =>
            request.returnDate === filterReturnDate &&
            (request.assetCode.trim().toLowerCase().includes(inputSearch.toLowerCase().trim()) ||
              request.assetName.trim().toLowerCase().includes(inputSearch.toLowerCase().trim()) ||
              request.acceptedBy.trim().toLowerCase().includes(inputSearch.toLowerCase().trim())),
        );
        console.log(resultsArray);
        setSearchAndFilterResults(resultsArray);
      }
    }
  };

  useEffect(() => {
    handleSearchAndFilterChange();
    // eslint-disable-next-line react-hooks/exhaustive-deps, no-use-before-define
  }, [inputSearch, filterStatus, filterReturnDate]);

  useEffect(() => {
    getRequestList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns = [
    {
      title: 'No.',
      dataIndex: 'no',
      key: 'no',
      render: (_, object, index) => {
        return (
          <div>
            <p>{index + 1}</p>
          </div>
        );
      },
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
      title: 'Requested by',
      dataIndex: 'requestBy',
      key: 'requestBy',
      sorter: (a, b) => a.requestBy.localeCompare(b.requestBy),
    },
    {
      title: 'Assigned Date',
      dataIndex: 'assignedDate',
      key: 'assignedDate',
      sorter: (a, b) => convertDateToNumber(a.assignedDate) - convertDateToNumber(b.assignedDate),
      render: (_, record) => {
        return (
          <div>
            <p>{record.assignedDate ? dayjs(record.assignedDate).format('YYYY-MM-DD') : ''}</p>
          </div>
        );
      },
    },
    {
      title: 'Accepted by',
      dataIndex: 'acceptedBy',
      key: 'acceptedBy',
      sorter: (a, b) => a.acceptedBy.localeCompare(b.acceptedBy),
    },
    {
      title: 'Returned Date',
      dataIndex: 'returnDate',
      key: 'returnDate',
      sorter: (a, b) => convertDateToNumber(a.returnDate) - convertDateToNumber(b.returnDate),
      render: (_, record) => {
        return (
          <div>
            <p>{record.returnDate}</p>
          </div>
        );
      },
    },
    {
      title: 'State',
      dataIndex: 'requestStatus',
      key: 'requestStatus',
      render: (_, { requestStatus }) => (
        <>
          {
            <Tag color={requestStatus === 0 ? 'geekblue' : 'volcano'}>
              {requestStatus === 0 ? 'Waiting for returning' : 'Completed'}
            </Tag>
          }
        </>
      ),
      sorter: (a, b) => a.requestStatus - b.requestStatus,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          {record.requestStatus === 0 ? (
            <>
              <CheckIcon
                onClick={(e) => {
                  e.stopPropagation();
                  showConfirmCompletedRequest(record);
                }}
                color="action"
                style={{ cursor: 'pointer', color: 'red', fontSize: 22 }}
              />
              <ClearIcon
                onClick={(e) => {
                  e.stopPropagation();
                  showConfirmCancelRequest(record);
                }}
                color="action"
                style={{ cursor: 'pointer', fontSize: 22 }}
              />
            </>
          ) : (
            <>
              <CheckIcon color="action" style={{ opacity: 0.3, color: 'red', fontSize: 22 }} />
              <ClearIcon color="action" style={{ opacity: 0.3, fontSize: 22 }} />
            </>
          )}
        </Space>
      ),
    },
  ];

  const convertDateToNumber = (date) => {
    //console.log(searchAndFilterResults);
    if (date === null) {
      return 0;
    }
    const dateNew = date.split('');

    for (let i = 0; i < dateNew.length; i++) {
      if (dateNew[i] === '-') {
        dateNew.splice(i, 1);
      }
    }

    return parseInt(dateNew.join(''), 10);
  };

  //start cancel request
  const showConfirmCompletedRequest = (record) => {
    Modal.confirm({
      title: 'Are you sure?',
      icon: <ExclamationCircleFilled />,
      content: 'Do you want to mark this returning request as "Completed"?',
      maskClosable: true,
      okText: 'Yes',
      okType: 'primary',
      cancelText: 'No',
      async onOk() {
        try {
          const response = await axios({
            method: 'put',
            url: `${BASE_URL}/request-returning-management/${record.id}`,
            headers: { Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}` },
            data: null,
          });
          getRequestList();
          setInputSearch('');
          setFilterStatus(2);
          Modal.success({
            title: 'Completed Request Returning Successfully',
            maskClosable: true,
          });
        } catch (err) {
          console.error(err);
        }
      },
      onCancel() {},
    });
  };
  //end cancel request

  //start completed request
  const showConfirmCancelRequest = (record) => {
    Modal.confirm({
      title: 'Are you sure?',
      icon: <ExclamationCircleFilled />,
      content: 'Do you want to cancel this returning request?',
      maskClosable: true,
      okText: 'Yes',
      okType: 'primary',
      cancelText: 'No',
      async onOk() {
        try {
          const response = await axios({
            method: 'delete',
            url: `${BASE_URL}/request-returning-management/${record.id}`,
            headers: { Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}` },
            data: null,
          });
          getRequestList();
          console.log(filterStatus);
          setInputSearch('');
          setFilterStatus(2);
          Modal.success({
            title: 'Cancel Request Returning Successfully',
            maskClosable: true,
          });
        } catch (err) {
          console.error(err);
        }
      },
      onCancel() {},
    });
  };
  //end completed request

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
        Request List
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
        <DatePicker
          style={{ height: '40px', width: '195px', backgroundColor: 'white' }}
          placeholder="Returned Date"
          onChange={handleChangeFilterReturnDate}
        />

        <Select
          value={filterStatus}
          defaultValue={2}
          style={{ width: 195, marginLeft: 35, marginRight: 35 }}
          size="large"
          onChange={(value) => handleChangeFilterStatus(value)}
        >
          <Select.Option value={0}>Waiting for returning</Select.Option>
          <Select.Option value={1}>Completed</Select.Option>
          <Select.Option value={2}>State</Select.Option>
        </Select>
        <Search>
          <SearchIconWrapper>
            <SearchIcon onSubmit={handleSubmit} />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search asset code or asset name or requester's username"
            inputProps={{ 'aria-label': 'search' }}
            onChange={(e) => setInputSearch(e.target.value)}
            value={inputSearch}
          />
        </Search>
      </div>
      <Table
        style={{ width: '100%' }}
        columns={columns}
        dataSource={searchAndFilterResults}
        onChange={onChange}
        pagination={{ current: currentPage, defaultPageSize: 10, showSizeChanger: true, pageSizeOptions: ['10'] }}
      />
    </div>
  );
};
export default ListRequestPage;
