import { Box, Button } from '@mui/material';
import { Breadcrumb, SimpleCard } from 'app/components';
import React, { useEffect, useState } from 'react';
import axios from '../../../../axios';
import { DELETE_ATTACHMENT, GET_BOOKING_ATTACHMENTS } from 'app/api';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate, useParams } from 'react-router-dom';
import CreateAttachments from '../Modals/CreateAttachments';
import toast, { Toaster } from 'react-hot-toast';

const Container = styled('div')(({ theme }) => ({
  margin: '30px',
  [theme.breakpoints.down('sm')]: { margin: '16px' },
  '& .breadcrumb': {
    marginBottom: '30px',
    [theme.breakpoints.down('sm')]: { marginBottom: '16px' },
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
function BookingAttachments() {
  const params = useParams();
  const navigate = useNavigate();
  const [attachmentList, setAttachmentList] = useState([]);
  const [createAttachments, setCreateAttachments] = useState(false);
  useEffect(() => {
    serviceListAPI();
  }, []);

  const serviceListAPI = async () => {
    await axios
      .get(`${GET_BOOKING_ATTACHMENTS}/${params?.id}`, {
        headers: { 'Content-Type': 'application/json' },
      })
      .then((res) => {
        setAttachmentList(res?.data?.data);
      })
      .catch((err) => console.log(err));
  };
  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      flex: 1,
      sortable: false,
      minWidth: 50,
      maxWidth: 50,
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
                width: '25px',
                fontSize: '13px',
                textAlign: 'center',
              }}
            >
              {item?.row?.id}
            </Box>
          </TableHeading>
        );
      },
    },
    {
      field: 'file',
      headerName: 'Attachment',
      flex: 1,
      sortable: false,
      renderCell: (item) => {
        return (
          <TableHeading
            sx={{
              '& a': {
                '&:hover': {
                  textDecoration: 'underline',
                },
              },
            }}
          >
            <a
              href={`https://api-cleany-backend.herokuapp.com${item?.value}`}
              target="_blank"
              download
            >
              View Attachments
            </a>
          </TableHeading>
        );
      },
    },
    {
      field: 'share_with_customer',
      headerName: 'Shared With Company',
      flex: 1,
      sortable: false,
      renderCell: (item) => {
        return <TableHeading>{item?.value ? 'True' : 'False'}</TableHeading>;
      },
    },
    {
      field: 'share_with_cleaner',
      headerName: 'Shared With Cleaner',
      flex: 1,
      sortable: false,
      renderCell: (item) => {
        return <TableHeading>{item?.value ? 'True' : 'False'}</TableHeading>;
      },
    },
    {
      field: 'additional_info',
      headerName: '',
      flex: 1,
      sortable: false,
      minWidth: 90,
      maxWidth: 90,
      renderCell: (item) => {
        return (
          <Box display={'flex'} alignItems="center" gap={1}>
            <Button variant="outlined" onClick={() => handleDelete(item?.row)} color="error">
              Delete
            </Button>
          </Box>
        );
      },
    },
  ];
  const handleDelete = (item) => {
    toast.promise(
      axios.delete(`${DELETE_ATTACHMENT}/${item?.id}`, {
        headers: { 'Content-Type': 'application/json' },
      }),
      {
        loading: () => {
          return `Deleting Attachment!`;
        },
        success: (res) => {
          serviceListAPI();

          return res?.data?.message;
        },
        error: (err) => {
          return err?.message;
        },
      }
    );
  };
  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb
          routeSegments={[
            { name: 'Bookings', path: '/dashboard/booking-appointments' },
            { name: 'Booking Appointments', path: '/dashboard/booking-appointments' },
            {
              name: `B-${params?.id || 'Booking Details'}`,
              path: `/dashboard/booking-appointments/${params?.id}/details/`,
            },
            {
              name: 'Booking Attachments Overview',
            },
          ]}
        />
      </Box>

      <Box display={'flex'} justifyContent={'end'}>
        <StyledButton
          startIcon={<AddIcon />}
          variant="contained"
          color="primary"
          onClick={() => {
            setCreateAttachments(true);
          }}
        >
          New Attachment
        </StyledButton>
      </Box>

      <SimpleCard title={'Booking Attachments Overview'}>
        <DataTableBox>
          <DataGrid
            sx={{
              [`& .${gridClasses.cell}`]: {
                py: 1,
              },
            }}
            getRowHeight={() => 'auto'}
            disableColumnMenu={true}
            rows={attachmentList || []}
            columns={columns}
            autoHeight={true}
            hideFooter={true}
            checkboxSelection={false}
            disableSelectionOnClick
          />
        </DataTableBox>
      </SimpleCard>
      <CreateAttachments
        open={createAttachments}
        handleClose={() => setCreateAttachments(false)}
        serviceListAPI={serviceListAPI}
      />
      <Toaster position="top-right" />
    </Container>
  );
}

export default BookingAttachments;
