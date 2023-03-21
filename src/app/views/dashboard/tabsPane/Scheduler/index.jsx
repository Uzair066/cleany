import React, { useState } from 'react';
import { GET_BOOKING_DASHBOARD } from '../../../../api';
import axios from '../../../../../axios';
import moment from 'moment';
import { Box, Grid, Icon, Stack, Typography, styled } from '@mui/material';

import Button from '@mui/material/Button';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';

const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
  },
}));

const SchedulerHeading = styled('h3')(({ theme }) => ({
  marginTop: 'unset',
  paddingBottom: '10px',
  typography: 'body1',
  color: 'black',
  borderBottom: '1px solid',
  borderBottomColor: theme.palette.text.secondary,
  textAlign: 'center',
  fontWeight: '900 !important',
  fontSize: '24px !important',
}));
function Scheduler() {
  const [events, setEvents] = useState();
  const currentDate = new Date().toJSON().slice(0, 10);
  React.useEffect(() => {
    getEvents();
  }, []);
  const getEvents = async () => {
    await axios
      .get(`${GET_BOOKING_DASHBOARD}?start_date=${currentDate}`)
      .then((res) => {
        const dataToMap = res?.data?.data;
        setEvents(dataToMap);
      })
      .catch((err) => console.log(err));
  };
  const GetDayFormDate = (date) => {
    let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let d = new Date(date);
    let dayName = days[d.getDay()];
    var month = d.toLocaleString('default', { month: 'short' });
    console.log(month);
    return { day: date === currentDate ? 'Today' : dayName, month: month, date: d.getDate() };
  };
  return (
    <Box>
      <SchedulerHeading>Your Scheduling Overview</SchedulerHeading>
      <Grid container>
        {events?.slice(0, 5)?.map((ele) => {
          return (
            <Grid item md={2.4} textAlign="center">
              <Typography
                component={'h2'}
                variant="h3"
                color="#CBC3E3"
                sx={{ fontWeight: 900, fontSize: '29px' }}
              >
                {GetDayFormDate(ele.value).day}
              </Typography>
              <Box>
                {GetDayFormDate(ele.value).date} {''}
                {GetDayFormDate(ele.value).month}
                {ele.data.length > 0 ? (
                  <>
                    {' '}
                    <p>{ele.data.length} Bookings </p>{' '}
                  </>
                ) : (
                  <p>No Bookings</p>
                )}
              </Box>
              {ele?.data?.map((e) => {
                return (
                  <>
                    {currentDate === ele.value ? (
                      <>
                        <Box sx={{ textAlign: 'left' }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-evenly', py: 3 }}>
                            <Icon sx={{ fontSize: '50px' }}>woman</Icon>
                            <Box>
                              <Typography sx={{ display: 'flex', py: '2px' }}>
                                <Icon sx={{ pr: 2 }}> alarm</Icon>{' '}
                                {moment(e.bod.start_time, 'hh').format('LT')} - {e.bod.total_hours}
                                (Hours)
                              </Typography>
                              <Typography sx={{ display: 'flex', py: '2px' }}>
                                <Icon sx={{ pr: 2 }}>public</Icon>
                                {e.id}
                              </Typography>
                              <Stack>
                                <Box
                                  sx={{
                                    bgcolor: 'blue',
                                    px: '10px',
                                    borderRadius: '20px',
                                    color: 'white',
                                  }}
                                >
                                  <a
                                    href={`https://cleany-app.netlify.app/dashboard/booking-appointments/${e.id}/details/`}
                                  >
                                    {e.status}
                                  </a>
                                </Box>
                              </Stack>
                            </Box>
                          </Box>
                        </Box>
                      </>
                    ) : (
                      <>
                        <Box
                          component="span"
                          sx={{
                            bgcolor: 'blue',
                            px: '10px',
                            borderRadius: '20px',
                            color: 'white',
                            ml: 0.1,
                          }}
                        >
                          <a
                            href={`https://cleany-app.netlify.app/dashboard/booking-appointments/${e.id}/details/`}
                          >
                            <HtmlTooltip
                              title={
                                <React.Fragment>
                                  <Typography color="inherit" component={'h4'} variant="h5">
                                    Booking Details
                                  </Typography>
                                  <Typography color="inherit">
                                    {e.bod.total_hours}(Hours)
                                  </Typography>
                                  <Typography color="inherit">{e.id}</Typography>
                                  <Typography color="inherit">{e.status}</Typography>
                                </React.Fragment>
                              }
                            >
                              <Button sx={{ color: 'white' }}>
                                {' '}
                                {moment(e.bod.start_time, 'hh').format('LT')}
                              </Button>
                            </HtmlTooltip>
                          </a>
                        </Box>
                      </>
                    )}
                  </>
                );
              })}
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}

export default Scheduler;
