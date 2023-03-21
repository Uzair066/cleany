import { Box, Button } from '@mui/material';
import { Breadcrumb, SimpleCard } from 'app/components';
import React, { useEffect, useState } from 'react';
import axios from '../../../axios';
import { GET_TAX_LIST } from 'app/api';
import { DataGrid, GridToolbarQuickFilter } from '@mui/x-data-grid';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import TaxAdd from './Modals/TaxAddModal';

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
function Company() {
  const [openAddModal, setOpenAddModal] = useState(false);
  const [taxList, setTaxList] = useState([]);
  const [editData, setEditData] = useState(null);
  useEffect(() => {
    taxListAPI();
  }, []);

  const taxListAPI = async () => {
    await axios
      .get(`${GET_TAX_LIST}`, {
        headers: { 'Content-Type': 'application/json' },
      })
      .then((res) => setTaxList(res?.data?.data))
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
      field: 'tax_code',
      headerName: 'Tax Code',
      flex: 1,
      renderCell: (item) => {
        return <TableHeading>{item?.value}</TableHeading>;
      },
    },
    {
      field: 'tax_code_number',
      headerName: 'Tax Number',
      flex: 1,
      renderCell: (item) => {
        return <TableHeading>{item?.value}</TableHeading>;
      },
    },
    {
      field: 'tax_rate',
      headerName: 'Tax Rate %',
      flex: 1,
      renderCell: (item) => {
        return <TableHeading>{item?.value}</TableHeading>;
      },
    },
    {
      field: '',
      headerName: 'Actions',
      flex: 1,
      sortable: false,
      minWidth: 90,
      maxWidth: 90,
      renderCell: (item) => {
        return (
          <Button
            variant="text"
            sx={{
              fontWeight: '400',
              fontSize: '16px',
              whiteSpace: 'break-spaces',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
            onClick={() => handleUpdate(item?.row)}
          >
            Edit
          </Button>
        );
      },
    },
  ];
  const handleUpdate = (item) => {
    setOpenAddModal(true);
    setEditData(item);
  };
  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb
          routeSegments={[{ name: 'Settings', path: '/dashboard/company' }, { name: 'Tax' }]}
        />
      </Box>

      <Box display={'flex'} justifyContent={'end'}>
        <StyledButton
          startIcon={<AddIcon />}
          variant="contained"
          color="primary"
          onClick={() => {
            setOpenAddModal(true);
            setEditData(null);
          }}
        >
          Create new tax
        </StyledButton>
      </Box>

      <SimpleCard>
        <DataTableBox>
          <DataGrid
            disableColumnMenu={true}
            rows={taxList}
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
      <TaxAdd
        open={openAddModal}
        handleClose={() => setOpenAddModal(false)}
        taxListAPI={taxListAPI}
        editData={editData}
      />
    </Container>
  );
}

export default Company;
