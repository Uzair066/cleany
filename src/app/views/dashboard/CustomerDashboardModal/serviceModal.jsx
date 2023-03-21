import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import axios from '../../../../axios';
import { Box, styled } from '@mui/material';
import { GET_SERVICE_LIST } from 'app/api';
import { DataGrid } from '@mui/x-data-grid';

const DataTableBox = styled(Box)(() => ({
  overflowY: 'auto',
  maxHeight: '25rem',
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
const TableHeading = styled('p')(() => ({
  fontWeight: '400',
  fontSize: '16px',
  color: '#0F0F0F',
  whiteSpace: 'break-spaces',
}));

function ServiceModal({ open, handleClose }) {
  const [serviceList, setServiceList] = useState([]);

  useEffect(() => {
    serviceListAPI();
  }, []);

  const serviceListAPI = async () => {
    await axios
      .get(`${GET_SERVICE_LIST}`, {
        headers: { 'Content-Type': 'application/json' },
      })
      .then((res) => setServiceList(res?.data?.data))
      .catch((err) => console.log(err));
  };

  const columns = [
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
      renderCell: (item) => {
        return <TableHeading>{item?.value}</TableHeading>;
      },
    },

    {
      field: 'description',
      headerName: 'Booking Page',
      sortable: false,
      flex: 1,
      minWidth: 140,
      maxWidth: 140,
      renderCell: (item) => {
        return (
          <Button
            variant="contained"
            sx={{
              '& a': {
                fontWeight: '400',
                fontSize: '16px',
              },
            }}
            color="primary"
          >
            <a href={`/customerbook/${item?.row?.slug}`}>Book Now</a>
          </Button>
        );
      },
    },
  ];

  return (
    <>
      <Dialog
        open={open}
        onClose={() => {
          handleClose();
        }}
        maxWidth={'xs'}
        PaperProps={{
          sx: {
            width: '100%',
          },
        }}
        aria-labelledby="package-item"
        aria-describedby="package-item-description"
      >
        <DialogTitle id="package-item" style={{ fontSize: '1.5rem' }}>
          Cleany Services
        </DialogTitle>
        <DialogContent>
          <DataTableBox>
            <DataGrid
              getRowHeight={() => 'auto'}
              disableColumnMenu={true}
              rows={serviceList}
              columns={columns}
              autoHeight={true}
              hideFooter={true}
              checkboxSelection={false}
              disableSelectionOnClick
              componentsProps={{
                toolbar: {
                  showQuickFilter: true,
                  quickFilterProps: { debounceMs: 500 },
                },
              }}
            />
          </DataTableBox>
          <Box display={'flex'} alignItems="center" justifyContent={'end'} sx={{ mb: 2, mt: 3 }}>
            <Button
              onClick={() => {
                handleClose();
              }}
              variant="outlined"
              color="primary"
              sx={{ mr: 2 }}
            >
              Cancel
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ServiceModal;
