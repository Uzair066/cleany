import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import toast, { Toaster } from 'react-hot-toast';
import { Box } from '@mui/system';
import CloseIcon from '@mui/icons-material/Close';
import BookOutlinedIcon from '@mui/icons-material/BookOutlined';
import { DialogActions, Divider, Grid, Switch, Typography } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function StepSeven({
  open,
  handleClose,
  setFormData,
  formData,
  handleReset,
  setStepSix,
  setStepEight,
  setCompleteBooking,
  handleSubmitBooking,
}) {
  const [validated, setValidated] = useState(true);

  const handleNext = () => {
    setStepEight(true);
    handleClose();
    if (validateVendorForm()) {
    }
  };

  var validEmailRegex =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const validateVendorForm = () => {
    if (formData.email == '' || formData.email.match(validEmailRegex) == null) {
      setValidated(false);
      return false;
    }
    setValidated(true);
    return true;
  };

  const handleToggleChange = (key, value) => {
    const dupObj = { ...formData };
    dupObj[key] = value;
    setFormData(dupObj);
  };
  return (
    <>
      <Dialog
        open={open}
        maxWidth={'md'}
        PaperProps={{
          sx: {
            width: '100%',
          },
        }}
        aria-labelledby="package-item"
        aria-describedby="package-item-description"
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '1.5rem',
            backgroundColor: '#1D60B0',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', color: 'white', fontSize: '1.25rem' }}>
            <BookOutlinedIcon
              sx={{
                fill: 'white',
                width: '70px',
                height: '70px',
                transform: 'rotate(-10deg)',
                marginRight: '2rem',
              }}
            />
            <Box
              sx={{
                '& h1': {
                  fontSize: '1.25rem',
                  fontWeight: '500',
                },
                '& span': {
                  fontSize: '1.4rem',
                  fontWeight: 'bold',
                },
              }}
            >
              <Typography variant="h1">Create a new Booking</Typography>
              <Typography variant="h1">
                <span>All Done!</span> Create the new booking
              </Typography>
            </Box>
          </Box>
          <CloseIcon
            sx={{ cursor: 'pointer' }}
            onClick={() => {
              handleReset();
              handleClose();
            }}
          />
        </Box>
        <Box
          sx={{
            padding: '1.5rem 2rem',
            '& h2': {
              margin: 'unset',
              paddingBottom: '5px',
            },
            '& p': {
              margin: 'unset',
            },
          }}
        >
          <Box
            sx={{
              backgroundColor: 'rgba(32,107,196,.03)',
              textAlign: 'center',
              color: '#1D60B0',
              height: '63px',
              border: '1px solid #206bc4',
              borderRadius: '4px',
              marginBottom: '1rem',
            }}
            display="flex"
            alignItems={'center'}
            justifyContent="center"
          >
            <p style={{ fontSize: '1.25rem' }}>Your new booking is ready to be created!</p>
          </Box>
          <Box display="flex" alignItems={'center'} justifyContent="space-between">
            <h2>Do you want to send a confirmation email to your customer?</h2>
            <Switch
              checked={formData?.confirmation_email}
              onChange={(event) => handleToggleChange('confirmation_email', event.target.checked)}
              inputProps={{ 'aria-label': 'controlled' }}
            />
          </Box>
          <Divider sx={{ marginTop: '1.5rem', marginBottom: '1.5rem' }} />
          <Box display="flex" alignItems={'center'} justifyContent="space-between">
            <p>Allow the coustomer to reschedule a booking</p>
            <Switch
              checked={formData?.allow_rescedule}
              onChange={(event) => handleToggleChange('allow_rescedule', event.target.checked)}
              inputProps={{ 'aria-label': 'controlled' }}
            />
          </Box>
          <Box display="flex" alignItems={'center'} justifyContent="space-between">
            <p>Allow the coustomer to cancel a booking</p>
            <Switch
              checked={formData?.allow_cancel}
              onChange={(event) => handleToggleChange('allow_cancel', event.target.checked)}
              inputProps={{ 'aria-label': 'controlled' }}
            />
          </Box>
          <Divider sx={{ marginTop: '1.5rem', marginBottom: '1.5rem' }} />
          <Box
            sx={{
              backgroundColor: 'rgba(32,107,196,.03)',
              textAlign: 'center',
              color: '#1D60B0',
              height: '74px',
              border: '1px solid #206bc4',
              borderRadius: '4px',
            }}
            display="flex"
            alignItems={'center'}
            justifyContent="center"
            flexDirection={'column'}
          >
            <p style={{ fontSize: '0.875rem' }}>There are more options are available to you!</p>
            <p style={{ fontSize: '0.875rem' }}>
              Notes, Attachments, Pre-authrizations, and payment information
            </p>
          </Box>
        </Box>
        <DialogActions
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBottom: '2rem',
            '& button': {
              fontSize: '1rem',
            },
          }}
        >
          <Box></Box>
          <Box>
            <Button
              variant="contained"
              color="primary"
              startIcon={<ArrowBackIcon />}
              onClick={() => {
                setStepSix(true);
                handleClose();
              }}
              sx={{ marginRight: '1rem' }}
            >
              Back
            </Button>
            <Button
              sx={{ marginRight: '1rem' }}
              variant="contained"
              color="primary"
              onClick={() => {
                handleSubmitBooking();
              }}
            >
              Create Booking Now
            </Button>
            <Button
              variant="contained"
              color="primary"
              endIcon={<ArrowForwardIcon />}
              onClick={() => handleNext()}
            >
              More Options
            </Button>
          </Box>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              handleReset();
              handleClose();
            }}
          >
            Cancel
          </Button>
        </DialogActions>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '0.5rem 2rem 1.5rem 2rem',
            backgroundColor: '#1D60B0',
            '& h3': {
              margin: 'unset',
              color: 'white',
              fontWeight: 'bold',
              paddingBottom: '5px',
            },
            '& p': {
              color: 'white',
              margin: 'unset',
            },
          }}
        >
          <Grid container spacing={5}>
            <Grid item xs={6}>
              <h3>Service: Cleany Miami - Custom Hourly</h3>
              <Grid container>
                <Grid item xs={10}>
                  <p>Minimum Time:</p>
                  <p>Maximum Price:</p>
                  <p>Base Time:</p>
                  <p>Base Price:</p>
                  <p>People:</p>
                </Grid>
                <Grid item xs={2}>
                  <p>0(hrs)</p>
                  <p>$0.00</p>
                  <p>0(hrs)</p>
                  <p>$0.00</p>
                  <p>1</p>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={6}>
              <Grid container>
                <Grid item xs={10}>
                  <p>Packages:</p>
                  <p>Discounts:</p>
                  <p>Extras:</p>
                  <p>Taxes:</p>
                  <p>Total:</p>
                </Grid>
                <Grid item xs={2}>
                  <p>$279.0</p>
                  <p>$0.00</p>
                  <p>$0.00</p>
                  <p>$19.53</p>
                  <p>$298.53</p>
                </Grid>
              </Grid>
              <Divider sx={{ borderColor: 'white', marginTop: '0.5rem', marginBottom: '0.5rem' }} />

              <Grid container>
                <Grid item xs={10}>
                  <p>Time Required(hrs):</p>
                </Grid>
                <Grid item xs={2}>
                  <p>5</p>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
        <Toaster position="top-right" />
      </Dialog>
    </>
  );
}

export default StepSeven;
