import { Box, Button, Menu, MenuItem } from '@mui/material';
import { Breadcrumb, SimpleCard } from 'app/components';
import React, { useEffect, useState } from 'react';
import axios from '../../../axios';
import { GET_SERVICE_PROVIDER_LIST } from 'app/api';
import { DataGrid } from '@mui/x-data-grid';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

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
function ServiceProvider() {
  const navigate = useNavigate();
  const [anchorEls, setAnchorEls] = useState({});
  const [serviceProviderList, setServiceProviderList] = useState([]);
  const [editData, setEditData] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteID, setDeleteID] = useState(null);
  useEffect(() => {
    serviceListAPI();
  }, []);

  const serviceListAPI = async () => {
    await axios
      .get(`${GET_SERVICE_PROVIDER_LIST}`, {
        headers: { 'Content-Type': 'application/json' },
      })
      .then((res) => {
        setServiceProviderList(res?.data?.data);
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
      headerName: 'Service Provider',
      flex: 1,
      sortable: false,
      minWidth: 300,
      renderCell: (item) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ borderRadius: '4px', height: '40px', width: '40px', background: '#e0e2e5' }}>
              {/* {item?.row?.user_profile?.profile_picture && (
                <img
                  style={{ width: '100%', height: '100%' }}
                  src={`https://api-cleany-backend.herokuapp.com${item?.row?.user_profile?.profile_picture}`}
                  alt="photo"
                />
              )} */}
            </Box>
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
      field: '',
      headerName: 'Work Hours',
      flex: 1,
      sortable: false,
      minWidth: 120,
      renderCell: (item) => {
        return (
          <TableHeading
            sx={{
              cursor: 'pointer',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            View
          </TableHeading>
        );
      },
    },
    {
      field: 'is_leave',
      headerName: 'Hourly Rate',
      flex: 1,
      sortable: false,
      minWidth: 120,
      renderCell: (item) => {
        return <TableHeading>{item?.row?.user_profile?.hourly_rate}</TableHeading>;
      },
    },
    {
      field: 'leave_time',
      headerName: 'Color',
      flex: 1,
      minWidth: 120,
      renderCell: (item) => {
        return (
          <Box
            sx={{
              background: `${item?.row?.user_profile?.color} !important`,
              width: '100%',
              pl: 2,
              py: 2,
            }}
          >
            <TableHeading style={{ color: '#c8cdcc' }}>
              {item?.row?.user_profile?.color}
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
      minWidth: 130,
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
      headerName: '',
      flex: 1,
      minWidth: 200,
      maxWidth: 200,
      sortable: false,
      renderCell: (item) => {
        const index = item.api.getRowIndex(item.row.id);
        const obj = { ...item?.row, update_btn: true };
        return (
          <Box display={'flex'} alignItems="center" gap={1}>
            <Button
              variant="outlined"
              onClick={() => {
                closeDropdown(index);
                navigate(`/dashboard/service-providers/${obj?.id}/update`, { state: obj });
              }}
            >
              View
            </Button>
            <Box>
              <Button
                variant="outlined"
                id={`basic-button${index}`}
                aria-controls={Boolean(anchorEls[index]) ? `basic-menu${index}` : undefined}
                aria-haspopup="true"
                aria-expanded={Boolean(anchorEls[index]) ? 'true' : undefined}
                onClick={(e) => openDropdown(e, index)}
                endIcon={<ArrowDropDownIcon />}
              >
                Actions
              </Button>
              <Menu
                id={`basic-menu${index}`}
                MenuListProps={{
                  'aria-labelledby': `basic-button${index}`,
                }}
                anchorEl={anchorEls[index]}
                open={Boolean(anchorEls[index])}
                onClose={() => closeDropdown(index)}
              >
                <MenuItem
                  onClick={() => {
                    navigate(`/dashboard/service-providers/${item?.row?.id}/work_calendar/`, {
                      state: item?.row,
                    });
                  }}
                >
                  Work Calendar
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    closeDropdown(index);
                    navigate(`/dashboard/service-providers/${obj?.id}/update`, {
                      state: item?.row,
                    });
                  }}
                >
                  Update
                </MenuItem>
              </Menu>
            </Box>
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
        <Breadcrumb
          routeSegments={[
            { name: 'Service Provider', path: '/dashboard/service-providers' },
            { name: 'All Service Providers' },
          ]}
        />
      </Box>

      <Box display={'flex'} justifyContent={'end'}>
        <StyledButton
          startIcon={<AddIcon />}
          variant="contained"
          color="primary"
          onClick={() => {
            navigate('/dashboard/service-providers/create');
          }}
        >
          Create New
        </StyledButton>
      </Box>

      <SimpleCard>
        <DataTableBox>
          <DataGrid
            // getRowHeight={() => 'auto'}
            rowHeight={100}
            disableColumnMenu={true}
            rows={serviceProviderList}
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

export default ServiceProvider;
