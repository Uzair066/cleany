import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import toast, { Toaster } from 'react-hot-toast';
import { Box } from '@mui/system';
import CloseIcon from '@mui/icons-material/Close';
import BookOutlinedIcon from '@mui/icons-material/BookOutlined';
import {
  DialogActions,
  Divider,
  Grid,
  MenuItem,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import TodayIcon from '@mui/icons-material/Today';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

function StepSix({
  open,
  handleClose,
  setFormData,
  formData,
  handleReset,
  setStepFive,
  handleFormData,
  setStepSeven,
}) {
  const [validated, setValidated] = useState(true);

  const handleNext = () => {
    setStepSeven(true);
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

  const handleToggleChange = (value) => {
    const dupObj = { ...formData };
    dupObj.schedule_booking = value;
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
                <span>Step 4 of 4</span> Date and Time
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
            '& h3': {
              margin: 'unset',
              paddingBottom: '5px',
            },
            '& p': {
              margin: 'unset',
            },
          }}
        >
          <Box display="flex" alignItems={'center'} justifyContent="space-between">
            <p>Do you want to schedule this booking?</p>
            <Switch
              checked={formData?.schedule_booking}
              onChange={(event) => handleToggleChange(event.target.checked)}
              inputProps={{ 'aria-label': 'controlled' }}
            />
          </Box>
          <Box display="flex" alignItems={'center'} gap={1} paddingBottom="5px">
            <TodayIcon />
            <p>Start Date and Time:</p>
          </Box>
          <TextField
            size="small"
            id="datetime-local"
            type={'datetime-local'}
            fullWidth
            name="start_time"
            value={formData?.start_time}
            onChange={(e) => handleFormData(e.target.name, e.target.value)}
          />
          <Box display="flex" alignItems={'center'} gap={1} paddingBottom="5px" marginTop="1rem">
            <TodayIcon />
            <p>End Date and Time:</p>
          </Box>
          <TextField
            size="small"
            id="datetime-local"
            type={'datetime-local'}
            fullWidth
            name="end_time"
            value={formData?.end_time}
            onChange={(e) => handleFormData(e.target.name, e.target.value)}
          />
          <Box display="flex" alignItems={'center'} justifyContent="space-between">
            <Box display="flex" alignItems={'center'} gap={1} paddingBottom="5px" marginTop="1rem">
              <AccessTimeIcon />
              <p>Duration</p>
            </Box>
            <p>5.0 (hrs)</p>
          </Box>
          <Divider sx={{ marginTop: '1.5rem', marginBottom: '2rem' }} />
          <Grid container>
            <Grid item xs={6}>
              <p>Frequency *</p>
            </Grid>
            <Grid item xs={6}>
              <TextField
                size="small"
                id="outlined-select-currency"
                select
                fullWidth
                name="frequency"
                inputProps={{ placeholder: '--Select a Booking Frequency--' }}
                value={formData?.frequency}
                onChange={(e) => handleFormData(e.target.name, e.target.value)}
              >
                <MenuItem value={'daily'}>Onetime</MenuItem>
                <MenuItem value={'weekly'}>Weekly - 20% Off</MenuItem>
                <MenuItem value={'biweekly'}>Biweekly - 15% Off</MenuItem>
                <MenuItem value={'monthly'}>Monthly - 10% Off</MenuItem>
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
                setStepFive(true);
                handleClose();
              }}
              sx={{ marginRight: '1rem' }}
            >
              Back
            </Button>
            <Button
              variant="contained"
              color="primary"
              endIcon={<ArrowForwardIcon />}
              onClick={() => handleNext()}
            >
              Next
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
                  <p>${formData?.packages_text}</p>
                  <p>${formData?.discounts_text}</p>
                  <p>${formData?.extras_text}</p>
                  <p>${formData?.taxes_text}</p>
                  <p>${formData?.total_text}</p>
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

export default StepSix;
