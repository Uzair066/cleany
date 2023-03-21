import React, { Fragment, useState, useCallback, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Calendar, Views, DateLocalizer, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Box, Button, Divider, styled, Typography } from '@mui/material';
import { Breadcrumb } from 'app/components';
import { useLocation, useParams } from 'react-router-dom';
import axios from '../../../../axios';
import { CREATE_PROVIDER_LEAVE, DELETE_PROVIDER_LEAVE, GET_PROVIDER_WORK_LIST } from 'app/api';
import toast from 'react-hot-toast';
import Drawer from '@mui/material/Drawer';
import CloseIcon from '@mui/icons-material/Close';

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
const DrawerMain = styled('div')(({ theme }) => ({
  height: 'calc(100vh - 63px)',
}));

export default function CalendarLeaves() {
  const params = useParams();
  const location = useLocation();
  const localizer = momentLocalizer(moment);

  const [myEvents, setEvents] = useState([]);
  const [state, setState] = useState(false);
  const [selectedLeaveTime, setSelectedLeaveTime] = useState(null);

  useEffect(() => {
    getEventList();
  }, []);
  const getEventList = async () => {
    await axios
      .get(`${GET_PROVIDER_WORK_LIST}?service_provider=${params?.id}`)
      .then((res) => {
        const dataToMap = res?.data?.data.map((item) => {
          return {
            start: moment(item?.start).toDate(),
            id: item?.id,
            end: moment(item?.end).toDate(),
            title: item?.title,
          };
        });
        setEvents(dataToMap);
      })
      .catch((err) => console.log(err));
  };

  const handleSelectSlot = useCallback(
    ({ start, end }) => {
      const title = window.prompt(
        `Create Nonworking Time ${moment(start).format('YYYY-MM-DD')} to ${moment(end).format(
          'YYYY-MM-DD'
        )} sfdsf`,
        'Consumer notes'
      );
      if (title) {
        toast.promise(
          axios.post(
            `${CREATE_PROVIDER_LEAVE}`,
            { start: start, end: end, service_provider: params?.id, title: title },
            {
              headers: { 'Content-Type': 'application/json' },
            }
          ),
          {
            loading: () => {
              return `Creating Service Provider Working Timeline!`;
            },
            success: (res) => {
              getEventList();
              return res?.data?.message;
            },
            error: (err) => {
              return err?.message;
            },
          }
        );
      }
    },
    [setEvents]
  );

  const handleSelectEvent = useCallback((event) => {
    setState(true);
    setSelectedLeaveTime(event);
  }, []);

  const { defaultDate, scrollToTime } = useMemo(
    () => ({
      defaultDate: new Date(),
      scrollToTime: new Date(),
    }),
    []
  );
  const handleDeleteTime = () => {
    toast.promise(axios.delete(`${DELETE_PROVIDER_LEAVE}/${selectedLeaveTime?.id}`), {
      loading: () => {
        return `Deleting Service Provider Working Timeline!`;
      },
      success: (res) => {
        getEventList();
        setState(false);
        return res?.data?.message;
      },
      error: (err) => {
        return err?.message;
      },
    });
  };
  return (
    <>
      <Container>
        <Box className="breadcrumb">
          <Breadcrumb
            routeSegments={[
              { name: 'Service Provider', path: '/dashboard/service-providers' },
              { name: 'All Service Providers', path: '/dashboard/service-providers' },
              { name: 'Work Calendar' },
            ]}
          />
          <h3>
            {location?.state?.user_profile.first_name} {location?.state?.user_profile.last_name}'s
            Work Calendar
          </h3>
        </Box>
        <Fragment>
          <div style={{ height: '600px' }}>
            <Calendar
              defaultDate={defaultDate}
              defaultView={Views.MONTH}
              startAccessor="start"
              endAccessor="end"
              resizable
              views={{ month: true, week: true }}
              events={myEvents}
              localizer={localizer}
              onSelectEvent={handleSelectEvent}
              onSelectSlot={handleSelectSlot}
              selectable
              scrollToTime={scrollToTime}
            />
          </div>
        </Fragment>
      </Container>
      <Drawer
        anchor={'right'}
        open={state}
        sx={{
          '& .MuiDrawer-paperAnchorRight': {
            width: '400px',
          },
        }}
        onClose={() => setState(false)}
      >
        <DrawerMain>
          <Box
            display={'flex'}
            alignItems="center"
            justifyContent={'space-between'}
            sx={{ padding: '15px' }}
          >
            <Typography variant="h5">Booking</Typography>
            <CloseIcon sx={{ cursor: 'pointer' }} onClick={() => setState(false)} />
          </Box>
          <Divider />
          <Box
            sx={{ padding: '15px' }}
            display={'flex'}
            justifyContent={'space-between'}
            flexDirection="column"
            height={'100%'}
          >
            <Box>
              <Typography variant="body1" fontWeight={'bold'} fontSize={'16px'}>
                Start
              </Typography>
              <Typography variant="body1" paddingBottom={'1rem'}>
                {moment(selectedLeaveTime?.start).format('LLL')}
              </Typography>
              <Typography variant="body1" fontWeight={'bold'} fontSize={'16px'}>
                End
              </Typography>
              <Typography variant="body1" paddingBottom={'1rem'}>
                {moment(selectedLeaveTime?.end).format('LLL')}
              </Typography>
              <Typography variant="body1" fontWeight={'bold'} fontSize={'16px'}>
                Consumer Notes
              </Typography>
              <Typography variant="body1" paddingBottom={'1rem'}>
                {selectedLeaveTime?.title}
              </Typography>
            </Box>
            <Box display={'flex'} alignItems="center" gap={2} paddingBottom={'1rem'}>
              <Button variant="outlined" color="error" onClick={() => setState(false)}>
                Close
              </Button>
              <Button variant="contained" color="error" onClick={handleDeleteTime}>
                Delete Time
              </Button>
            </Box>
          </Box>
        </DrawerMain>
      </Drawer>
    </>
  );
}

CalendarLeaves.propTypes = {
  localizer: PropTypes.instanceOf(DateLocalizer),
};
