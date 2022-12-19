import React, { useEffect, useState } from 'react';
import { Button, Table } from 'antd';
import axios from 'axios';
import { Excel } from 'antd-table-saveas-excel';
import { BASE_URL } from '../../constants/index';
const onChange = (pagination, filters, sorter, extra) => {
  console.log('params', pagination, filters, sorter, extra);
};

const ReportPage = () => {
  const [searchResults, setSearchResults] = useState([]);

  const getAllAssignmentFunc = () => {
    axios
      .get(`${BASE_URL}/report-management/reports`)
      .then((data) => {
        setSearchResults(data.data.$values);
        console.log(data.data.$values);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    getAllAssignmentFunc();
  }, []);

  const columns = [
    {
      title: 'Category',
      dataIndex: 'categoryName',
      key: 'categoryName',
      sorter: (a, b) => a.categoryName.localeCompare(b.categoryName),
      defaultSortOrder: 'ascend',
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      sorter: (a, b) => a.total - b.total,
    },
    {
      title: 'Assigned ',
      dataIndex: 'assigned',
      key: 'assigned',
      sorter: (a, b) => a.assigned - b.assigned,
    },
    {
      title: 'Available ',
      dataIndex: 'available',
      key: 'available',
      sorter: (a, b) => a.available - b.available,
    },
    {
      title: 'Not Available',
      dataIndex: 'notAvailable',
      key: 'notAvailable',
      sorter: (a, b) => a.notAvailable - b.notAvailable,
    },
    {
      title: 'Waiting For Recycling',
      dataIndex: 'waitingForRecycling',
      key: 'waitingForRecycling',
      sorter: (a, b) => a.waitingForRecycling - b.waitingForRecycling,
    },
    {
      title: 'Recycled',
      dataIndex: 'recycled',
      key: 'recycled',
      sorter: (a, b) => a.recycled - b.recycled,
    },
  ];

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
        Report
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          marginBottom: '10px',
          marginTop: '25px',
        }}
      >
        <Button
          variant="contained"
          style={{
            height: '42px',
            width: '100px',
            fontSize: '18px',
            backgroundColor: '#1976d2',
            color: 'white',
            float: 'right',
          }}
          onClick={() => {
            const excel = new Excel();
            excel.addSheet('Asset').addColumns(columns).addDataSource(searchResults).saveAs('Report_Data_Team5.xlsx');
          }}
        >
          Export
        </Button>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-around', margin: '25px 0px' }}>
        <Table
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

export default ReportPage;
