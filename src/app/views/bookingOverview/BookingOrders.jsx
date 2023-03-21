import { Box, Button, Menu, MenuItem, Pagination, TextField, Typography } from '@mui/material';
import { Breadcrumb, SimpleCard } from 'app/components';
import React, { useEffect, useState } from 'react';
import axios from '../../../axios';
import { ADMIN_CREATE_APPOINTMENT_BOOKING, LIST_BOOKING, SEARCH_BOOKING_BY_ID } from 'app/api';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import moment from 'moment';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import StepOne from './Modals/CreateBookingModals/StepOne';
import StepTwo from './Modals/CreateBookingModals/StepTwo';
import StepThree from './Modals/CreateBookingModals/StepThree';
import StepFour from './Modals/CreateBookingModals/StepFour';
import StepFive from './Modals/CreateBookingModals/StepFive';
import StepSix from './Modals/CreateBookingModals/StepSix';
import StepSeven from './Modals/CreateBookingModals/StepSeven';
import StepEight from './Modals/CreateBookingModals/StepEight';
import StepNine from './Modals/CreateBookingModals/StepNine';
import StepTen from './Modals/CreateBookingModals/StepTen';
import CompleteBooking from './Modals/CreateBookingModals/CompleteBooking';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { toast, Toaster } from 'react-hot-toast';

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
function BookingOrders() {
  const initialData = {
    selected_customer_id: '',
    email: '',
    service: 'select',
    service_slug: '',
    first_name: '',
    last_name: '',
    phone_no: '',
    address: '',
    road: '',
    apt_suite: '',
    city: '',
    state: '',
    zip_code: '',
    location: '',
    packages_text: '',
    discounts_text: '',
    extras_text: '',
    taxes_text: '',
    total_text: '',
    booking_items: null,
    booking_extras: null,
    switch_component: [
      { title: 'Go Green - Free Upgrade', value: false },
      { title: 'Inside of Fridge', value: false },
      { title: 'Inside of Oven', value: false },
      { title: 'Interior Kitchen Cabinets', value: false },
      { title: 'Inside Windows (# Of Windows)', value: false },
      { title: 'Inside Windows (30 Min)', value: false },
      { title: 'Washing Dishes', value: false },
      { title: 'Pet Hair Removal', value: false },
      { title: 'Deep Bathroom', value: false },
      { title: 'Laundry (wash & fold)', value: false },
      { title: 'Baseboards & Radiators', value: false },
      { title: 'Oraganizing / Paking (30 Min)', value: false },
      { title: 'Patio or Balcony', value: false },
      { title: 'Wall Washing (60 Min)', value: false },
      { title: 'Post Constrruction Equipment (HEPA)', value: false },
      { title: 'Airbrb Package', value: false },
    ],
    custom_options: [],
    custom_discount: [],
    custom_extras: [],
    schedule_booking: true,
    start_time: '',
    end_time: '',
    frequency: 'biweekly',
    confirmation_email: true,
    allow_rescedule: false,
    allow_cancel: false,
    optional_notes: '',
    attachments: [],
    payment_processor: 'none',
    payment_method: 'Card',
    dispatch_now: true,
  };
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialData);
  const [bookingList, setBookingList] = useState([]);
  const [dateChange, setDateChange] = useState('t_month');
  const [statusChange, setStatusChange] = useState('scheduled');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(50);
  const [stepOne, setStepOne] = useState(false);
  const [stepTwo, setStepTwo] = useState(false);
  const [stepThree, setStepThree] = useState(false);
  const [stepFour, setStepFour] = useState(false);
  const [stepFive, setStepFive] = useState(false);
  const [stepSix, setStepSix] = useState(false);
  const [stepSeven, setStepSeven] = useState(false);
  const [stepEight, setStepEight] = useState(false);
  const [stepNine, setStepNine] = useState(false);
  const [stepTen, setStepTen] = useState(false);
  const [completeBooking, setCompleteBooking] = useState(false);
  const [toDate, setToDate] = useState(null);
  const [searchByID, setSearchByID] = useState('');

  const handleChangeDate = (newValue) => {
    setToDate(newValue);
  };

  const handleFormData = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };
  const handleReset = () => {
    const dupData = {
      selected_customer_id: '',
      email: '',
      service: 'select',
      service_slug: '',
      first_name: '',
      last_name: '',
      phone_no: '',
      address: '',
      road: '',
      apt_suite: '',
      city: '',
      state: '',
      zip_code: '',
      location: '',
      packages_text: '',
      discounts_text: '',
      extras_text: '',
      taxes_text: '',
      total_text: '',
      booking_items: null,
      booking_extras: null,
      switch_component: [
        { title: 'Go Green - Free Upgrade', value: false },
        { title: 'Inside of Fridge', value: false },
        { title: 'Inside of Oven', value: false },
        { title: 'Interior Kitchen Cabinets', value: false },
        { title: 'Inside Windows (# Of Windows)', value: false },
        { title: 'Inside Windows (30 Min)', value: false },
        { title: 'Washing Dishes', value: false },
        { title: 'Pet Hair Removal', value: false },
        { title: 'Deep Bathroom', value: false },
        { title: 'Laundry (wash & fold)', value: false },
        { title: 'Baseboards & Radiators', value: false },
        { title: 'Oraganizing / Paking (30 Min)', value: false },
        { title: 'Patio or Balcony', value: false },
        { title: 'Wall Washing (60 Min)', value: false },
        { title: 'Post Constrruction Equipment (HEPA)', value: false },
        { title: 'Airbrb Package', value: false },
      ],
      custom_options: [],
      custom_discount: [],
      custom_extras: [],
      schedule_booking: true,
      start_time: '',
      end_time: '',
      frequency: 'biweekly',
      confirmation_email: true,
      allow_rescedule: false,
      allow_cancel: false,
      optional_notes: '',
      attachments: [],
      payment_processor: 'none',
      payment_method: 'Card',
      dispatch_now: true,
    };
    setFormData(dupData);
  };

  useEffect(() => {
    serviceListAPI();
  }, [dateChange, statusChange, page, perPage, toDate]);

  const serviceListAPI = async () => {
    await axios
      .get(
        `${LIST_BOOKING}?to_date=${
          toDate === null ? '' : moment(toDate?.toString()).format('YYYY-MM-DD HH:mm:ss')
        }&booking_status=${statusChange}&date_filter=${dateChange}&page=${page}&per_page=${perPage}`,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      )
      .then((res) => {
        setBookingList(res?.data);
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
      field: 'bod',
      headerName: 'Customer',
      flex: 1,
      sortable: false,
      renderCell: (item) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box>
              <TableHeading style={{ fontWeight: 'bold', fontSize: '18px' }}>
                {item?.value?.bod_contact_info?.first_name}{' '}
                {item?.value?.bod_contact_info?.last_name}
              </TableHeading>
              <Box display={'flex'} alignItems="center">
                <EmailOutlinedIcon sx={{ paddingRight: '5px' }} />
                <TableHeading>{item?.value?.bod_contact_info?.email}</TableHeading>
              </Box>
              <Box display={'flex'} alignItems="center">
                <LocalPhoneOutlinedIcon sx={{ paddingRight: '5px' }} />
                <TableHeading>{item?.value?.bod_contact_info?.phone}</TableHeading>
              </Box>
            </Box>
          </Box>
        );
      },
    },
    {
      field: '',
      headerName: 'Scheduled',
      flex: 1,
      sortable: false,
      renderCell: (item) => {
        return (
          <Box>
            <Box display={'flex'} alignItems="center">
              <CalendarMonthOutlinedIcon sx={{ paddingRight: '5px' }} />
              <TableHeading style={{ fontSize: '18px' }}>
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
      field: 'type',
      headerName: 'Location',
      flex: 1,
      minWidth: 150,
      sortable: false,
      renderCell: (item) => {
        return (
          <Box>
            <TableHeading>{item?.row?.bod?.bod_service_location?.street_address}</TableHeading>

            <TableHeading>
              {item?.row?.bod?.bod_service_location?.city}
              {', '}
              {item?.row?.bod?.bod_service_location?.state}
            </TableHeading>

            <TableHeading>{item?.row?.bod?.bod_service_location?.zip_code}</TableHeading>
          </Box>
        );
      },
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      minWidth: 120,
      maxWidth: 120,
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
      field: 'additional_info',
      headerName: '',
      flex: 1,
      sortable: false,
      minWidth: 90,
      maxWidth: 90,
      renderCell: (item) => {
        return (
          <Box display={'flex'} alignItems="center" gap={1}>
            <Button
              variant="outlined"
              onClick={() => navigate(`/dashboard/booking-appointments/${item?.row?.id}/details/`)}
            >
              View
            </Button>
          </Box>
        );
      },
    },
  ];
  const handleSubmitBooking = () => {
    const objToSend = {
      contact_info: {
        first_name: formData?.first_name,
        last_name: formData?.last_name,
        email: formData?.email,
        phone: formData?.phone_no,
        how_to_enter_on_premise: '',
      },
      service_location: {
        street_address: formData?.road,
        apt_suite: formData?.apt_suite,
        city: formData?.city,
        state: formData?.state,
        zip_code: formData?.zip_code,
        let_long: '',
      },
      extras: formData?.booking_extras,
      items: formData?.booking_items,
      booking_type: formData?.frequency,
      service_id: formData?.service,
      start_date: moment(formData?.start_time).format('YYYY-MM-DD'),
      start_time: moment(formData?.start_time).format('HH:mm'),
      additional_info: 'null',
    };
    toast.promise(
      axios.post(
        `https://api-cleany-backend.herokuapp.com${ADMIN_CREATE_APPOINTMENT_BOOKING}/${formData?.service}`,
        objToSend,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      ),
      {
        loading: () => {
          return `Creating Booking!`;
        },
        success: (res) => {
          setTimeout(() => {
            setCompleteBooking(true);
            setStepSeven(false);
          }, 500);

          return res?.data?.message;
        },
        error: (err) => {
          return err?.message;
        },
      }
    );
  };
  const handleBookingSearch = async (value) => {
    setSearchByID(value);
    if (value === '') {
      setPerPage(25);
    } else {
      await axios
        .get(`${SEARCH_BOOKING_BY_ID}/${value}`, {
          headers: { 'Content-Type': 'application/json' },
        })
        .then((res) => {
          let dummyArr = [];
          dummyArr.push(res?.data?.data);
          setBookingList({ data: dummyArr });
        })
        .catch((err) => {
          console.log(err);
          setBookingList([]);
        });
    }
  };
  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb
          routeSegments={[
            { name: 'Bookings', path: '/dashboard/booking-appointments' },
            { name: 'Booking Appointments' },
          ]}
        />
      </Box>

      <Box display={'flex'} justifyContent={'end'}>
        <StyledButton
          startIcon={<AddIcon />}
          variant="contained"
          color="primary"
          onClick={() => setStepOne(true)}
        >
          Create Booking
        </StyledButton>
      </Box>

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
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              '& p': {
                fontWeight: 'bold',
                fontSize: '1rem',
              },
            }}
            gap={2}
          >
            <Typography variant="body1">Search by ID</Typography>
            <TextField
              size="small"
              type={'number'}
              inputProps={{ min: '0', placeholder: 'Enter Id' }}
              id="outlined-select-currency"
              value={searchByID}
              onChange={(e) => {
                setPage(1);
                handleBookingSearch(e.target.value);
              }}
            />
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
            getRowHeight={() => 'auto'}
            disableColumnMenu={true}
            rows={bookingList?.data || []}
            columns={columns}
            autoHeight={true}
            hideFooter={true}
            checkboxSelection={false}
            disableSelectionOnClick
          />
        </DataTableBox>
        {!!bookingList?.data?.length && (
          <Box display="flex" alignItems={'center'} gap={3}>
            <Pagination
              sx={{
                '& .Mui-selected': {
                  background: '#1976d2 !important',
                  color: 'white',
                },
              }}
              count={bookingList?.total_page}
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
              id="outlined-select-currency"
              value={perPage}
              select
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
      <StepOne
        open={stepOne}
        handleClose={() => setStepOne(false)}
        handleFormData={handleFormData}
        formData={formData}
        handleReset={handleReset}
        setStepTwo={setStepTwo}
        setFormData={setFormData}
      />
      <StepTwo
        open={stepTwo}
        handleClose={() => setStepTwo(false)}
        handleFormData={handleFormData}
        formData={formData}
        handleReset={handleReset}
        setStepOne={setStepOne}
        setStepThree={setStepThree}
        setFormData={setFormData}
      />
      <StepThree
        open={stepThree}
        handleClose={() => setStepThree(false)}
        handleFormData={handleFormData}
        formData={formData}
        handleReset={handleReset}
        setStepTwo={setStepTwo}
        setStepFour={setStepSix}
        setFormData={setFormData}
      />
      <StepFour
        open={stepFour}
        handleClose={() => setStepFour(false)}
        handleFormData={handleFormData}
        formData={formData}
        setFormData={setFormData}
        handleReset={handleReset}
        setStepThree={setStepThree}
        setStepFive={setStepFive}
      />
      <StepFive
        open={stepFive}
        handleClose={() => setStepFive(false)}
        handleFormData={handleFormData}
        formData={formData}
        setFormData={setFormData}
        handleReset={handleReset}
        setStepFour={setStepFour}
        setStepSix={setStepSix}
      />
      <StepSix
        open={stepSix}
        handleClose={() => setStepSix(false)}
        handleFormData={handleFormData}
        formData={formData}
        setFormData={setFormData}
        handleReset={handleReset}
        setStepFive={setStepThree}
        setStepSeven={setStepSeven}
      />
      <StepSeven
        open={stepSeven}
        handleClose={() => setStepSeven(false)}
        formData={formData}
        setFormData={setFormData}
        handleReset={handleReset}
        setStepSix={setStepSix}
        setStepEight={setStepEight}
        setCompleteBooking={setCompleteBooking}
        handleSubmitBooking={handleSubmitBooking}
      />
      <StepEight
        open={stepEight}
        handleClose={() => setStepEight(false)}
        handleFormData={handleFormData}
        formData={formData}
        setFormData={setFormData}
        handleReset={handleReset}
        setStepSeven={setStepSeven}
        setStepNine={setStepNine}
        setCompleteBooking={setCompleteBooking}
      />
      <StepNine
        open={stepNine}
        handleClose={() => setStepNine(false)}
        handleFormData={handleFormData}
        formData={formData}
        setFormData={setFormData}
        handleReset={handleReset}
        setStepEight={setStepEight}
        setStepTen={setStepTen}
        setCompleteBooking={setCompleteBooking}
      />
      <StepTen
        open={stepTen}
        handleClose={() => setStepTen(false)}
        handleFormData={handleFormData}
        formData={formData}
        setFormData={setFormData}
        handleReset={handleReset}
        setStepNine={setStepNine}
        setCompleteBooking={setCompleteBooking}
      />
      <CompleteBooking
        open={completeBooking}
        handleClose={() => setCompleteBooking(false)}
        handleFormData={handleFormData}
        formData={formData}
        setFormData={setFormData}
        handleReset={handleReset}
      />
      <Toaster position="top-right" />
    </Container>
  );
}

export default BookingOrders;
