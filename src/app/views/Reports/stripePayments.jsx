import { Box, Button } from '@mui/material';
import { Breadcrumb, SimpleCard } from 'app/components';
import React, { useEffect, useState } from 'react';
import axios from '../../../axios';
import { BOOKING_BY_CREATION_DATE, GET_STRIPE_PAYMENTS } from 'app/api';
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
function StripePayments() {
  const [customerList, setCustomerList] = useState([]);

  useEffect(() => {
    serviceListAPI();
  }, []);

  const serviceListAPI = async () => {
    await axios
      .get(`${GET_STRIPE_PAYMENTS}`, {
        headers: { 'Content-Type': 'application/json' },
      })
      .then((res) => {
        setCustomerList(res?.data?.data);
      })
      .catch((err) => console.log(err));
  };

  const columns = [
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
      field: '',
      headerName: 'Transaction',
      flex: 1,
      sortable: false,
      minWidth: 220,
      renderCell: (item) => {
        return <TableHeading>Charged</TableHeading>;
      },
    },
    {
      field: 'user',
      headerName: 'Name',
      flex: 1,
      sortable: false,
      minWidth: 220,
      renderCell: (item) => {
        return (
          <TableHeading>
            {item?.value?.user_profile?.first_name} {item?.value?.user_profile?.last_name}
          </TableHeading>
        );
      },
    },
    {
      field: 'amount',
      headerName: 'Charges',
      flex: 1,
      sortable: false,
      minWidth: 220,
      renderCell: (item) => {
        return <TableHeading>${item?.value?.toFixed(2)}</TableHeading>;
      },
    },
  ];

  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb
          routeSegments={[
            { name: 'Reports', path: '/dashboard/reports/stripe-payments' },
            { name: 'Stripe Charges' },
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
            rows={customerList}
            columns={columns}
            autoHeight={true}
            pageSize={10}
            rowsPerPageOptions={[10]}
            checkboxSelection={false}
            disableSelectionOnClick
          />
        </DataTableBox>
      </SimpleCard>
    </Container>
  );
}

export default StripePayments;
