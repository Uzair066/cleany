import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import toast, { Toaster } from 'react-hot-toast';
import { Box } from '@mui/system';
import CloseIcon from '@mui/icons-material/Close';
import BookOutlinedIcon from '@mui/icons-material/BookOutlined';
import { DialogActions, Divider, Grid, MenuItem, TextField, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function StepTen({
  open,
  handleClose,
  setFormData,
  formData,
  handleReset,
  setStepNine,
  setCompleteBooking,
  handleFormData,
}) {
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
                <span>Optional</span> Booking Payment
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
              paddingBottom: '1rem',
            },
            '& p': {
              margin: 'unset',
            },
          }}
        >
          <h2>How do you intend to charge the customer?</h2>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <p>Select the Payment Processor to use</p>
            </Grid>
            <Grid item xs={6}>
              <TextField
                size="small"
                id="outlined-select-currency"
                select
                fullWidth
                name="payment_processor"
                inputProps={{ placeholder: 'Select deep clean hours' }}
                value={formData?.payment_processor}
                onChange={(e) => handleFormData(e.target.name, e.target.value)}
              >
                <MenuItem value={'none'}>None</MenuItem>
              </TextField>
            </Grid>
          </Grid>
          <Divider sx={{ marginTop: '1.5rem', marginBottom: '1.5rem' }} />
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <p>Select the Payment Processor to use</p>
            </Grid>
            <Grid item xs={6}>
              <TextField
                size="small"
                id="outlined-select-currency"
                select
                fullWidth
                name="payment_method"
                inputProps={{ placeholder: 'Select deep clean hours' }}
                value={formData?.payment_method}
                onChange={(e) => handleFormData(e.target.name, e.target.value)}
              >
                <MenuItem value={'Card'}>Card</MenuItem>
              </TextField>
            </Grid>
          </Grid>
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
                setStepNine(true);
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
                setCompleteBooking(true);
                handleClose();
              }}
            >
              Create Booking Now
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

export default StepTen;
