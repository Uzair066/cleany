import React, { useEffect, useState } from 'react';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import { EXPORT_PDF_PAYROLL, GET_BOOKING_PAYROLL, GET_SERVICE_PROVIDER_LIST } from 'app/api';
import axios from '../../../../../axios';
import { styled, Box, Typography, TextField, MenuItem, Button } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { Breadcrumb, SimpleCard } from 'app/components';
import moment from 'moment';
import { toast, Toaster } from 'react-hot-toast';
import { jsPDF } from 'jspdf';

const TableHeading = styled('p')(() => ({
  fontWeight: '400',
  fontSize: '16px',
  color: '#0F0F0F',
  whiteSpace: 'break-spaces',
  margin: 'unset',
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
const columns = [
  {
    field: 'service provider',
    headerName: 'SERVICE PROVIDER',
    width: 250,
    renderCell: (item) => {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box>
            <TableHeading>
              {item?.row?.sp?.user_profile?.first_name} {item?.row?.sp?.user_profile?.last_name}
            </TableHeading>
          </Box>
        </Box>
      );
    },
  },
  {
    field: 'hourly_wage',
    headerName: 'HOURLY WAGE',
    width: 150,
  },
  {
    field: 'total_hours',
    headerName: 'TOTAL WORKED HOURS',
    width: 150,
    renderCell: (item) => {
      return <TableHeading>{item?.value?.toFixed(2)}</TableHeading>;
    },
  },
  {
    field: 'total_amount',
    headerName: 'AMOUNT',
    width: 150,
  },
  {
    field: 'paid_amount',
    headerName: 'PAID',
    width: 150,
  },
  {
    field: 'due_amount',
    headerName: 'DUE',
    width: 100,
  },
  {
    field: 'tip_amount',
    headerName: 'TOTAL TIPS	',
    width: 150,
  },
];
const StyledButton = styled(Button)(({ theme }) => ({
  fontSize: '16px',
}));
const ServicesProviderPAyroll = () => {
  const [data, setData] = React.useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [serviceProviderList, setServiceProviderList] = useState([]);
  const [selectedServiceProvider, setSelectedServiceProvider] = useState(null);

  React.useEffect(() => {
    const getEventList = async () => {
      await axios
        .get(
          `${GET_BOOKING_PAYROLL}?start_date=${
            startDate === null ? '' : moment(startDate?.toString()).format('YYYY-MM-DD HH:mm:ss')
          }&end_date=${
            endDate === null ? '' : moment(endDate?.toString()).format('YYYY-MM-DD HH:mm:ss')
          }&service_provider=${selectedServiceProvider === null ? '' : selectedServiceProvider}`
        )
        .then((res) => {
          const dataToMap = res?.data?.data;
          setData(dataToMap);
        })
        .catch((err) => console.log(err));
    };

    getEventList();
  }, [startDate, endDate, selectedServiceProvider]);

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
  const export_to_pdf = () => {
    toast.promise(
      axios.get(
        `${EXPORT_PDF_PAYROLL}?start_date=${
          startDate === null ? '' : moment(startDate?.toString()).format('YYYY-MM-DD HH:mm:ss')
        }&end_date=${
          endDate === null ? '' : moment(endDate?.toString()).format('YYYY-MM-DD HH:mm:ss')
        }&service_provider=${selectedServiceProvider === null ? '' : selectedServiceProvider}`
        // {
        //   responseType: 'arraybuffer',
        // }
      ),
      {
        loading: () => {
          return `Exporting PDF!`;
        },
        success: (res) => {
          const doc = new jsPDF();

          doc.text(res?.data, 10, 10);
          doc.save('Payroll.pdf');

          return 'Exported Successfully!';
        },
        error: (err) => {
          return err?.message;
        },
      }
    );
  };
  return (
    <Box sx={{ p: 4 }}>
      <Box className="breadcrumb">
        <Breadcrumb
          routeSegments={[
            { name: 'Home', path: '/' },
            { name: 'Service Provider Payroll', path: '/dashboard/service-provider-payroll' },
          ]}
        />
      </Box>
      <Box display={'flex'} justifyContent={'end'} marginBottom="2rem">
        {selectedServiceProvider != null && endDate != null && startDate != null && (
          <StyledButton
            startIcon={<FileDownloadIcon />}
            variant="contained"
            color="primary"
            onClick={export_to_pdf}
          >
            Export to PDF
          </StyledButton>
        )}
      </Box>

      <Box>
        <SimpleCard>
          <Box
            display="flex"
            alignItems={'center'}
            justifyContent="space-between"
            paddingBottom={'1rem'}
          >
            <Box
              display="flex"
              alignItems={'center'}
              gap={2}
              sx={{
                '& p': {
                  fontWeight: 'bold',
                  fontSize: '1rem',
                },
              }}
            >
              <Box>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    label="Start Date"
                    value={startDate}
                    onChange={(e) => {
                      setStartDate(e);
                    }}
                    renderInput={(params) => <TextField size="small" {...params} />}
                  />
                </LocalizationProvider>
              </Box>
              <Box>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    label="End Date"
                    value={endDate}
                    onChange={(e) => {
                      setEndDate(e);
                    }}
                    renderInput={(params) => <TextField size="small" {...params} />}
                  />
                </LocalizationProvider>
              </Box>

              <Typography variant="body1">Service Provider</Typography>
              <TextField
                size="small"
                id="outlined-select-currency"
                select
                value={selectedServiceProvider}
                onChange={(e) => {
                  setSelectedServiceProvider(e.target.value);
                }}
              >
                {!!serviceProviderList?.length &&
                  serviceProviderList.map((data, index) => (
                    <MenuItem value={data?.id}>
                      {data?.user_profile?.first_name} {data?.user_profile?.last_name}
                    </MenuItem>
                  ))}
              </TextField>
            </Box>
          </Box>
          <DataTableBox>
            <DataGrid
              sx={{
                [`& .${gridClasses.cell}`]: {
                  py: 1,
                },
              }}
              rows={data}
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
      </Box>
      <Toaster position="top-right" />
    </Box>
  );
};

export default ServicesProviderPAyroll;
