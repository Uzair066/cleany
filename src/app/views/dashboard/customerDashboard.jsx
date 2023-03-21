import { Box, Button, Grid, styled } from '@mui/material';
import { CUSTOMER_CURRENT_BOOKING } from 'app/api';
import { Breadcrumb } from 'app/components';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../../axios';
import CustomerChargeTipModal from './CustomerDashboardModal/customerChargeTipModal';
import ServiceModal from './CustomerDashboardModal/serviceModal';

const Container = styled('div')(({ theme }) => ({
  margin: '30px',
  [theme.breakpoints.down('sm')]: { margin: '16px' },
  '& .breadcrumb': {
    marginBottom: '30px',
    [theme.breakpoints.down('sm')]: { marginBottom: '16px' },
    '& h5': {
      margin: 'unset',
    },
  },
}));

function CustomerDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [currentBooking, setCurrentBooking] = useState(null);
  const [selectService, setSelectService] = useState(false);
  const [chargeTip, setChargeTip] = useState(false);

  useEffect(() => {
    userBookingData();
  }, []);

  const userBookingData = async () => {
    await axios
      .get(`${CUSTOMER_CURRENT_BOOKING}`, {
        headers: { 'Content-Type': 'application/json' },
      })
      .then((res) => {
        setCurrentBooking(res?.data?.data);
      })
      .catch((err) => console.log(err));
  };

  return (
    <Container>
      <Box className="breadcrumb">
        <h5>CLEANY MIAMI</h5>
        <Breadcrumb routeSegments={[{ name: 'Customer Portal' }]} />
      </Box>
      <Box
        sx={{
          boxShadow: ' rgb(30 41 59 / 4%) 0 2px 4px 0',
          border: '1px solid rgba(98,105,118,.16)',
          background: 'white',
          padding: '0.5rem',
          borderRadius: '4px',
        }}
      >
        <Box
          sx={{
            background: 'linear-gradient(60deg, rgba(50,165,215,1) 0%, rgba(30,41,59,1) 100%)',
            '& .waves': {
              width: '100%',
              height: '15vh',
              marginBottom: '-7px',
              minHeight: '100px',
              maxHeight: '150px',
              position: 'relative',
              '& .parallax > use': {
                animation: 'move-forever 25s cubic-bezier(.55,.5,.45,.5) infinite',
                '&:nth-child(1)': {
                  animationDelay: '-2s',
                  animationDuration: '7s',
                },
                '&:nth-child(2)': {
                  animationDelay: '-3s',
                  animationDuration: '10s',
                },
                '&:nth-child(3)': {
                  animationDelay: '-4s',
                  animationDuration: '13s',
                },
                '&:nth-child(4)': {
                  animationDelay: '-5s',
                  animationDuration: '20s',
                },
              },
            },
          }}
        >
          <Box
            sx={{
              textAlign: 'center',
              '& .heading': {
                textAlign: 'center',
                margin: 'unset',
                color: 'white',
                fontWeight: '200',
                letterSpacing: '0px',
                fontSize: '48px',
                paddingBottom: '0.5rem',
                paddingTop: '1rem',
              },
              '& .subheading': {
                paddingBottom: '0.5rem',
                margin: 'unset',
                color: 'white',
              },
            }}
          >
            <p className="heading">Welcome Back {user?.full_name}!</p>
            <h2 className="subheading">Your Details</h2>
            <Grid container spacing={2}>
              {currentBooking != null && (
                <>
                  <Grid
                    item
                    xs={6}
                    sx={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}
                  >
                    {currentBooking?.bod?.type}
                    <br />
                    {moment
                      .utc(currentBooking?.appointment_date_time)
                      .format('MMMM DD, YYYY h:mm a')}
                    <br />
                    0000-0015
                  </Grid>
                  <Grid
                    item
                    xs={6}
                    sx={{
                      color: 'white',
                      textAlign: 'center',
                      fontWeight: 'bold',
                      padding: '0px 10px',
                    }}
                  >
                    At The Location
                    <br />
                    {currentBooking?.bod?.bod_service_location?.street_address},{' '}
                    {currentBooking?.bod?.bod_service_location?.city},{' '}
                    {currentBooking?.bod?.bod_service_location?.state}
                    <br />
                    {currentBooking?.bod?.bod_service_location?.zip_code}
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sx={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}
                  >
                    <Button
                      variant="contained"
                      sx={{ fontWeight: 'bold' }}
                      onClick={() =>
                        navigate(`/dashboard/booking-appointments/${currentBooking?.id}/details/`)
                      }
                    >
                      View Details
                    </Button>
                  </Grid>
                </>
              )}
              <Grid item xs={12} sx={{ color: '#1e293b', textAlign: 'center', fontWeight: 'bold' }}>
                <Box
                  display={'flex'}
                  alignItems="center"
                  justifyContent={'center'}
                  gap={3}
                  paddingBottom="1rem"
                ></Box>
                <Button
                  href="https://www.udemy.com/course/nodejs-the-complete-guide/learn/lecture/11739012#overview"
                  target={'_blank'}
                  variant="outlined"
                  color="inherit"
                  sx={{
                    flexDirection: 'column',
                    fontWeight: 'bold',
                    '& span': {
                      margin: 'unset',
                      fontWeight: '300',
                      fontSize: 'small',
                    },
                  }}
                >
                  <span>Available on the</span>
                  App Store
                </Button>
                <Button
                  href="https://www.udemy.com/course/nodejs-the-complete-guide/learn/lecture/11739012#overview"
                  target={'_blank'}
                  variant="outlined"
                  color="inherit"
                  sx={{
                    flexDirection: 'column',
                    fontWeight: 'bold',
                    marginLeft: '10px',
                    '& span': {
                      margin: 'unset',
                      fontWeight: '300',
                      fontSize: 'small',
                    },
                  }}
                >
                  <span>Available on the</span>
                  Google Play
                </Button>
              </Grid>
            </Grid>
          </Box>

          <svg
            className="waves"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox="0 24 150 28"
            preserveAspectRatio="none"
            shapeRendering="auto"
          >
            <defs>
              <path
                id="gentle-wave"
                d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
              ></path>
            </defs>
            <g className="parallax">
              <use xlinkHref="#gentle-wave" x="48" y="0" fill="rgba(255,255,255,0.7)"></use>
              <use xlinkHref="#gentle-wave" x="48" y="3" fill="rgba(255,255,255,0.5)"></use>
              <use xlinkHref="#gentle-wave" x="48" y="5" fill="rgba(255,255,255,0.3)"></use>
              <use xlinkHref="#gentle-wave" x="48" y="7" fill="#fff"></use>
            </g>
          </svg>
        </Box>
      </Box>
      <Box
        sx={{
          marginTop: '1rem',
          boxShadow: ' rgb(30 41 59 / 4%) 0 2px 4px 0',
          border: '1px solid rgba(98,105,118,.16)',
          background: 'linear-gradient(60deg, rgba(50,165,215,1) 0%, rgba(30,41,59,1) 100%)',
          padding: '0.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          borderRadius: '4px',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            cursor: 'pointer',
            '& svg': {
              border: '2px solid white',
              padding: '2px',
              borderRadius: '25px',
              width: '50px',
              height: '50px',
              color: 'white',
              strokeWidth: '1.5 !important',
            },
            '& p': {
              margin: 'unset',
              color: 'white',
            },
          }}
          onClick={() => navigate('/dashboard/customer-booking')}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="icon icon-tabler icon-tabler-bookmark"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <path d="M9 4h6a2 2 0 0 1 2 2v14l-5 -3l-5 3v-14a2 2 0 0 1 2 -2"></path>
          </svg>
          <p>See Bookings</p>
        </Box>
        <Box
          onClick={() => setSelectService(true)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            cursor: 'pointer',
            '& svg': {
              border: '2px solid white',
              padding: '2px',
              borderRadius: '25px',
              width: '50px',
              height: '50px',
              color: 'white',
              strokeWidth: '1.5 !important',
            },
            '& p': {
              margin: 'unset',
              color: 'white',
            },
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="icon icon-tabler icon-tabler-brand-booking"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <path d="M4 18v-9.5a4.5 4.5 0 0 1 4.5 -4.5h7a4.5 4.5 0 0 1 4.5 4.5v7a4.5 4.5 0 0 1 -4.5 4.5h-9.5a2 2 0 0 1 -2 -2z"></path>
            <path d="M8 12h3.5a2 2 0 1 1 0 4h-3.5v-7a1 1 0 0 1 1 -1h1.5a2 2 0 1 1 0 4h-1.5"></path>
            <line x1="16" y1="16" x2="16.01" y2="16"></line>
          </svg>
          <p>Book Now</p>
        </Box>
        <Box
          onClick={() => setChargeTip(true)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            cursor: 'pointer',
            '& svg': {
              border: '2px solid white',
              padding: '2px',
              borderRadius: '25px',
              width: '50px',
              height: '50px',
              color: 'white',
              strokeWidth: '1.5 !important',
            },
            '& p': {
              margin: 'unset',
              color: 'white',
            },
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="icon icon-tabler icon-tabler-news"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <path d="M16 6h3a1 1 0 0 1 1 1v11a2 2 0 0 1 -4 0v-13a1 1 0 0 0 -1 -1h-10a1 1 0 0 0 -1 1v12a3 3 0 0 0 3 3h11"></path>
            <line x1="8" y1="8" x2="12" y2="8"></line>
            <line x1="8" y1="12" x2="12" y2="12"></line>
            <line x1="8" y1="16" x2="12" y2="16"></line>
          </svg>
          <p>Charge Tip</p>
        </Box>
      </Box>
      <ServiceModal open={selectService} handleClose={() => setSelectService(false)} />
      <CustomerChargeTipModal
        open={chargeTip}
        handleClose={() => setChargeTip(false)}
        bookindDetails={currentBooking}
        getEventList={userBookingData}
        customerSide={'customer-side'}
      />
    </Container>
  );
}

export default CustomerDashboard;
