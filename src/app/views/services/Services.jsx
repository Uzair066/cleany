import { Box, Button } from '@mui/material';
import { Breadcrumb, SimpleCard } from 'app/components';
import React, { useEffect, useState } from 'react';
import axios from '../../../axios';
import { GET_SERVICE_LIST } from 'app/api';
import { DataGrid, GridToolbarQuickFilter } from '@mui/x-data-grid';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import DeleteService from './Modals/DeleteModal';
import { useNavigate } from 'react-router-dom';

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
}));
function Services() {
  const navigate = useNavigate();
  const [serviceList, setServiceList] = useState([]);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteID, setDeleteID] = useState(null);
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
  function QuickSearchToolbar() {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'end',
          paddingBottom: '1rem',
        }}
      >
        <GridToolbarQuickFilter />
      </Box>
    );
  }
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
      field: 'title',
      headerName: 'Title',
      flex: 1,
      renderCell: (item) => {
        return <TableHeading>{item?.value}</TableHeading>;
      },
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      renderCell: (item) => {
        return <TableHeading>{item?.value}</TableHeading>;
      },
    },
    {
      field: 'colour',
      headerName: 'Color',
      flex: 1,
      renderCell: (item) => {
        return (
          <Box sx={{ background: `${item.value} !important`, width: '100%', pl: 2 }}>
            <TableHeading style={{ color: '#c8cdcc' }}>{item?.value}</TableHeading>
          </Box>
        );
      },
    },
    {
      field: 'description',
      headerName: 'URLs',
      sortable: false,
      flex: 1,
      renderCell: (item) => {
        return (
          <Button
            variant="text"
            sx={{
              '& a': {
                fontWeight: '400',
                fontSize: '16px',
                color: 'black',
                '&:hover': {
                  textDecoration: 'underline',
                },
              },
            }}
          >
            <a href={`/booking/${item?.row?.slug}`}>Visit Page</a>
          </Button>
        );
      },
    },

    {
      field: '',
      headerName: 'Actions',
      flex: 1,
      sortable: false,
      minWidth: 150,
      maxWidth: 150,
      renderCell: (item) => {
        return (
          <Box display={'flex'} alignItems="center">
            <Button
              variant="outlined"
              sx={{
                fontWeight: '400',
                fontSize: '16px',
                whiteSpace: 'break-spaces',
                border: '1px solid #dfd9d9',
                '&:hover': {
                  border: '1px solid #dfd9d9',
                },
              }}
              onClick={() => handleDelete(item?.row)}
            >
              <DeleteOutlineOutlinedIcon style={{ fontSize: '20px', color: '#817272' }} />
            </Button>
            <Button
              variant="outlined"
              sx={{
                fontWeight: '400',
                fontSize: '16px',
                whiteSpace: 'break-spaces',
                border: '1px solid #dfd9d9',
                marginLeft: '10px',
                '&:hover': {
                  border: '1px solid #dfd9d9',
                },
              }}
              onClick={() =>
                navigate(`/dashboard/services/details/${item?.row?.slug}`, {
                  state: item?.row,
                })
              }
            >
              <BorderColorOutlinedIcon style={{ fontSize: '20px', color: '#817272' }} />
            </Button>
          </Box>
        );
      },
    },
  ];

  const handleDelete = (item) => {
    setDeleteID(item.id);
    setDeleteOpen(true);
  };
  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb routeSegments={[{ name: 'Services', path: '/dashboard/services' }]} />
      </Box>

      <Box display={'flex'} justifyContent={'end'}>
        <StyledButton
          startIcon={<AddIcon />}
          variant="contained"
          color="primary"
          onClick={() => {
            navigate('/dashboard/services/create');
          }}
        >
          Create new service
        </StyledButton>
      </Box>

      <SimpleCard>
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
            components={{ Toolbar: QuickSearchToolbar }}
            componentsProps={{
              toolbar: {
                showQuickFilter: true,
                quickFilterProps: { debounceMs: 500 },
              },
            }}
          />
        </DataTableBox>
      </SimpleCard>
      <DeleteService
        open={deleteOpen}
        handleClose={() => setDeleteOpen(false)}
        deleteID={deleteID}
        serviceListAPI={serviceListAPI}
      />
    </Container>
  );
}

export default Services;
