import { Box, Button, Menu, MenuItem } from '@mui/material';
import { Breadcrumb, SimpleCard } from 'app/components';
import React, { useEffect, useState } from 'react';
import axios from '../../../axios';
import { ADMIN_SIDE_CUSTOMER_LIST, MANAGER_LIST } from 'app/api';
import { DataGrid, GridToolbarQuickFilter } from '@mui/x-data-grid';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import IosShareIcon from '@mui/icons-material/IosShare';
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';

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
function Customers() {
  const navigate = useNavigate();
  const [anchorEls, setAnchorEls] = useState({});
  const [customerList, setCustomerList] = useState([]);
  const [editData, setEditData] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteID, setDeleteID] = useState(null);
  useEffect(() => {
    serviceListAPI();
  }, []);

  const serviceListAPI = async () => {
    await axios
      .get(`${MANAGER_LIST}`, {
        headers: { 'Content-Type': 'application/json' },
      })
      .then((res) => {
        setCustomerList(res?.data?.data);
      })
      .catch((err) => console.log(err));
  };
  const openDropdown = (event, index) => {
    const updatedAnchorEls = { ...anchorEls };
    if (updatedAnchorEls[index]) updatedAnchorEls[index] = null;
    else updatedAnchorEls[index] = event.currentTarget;
    setAnchorEls(updatedAnchorEls);
  };

  const closeDropdown = (index) => {
    const updatedAnchorEls = { ...anchorEls };
    updatedAnchorEls[index] = null;
    setAnchorEls(updatedAnchorEls);
  };

  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      flex: 1,
      sortable: false,
      minWidth: 70,
      maxWidth: 70,
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
              {item?.row?.user_profile?.id}
            </Box>
          </TableHeading>
        );
      },
    },
    {
      field: 'user_profile',
      headerName: 'Customers',
      flex: 1,
      sortable: false,
      minWidth: 220,
      renderCell: (item) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box>
              <TableHeading style={{ fontWeight: 'bold' }}>
                {item?.value?.first_name} {item?.value?.last_name}
              </TableHeading>
              <TableHeading>{item?.row?.email}</TableHeading>
              <TableHeading>{item?.value?.phone_number}</TableHeading>
            </Box>
          </Box>
        );
      },
    },

    {
      field: 'role',
      headerName: 'Address',
      flex: 1,
      sortable: false,
      minWidth: 350,
      renderCell: (item) => {
        return (
          <Box>
            <TableHeading style={{ fontWeight: 'bold' }}>
              {item?.row?.user_profile?.address}
            </TableHeading>
            <TableHeading>
              {item?.row?.user_profile?.country} - {item?.row?.user_profile?.zip_code}
            </TableHeading>
          </Box>
        );
      },
    },

    {
      field: 'is_active',
      headerName: 'Status',
      flex: 1,
      sortable: false,
      minWidth: 100,
      renderCell: (item) => {
        return (
          <TableHeading>
            {item?.row?.user_profile?.status === 'Active' ? (
              <Box
                sx={{
                  textTransform: 'uppercase',
                  background: '#2fb344',
                  padding: '0.3rem',
                  borderRadius: '4px',
                  color: 'white',
                  fontSize: '13px',
                }}
              >
                ACTIVE
              </Box>
            ) : (
              <Box
                sx={{
                  textTransform: 'uppercase',
                  background: '#d63939',
                  padding: '0.25rem',
                  borderRadius: '4px',
                  color: 'white',
                  fontSize: '13px',
                }}
              >
                INACTIVE
              </Box>
            )}
          </TableHeading>
        );
      },
    },
    {
      field: 'email',
      headerName: 'Action',
      flex: 1,
      sortable: false,
      minWidth: 180,
      renderCell: (item) => {
        const index = item.api.getRowIndex(item.row.id);
        const obj = { ...item?.row, update_btn: true };
        return (
          <Box display={'flex'} alignItems="center" gap={1}>
            <Button
              variant="outlined"
              onClick={() => {
                closeDropdown(index);
                navigate(`/dashboard/managers/${obj?.id}/update`, { state: obj });
              }}
            >
              View
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                closeDropdown(index);
                navigate(`/dashboard/managers/${obj?.id}/update`, {
                  state: item?.row,
                });
              }}
            >
              Edit
            </Button>
          </Box>
        );
      },
    },
  ];

  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb
          routeSegments={[
            { name: 'Managers', path: '/dashboard/managers' },
            { name: 'All Managers' },
          ]}
        />
      </Box>

      <Box display={'flex'} justifyContent={'end'} gap={2}>
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
      </Box>

      <SimpleCard>
        <DataTableBox>
          <DataGrid
            // getRowHeight={() => 'auto'}
            rowHeight={100}
            disableColumnMenu={true}
            rows={customerList}
            columns={columns}
            autoHeight={true}
            hideFooter={true}
            checkboxSelection={false}
            disableSelectionOnClick
          />
        </DataTableBox>
      </SimpleCard>
    </Container>
  );
}

export default Customers;
