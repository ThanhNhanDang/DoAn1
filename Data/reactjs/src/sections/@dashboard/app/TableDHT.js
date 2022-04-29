import React from 'react';
import {
  DataGrid,
  gridPageCountSelector,
  gridPageSelector,
  useGridApiContext,
  useGridSelector,
  GridToolbar
} from '@mui/x-data-grid';
import Pagination from '@mui/material/Pagination';
import { Card, CardHeader, Box } from '@mui/material';
import { useSelector } from 'react-redux';

function CustomPagination() {
  const apiRef = useGridApiContext();
  const page = useGridSelector(apiRef, gridPageSelector);
  const pageCount = useGridSelector(apiRef, gridPageCountSelector);

  return (
    <Pagination
      color="primary"
      count={pageCount}
      page={page + 1}
      onChange={(event, value) => apiRef.current.setPage(value - 1)}
    />
  );
}

function TableDHT() {
  const data = useSelector((state) => state.dht);
  const columns = [
    { field: 'id', headerName: 'ID', width: 110, editable: true },
    {
      field: 'thietbi',
      headerName: 'Thiết bị',
      width: 100
    },
    { field: 'topic', headerName: 'Topic', width: 130, editable: false },
    {
      field: 'time',
      headerName: 'Thời gian',
      width: 160,
      type: 'date',
      editable: true
    },
    {
      field: 'temp',
      headerName: 'Nhiệt độ',
      width: 90,
      type: 'number',
      editable: true
    },
    {
      field: 'humid',
      headerName: 'Độ ẩm',
      width: 100,
      type: 'number',
      editable: true
    },
    {
      field: 'warning',
      headerName: 'Báo động',
      width: 150,
      editable: true,
      renderCell: (param) => (
        <h4
          style={{
            fontWeight: '700',
            color: param.row.warning ? '#990500' : '#009914'
          }}
        >
          {param.row.warning ? 'BÁO ĐỘNG' : 'BÌNH THƯỜNG'}
        </h4>
      )
    }
  ];

  return (
    <Card>
      <CardHeader title="Bảng Thống Kê Nhiệt Độ Và Độ Ẩm" subheader="Nhiệt Độ Và Độ Ẩm" />
      <Box sx={{ p: 2, pb: 1 }} dir="ltr">
        <div style={{ height: '550px', width: '100%' }}>
          <DataGrid
            rows={data}
            columns={columns}
            pageSize={8}
            rowsPerPageOptions={[10]}
            components={{
              Pagination: CustomPagination,
              Toolbar: GridToolbar
            }}
            pagination
          />
        </div>
      </Box>
    </Card>
  );
}

export default TableDHT;
