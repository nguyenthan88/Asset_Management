import React, { useEffect, useState } from 'react';
import { Modal, Space, Table, Button, Tag, Skeleton } from 'antd';
import SearchIcon from '@mui/icons-material/Search';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../constants';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import EditIcon from '@mui/icons-material/Edit';
import moment from 'moment';
import { NavLink } from 'react-router-dom';

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

const AssetListPage = () => {
  const [dataAsset, setDataAsset] = useState();
  const [searchResults, setSearchResults] = useState([]);
  const [category, setCategory] = useState();
  //console.log(category);

  const [currentPage, setCurrentPage] = useState(1);
  // const onChangePage = (page) => {
  //   console.log(page);
  //   setCurrentPage(page);
  // };
  const onChange = (pagination, filters, sorter, extra, record, current) => {
    console.log('pagination', pagination);
    console.log('filters', filters);
    console.log('sorter', sorter);
    console.log('extra', extra);
    // console.log('record', record);
    if (extra.action === 'sort') {
      setCurrentPage(1);
    } else {
      setCurrentPage(current);
    }
    setFilteredInfo(filters);
  };

  function isEmptyOrSpaces(str) {
    return str === null || str.match(/^ *$/) !== null;
  }

  const categoryName = (arrayCategory) => {
    const arrayCategoryName = [];
    arrayCategory.forEach((category) => {
      arrayCategoryName.push({
        text: category.categoryName,
        value: category.categoryName,
      });
    });
    return arrayCategoryName;
  };

  const getAssetByLocation = async () => {
    const res = await axios.get(`${BASE_URL}/asset-management/assets?location=${localStorage.getItem('location')}`);
    //console.log(res.data);
    //console.log(res.data.$values);
    setDataAsset(res.data.$values);
    setSearchResults(res.data.$values);
  };

  const getCategory = async () => {
    const res = await axios.get(`${BASE_URL}/category-management/categories`);
    //console.log(res.data.$values);
    setCategory(categoryName(res.data.$values));
  };

  useEffect(() => {
    getAssetByLocation();
    getCategory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (e) => e.preventDefault();
  const handleSearchChange = (e) => {
    if (isEmptyOrSpaces(e.target.value)) {
      return setSearchResults(dataAsset);
    } else {
      const resultsArray = dataAsset.filter(
        (dataAsset) =>
          dataAsset.assetCode.trim().toLowerCase().includes(e.target.value.toLowerCase().trim()) ||
          dataAsset.assetName.trim().toLowerCase().includes(e.target.value.toLowerCase().trim()),
      );
      setSearchResults(resultsArray);
    }
  };

  const [filteredInfo, setFilteredInfo] = useState({});

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
      title: 'Category',
      dataIndex: 'categoryName',
      key: 'categoryName',
      filters: category,
      filteredValue: filteredInfo.categoryName || null,
      onFilter: (value, record) => record.categoryName === value,
      sorter: (a, b) => a.categoryName.localeCompare(b.categoryName),
    },
    {
      title: 'State',
      dataIndex: 'assetStatus',
      key: 'assetStatus',
      render: (_, { assetStatus }) => (
        <>
          {
            <Tag color={assetStatus === 1 ? 'geekblue' : assetStatus === 0 ? 'green' : 'volcano'}>
              {assetStatus === 0
                ? 'Available'
                : assetStatus === 1
                ? 'Not available'
                : assetStatus === 2
                ? 'Assigned'
                : assetStatus === 3
                ? 'Waiting for recycling'
                : 'Recycled'}
            </Tag>
          }
        </>
      ),
      filters: [
        {
          text: 'Available',
          value: 0,
        },
        {
          text: 'Not available',
          value: 1,
        },
        {
          text: 'Assigned',
          value: 2,
        },
        {
          text: 'Waiting for recycling',
          value: 3,
        },
        {
          text: 'Recycled',
          value: 4,
        },
      ],
      filterMultiple: true,
      defaultFilteredValue: [0, 1, 2],
      filteredValue: filteredInfo.assetStatus || [0, 1, 2],
      onFilter: (value, record) => record.assetStatus === value,
      sorter: (a, b) => a.assetStatus - b.assetStatus,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          {record.assetStatus === 2 ? (
            <EditIcon
              onClick={(e) => {
                e.stopPropagation();
              }}
              color="action"
              style={{ cursor: 'pointer', opacity: 0.3, fontSize: 22 }}
            />
          ) : (
            <EditIcon
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(record.assetCode);
              }}
              color="action"
              style={{ cursor: 'pointer', fontSize: 22 }}
            />
          )}
          {record.assetStatus === 2 ? (
            <HighlightOffIcon
              onClick={(e) => {
                e.stopPropagation();
              }}
              color="action"
              style={{ cursor: 'pointer', color: 'red', opacity: 0.3, fontSize: 22 }}
            />
          ) : (
            <HighlightOffIcon
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(record.assetCode);
              }}
              color="action"
              style={{ cursor: 'pointer', color: 'red', fontSize: 22 }}
            />
          )}
        </Space>
      ),
    },
  ];

  const getAssetInformation = async (assetCode) => {
    await axios
      .get(`${BASE_URL}/asset-management/assets-detail/${assetCode}`)
      .then((res) => {
        console.log(res.data);
        setAssetInformation(res.data);
        setAssetInformationLoading(false);
      })
      .catch((err) => {
        setAssetInformationLoading(false);
        setAssetInformation({
          assetName: 'None',
          assignedBy: 'None',
          assignedDate: null,
          assignedTo: 'None',
          categoryName: 'None',
        });
      });
  };
  const [assetInformationLoading, setAssetInformationLoading] = useState(false);
  const [assetInformation, setAssetInformation] = useState({});
  const [openInformation, setOpenInformation] = useState(false);
  const handleCancelInformation = () => {
    setOpenInformation(false);
    setAssetInformation({});
  };
  const handleOkInformation = () => {
    setOpenInformation(false);
    setAssetInformation({});
  };

  const handleEdit = (assetCode) => {
    navigate(`/asset/edit/${assetCode}`);
  };

  const [confirmLoadingDelete, setConfirmLoadingDelete] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [assetCodeDelete, setAssetCodeDelete] = useState();

  const handleDelete = async (assetCode) => {
    await axios
      .get(`${BASE_URL}/asset-management/${assetCode}`)
      .then(() => {
        setAssetCodeDelete(assetCode);
        setOpenDelete(true);
      })
      .catch((err) => {
        console.log(err);
        setAssetCodeDelete(assetCode);
        setOpenCannotDelete(true);
      });
  };

  const handleOkDelete = async () => {
    setConfirmLoadingDelete(true);
    await axios
      .delete(`${BASE_URL}/asset-management/${assetCodeDelete}`)
      .then(() => {
        setConfirmLoadingDelete(false);
        setOpenDelete(false);
        getAssetByLocation();
      })
      .catch((err) => {
        console.log(err);
        handleCancelDelete();
      });
  };
  const handleCancelDelete = () => {
    setOpenDelete(false);
    setConfirmLoadingDelete(false);
  };

  const [openCannotDelete, setOpenCannotDelete] = useState(false);
  const handleCancelCannotDelete = () => {
    setOpenCannotDelete(false);
  };
  const handleOkCannotDelete = () => {
    navigate(`/asset/edit/${assetCodeDelete}`);
  };

  const navigate = useNavigate();
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
        Asset List
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          marginBottom: '40px',
          marginTop: '30px',
        }}
      >
        <div className="" style={{ width: '180px' }}></div>
        <Search>
          <SearchIconWrapper>
            <SearchIcon onSubmit={handleSubmit} />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search asset code or asset name"
            inputProps={{ 'aria-label': 'search' }}
            onChange={handleSearchChange}
          />
        </Search>

        <Link style={{ listStyle: 'none', textDecoration: 'none' }} to={`/asset/create`}>
          <Button
            variant="contained"
            style={{ height: '38px', width: '180px', fontSize: '18px', backgroundColor: '#1976d2', color: 'white' }}
          >
            Create new asset
          </Button>
        </Link>
      </div>
      <Table
        onRow={(record) => {
          return {
            onClick: () => {
              getAssetInformation(record.assetCode);
              setOpenInformation(true);
              setAssetInformationLoading(true);
            },
          };
        }}
        style={{ width: '100%' }}
        columns={columns}
        dataSource={searchResults}
        onChange={onChange}
        pagination={{
          // onChange: onChangePage,
          current: currentPage,
          defaultPageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ['10'],
        }}
      />

      <Modal
        title="Are you sure?"
        closable={false}
        open={openDelete}
        onOk={handleOkDelete}
        onCancel={handleCancelDelete}
        footer={[
          <Button onClick={handleCancelDelete}>Cancel</Button>,
          <Button key="submit" type="primary" loading={confirmLoadingDelete} onClick={handleOkDelete}>
            Delete
          </Button>,
        ]}
      >
        <p>Do you want to delete this asset?</p>
      </Modal>

      <Modal
        title="Cannot Delete Asset"
        open={openCannotDelete}
        onOk={handleOkCannotDelete}
        onCancel={handleCancelCannotDelete}
        footer={[]}
      >
        <p style={{ marginBottom: 0 }}>Cannot delete the asset because it belongs to one or more historical assignments.</p>
        <p style={{ marginTop: 0 }}>
          If the asset is not able to be used anymore, please update its status in{' '}
          <NavLink to={`/asset/edit/${assetCodeDelete}`}>Edit Asset page</NavLink>
        </p>
      </Modal>

      <Modal
        open={openInformation}
        title="Assignment history of asset"
        onOk={handleOkInformation}
        onCancel={handleCancelInformation}
        closable={false}
        footer={[
          <Button key="submit" type="primary" onClick={handleCancelInformation}>
            OK
          </Button>,
        ]}
      >
        {assetInformationLoading && <Skeleton active />}
        {!assetInformationLoading && (
          <>
            <p>Asset Name: {assetInformation.assetName}</p>
            <p>Category Name: {assetInformation.categoryName}</p>
            <p>Assigned to: {assetInformation.assignedTo}</p>
            <p>Assigned by: {assetInformation.assignedBy}</p>
            <p>
              Assigned Date:{' '}
              {assetInformation.assignedDate === null
                ? 'YYYY-MM-DD'
                : `${moment(assetInformation.assignedDate).format('YYYY-MM-DD')}`}
            </p>
          </>
        )}
      </Modal>
    </div>
  );
};
export default AssetListPage;
