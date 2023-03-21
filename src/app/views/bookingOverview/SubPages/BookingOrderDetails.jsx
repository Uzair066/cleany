import React, { useState, useCallback, useMemo, useEffect } from 'react';
import moment from 'moment';
import { Box, Button, Divider, Grid, styled, Tab, Tabs, Tooltip, Typography } from '@mui/material';
import { Breadcrumb } from 'app/components';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../../../../axios';
import {
  ADMIN_CARD_LIST_BOOKING_DETAILS,
  BOOKING_APPOINTMENT_DETAILS,
  CANCEL_BOOKING,
  CLEANER_LOCATION,
  COMPLETE_BOOKING,
  GET_BOOKING_DATA,
  GET_BOOKING_PROBLEMS,
  LIST_COMMUNICATION_LOGS,
} from 'app/api';
import toast from 'react-hot-toast';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import TodayOutlinedIcon from '@mui/icons-material/TodayOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import PentagonOutlinedIcon from '@mui/icons-material/PentagonOutlined';
import SpeedOutlinedIcon from '@mui/icons-material/SpeedOutlined';
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import EventOutlinedIcon from '@mui/icons-material/EventOutlined';
import GpsFixedOutlinedIcon from '@mui/icons-material/GpsFixedOutlined';
import ArrowRightAltOutlinedIcon from '@mui/icons-material/ArrowRightAltOutlined';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import NoteAddOutlinedIcon from '@mui/icons-material/NoteAddOutlined';
import CancelPresentationIcon from '@mui/icons-material/CancelPresentation';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import BookOutlinedIcon from '@mui/icons-material/BookOutlined';
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined';
import PermIdentityOutlinedIcon from '@mui/icons-material/PermIdentityOutlined';
import RescheduleAppointment from '../Modals/Reappointment';
import RaiseBookingProblem from '../Modals/RaiseBookingProblem';
import EditBookingModal from '../Modals/EditBookingModal';
import LocationOnIcon from '@mui/icons-material/LocationOn';

import Chat from 'app/components/Chat/adminChat';
import CustomerChat from 'app/components/Chat/customerChat';
import ChargeCustomerModal from '../Modals/ChargeCustomer';
import ChargeTipModal from '../Modals/ChargeTip';
import GenerateInvoice from '../Modals/GenerateInvoice';
import PersonIcon from '@mui/icons-material/Person';
import BookingMarkComplete from '../Modals/BookingMarkComplete';
import BookingMarkCancel from '../Modals/BookingMarkCancel';
import GoogleMaps from './Map';

const Container = styled('div')(({ theme }) => ({
  margin: '30px',
  [theme.breakpoints.down('sm')]: { margin: '16px' },
  '& .breadcrumb': {
    marginBottom: '30px',
    [theme.breakpoints.down('sm')]: { marginBottom: '16px' },
  },
  '& .formMain': {
    borderTop: '1px solid #d5d1d1',
  },
  '& .heading': {
    marginTop: '1rem',
    marginBottom: '1rem',
    color: 'rgba(52, 49, 76, 1)',
  },
}));

