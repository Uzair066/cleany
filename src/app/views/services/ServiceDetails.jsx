import { Box, Button, Grid, IconButton, Menu, MenuItem, Switch, Typography } from '@mui/material';
import { Breadcrumb, SimpleCard } from 'app/components';
import React, { useEffect, useState } from 'react';
import axios from '../../../axios';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import { useLocation, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { RETRIEVE_SERVICE, UPDATE_SERVICE_STATUS } from 'app/api';
import { DataGrid } from '@mui/x-data-grid';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import DeletePackage from './Modals/DeletePackages';
import DeleteExtra from './Modals/DeleteExtraModal';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import UpdateServiceModal from './Modals/UpdateService';
import CreateExtraModal from './Modals/CreateExtra';
import CreatePackageModal from './Modals/CreatePackage';
import UpdatePackageModal from './Modals/UpdatePackage';

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

  '& .MuiDataGrid-columnHeaderTitle': {
    fontWeight: '500',
    fontSize: '14px',
    color: '#0F0F0F',
  },
  '& .MuiDataGrid-root': {
    borderLeft: 'none !important',
    borderRight: 'none !important',
    borderRadius: 'unset !important',
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
  fontSize: '14px',
  color: '#0F0F0F',
  whiteSpace: 'break-spaces',
  margin: 'unset !important',
}));

function ServiceDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const [anchorEls, setAnchorEls] = useState({});
  const [anchorEls2, setAnchorEls2] = useState({});
  const [serviceData, setServiceData] = useState(null);
  const [packagesData, setPackagesData] = useState([]);
  const [extrasData, setExtrasData] = useState([]);
  const [deletePackageModal, setDeletePackageModal] = useState(false);
  const [deleteExtraModal, setDeleteExtraModal] = useState(false);
  const [selectedPackage, setselectedPackage] = useState({});
  const [selectedExtra, setSelectedExtra] = useState({});
  const [serviceStatus, setserviceStatus] = useState(false);
  const [updateServiceDataModal, setUpdateServiceDataModal] = useState(false);
  const [createExtraModal, setCreateExtraModal] = useState(false);
  const [createPackageModal, setCreatePackageModal] = useState(false);
  const [updatePackageModal, setUpdatePackageModal] = useState(false);
  const [selectedPackageData, setSelectedPackageData] = useState({});

  useEffect(() => {
    retrieveService();
  }, [state?.id]);
  const retrieveService = async () => {
    await axios
      .get(`${RETRIEVE_SERVICE}/${state?.id}`, {
        headers: { 'Content-Type': 'application/json' },
      })
      .then((res) => {
        setServiceData(res?.data?.data);
        setPackagesData(res?.data?.data?.packages);
        setExtrasData(res?.data?.data?.extras);
        if (res?.data?.data?.status === 'Draft') {
          setserviceStatus(false);
        } else {
          setserviceStatus(true);
        }
      })
      .catch((err) => console.log(err));
  };

  const openDropdown = (event, index) => {
    const updatedAnchorEls = { ...anchorEls };
    if (updatedAnchorEls[index]) updatedAnchorEls[index] = null;
    else updatedAnchorEls[index] = event.currentTarget;
    setAnchorEls(updatedAnchorEls);
  };
  const openDropdown2 = (event, index) => {
    const updatedAnchorEls = { ...anchorEls2 };
    if (updatedAnchorEls[index]) updatedAnchorEls[index] = null;
    else updatedAnchorEls[index] = event.currentTarget;
    setAnchorEls2(updatedAnchorEls);
  };

  const closeDropdown = (index) => {
    const updatedAnchorEls = { ...anchorEls };
    updatedAnchorEls[index] = null;
    setAnchorEls(updatedAnchorEls);
  };
  const closeDropdown2 = (index) => {
    const updatedAnchorEls = { ...anchorEls2 };
    updatedAnchorEls[index] = null;
    setAnchorEls2(updatedAnchorEls);
  };

  const packages = [
    {
      field: 'title',
      headerName: 'Package',
      flex: 1,
      minWidth: 230,
      sortable: false,
      renderCell: (item) => {
        // return <TableHeading>{item?.value}</TableHeading>;
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{ borderRadius: '4px', height: '40px', width: '40px', background: '#e0e2e5' }}
            ></Box>
            <Box>
              <TableHeading style={{ fontWeight: 'bold' }}>{item?.value}</TableHeading>
              <TableHeading>{item?.row?.item?.length} order ongoing</TableHeading>
              <TableHeading>{item?.row?.item?.length} items</TableHeading>
            </Box>
          </Box>
        );
      },
    },
    {
      field: 'item',
      headerName: 'Items',
      flex: 1,
      sortable: false,
      renderCell: (item) => {
        return (
          <Box
            sx={{
              color: '#206bc4',
              fontWeight: '400',
              fontSize: '14px',
              whiteSpace: 'break-spaces',
              cursor: 'pointer',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
            onClick={() => {
              setSelectedPackageData(item?.row);
              setUpdatePackageModal(true);
            }}
          >
            View
          </Box>
        );
      },
    },
    {
      field: '',
      headerName: 'Actions',
      flex: 1,
      minWidth: 75,
      maxWidth: 75,
      sortable: false,
      renderCell: (item) => {
        const index = item.api.getRowIndex(item.row.id);
        return (
          <Box>
            <IconButton
              id={`basic-button${index}`}
              aria-controls={Boolean(anchorEls[index]) ? `basic-menu${index}` : undefined}
              aria-haspopup="true"
              aria-expanded={Boolean(anchorEls[index]) ? 'true' : undefined}
              onClick={(e) => openDropdown(e, index)}
            >
              <MoreHorizIcon />
            </IconButton>
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
                  closeDropdown(index);
                  setselectedPackage(item?.row);
                  setDeletePackageModal(true);
                }}
              >
                Delete
              </MenuItem>
            </Menu>
          </Box>
        );
      },
    },
  ];
  const extras = [
    {
      field: 'title',
      headerName: 'Extra',
      flex: 1,
      sortable: false,
      renderCell: (item) => {
        // return <TableHeading>{item?.value}</TableHeading>;
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{ borderRadius: '4px', height: '40px', width: '40px', background: '#e0e2e5' }}
            ></Box>
            <Box>
              <TableHeading style={{ fontWeight: 'bold' }}>{item?.value}</TableHeading>
              <TableHeading>Time Hrs: {item?.row?.time_hrs}</TableHeading>
              <TableHeading>Cost: {item?.row?.price}</TableHeading>
            </Box>
          </Box>
        );
      },
    },
    {
      field: '',
      headerName: 'Actions',
      flex: 1,
      minWidth: 150,
      maxWidth: 150,
      sortable: false,
      renderCell: (item) => {
        const index = item.api.getRowIndex(item.row.id);
        return (
          <Box display={'flex'} alignItems="center">
            <Button
              sx={{ marginRight: '10px' }}
              variant="outlined"
              color="info"
              onClick={() => {
                setSelectedExtra(item?.row);
                setCreateExtraModal(true);
              }}
            >
              View
            </Button>
            <Box>
              <IconButton
                id={`basic-button${index}`}
                aria-controls={Boolean(anchorEls2[index]) ? `basic-menu${index}` : undefined}
                aria-haspopup="true"
                aria-expanded={Boolean(anchorEls2[index]) ? 'true' : undefined}
                onClick={(e) => openDropdown2(e, index)}
              >
                <MoreHorizIcon />
              </IconButton>
              <Menu
                id={`basic-menu${index}`}
                MenuListProps={{
                  'aria-labelledby': `basic-button${index}`,
                }}
                anchorEl={anchorEls2[index]}
                open={Boolean(anchorEls2[index])}
                onClose={() => closeDropdown2(index)}
              >
                <MenuItem
                  onClick={() => {
                    closeDropdown2(index);
                    setSelectedExtra(item?.row);
                    setDeleteExtraModal(true);
                  }}
                >
                  Delete
                </MenuItem>
              </Menu>
            </Box>
          </Box>
        );
      },
    },
  ];
  const handleStatusChange = (event) => {
    const data = {
      id: serviceData?.id,
      status: event.target.checked ? 'published' : 'Draft',
    };
    setserviceStatus(event.target.checked);

    toast.promise(
      axios.put(`${UPDATE_SERVICE_STATUS}`, data, {
        headers: { 'Content-Type': 'application/json' },
      }),
      {
        loading: () => {
          return `Updating Status!`;
        },
        success: (res) => {
          retrieveService();

          return res?.data?.message;
        },
        error: (err) => {
          setserviceStatus(!event.target.checked);
          return err?.message;
        },
      }
    );
  };
  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb
          routeSegments={[{ name: 'Services', path: '/dashboard/services' }, { name: 'Update' }]}
        />
      </Box>

      <Box display={'flex'} justifyContent={'end'} gap={2}>
        <StyledButton
          startIcon={<AddIcon />}
          variant="contained"
          color="primary"
          onClick={() => {
            setCreatePackageModal(true);
            setselectedPackage({});
          }}
        >
          Package
        </StyledButton>
        <StyledButton
          startIcon={<AddIcon />}
          variant="contained"
          color="primary"
          onClick={() => {
            setCreateExtraModal(true);
            setSelectedExtra({});
          }}
        >
          Extra
        </StyledButton>
      </Box>
      <Grid container spacing={2}>
        <Grid item sm={9} md={9} lg={10} xl={10}>
          <SimpleCard title={`Service: ${serviceData?.slug.toLowerCase()}`}>
            <Grid container spacing={2}>
              <Grid
                item
                sm={12}
                md={12}
                lg={6}
                xl={6}
                sx={{
                  '& .MuiPaper-elevation': {
                    paddingLeft: 'unset !important',
                    paddingRight: 'unset !important',
                    paddingBottom: 'unset !important',
                  },
                }}
              >
                <SimpleCard title="Packages" padding={true}>
                  <DataTableBox>
                    <DataGrid
                      rowHeight={75}
                      disableColumnMenu={true}
                      rows={packagesData}
                      columns={packages}
                      autoHeight={true}
                      hideFooter={true}
                      checkboxSelection={false}
                      disableSelectionOnClick
                    />
                  </DataTableBox>
                </SimpleCard>
              </Grid>
              <Grid
                item
                sm={12}
                md={12}
                lg={6}
                xl={6}
                sx={{
                  '& .MuiPaper-elevation': {
                    paddingLeft: 'unset !important',
                    paddingRight: 'unset !important',
                    paddingBottom: 'unset !important',
                  },
                }}
              >
                <SimpleCard title="Extras" padding={true}>
                  <DataTableBox>
                    <DataGrid
                      rowHeight={75}
                      disableColumnMenu={true}
                      rows={extrasData}
                      columns={extras}
                      autoHeight={true}
                      hideFooter={true}
                      checkboxSelection={false}
                      disableSelectionOnClick
                    />
                  </DataTableBox>
                </SimpleCard>
              </Grid>
            </Grid>
          </SimpleCard>
        </Grid>
        <Grid
          item
          sm={3}
          md={3}
          lg={2}
          xl={2}
          sx={{
            '& .MuiPaper-elevation': {
              paddingLeft: '10px !important',
              paddingRight: '10px !important',
              paddingBottom: ' !important',
              height: 'fit-content !important',
            },
          }}
        >
          <SimpleCard title="Basic Info">
            <Typography
              variant="body1"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1rem',
              }}
            >
              Status:{' '}
              {serviceData?.status && (
                <span
                  style={
                    serviceData?.status === 'Draft'
                      ? {
                          background: '#FF3D57',
                          padding: '5px',
                          borderRadius: '4px',
                          color: 'white',
                          marginLeft: 'auto',
                        }
                      : {
                          background: 'rgb(102, 187, 106)',
                          padding: '5px',
                          borderRadius: '4px',
                          color: 'white',
                        }
                  }
                >
                  {serviceData?.status.toUpperCase()}
                </span>
              )}
            </Typography>
            <Box
              display={'flex'}
              alignItems="center"
              justifyContent={'space-between'}
              sx={{ marginBottom: '1rem' }}
            >
              <Typography variant="body1">Status:</Typography>
              <Switch
                checked={serviceStatus}
                onChange={handleStatusChange}
                inputProps={{ 'aria-label': 'controlled' }}
              />
            </Box>
            <Box
              display={'flex'}
              alignItems="center"
              justifyContent={'space-between'}
              sx={{ marginBottom: '1rem' }}
            >
              <Typography variant="body1">Serrvice:</Typography>
              <Button
                variant="outlined"
                color="inherit"
                onClick={() => setUpdateServiceDataModal(true)}
              >
                <DriveFileRenameOutlineIcon />
              </Button>
            </Box>
          </SimpleCard>
        </Grid>
      </Grid>

      <Toaster position="top-right" />
      <DeletePackage
        open={deletePackageModal}
        handleClose={() => setDeletePackageModal(false)}
        id={selectedPackage?.id}
        retrieveService={retrieveService}
      />
      <DeleteExtra
        open={deleteExtraModal}
        handleClose={() => setDeleteExtraModal(false)}
        id={selectedExtra?.id}
        retrieveService={retrieveService}
      />
      <UpdateServiceModal
        open={updateServiceDataModal}
        handleClose={() => setUpdateServiceDataModal(false)}
        serviceData={serviceData}
        retrieveService={retrieveService}
      />
      <CreateExtraModal
        open={createExtraModal}
        handleClose={() => setCreateExtraModal(false)}
        serviceData={serviceData}
        retrieveService={retrieveService}
        selectedExtra={selectedExtra}
      />
      <CreatePackageModal
        open={createPackageModal}
        handleClosePackage={() => setCreatePackageModal(false)}
        serviceData={serviceData}
        retrieveService={retrieveService}
      />
      <UpdatePackageModal
        open={updatePackageModal}
        handleClosePackage={() => setUpdatePackageModal(false)}
        serviceData={serviceData}
        retrieveService={retrieveService}
        selectedPackageData={selectedPackageData}
      />
    </Container>
  );
}

export default ServiceDetails;
