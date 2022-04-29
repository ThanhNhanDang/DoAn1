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

function TableRelay1() {
  const data = useSelector((state) => state.relay1);
  const columns = [
    { field: 'id', headerName: 'ID', width: 200 },
    {
      field: 'thietbi',
      headerName: 'Thiết bị',
      width: 150
    },
    { field: 'topic', headerName: 'Topic', width: 130 },
    {
      field: 'time',
      headerName: 'Thời gian',
      width: 200,
      type: 'date'
    },
    {
      field: 'state',
      headerName: 'Trạng thái',
      width: 100,

      renderCell: (params) => (
        <h3
          style={{
            fontWeight: '700',
            color: params.row.state === 'ON' ? '#b30000' : '#364cf4'
          }}
        >
          {params.row.state}
        </h3>
      )
    }
  ];

  return (
    <Card>
      <CardHeader title="Bảng Thống Kê Trạng Thái Thiết Bị 1" subheader="Trạng Thái Thiết Bị 1" />
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

export default TableRelay1;
