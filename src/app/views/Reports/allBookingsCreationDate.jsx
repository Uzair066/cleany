import { Box, Button, MenuItem, Pagination, TextField } from '@mui/material';
import { Breadcrumb, SimpleCard } from 'app/components';
import React, { useEffect, useState } from 'react';
import axios from '../../../axios';
import { BOOKING_BY_CREATION_DATE } from 'app/api';
import { DataGrid } from '@mui/x-data-grid';
import { styled } from '@mui/material/styles';

import moment from 'moment';

const Container = styled('div')(({ theme }) => ({
  margin: '30px',
  [theme.breakpoints.down('sm')]: { margin: '16px' },
  '& .breadcrumb': {
    marginBottom: '30px',
    [theme.breakpoints.down('sm')]: { marginBottom: '16px' },
  },
}));
const DataTableBox = styled(Box)(() => ({
  overflowX: 'auto',
  width: '100%',
  '& .MuiDataGrid-main': {},
  '& .MuiDataGrid-columnHeaders': {
    border: 'none !important',
  },
  '& .MuiDataGrid-columnHeaderTitle': {
    fontWeight: '700',
    fontSize: '18px',
    color: '#0F0F0F',
  },
  '& .MuiDataGrid-root': {
    border: 'none !important',
    '& .MuiDataGrid-columnHeader': {
      background: 'unset !important',
      '&:focus': {
        outline: 'none !important',
      },
      '&:focus-within': {
        outline: 'none !important',
      },
    },
    '& .MuiDataGrid-cell': {
      '&:focus': {
        outline: 'none !important',
      },
      '&:focus-within': {
        outline: 'none !important',
      },
    },
    '& .MuiDataGrid-columnSeparator': {
      visibility: 'hidden',
    },
  },
}));
const StyledButton = styled(Button)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  fontSize: '16px',
}));
const TableHeading = styled('p')(() => ({
  fontWeight: '400',
  fontSize: '16px',
  color: '#0F0F0F',
  whiteSpace: 'break-spaces',
  margin: 'unset',
}));
function AllBookingsCreationDate() {
  const [customerList, setCustomerList] = useState({});
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(25);

  useEffect(() => {
    serviceListAPI();
  }, [page, perPage]);

  const serviceListAPI = async () => {
    await axios
      .get(`${BOOKING_BY_CREATION_DATE}?page=${page}&per_page=${perPage}`, {
        headers: { 'Content-Type': 'application/json' },
      })
      .then((res) => {
        setCustomerList(res?.data);
      })
      .catch((err) => console.log(err));
  };

  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      flex: 1,
      sortable: false,
      minWidth: 100,
      maxWidth: 100,
      renderCell: (item) => {
        return (
          <TableHeading>
            <Box
              sx={{
                background: '#4263eb',
                padding: '0.25rem',
                borderRadius: '4px',
                color: 'white',
                height: '25px',
                width: 'fit-content',
                fontSize: '13px',
                textAlign: 'center',
              }}
            >
              {item?.value}
            </Box>
          </TableHeading>
        );
      },
    },
    {
      field: 'created_at',
      headerName: 'Creation Date',
      flex: 1,
      sortable: false,
      minWidth: 220,
      renderCell: (item) => {
        return <TableHeading>{moment.utc(item?.value).format('lll')}</TableHeading>;
      },
    },
    {
      field: 'service',
      headerName: 'Service',
      flex: 1,
      sortable: false,
      minWidth: 220,
      renderCell: (item) => {
        return <TableHeading>{item?.row?.bod?.frequency?.service?.title}</TableHeading>;
      },
    },
    {
      field: 'bod',
      headerName: 'Name',
      flex: 1,
      sortable: false,
      minWidth: 220,
      renderCell: (item) => {
        return (
          <TableHeading>
            {item?.value?.bod_contact_info?.first_name} {item?.value?.bod_contact_info?.last_name}
          </TableHeading>
        );
      },
    },
    {
      field: 'additional_info',
      headerName: 'City',
      flex: 1,
      sortable: false,
      minWidth: 220,
      renderCell: (item) => {
        return <TableHeading>{item?.row?.bod?.bod_service_location?.city}</TableHeading>;
      },
    },
  ];

  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb
          routeSegments={[
            { name: 'Reports', path: '/dashboard/booking-creation-date' },
            { name: 'All Bookings (by Creation Date)' },
          ]}
        />
      </Box>

      {/* <Box display={'flex'} justifyContent={'end'} gap={2}>
        <StyledButton
          startIcon={<AddIcon />}
          variant="contained"
          color="primary"
          onClick={() => {
            navigate('/dashboard/managers/create');
          }}
        >
          Create New
        </StyledButton>
        <StyledButton startIcon={<IosShareIcon />} variant="contained" color="primary">
          Import Customers as CSV
        </StyledButton>
        <StyledButton startIcon={<SystemUpdateAltIcon />} variant="contained" color="primary">
          Export
        </StyledButton>
      </Box> */}

      <SimpleCard>
        <DataTableBox>
          <DataGrid
            // getRowHeight={() => 'auto'}
            rowHeight={70}
            disableColumnMenu={true}
            rows={customerList?.data || []}
            columns={columns}
            autoHeight={true}
            hideFooter={true}
            checkboxSelection={false}
            disableSelectionOnClick
          />
        </DataTableBox>
        {!!customerList?.data?.length && (
          <Box display="flex" alignItems={'center'} gap={3}>
            <Pagination
              sx={{
                '& .Mui-selected': {
                  background: '#1976d2 !important',
                  color: 'white',
                },
              }}
              count={customerList?.total_page}
              page={page}
              onChange={(event, value) => setPage(value)}
              variant="contained"
              color="primary"
              shape="rounded"
            />
            <Box>Rows per page </Box>
            <TextField
              sx={{ width: '6rem' }}
              size="small"
              type={'number'}
              inputProps={{ min: 0 }}
              placeholder="Enter rows"
              select
              id="outlined-select-currency"
              value={perPage}
              onChange={(e) => {
                setPage(1);
                setPerPage(e.target.value);
              }}
            >
              <MenuItem value={25}>25</MenuItem>
              <MenuItem value={50}>50</MenuItem>
              <MenuItem value={100}>100</MenuItem>
            </TextField>
          </Box>
        )}
      </SimpleCard>
    </Container>
  );
}

export default AllBookingsCreationDate;
