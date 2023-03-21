import { Box, Container, styled, Grid, Button } from '@mui/material';
import { Breadcrumb, SimpleCard } from 'app/components';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import axios from '../../../../../axios';
import React, { useEffect, useState } from 'react';
import AddPayment from '../Modals/addPayment';
import { GET_PAYROLL_LEDGER_LIST } from 'app/api';

const TableHeading = styled('p')(() => ({
  fontWeight: '400',
  fontSize: '16px',
  color: '#0F0F0F',
  whiteSpace: 'break-spaces',
  margin: 'unset',
}));
const DataTableBox = styled(Box)(() => ({
  marginTop: '-1rem !important',
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

const Payments = () => {
  const [addPaymentModal, setAddPaymentModal] = useState(false);
  const [paymentList, setpaymentList] = useState([]);
  useEffect(() => {
    getPaymentList();
  }, []);
  const getPaymentList = async () => {
    await axios
      .get(`${GET_PAYROLL_LEDGER_LIST}`)
      .then((res) => setpaymentList(res?.data?.data))
      .catch((err) => console.log(err));
  };
  const columns = [
    {
      field: 'service_provider',
      headerName: 'SERVICE PROVIDER',
      width: 250,
      renderCell: (item) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box>
              <TableHeading>
                {item?.row?.service_provider?.user_profile?.first_name}{' '}
                {item?.row?.service_provider?.user_profile?.last_name}
              </TableHeading>
            </Box>
          </Box>
        );
      },
    },
    {
      field: 'id',
      headerName: 'EMAIL',
      width: 250,
      renderCell: (item) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box>
              <TableHeading>{item?.row?.service_provider?.email}</TableHeading>
            </Box>
          </Box>
        );
      },
    },
    {
      field: 'payroll',
      headerName: "PAYROLL ID's",
      width: 250,
      renderCell: (item) => {
        const dataToMap = item?.value?.map((data) => data?.id);
        return <TableHeading>{dataToMap?.toString()}</TableHeading>;
      },
    },
    {
      field: 'total_amount',
      headerName: 'AMOUNT',
      width: 150,
    },
  ];
  return (
    <Box sx={{ mt: 4 }}>
      <Container maxWidth="lg">
        <Box>
          <Breadcrumb
            routeSegments={[
              { name: 'Home', path: '/' },
              { name: 'Payroll', path: '/dashboard/payment' },
              { name: 'Payments', path: '/dashboard/payment' },
            ]}
          />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'end', marginBottom: '1rem' }}>
          <Box>
            <Button variant="contained" onClick={() => setAddPaymentModal(true)}>
              Add Payment
            </Button>
          </Box>
        </Box>
        <SimpleCard>
          <DataTableBox>
            <DataGrid
              sx={{
                [`& .${gridClasses.cell}`]: {
                  py: 2,
                },
              }}
              rows={paymentList}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[5]}
              getRowHeight={() => 'auto'}
              disableColumnMenu={true}
              autoHeight={true}
              checkboxSelection={false}
              disableSelectionOnClick
            />
          </DataTableBox>
        </SimpleCard>
      </Container>
      <AddPayment
        getPaymentList={getPaymentList}
        open={addPaymentModal}
        handleClose={() => setAddPaymentModal(false)}
      />
    </Box>
  );
};

export default Payments;
