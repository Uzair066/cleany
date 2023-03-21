import { Box, Button } from '@mui/material';
import { Breadcrumb, SimpleCard } from 'app/components';
import React, { useEffect, useState } from 'react';
import axios from '../../../../axios';
import { USER_SIDE_GET_CARDS } from 'app/api';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import moment from 'moment';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import AddPaymentCard from './Modal/AddPayment';

const Container = styled('div')(({ theme }) => ({
  margin: '30px',
  [theme.breakpoints.down('sm')]: { margin: '16px' },
  '& .breadcrumb': {
    marginBottom: '30px',
    [theme.breakpoints.down('sm')]: { marginBottom: '16px' },
    '& h5': {
      margin: 'unset',
    },
  },
}));
const DataTableBox = styled(Box)(() => ({
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
function PaymentMethod() {
  const [cardList, setCardList] = useState([]);
  const [addModal, setAddModal] = useState(false);

  useEffect(() => {
    getCardList();
  }, []);

  const getCardList = async () => {
    await axios
      .get(`${USER_SIDE_GET_CARDS}`, {
        headers: { 'Content-Type': 'application/json' },
      })
      .then((res) => {
        setCardList(res?.data?.data?.data);
      })
      .catch((err) => console.log(err));
  };

  const columns = [
    {
      field: 'last4',
      headerName: 'Crd No',
      flex: 1,
      sortable: false,
      renderCell: (item) => {
        return <TableHeading>**** **** **** {item?.value}</TableHeading>;
      },
    },
    {
      field: 'brand',
      headerName: 'Brand',
      flex: 1,
      sortable: false,
      renderCell: (item) => {
        return <TableHeading>{item?.value}</TableHeading>;
      },
    },
    {
      field: 'exp_month',
      headerName: 'Expiry',
      flex: 1,
      sortable: false,
      renderCell: (item) => {
        return (
          <TableHeading>
            {item?.value}/{item?.row?.exp_year}
          </TableHeading>
        );
      },
    },
  ];

  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb routeSegments={[{ name: 'Payment Method' }]} />
      </Box>

      <Box display={'flex'} justifyContent={'end'}>
        <StyledButton
          startIcon={<AddIcon />}
          variant="contained"
          color="primary"
          onClick={() => setAddModal(true)}
        >
          Add Payment Method
        </StyledButton>
      </Box>

      <SimpleCard>
        <DataTableBox>
          <DataGrid
            sx={{
              [`& .${gridClasses.cell}`]: {
                py: 1,
              },
            }}
            getRowHeight={() => 'auto'}
            disableColumnMenu={true}
            rows={cardList || []}
            columns={columns}
            autoHeight={true}
            hideFooter={true}
            checkboxSelection={false}
            disableSelectionOnClick
          />
        </DataTableBox>
      </SimpleCard>
      <AddPaymentCard
        open={addModal}
        handleClose={() => setAddModal(false)}
        getCardList={getCardList}
      />
    </Container>
  );
}

export default PaymentMethod;
