import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import toast, { Toaster } from 'react-hot-toast';
import { LoadingButton } from '@mui/lab';
import { Box } from '@mui/system';
import axios from '../../../../axios';
import { COMPLETE_BOOKING } from 'app/api';
import { Grid, ToggleButton, ToggleButtonGroup } from '@mui/material';

function BookingMarkComplete({ open, handleClose, bookindDetails, getEventList }) {
  const [loading, setLoading] = useState(false);
  const [notifyCustomer, setNotifyCustomer] = useState('yes');
  const [feedBack, setFeedBack] = useState('yes');
  const [requestTip, setRequestTip] = useState('yes');

  const handleCompleteBooking = () => {
    setLoading(true);
    toast.promise(
      axios.post(
        `${COMPLETE_BOOKING}`,
        {
          booking_id: bookindDetails?.id,
          notify_customer: notifyCustomer,
          feed_back: feedBack,
          request_tip: requestTip,
        },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      ),
      {
        loading: () => {
          return `Marking Booking Complete!`;
        },
        success: (res) => {
          setLoading(false);
          getEventList();
          handleClose();
          return res?.data?.message;
        },
        error: (err) => {
          setLoading(false);
          return err?.message;
        },
      }
    );
  };

  return (
    <>
      <Dialog
        open={open}
        maxWidth={'sm'}
        PaperProps={{
          sx: {
            width: '100%',
          },
        }}
        aria-labelledby="package-item"
        aria-describedby="package-item-description"
      >
        <DialogTitle id="package-item" style={{ fontSize: '1.5rem' }}>
          Complete Booking
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={10}>
              Would you like us to notify your customer that the booking is complete?
            </Grid>
            <Grid item xs={2}>
              <ToggleButtonGroup
                color="primary"
                value={notifyCustomer}
                exclusive
                size="small"
                onChange={(e, s) => {
                  setNotifyCustomer(s);
                }}
                aria-label="Platform"
              >
                <ToggleButton value="yes">Yes</ToggleButton>
                <ToggleButton value="no">No</ToggleButton>
              </ToggleButtonGroup>
            </Grid>
            <Grid item xs={10}>
              Would you like us to include a feedback request?
            </Grid>
            <Grid item xs={2}>
              <ToggleButtonGroup
                color="primary"
                value={feedBack}
                exclusive
                size="small"
                onChange={(e, s) => {
                  setFeedBack(s);
                }}
                aria-label="Platform"
              >
                <ToggleButton value="yes">Yes</ToggleButton>
                <ToggleButton value="no">No</ToggleButton>
              </ToggleButtonGroup>
            </Grid>
            <Grid item xs={10}>
              Would you like us to ask for a tip?
            </Grid>
            <Grid item xs={2}>
              <ToggleButtonGroup
                color="primary"
                value={requestTip}
                exclusive
                size="small"
                onChange={(e, s) => {
                  setRequestTip(s);
                }}
                aria-label="Platform"
              >
                <ToggleButton value="yes">Yes</ToggleButton>
                <ToggleButton value="no">No</ToggleButton>
              </ToggleButtonGroup>
            </Grid>
          </Grid>
          <Box display={'flex'} alignItems="center" justifyContent={'end'} sx={{ mb: 2, mt: 3 }}>
            <Button
              onClick={() => {
                handleClose();
              }}
              variant="outlined"
              color="primary"
              sx={{ mr: 2 }}
            >
              No, do not mark complete
            </Button>
            <LoadingButton
              onClick={handleCompleteBooking}
              color="primary"
              loading={loading}
              variant="contained"
            >
              Yes, mark complete
            </LoadingButton>
          </Box>
        </DialogContent>

        <Toaster position="top-right" />
      </Dialog>
    </>
  );
}

export default BookingMarkComplete;