function BookingOrderDetails() {
  const navigate = useNavigate();
  const { role } = JSON.parse(localStorage.getItem('user'));
  const params = useParams();
  const [value, setValue] = useState(0);
  const [bookindDetails, setBookindDetails] = useState(null);
  const [openRescheduleAppointment, setOpenRescheduleAppointment] = useState(false);
  const [openRaiseProblemModal, setOpenRaiseProblemModal] = useState(false);
  const [editBookingModal, setEditBookingModal] = useState(false);
  const [chargeCustomer, setChargeCustomer] = useState(false);
  const [chargeTip, setChargeTip] = useState(false);
  const [invoiceModal, setInvoiceModal] = useState(false);
  const [bookingProblems, setBookingProblems] = useState(null);
  const [bookingData, setBookingData] = useState({});
  const [cleanerLocation, setCleanerLocation] = useState([]);
  const [communicationData, setCommunicationData] = useState([]);
  const [adminCardsData, setadminCardsData] = useState([]);
  const [completeBookingModal, setCompleteBookingModal] = useState(false);
  const [cancelBookingModal, setCancelBookingModal] = useState(false);

  useEffect(() => {
    getEventList();
  }, []);
  useEffect(() => {
    if (!!bookindDetails) {
      getBookingData();
    }
  }, [bookindDetails]);
  const getBookingData = async () => {
    await axios
      .get(`${GET_BOOKING_DATA}/${bookindDetails?.service?.slug}`)
      .then((res) => {
        setBookingData(res?.data?.data);
      })
      .catch((err) => console.log(err));
    await axios
      .get(`${CLEANER_LOCATION}?booking_id=${bookindDetails?.id}`)
      .then((res) => {
        setCleanerLocation(res?.data?.data);
      })
      .catch((err) => console.log(err));
    await axios
      .get(`${LIST_COMMUNICATION_LOGS}?user_id=${bookindDetails?.bod?.user}`)
      .then((res) => {
        setCommunicationData(res?.data?.data);
      })
      .catch((err) => console.log(err));
    await axios
      .get(`${ADMIN_CARD_LIST_BOOKING_DETAILS}?user_id=${bookindDetails?.bod?.user}`)
      .then((res) => {
        setadminCardsData(res?.data?.data?.data);
      })
      .catch((err) => console.log(err));
  };

  const getEventList = async () => {
    await axios
      .get(`${BOOKING_APPOINTMENT_DETAILS}/${params?.id}`)
      .then((res) => {
        setBookindDetails(res?.data?.data);
      })
      .catch((err) => console.log(err));
    await axios
      .get(`${GET_BOOKING_PROBLEMS}/${params?.id}`)
      .then((res) => {
        setBookingProblems(res?.data?.data);
      })
      .catch((err) => console.log(err));
  };
  const steps = ['Unscheduled', 'Scheduled', 'Dispatched', 'Complete', 'Cancelled'];

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Container>
        <Box className="breadcrumb">
          <Breadcrumb
            routeSegments={[
              { name: 'Bookings', path: '/dashboard/booking-appointments' },
              { name: 'Booking Appointments', path: '/dashboard/booking-appointments' },
              { name: `B-${bookindDetails?.id || 'Booking Details'}` },
            ]}
          />
          <h3>Booking Overview</h3>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} md={9}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Box
                  sx={{
                    boxShadow: 'rgb(30 41 59 / 4%) 0 2px 4px 0',
                    border: ' 1px solid rgba(98,105,118,.16)',
                    background: '#fff',
                    borderTop: ' 5px solid #1976d2',
                    padding: ' 1rem 1rem',
                    borderRadius: '4px',
                    '& .MuiStep-horizontal ': {
                      '&:nth-child(1)': {
                        '& svg.Mui-completed': {
                          color: '#7cbeff',
                        },
                        '& svg.Mui-active': {
                          color: '#7cbeff',
                        },
                      },
                      '&:nth-child(2)': {
                        '& svg.Mui-completed': {
                          color: '#2493ff',
                        },
                        '& svg.Mui-active': {
                          color: '#2493ff',
                        },
                      },
                      '&:nth-child(3)': {
                        '& svg.Mui-completed': {
                          color: '#0061c0',
                        },
                        '& svg.Mui-active': {
                          color: '#0061c0',
                        },
                      },
                      '&:nth-child(4)': {
                        '& svg.Mui-completed': {
                          color: '#00827F',
                        },
                        '& svg.Mui-active': {
                          color: '#00827F',
                        },
                      },
                      '&:nth-child(5)': {
                        '& svg.Mui-completed': {
                          color: '#003466',
                        },
                        '& svg.Mui-active': {
                          color: '#003466',
                        },
                      },
                    },
                  }}
                >
                  <Stepper
                    activeStep={
                      bookindDetails?.status?.toLowerCase() === 'unscheduled'
                        ? 0
                        : bookindDetails?.status?.toLowerCase() === 'scheduled'
                        ? 1
                        : bookindDetails?.status?.toLowerCase() === 'dispatched'
                        ? 2
                        : bookindDetails?.status?.toLowerCase() === 'complete'
                        ? 3
                        : bookindDetails?.status?.toLowerCase() === 'cancelled'
                        ? 4
                        : null
                    }
                    alternativeLabel
                  >
                    {steps.map((label) => (
                      <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                      </Step>
                    ))}
                  </Stepper>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Box
                      sx={{
                        boxShadow: 'rgb(30 41 59 / 4%) 0 2px 4px 0',
                        border: ' 1px solid rgba(98,105,118,.16)',
                        background: '#fff',
                        borderTop: ' 5px solid #1976d2',
                        padding: ' 1rem 1rem',
                        borderRadius: '4px',
                        '& .headingSubTxt': {
                          fontSize: '1rem',
                          fontWeight: 'bold',
                          paddingBottom: '1rem',
                        },
                        '& p': {
                          margin: 'unset',
                          paddingLeft: '5px',
                        },
                      }}
                    >
                      <Typography variant="h3" className="headingSubTxt">
                        Booking
                      </Typography>
                      <Box
                        display={'flex'}
                        alignItems="center"
                        paddingBottom="5px"
                        fontWeight={'bold'}
                      >
                        <TodayOutlinedIcon sx={{ paddingRight: '5px' }} />
                        <p>{moment.utc(bookindDetails?.appointment_date_time).format('lll')}</p>
                      </Box>
                      <Box
                        display={'flex'}
                        alignItems="center"
                        paddingBottom="5px"
                        fontWeight={'bold'}
                      >
                        <AccessTimeOutlinedIcon sx={{ paddingRight: '5px' }} />
                        <p>11:00 - {bookindDetails?.total_hours} (hrs)</p>
                      </Box>
                      <Box
                        display={'flex'}
                        alignItems="center"
                        paddingBottom="5px"
                        fontWeight={'bold'}
                      >
                        <PentagonOutlinedIcon sx={{ paddingRight: '5px' }} />
                        <p>B-{bookindDetails?.id}</p>
                      </Box>
                      <Box
                        display={'flex'}
                        alignItems="center"
                        paddingBottom="5px"
                        fontWeight={'bold'}
                      >
                        <SpeedOutlinedIcon sx={{ paddingRight: '5px' }} />
                        <p>None Cleaning</p>
                      </Box>
                      <Box
                        display={'flex'}
                        alignItems="center"
                        paddingBottom="5px"
                        fontWeight={'bold'}
                      >
                        <ViewInArIcon sx={{ paddingRight: '5px' }} />
                        <p>Service</p>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <Box
                      sx={{
                        boxShadow: 'rgb(30 41 59 / 4%) 0 2px 4px 0',
                        border: ' 1px solid rgba(98,105,118,.16)',
                        background: '#fff',
                        borderTop: ' 5px solid #1976d2',
                        padding: ' 1rem 1rem',
                        borderRadius: '4px',
                        '& .headingSubTxt': {
                          fontSize: '1rem',
                          fontWeight: 'bold',
                          paddingBottom: '1rem',
                        },
                        '& p': {
                          margin: 'unset',
                          paddingLeft: '5px',
                        },
                      }}
                    >
                      <Typography variant="h3" className="headingSubTxt">
                        Details
                      </Typography>
                      <Box display="flex" justifyContent={'space-between'}>
                        <Box>
                          <p>Bedrooms</p>

                          <p>Bathrooms</p>

                          <p>Dropdown Option</p>

                          <p>Do you have pets?</p>

                          <p>How will we get in?</p>

                          <p>Is parking available?</p>
                        </Box>
                        <Box sx={{ fontWeight: 'bold', textAlign: 'right' }}>
                          <p>Studio ( 500 Sq Ft)</p>

                          <p>1 Bathroom</p>

                          <p>Standard Cleany</p>

                          <p>No Pets</p>

                          <p>I'll be at home</p>

                          <p>Yes - no fee</p>
                        </Box>
                      </Box>
                      <Box display={'flex'} alignItems="center" paddingBottom="10px">
                        <GpsFixedOutlinedIcon sx={{ paddingRight: '5px' }} />
                        <p>1245 Main Street, FLorida</p>
                      </Box>
                      <Box textAlign={'right'}>
                        <Button
                          variant="text"
                          startIcon={<LocationOnOutlinedIcon />}
                          endIcon={<ArrowRightAltOutlinedIcon />}
                        >
                          see on the Google Map
                        </Button>
                      </Box>
                    </Box>
                  </Grid>
                  {role !== 'Customer' && (
                    <Grid item xs={12} md={12}>
                      <Box
                        sx={{
                          boxShadow: 'rgb(30 41 59 / 4%) 0 2px 4px 0',
                          border: ' 1px solid rgba(98,105,118,.16)',
                          background: '#fff',
                          borderTop: ' 5px solid #1976d2',
                          padding: ' 1rem 1rem',
                          borderRadius: '4px',
                          '& .headingSubTxt': {
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            paddingBottom: '1rem',
                          },
                          '& p': {
                            margin: 'unset',
                            paddingLeft: '5px',
                          },
                        }}
                      >
                        <Typography variant="h3" className="headingSubTxt">
                          See Customer On Stripe
                        </Typography>

                        <Box display={'flex'} alignItems="center" paddingBottom="10px">
                          <CreditCardOutlinedIcon sx={{ paddingRight: '5px' }} />
                          <p>Card Details</p>
                        </Box>
                        <Box textAlign={'right'}>
                          <Button
                            variant="text"
                            startIcon={<CreditCardOutlinedIcon />}
                            endIcon={<ArrowRightAltOutlinedIcon />}
                            href="https://dashboard.stripe.com/login?redirect=%2Ftest%2Fcustomers%2Fcus_MXNagLEmS4YskQ"
                            target={'_blank'}
                          >
                            Logs
                          </Button>
                        </Box>
                      </Box>
                    </Grid>
                  )}

                  <Grid item xs={12} md={12}>
                    <Box
                      sx={{
                        boxShadow: 'rgb(30 41 59 / 4%) 0 2px 4px 0',
                        border: ' 1px solid rgba(98,105,118,.16)',
                        background: '#fff',
                        borderTop: ' 5px solid #1976d2',
                        padding: ' 1rem 1rem',
                        borderRadius: '4px',
                        '& .headingSubTxt': {
                          fontSize: '1rem',
                          fontWeight: 'bold',
                          paddingBottom: '1rem',
                        },
                        '& p': {
                          margin: 'unset',
                          paddingLeft: '5px',
                        },
                      }}
                    >
                      <Typography variant="h3" className="headingSubTxt">
                        Assigned Service Providers
                      </Typography>
                      <Grid container>
                        <Grid item xs={3} textAlign="center" fontWeight={'bold'}>
                          Assigned On
                        </Grid>
                        <Grid item xs={3} textAlign="center" fontWeight={'bold'}>
                          Service Provider
                        </Grid>
                        <Grid item xs={3} textAlign="center" fontWeight={'bold'}>
                          Phone
                        </Grid>
                        <Grid item xs={3} textAlign="center" fontWeight={'bold'}>
                          View Profile
                        </Grid>
                      </Grid>
                      <Grid container>
                        {!!bookindDetails?.dispatch.length &&
                          bookindDetails?.dispatch?.map((cleaner, index) => (
                            <>
                              <Grid item xs={3}>
                                {moment.utc(cleaner?.created_at).format('lll')}
                              </Grid>
                              <Grid
                                item
                                xs={3}
                                textAlign="center"
                                sx={{ whiteSpace: 'break-spaces', wordBreak: 'break-all' }}
                              >
                                {cleaner?.service_provider?.user_profile?.first_name}{' '}
                                {cleaner?.service_provider?.user_profile?.last_name}
                              </Grid>
                              <Grid
                                item
                                xs={3}
                                textAlign="center"
                                sx={{ whiteSpace: 'break-spaces', wordBreak: 'break-all' }}
                              >
                                {cleaner?.service_provider?.user_profile?.phone_number}
                              </Grid>
                              <Grid item xs={3} textAlign="center">
                                <Button
                                  variant="text"
                                  onClick={() =>
                                    navigate(
                                      `/dashboard/service-providers/${cleaner?.service_provider?.id}/update`
                                    )
                                  }
                                >
                                  <ArrowRightAltOutlinedIcon />
                                </Button>
                              </Grid>
                            </>
                          ))}
                      </Grid>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <Box
                      sx={{
                        boxShadow: 'rgb(30 41 59 / 4%) 0 2px 4px 0',
                        border: ' 1px solid rgba(98,105,118,.16)',
                        background: '#fff',
                        borderTop: ' 5px solid #1976d2',
                        padding: ' 1rem 1rem',
                        borderRadius: '4px',
                        '& .headingSubTxt': {
                          fontSize: '1rem',
                          fontWeight: 'bold',
                          paddingBottom: '1rem',
                        },
                        '& p': {
                          margin: 'unset',
                          paddingLeft: '5px',
                        },
                      }}
                    >
                      <Typography variant="h3" className="headingSubTxt">
                        Payment Transactions
                      </Typography>
                      <Grid container>
                        <Grid item xs={3} textAlign="center" fontWeight={'bold'}>
                          Processed On
                        </Grid>
                        <Grid item xs={3} textAlign="center" fontWeight={'bold'}>
                          Mode
                        </Grid>
                        <Grid item xs={3} textAlign="center" fontWeight={'bold'}>
                          Amount
                        </Grid>
                        <Grid item xs={3} textAlign="center" fontWeight={'bold'}></Grid>
                      </Grid>
                      <Grid container>
                        <Grid item xs={3}>
                          Oct. 2, 2022, 3:26 a.m.
                        </Grid>
                        <Grid item xs={3} textAlign="center">
                          card
                        </Grid>
                        <Grid item xs={3} textAlign="center">
                          $ 15.0
                        </Grid>
                        <Grid item xs={3} textAlign="center">
                          <Button variant="text">
                            <ArrowRightAltOutlinedIcon />
                          </Button>
                        </Grid>
                      </Grid>
                    </Box>
                  </Grid>
                  {role !== 'Customer' && (
                    <Grid item xs={12} md={12}>
                      <Box
                        sx={{
                          boxShadow: 'rgb(30 41 59 / 4%) 0 2px 4px 0',
                          border: ' 1px solid rgba(98,105,118,.16)',
                          background: '#fff',
                          borderTop: ' 5px solid #1976d2',
                          padding: ' 1rem 1rem',
                          borderRadius: '4px',
                          '& .headingSubTxt': {
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            paddingBottom: '1rem',
                          },
                          '& p': {
                            margin: 'unset',
                            paddingLeft: '5px',
                          },
                        }}
                      >
                        <Typography variant="h3" className="headingSubTxt">
                          Cleaner Location
                        </Typography>
                        <Grid container>
                          <Grid item xs={3} fontWeight={'bold'}>
                            Cleaner
                          </Grid>
                          <Grid item xs={3} fontWeight={'bold'}>
                            Check in
                          </Grid>
                          <Grid item xs={3} fontWeight={'bold'}>
                            Check out
                          </Grid>
                          <Grid item xs={3} fontWeight={'bold'}></Grid>
                        </Grid>
                        <Grid container>
                          {!!cleanerLocation.length &&
                            cleanerLocation.map((location) => (
                              <>
                                <Grid item xs={3}>
                                  {location?.service_provider?.profile?.first_name}{' '}
                                  {location?.service_provider?.profile?.last_name}
                                </Grid>
                                <Grid item xs={3}>
                                  {moment.utc(location?.check_in).format('lll')}
                                </Grid>
                                <Grid item xs={3}>
                                  {moment.utc(location?.check_out).format('lll')}
                                </Grid>
                                <Grid
                                  item
                                  xs={3}
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                  }}
                                >
                                  <Tooltip title="See location on Google Map">
                                    <Button
                                      variant="text"
                                      href={`https://www.google.com/maps/search/?api=1&query=${location?.latitude},${location?.longitude}`}
                                      target="_blank"
                                    >
                                      <LocationOnIcon />
                                    </Button>
                                  </Tooltip>
                                </Grid>
                              </>
                            ))}
                        </Grid>
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </Grid>
              <Grid item xs={12} md={6}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Box
                      sx={{
                        boxShadow: 'rgb(30 41 59 / 4%) 0 2px 4px 0',
                        border: ' 1px solid rgba(98,105,118,.16)',
                        background: '#fff',
                        borderTop: ' 5px solid #1976d2',
                        padding: ' 1rem 1rem',
                        borderRadius: '4px',
                        '& .headingSubTxt': {
                          fontSize: '1rem',
                          fontWeight: 'bold',
                        },
                        '& p': {
                          margin: 'unset',
                          paddingLeft: '5px',
                        },
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          paddingBottom: '1rem',
                        }}
                      >
                        <Typography variant="h3" className="headingSubTxt">
                          Customer
                        </Typography>
                        <Box
                          display={'flex'}
                          alignItems="center"
                          paddingBottom="5px"
                          fontWeight={'bold'}
                        >
                          <EventOutlinedIcon sx={{ paddingRight: '5px' }} />
                          <p>
                            Since:{' '}
                            {moment
                              .utc(bookindDetails?.bod?.bod_contact_info?.created_at)
                              .format('MMM DD, YYYY')}
                          </p>
                        </Box>
                      </Box>

                      <Grid container>
                        <Grid item xs={3}>
                          <PersonIcon sx={{ fontSize: '5rem' }} />
                        </Grid>
                        <Grid item xs={9}>
                          <Box
                            display={'flex'}
                            alignItems="center"
                            paddingBottom="5px"
                            fontWeight={'bold'}
                          >
                            <p style={{ fontSize: '1.4rem', textTransform: 'capitalize' }}>
                              {bookindDetails?.bod?.bod_contact_info?.first_name}{' '}
                              {bookindDetails?.bod?.bod_contact_info?.last_name}
                            </p>
                          </Box>
                          <Box display={'flex'} alignItems="center" paddingBottom="5px">
                            <EmailOutlinedIcon sx={{ paddingRight: '5px' }} />
                            <p>{bookindDetails?.bod?.bod_contact_info?.email}</p>
                          </Box>
                          <Box display={'flex'} alignItems="center" paddingBottom="5px">
                            <LocalPhoneOutlinedIcon sx={{ paddingRight: '5px' }} />
                            <p>{bookindDetails?.bod?.bod_contact_info?.phone}</p>
                          </Box>
                          <Box display={'flex'} alignItems="center" paddingBottom="5px">
                            <HomeOutlinedIcon sx={{ paddingRight: '5px' }} />
                            <p>{bookindDetails?.bod?.bod_service_location?.street_address}</p>
                          </Box>
                          <Box display={'flex'} alignItems="center" paddingBottom="5px">
                            <LocationOnOutlinedIcon sx={{ paddingRight: '5px' }} />
                            <p>
                              From: {bookindDetails?.bod?.bod_service_location?.city},{' '}
                              {bookindDetails?.bod?.bod_service_location?.state}
                            </p>
                          </Box>
                          <Box
                            display={'flex'}
                            alignItems="center"
                            justifyContent={'end'}
                            paddingBottom="5px"
                          >
                            <Button
                              variant="text"
                              startIcon={<PersonIcon />}
                              endIcon={<ArrowRightAltOutlinedIcon />}
                              onClick={() =>
                                navigate(`/dashboard/customers/${bookindDetails?.bod?.user}/update`)
                              }
                            >
                              View Customer
                            </Button>
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <Box
                      sx={{
                        boxShadow: 'rgb(30 41 59 / 4%) 0 2px 4px 0',
                        border: ' 1px solid rgba(98,105,118,.16)',
                        background: '#fff',
                        borderTop: ' 5px solid #1976d2',
                        padding: ' 1rem 1rem',
                        borderRadius: '4px',
                        '& .headingSubTxt': {
                          fontSize: '1rem',
                          fontWeight: 'bold',
                          paddingBottom: '1rem',
                        },
                        '& p': {
                          margin: 'unset',
                          paddingLeft: '5px',
                        },
                        '& h3': {
                          margin: 'unset',
                          paddingLeft: '5px',
                        },
                      }}
                    >
                      <Typography variant="h3" className="headingSubTxt">
                        Recurring
                      </Typography>
                      <Box display="flex">
                        <AutorenewIcon sx={{ fontSize: '3rem' }} />
                        <Box>
                          <h3>
                            <span style={{ fontWeight: '400' }}>Frequency: </span>
                            {bookindDetails?.bod?.frequency?.type === 'weekly'
                              ? 'Every week'
                              : bookindDetails?.bod?.frequency?.type === 'once'
                              ? 'One Time'
                              : bookindDetails?.bod?.frequency?.type === 'biweekly'
                              ? 'Biweekly'
                              : bookindDetails?.bod?.frequency?.type === 'monthly'
                              ? 'Every Month'
                              : '-'}
                          </h3>
                          <Box display={'flex'} alignItems="center">
                            <AccessTimeIcon sx={{ paddingRight: '5px' }} />
                            <p>11:00 - 5.00 (hrs)</p>
                          </Box>
                          <Box display={'flex'} alignItems="center">
                            <TodayOutlinedIcon sx={{ paddingRight: '5px' }} />
                            <p>
                              Start{' '}
                              <span style={{ fontWeight: 'bold' }}>
                                {moment(
                                  new Date(bookindDetails?.bod?.frequency?.start_date)
                                ).format('ll')}
                              </span>
                            </p>
                          </Box>
                          <Box display={'flex'} alignItems="center">
                            <TodayOutlinedIcon sx={{ paddingRight: '5px' }} />
                            <p>
                              End{' '}
                              <span style={{ fontWeight: 'bold' }}>
                                {bookindDetails?.bod?.frequency?.recur_end_date === null
                                  ? 'No end date'
                                  : moment(
                                      new Date(bookindDetails?.bod?.frequency?.recur_end_date)
                                    ).format('ll')}
                              </span>
                            </p>
                          </Box>
                        </Box>
                      </Box>
                      <Tabs
                        value={value}
                        onChange={handleChange}
                        aria-label="icon tabs example"
                        sx={{
                          height: '35px',
                          '& button': {
                            display: 'flex',
                            alignItems: 'center',
                            flexDirection: 'row',
                          },
                        }}
                      >
                        <Tab
                          icon={<NoteAddOutlinedIcon sx={{ marginRight: '3px' }} />}
                          label="Upcoming"
                          aria-label="phone"
                        />
                        <Tab
                          icon={<CancelPresentationIcon sx={{ marginRight: '3px' }} />}
                          label="Unscheduled"
                          aria-label="favorite"
                        />
                        <Tab
                          icon={<DoneAllIcon sx={{ marginRight: '3px' }} />}
                          label="passed"
                          aria-label="person"
                        />
                      </Tabs>
                      <Box
                        sx={{
                          maxHeight: '20rem',
                          overflow: 'auto',
                          width: '100%',
                          '&::-webkit-scrollbar': {
                            width: '5px',
                          },
                          '&::-webkit-scrollbar-track': {
                            backgroundColor: 'transparent',
                          },
                          '&::-webkit-scrollbar-thumb ': {
                            boxShadow: 'inset 0 0 6px rgba(0, 0, 0, 0.3)',
                            borderRadius: '4px',
                          },
                        }}
                      >
                        {value === 0 &&
                          !!bookindDetails?.bookings?.length &&
                          bookindDetails?.bookings
                            ?.filter((data) => data?.status === 'scheduled')
                            ?.map((item, index) => (
                              <Grid container key={index} sx={{ paddingTop: '10px' }}>
                                <Grid item xs={2} textAlign="center">
                                  <Box display="flex" alignItems={'center'}>
                                    <BookOutlinedIcon sx={{ marginRight: '10px' }} />{' '}
                                    <span> {index + 1}</span>
                                  </Box>
                                </Grid>
                                <Grid item xs={8} textAlign="center">
                                  <span>
                                    {moment.utc(item?.appointment_date_time).format('lll')}
                                  </span>
                                </Grid>
                                <Grid item xs={2} textAlign="center">
                                  <span>{item?.start_time}</span>
                                </Grid>
                              </Grid>
                            ))}
                        {value === 1 &&
                          !!bookindDetails?.bookings?.length &&
                          bookindDetails?.bookings
                            ?.filter((data) => data?.status === 'unscheduled')
                            ?.map((item, index) => (
                              <Grid container key={index} sx={{ paddingTop: '10px' }}>
                                <Grid item xs={2} textAlign="center">
                                  <Box display="flex" alignItems={'center'}>
                                    <BookOutlinedIcon sx={{ marginRight: '10px' }} />{' '}
                                    <span> {index + 1}</span>
                                  </Box>
                                </Grid>
                                <Grid item xs={8} textAlign="center">
                                  <span>
                                    {moment.utc(item?.appointment_date_time).format('lll')}
                                  </span>
                                </Grid>
                                <Grid item xs={2} textAlign="center">
                                  <span>{item?.start_time}</span>
                                </Grid>
                              </Grid>
                            ))}
                        {value === 2 &&
                          !!bookindDetails?.bookings?.length &&
                          bookindDetails?.bookings
                            ?.filter((data) => data?.status === 'completed')
                            ?.map((item, index) => (
                              <Grid container key={index} sx={{ paddingTop: '10px' }}>
                                <Grid item xs={2} textAlign="center">
                                  <Box display="flex" alignItems={'center'}>
                                    <BookOutlinedIcon sx={{ marginRight: '10px' }} />{' '}
                                    <span> {index + 1}</span>
                                  </Box>
                                </Grid>
                                <Grid item xs={8} textAlign="center">
                                  <span>
                                    {moment.utc(item?.appointment_date_time).format('lll')}
                                  </span>
                                </Grid>
                                <Grid item xs={2} textAlign="center">
                                  <span>{item?.start_time}</span>
                                </Grid>
                              </Grid>
                            ))}
                      </Box>
                    </Box>
                  </Grid>
                  {role !== 'Customer' && (
                    <Grid item xs={12} md={12}>
                      <Box
                        sx={{
                          boxShadow: 'rgb(30 41 59 / 4%) 0 2px 4px 0',
                          border: ' 1px solid rgba(98,105,118,.16)',
                          background: '#fff',
                          borderTop: ' 5px solid #1976d2',
                          padding: ' 1rem 1rem',
                          borderRadius: '4px',
                          '& .headingSubTxt': {
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            paddingBottom: '1rem',
                          },
                          '& p': {
                            margin: 'unset',
                            paddingLeft: '5px',
                          },
                        }}
                      >
                        <Typography variant="h3" className="headingSubTxt">
                          Payment Information
                        </Typography>
                        <Grid container sx={{ marginTop: '0.5rem' }}>
                          <Grid item xs={4} sx={{ fontWeight: 'bold', textAlign: 'start' }}>
                            Card No <small>(last 4)</small>
                          </Grid>
                          <Grid item xs={4} sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                            Card Brand
                          </Grid>
                          <Grid item xs={4} sx={{ fontWeight: 'bold', textAlign: 'end' }}>
                            Expiry
                          </Grid>
                        </Grid>
                        <Grid container>
                          {!!adminCardsData.length &&
                            adminCardsData?.map((card, index) => (
                              <>
                                <Grid item xs={4} sx={{ textAlign: 'start' }}>
                                  {card?.last4}
                                </Grid>
                                <Grid
                                  item
                                  xs={4}
                                  textAlign="center"
                                  sx={{
                                    whiteSpace: 'break-spaces',
                                    wordBreak: 'break-all',
                                    textAlign: 'center',
                                  }}
                                >
                                  {card?.brand}
                                </Grid>
                                <Grid
                                  item
                                  xs={4}
                                  textAlign="center"
                                  sx={{
                                    whiteSpace: 'break-spaces',
                                    wordBreak: 'break-all',
                                    textAlign: 'end',
                                  }}
                                >
                                  {card?.exp_month}/{card?.exp_year}
                                </Grid>
                              </>
                            ))}
                        </Grid>
                        {/* <Box display={'flex'} alignItems="center" justifyContent={'space-between'}>
                          <Box display={'flex'} alignItems="center" paddingBottom="10px">
                            <CreditCardOutlinedIcon sx={{ paddingRight: '5px' }} />
                            <p>Preferred Payment Method</p>
                          </Box>
                          <Box paddingBottom="10px">Credit Card</Box>
                        </Box>

                        <Box textAlign={'right'}>
                          <Button
                            variant="text"
                            startIcon={<CreditCardOutlinedIcon />}
                            endIcon={<ArrowRightAltOutlinedIcon />}
                          >
                            Payment Options
                          </Button>
                        </Box> */}
                      </Box>
                    </Grid>
                  )}

                  <Grid item xs={12} md={12}>
                    <Box
                      sx={{
                        boxShadow: 'rgb(30 41 59 / 4%) 0 2px 4px 0',
                        border: ' 1px solid rgba(98,105,118,.16)',
                        background: '#fff',
                        borderTop: ' 5px solid #1976d2',
                        padding: ' 1rem 1rem',
                        borderRadius: '4px',
                        '& .headingSubTxt': {
                          fontSize: '1rem',
                          fontWeight: 'bold',
                          paddingBottom: '1rem',
                        },
                        '& p': {
                          margin: 'unset',
                          paddingLeft: '5px',
                        },
                      }}
                    >
                      <Typography
                        variant="h3"
                        className="headingSubTxt"
                        style={{ paddingBottom: '0px' }}
                      >
                        Communications
                      </Typography>
                      {/* <Box display="flex" justifyContent={'space-between'}>
                        <Box
                          sx={{
                            '& p': {
                              fontWeight: 'bold',
                            },
                          }}
                        >
                          <p>Customer Wants Email</p>

                          <p>Customer Wants SMS</p>

                          <p>Customer Requested Emails for this</p>

                          <p>Booking</p>

                          <p>Requested SMS for this Booking</p>
                        </Box>
                        <Box sx={{ textAlign: 'right' }}>
                          <p>Yes</p>

                          <p>Yes</p>

                          <p>Yes</p>

                          <p>-</p>

                          <p>Yes</p>
                        </Box>
                      </Box> */}
                      <Grid container spacing={2} sx={{ marginTop: '0.5rem', fontSize: '1rem' }}>
                        <Grid item xs={6}>
                          Recipent
                        </Grid>
                        <Grid item xs={6}>
                          Dates
                        </Grid>
                      </Grid>
                      <Divider />
                      <Grid
                        container
                        columnSpacing={1}
                        sx={{ fontSize: 'x-small', marginTop: '5px' }}
                      >
                        {!!communicationData?.length &&
                          communicationData?.map((communication, index) => (
                            <>
                              <Grid item xs={3}>
                                <Box
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: 'blue',
                                    padding: '2px 5px',
                                    color: 'white',
                                    borderRadius: '25px',
                                    '& p': {
                                      padding: 'unset !important',
                                    },
                                  }}
                                >
                                  <PermIdentityOutlinedIcon sx={{ fontSize: '14px' }} />
                                  <p>
                                    {communication?.customer?.user_profile?.first_name}{' '}
                                    {communication?.customer?.user_profile?.last_name}
                                  </p>
                                </Box>
                              </Grid>
                              <Grid item xs={4}>
                                <Box
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexDirection: 'column',
                                    backgroundColor: 'red',
                                    padding: '2px 5px',
                                    color: 'white',
                                    borderRadius: '25px',
                                    '& p': {
                                      padding: 'unset !important',
                                    },
                                  }}
                                >
                                  <Box display="flex" alignItems={'center'} justifyContent="center">
                                    <p>{communication?.title}</p>
                                  </Box>
                                </Box>
                              </Grid>
                              <Grid item xs={4}>
                                <Box
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexDirection: 'column',
                                    backgroundColor: 'green',
                                    padding: '2px 5px',
                                    color: 'white',
                                    borderRadius: '25px',
                                    '& p': {
                                      padding: '0px 5px !important',
                                    },
                                  }}
                                >
                                  <p>Sent: {moment.utc(communication?.created_at).format('lll')}</p>
                                </Box>
                              </Grid>
                              <Grid item xs={1}>
                                dfg
                              </Grid>
                            </>
                          ))}
                      </Grid>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
              <Grid container spacing={3}>
                <Grid xs={6} sx={{ paddingTop: '4rem', paddingLeft: '3rem !important' }}>
                  <Box
                    sx={{
                      boxShadow: 'rgb(30 41 59 / 4%) 0 2px 4px 0',
                      border: ' 1px solid rgba(98,105,118,.16)',
                      background: '#fff',
                      borderTop: ' 5px solid #1976d2',
                      padding: ' 1rem 1rem',
                      borderRadius: '4px',
                      '& .headingSubTxt': {
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        paddingBottom: '1rem',
                      },
                      '& p': {
                        margin: 'unset',
                        paddingLeft: '5px',
                      },
                    }}
                  >
                    <Typography variant="h3" className="headingSubTxt">
                      Location Points
                    </Typography>
                    {bookindDetails !== null && <GoogleMaps bookindDetails={bookindDetails} />}
                    <Button
                      variant="contained"
                      onClick={() => {
                        setBookindDetails(null);
                        getEventList();
                      }}
                      sx={{ marginTop: '1rem' }}
                    >
                      Refresh
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} md={3} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {role !== 'Customer' && (
              <Box
                sx={{
                  boxShadow: 'rgb(30 41 59 / 4%) 0 2px 4px 0',
                  border: ' 1px solid rgba(98,105,118,.16)',
                  background: '#fff',
                  borderTop: ' 5px solid #1976d2',
                  padding: ' 0.7rem 1rem',
                  borderRadius: '4px',
                  textAlign: 'center',
                  '& .headingSubTxt': {
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    paddingBottom: '1px',
                    textAlign: 'center',
                  },
                  '& p': {
                    margin: 'unset',
                    paddingLeft: '5px',
                  },
                  '& button': {
                    marginTop: '10px',
                    fontWeight: 'bold',
                  },

                  '& .Mui-disabled': {
                    backgroundColor:
                      bookindDetails?.status === 'cancelled'
                        ? '#d32f2f !important'
                        : bookindDetails?.outstanding?.status === 'completed'
                        ? '#2e7d32 !important'
                        : '',
                    color: 'white !important',
                  },
                }}
              >
                <Typography variant="h3" className="headingSubTxt">
                  {bookindDetails?.status === 'cancelled'
                    ? 'Cancelled'
                    : bookindDetails?.outstanding?.status === 'pending'
                    ? 'Not Charged'
                    : bookindDetails?.outstanding?.status === 'completed'
                    ? 'Fully Charged'
                    : 'Partially Charged'}
                </Typography>
                {!!bookindDetails && (
                  <Button
                    variant="contained"
                    color={
                      bookindDetails?.status === 'cancelled'
                        ? 'error'
                        : bookindDetails?.outstanding?.status === 'pending'
                        ? 'inherit'
                        : bookindDetails?.outstanding?.status === 'completed'
                        ? 'success'
                        : 'warning'
                    }
                    onClick={() => setChargeCustomer(true)}
                    disabled={
                      bookindDetails?.status === 'cancelled' ||
                      bookindDetails?.outstanding?.status === 'completed'
                    }
                  >
                    Charge Now
                  </Button>
                )}
              </Box>
            )}

            <Box
              sx={{
                boxShadow: 'rgb(30 41 59 / 4%) 0 2px 4px 0',
                border: ' 1px solid rgba(98,105,118,.16)',
                background: '#fff',
                borderTop: ' 5px solid #1976d2',
                padding: ' 1rem 1rem',
                borderRadius: '4px',
                '& .headingSubTxt': {
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  paddingBottom: '1rem',
                },
                '& p': {
                  margin: 'unset',
                },
                '& button': {
                  fontWeight: '500',
                },
              }}
            >
              <Typography variant="h3" className="headingSubTxt">
                Actions
              </Typography>
              <Box display={'flex'} alignItems={'center'} flexDirection={'column'} gap={1}>
                {role !== 'Customer' && (
                  <Button fullWidth variant="contained" onClick={() => setEditBookingModal(true)}>
                    Edit
                  </Button>
                )}

                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => setOpenRescheduleAppointment(true)}
                >
                  Reschedule Booking
                </Button>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => setOpenRaiseProblemModal(true)}
                >
                  {bookingProblems === null ? 'Raise Problem' : 'Problem Check!'}
                </Button>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() =>
                    navigate(
                      `/dashboard/booking-appointments/${bookindDetails?.id}/details/booking-attachments`
                    )
                  }
                >
                  Attach File
                </Button>
                {role !== 'Customer' && (
                  <Button
                    fullWidth
                    variant="contained"
                    color="success"
                    onClick={() => setChargeCustomer(true)}
                  >
                    Charge Customer
                  </Button>
                )}
                {role !== 'Customer' && (
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={() => setCompleteBookingModal(true)}
                  >
                    Mark Complete
                  </Button>
                )}
                <Button fullWidth variant="contained" onClick={() => setInvoiceModal(true)}>
                  Generate Invoice
                </Button>
                <Button
                  fullWidth
                  variant="contained"
                  color="success"
                  onClick={() => setChargeTip(true)}
                >
                  Charge Tip
                </Button>
                <Button
                  fullWidth
                  variant="contained"
                  color="warning"
                  onClick={() => setCancelBookingModal(true)}
                  disabled={bookindDetails?.is_cancelled}
                >
                  Cancel Booking
                </Button>
              </Box>
            </Box>
            <Box
              sx={{
                boxShadow: 'rgb(30 41 59 / 4%) 0 2px 4px 0',
                border: ' 1px solid rgba(98,105,118,.16)',
                background: '#fff',
                borderTop: ' 5px solid #1976d2',
                padding: ' 1rem 1rem',
                borderRadius: '4px',
                '& .headingSubTxt': {
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  paddingBottom: '1rem',
                },
                '& p': {
                  margin: 'unset',
                },
              }}
            >
              <Typography variant="h3" className="headingSubTxt">
                Cost Information
              </Typography>
              <Box display="flex" alignItems={'center'} justifyContent="space-between">
                <Typography variant="body1">Type Cleaning</Typography>
                <Typography variant="body1" style={{ textTransform: 'capitalize' }}>
                  {bookindDetails?.bod?.frequency?.type}
                </Typography>
              </Box>
              <Box display="flex" alignItems={'center'} justifyContent="space-between">
                <Typography variant="body1">Status</Typography>
                <Typography variant="body1" style={{ textTransform: 'capitalize' }}>
                  {bookindDetails?.outstanding?.status}
                </Typography>
              </Box>
              <Divider sx={{ paddingTop: '1.5rem', marginBottom: '1.5rem' }} />
              <Box display="flex" alignItems={'center'} justifyContent="space-between">
                <Typography variant="body1">Total</Typography>
                <Typography variant="body1">
                  $ {bookindDetails?.outstanding?.total_amount?.toFixed(2)}
                </Typography>
              </Box>
              <Box display="flex" alignItems={'center'} justifyContent="space-between">
                <Typography variant="body1">Required Time (Hrs)</Typography>
                <Typography variant="body1">
                  {bookindDetails?.bod?.total_hours?.toFixed(1)}
                </Typography>
              </Box>
              <Divider sx={{ paddingTop: '1.5rem', marginBottom: '1.5rem' }} />
              <Box display="flex" alignItems={'center'} justifyContent="space-between">
                <Typography variant="body1">Charged</Typography>
                <Typography variant="body1">
                  $ {bookindDetails?.outstanding?.paid_amount?.toFixed(2)}
                </Typography>
              </Box>
              <Box display="flex" alignItems={'center'} justifyContent="space-between">
                <Typography variant="body1" style={{ width: 'fit-content' }}>
                  Outstanding Balance
                </Typography>
                <Typography variant="body1">
                  {bookindDetails?.outstanding?.paid_amount === null
                    ? `$${bookindDetails?.outstanding?.total_amount?.toFixed(2)}`
                    : `$${(
                        bookindDetails?.outstanding?.total_amount -
                        bookindDetails?.outstanding?.paid_amount
                      )?.toFixed(2)}`}
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                boxShadow: 'rgb(30 41 59 / 4%) 0 2px 4px 0',
                border: ' 1px solid rgba(98,105,118,.16)',
                background: '#fff',
                borderTop: ' 5px solid #1976d2',
                padding: ' 1rem 1rem',
                borderRadius: '4px',
                '& .headingSubTxt': {
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  margin: 'unset',
                  paddingBottom: '0.5rem',
                },
                '& p': {
                  margin: 'unset',
                },
                '& button': {
                  fontWeight: 'bold',
                },
              }}
            >
              <Typography variant="h3" className="headingSubTxt">
                Location
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  gap: '1',
                  '& p': {
                    margin: 'unset',
                  },
                }}
              >
                <LocationOnIcon sx={{ fontSize: '1rem', marginTop: '3px' }} />
                <p>{bookindDetails?.bod?.bod_service_location?.street_address}</p>
              </Box>
              <Box display={'flex'} alignItems="center" justifyContent={'end'} paddingBottom="5px">
                <Button
                  variant="text"
                  startIcon={<LocationOnIcon />}
                  endIcon={<ArrowRightAltOutlinedIcon />}
                  sx={{ fontSize: '0.8rem' }}
                  href={`http://maps.google.com/?q=${bookindDetails?.bod?.bod_service_location?.street_address} ${bookindDetails?.bod?.bod_service_location?.city} 
                  ${bookindDetails?.bod?.bod_service_location?.state}`}
                  target="_blank"
                >
                  See on Google Map
                </Button>
              </Box>
            </Box>
            <Box
              sx={{
                boxShadow: 'rgb(30 41 59 / 4%) 0 2px 4px 0',
                border: ' 1px solid rgba(98,105,118,.16)',
                background: '#fff',
                borderTop: ' 5px solid #1976d2',
                padding: ' 1rem 1rem',
                borderRadius: '4px',
                '& .headingSubTxt': {
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  margin: 'unset',
                  paddingBottom: '0.5rem',
                },
                '& p': {
                  margin: 'unset',
                },
                '& button': {
                  fontWeight: 'bold',
                },
              }}
            >
              <Grid container>
                <Grid item xs={6}>
                  <p style={{ margin: 'unset', fontSize: 'small' }}>Creation Date</p>
                </Grid>
                <Grid item xs={6}>
                  <p
                    style={{
                      margin: 'unset',
                      fontSize: 'small',
                      fontWeight: 'bold',
                      textAlign: 'right',
                    }}
                  >
                    {moment.utc(bookindDetails?.created_at).format('lll')}
                  </p>
                </Grid>
                <Grid item xs={6}>
                  <p style={{ margin: 'unset', fontSize: 'small' }}>Last Modified Date</p>
                </Grid>
                <Grid item xs={6}>
                  <p
                    style={{
                      margin: 'unset',
                      fontSize: 'small',
                      fontWeight: 'bold',
                      textAlign: 'right',
                    }}
                  >
                    {moment.utc(bookindDetails?.updated_at).format('lll')}
                  </p>
                </Grid>
              </Grid>
            </Box>

            {role === 'Customer' ? (
              <CustomerChat bookindDetails={bookindDetails} />
            ) : (
              <Chat bookindDetails={bookindDetails} />
            )}
          </Grid>
        </Grid>
      </Container>
      <RescheduleAppointment
        open={openRescheduleAppointment}
        handleClose={() => setOpenRescheduleAppointment(false)}
        bookindDetails={bookindDetails}
        getEventList={getEventList}
      />
      <RaiseBookingProblem
        open={openRaiseProblemModal}
        handleClose={() => setOpenRaiseProblemModal(false)}
        bookindDetails={bookindDetails}
        bookingProblems={bookingProblems}
        getEventList={getEventList}
      />
      <EditBookingModal
        open={editBookingModal}
        handleClose={() => setEditBookingModal(false)}
        bookindDetails={bookindDetails}
        getEventList={getEventList}
        bookingData={bookingData}
        getBookingData={getBookingData}
      />
      <ChargeCustomerModal
        open={chargeCustomer}
        handleClose={() => setChargeCustomer(false)}
        bookindDetails={bookindDetails}
        bookingProblems={bookingProblems}
        getEventList={getEventList}
      />
      <ChargeTipModal
        open={chargeTip}
        handleClose={() => setChargeTip(false)}
        bookindDetails={bookindDetails}
        getEventList={getEventList}
      />
      <GenerateInvoice
        open={invoiceModal}
        handleClose={() => setInvoiceModal(false)}
        bookindDetails={bookindDetails}
      />
      <BookingMarkComplete
        open={completeBookingModal}
        handleClose={() => setCompleteBookingModal(false)}
        bookindDetails={bookindDetails}
        getEventList={getEventList}
      />
      <BookingMarkCancel
        open={cancelBookingModal}
        handleClose={() => setCancelBookingModal(false)}
        bookindDetails={bookindDetails}
        getEventList={getEventList}
      />
    </>
  );
}

export default BookingOrderDetails;
