import React, { useState } from 'react';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import { BOOKING_REPORTS } from 'app/api';
import axios from '../../../axios';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import moment from 'moment';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import { styled, Button, Box, Typography, Pagination, TextField, MenuItem } from '@mui/material';

import { Breadcrumb, SimpleCard } from 'app/components';
import ChargeCustomerModal from '../bookingOverview/Modals/ChargeCustomer';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

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

const Reports = () => {
  const [data, setData] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(25);
  const [chargeCustomer, setChargeCustomer] = useState(false);
  const [bookindDetails, setBookindDetails] = useState(null);
  const [dateChange, setDateChange] = useState('t_month');
  const [statusChange, setStatusChange] = useState('scheduled');
  const [toDate, setToDate] = useState(null);

  const handleChangeDate = (newValue) => {
    setToDate(newValue);
  };

  React.useEffect(() => {
    getEventList();
  }, [dateChange, statusChange, page, perPage, toDate]);
  const getEventList = async () => {
    await axios
      .get(
        `${BOOKING_REPORTS}?to_date=${
          toDate === null ? '' : moment(toDate?.toString()).format('YYYY-MM-DD HH:mm:ss')
        }&booking_status=${statusChange}&date_filter=${dateChange}&page=${page}&per_page=${perPage}`
      )
      .then((res) => {
        const dataToMap = res?.data;
        setData(dataToMap);
      })
      .catch((err) => console.log(err));
  };
  const columns = [
    { field: 'id', headerName: 'ID', width: 150 },
    {
      field: 'customer',
      headerName: 'CUSTOMER',
      width: 250,
      sortable: false,
      height: 250,
      renderCell: (item) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box>
              <TableHeading>
                <Typography sx={{ fontWeight: 900 }}>
                  {item?.row?.bod?.bod_contact_info?.first_name}{' '}
                  {item?.row?.bod?.bod_contact_info?.last_name}
                </Typography>
              </TableHeading>
              <Box display={'flex'} alignItems="center">
                <EmailOutlinedIcon sx={{ paddingRight: '5px' }} />
                <TableHeading>{item?.row?.bod?.bod_contact_info?.email}</TableHeading>
              </Box>
              <Box display={'flex'} alignItems="center">
                <LocalPhoneOutlinedIcon sx={{ paddingRight: '5px' }} />
                <TableHeading>{item?.row?.bod?.bod_contact_info?.phone}</TableHeading>
              </Box>
            </Box>
          </Box>
        );
      },
    },
    {
      field: 'scheduled',
      headerName: 'SCHEDULED',
      width: 250,
      sortable: false,
      renderCell: (item) => {
        return (
          <Box>
            <Box display={'flex'} alignItems="center">
              <CalendarMonthOutlinedIcon sx={{ paddingRight: '5px' }} />
              <TableHeading>
                {moment.utc(item?.row?.appointment_date_time).format('YYYY-MM-DD')}
              </TableHeading>
            </Box>

            <Box display={'flex'} alignItems="center">
              <AccessTimeOutlinedIcon sx={{ paddingRight: '5px' }} />
              <TableHeading>
                {item?.row?.bod?.start_time} - ({item?.row?.bod?.total_hours}hrs)
              </TableHeading>
            </Box>

            <TableHeading>B-{item?.row?.id}</TableHeading>
          </Box>
        );
      },
    },
    {
      field: 'status',
      headerName: 'STATUS',
      width: 150,
      sortable: false,
      renderCell: (item) => {
        return (
          <Button sx={{ textTransform: 'uppercase' }} variant="contained" color="primary">
            {item?.row?.status}
          </Button>
        );
      },
    },
    {
      field: 'amount',
      headerName: 'AMOUNT',
      width: 150,
      sortable: false,
      renderCell: (item) => {
        return (
          <Box sx={{ textTransform: 'uppercase' }} variant="contained" color="primary">
            <TableHeading>{item?.row?.bod?.total_amount?.toFixed(2)}</TableHeading>
          </Box>
        );
      },
    },
    {
      field: 'outstanding',
      headerName: 'PAID AMOUNT',
      width: 150,
      sortable: false,
      renderCell: (item) => {
        return (
          <Box sx={{ textTransform: 'uppercase' }} variant="contained" color="primary">
            <TableHeading>
              {item?.value?.paid_amount === null ? 0 : item?.value?.paid_amount?.toFixed(2)}
            </TableHeading>
          </Box>
        );
      },
    },
    {
      field: 'payment_status',
      headerName: 'PAYMENT STATUS',
      width: 180,
      sortable: false,
      renderCell: (item) => {
        return (
          <Box sx={{ textTransform: 'capitalize' }} variant="contained" color="primary">
            <TableHeading>{item?.row?.outstanding?.status}</TableHeading>
          </Box>
        );
      },
    },
    {
      field: 'action',
      headerName: 'ACTIONS',
      width: 150,
      sortable: false,
      renderCell: (item) => {
        return (
          <Box sx={{ textTransform: 'uppercase' }} variant="contained" color="primary">
            {console.log(item)}
            <Button
              variant="contained"
              onClick={() => {
                setChargeCustomer(true);
                setBookindDetails(item?.row);
              }}
            >
              Charge
            </Button>
          </Box>
        );
      },
    },
  ];
  return (
    <Box sx={{ p: 4 }}>
      <Box className="breadcrumb">
        <Breadcrumb
          routeSegments={[
            { name: 'Home', path: '/' },
            { name: 'Reports', path: '/dashboard/Reports' },
          ]}
        />
      </Box>
      <Box sx={{ mt: 5 }}>
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
              <Typography variant="body1">Scheduled for</Typography>
              <TextField
                size="small"
                id="outlined-select-currency"
                select
                value={dateChange}
                onChange={(e) => {
                  setPage(1);
                  setDateChange(e.target.value);
                }}
              >
                <MenuItem value={'t_week'}>This Week</MenuItem>
                <MenuItem value={'t_month'}>This Month</MenuItem>
                <MenuItem value={'t_quarter'}>This Quarter</MenuItem>
                <MenuItem value={'today'}>Today</MenuItem>
                <MenuItem value={'yesterday'}>Yesterday</MenuItem>
                <MenuItem value={'tomorrow'}>Tomorrow</MenuItem>
                <MenuItem value={'l_week'}>Last Week</MenuItem>
                <MenuItem value={'l_month'}>Last Month</MenuItem>
                <MenuItem value={'l_year'}>Last Year</MenuItem>
                <MenuItem value={'l_quarter'}>Last Quarter</MenuItem>
                <MenuItem value={'t_week_to_date'}>This Week To Date</MenuItem>
                <MenuItem value={'t_month_to_date'}>This Month To Date</MenuItem>
                <MenuItem value={'t_year_to_date'}>This Year To Date</MenuItem>
              </TextField>
              {(dateChange === 't_week_to_date' ||
                dateChange === 't_month_to_date' ||
                dateChange === 't_year_to_date') && (
                <Box>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                      disablePast
                      label="Select Date"
                      value={toDate}
                      onChange={handleChangeDate}
                      renderInput={(params) => <TextField size="small" {...params} />}
                    />
                  </LocalizationProvider>
                </Box>
              )}

              <Typography variant="body1">Booking Status</Typography>
              <TextField
                size="small"
                id="outlined-select-currency"
                select
                value={statusChange}
                onChange={(e) => {
                  setPage(1);
                  setStatusChange(e.target.value);
                }}
              >
                <MenuItem value={'scheduled'}>Scheduled</MenuItem>
                <MenuItem value={'unscheduled'}>Unscheduled</MenuItem>
                <MenuItem value={'dispatched'}>Dispatched</MenuItem>
                <MenuItem value={'complete'}>Complete</MenuItem>
                <MenuItem value={'cancelled'}>Cancelled</MenuItem>
              </TextField>
            </Box>
          </Box>
          {(dateChange === 't_week_to_date' ||
            dateChange === 't_month_to_date' ||
            dateChange === 't_year_to_date') && (
            <p style={{ margin: 'unset', fontSize: 'small', fontWeight: '300' }}>
              Select date to fetch bookings!
            </p>
          )}
          <DataTableBox>
            <DataGrid
              sx={{
                [`& .${gridClasses.cell}`]: {
                  py: 1,
                },
              }}
              rows={data?.data || []}
              columns={columns}
              getRowHeight={() => 'auto'}
              disableColumnMenu={true}
              autoHeight={true}
              hideFooter={true}
              checkboxSelection={false}
              disableSelectionOnClick
            />
          </DataTableBox>
          {!!data?.data?.length && (
            <Box display="flex" alignItems={'center'} gap={3}>
              <Pagination
                sx={{
                  '& .Mui-selected': {
                    background: '#1976d2 !important',
                    color: 'white',
                  },
                }}
                count={data?.total_page}
                page={page}
                onChange={(event, value) => setPage(value)}
                variant="contained"
                color="primary"
                shape="rounded"
              />
              <Box>Rows per page </Box>
              <TextField
                sx={{ width: '6rem' }}
                size="small"
                type={'number'}
                inputProps={{ min: 0 }}
                placeholder="Enter rows"
                select
                id="outlined-select-currency"
                value={perPage}
                onChange={(e) => {
                  setPage(1);
                  setPerPage(e.target.value);
                }}
              >
                <MenuItem value={25}>25</MenuItem>
                <MenuItem value={50}>50</MenuItem>
                <MenuItem value={100}>100</MenuItem>
              </TextField>
            </Box>
          )}
        </SimpleCard>
      </Box>
      <ChargeCustomerModal
        open={chargeCustomer}
        handleClose={() => setChargeCustomer(false)}
        bookindDetails={bookindDetails}
        getEventList={getEventList}
      />
    </Box>
  );
};

export default Reports;
