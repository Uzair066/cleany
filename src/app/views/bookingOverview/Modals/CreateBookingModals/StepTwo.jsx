import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import toast, { Toaster } from 'react-hot-toast';
import { Box } from '@mui/system';
import CloseIcon from '@mui/icons-material/Close';
import BookOutlinedIcon from '@mui/icons-material/BookOutlined';
import axios from '../../../../../axios';
import { DialogActions, Grid, TextField, Typography } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { GET_CUSTOMER_WITH_ID, GET_SERVICE_LIST } from 'app/api';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined';
import PhoneAndroidOutlinedIcon from '@mui/icons-material/PhoneAndroidOutlined';

function StepTwo({
  open,
  handleClose,
  handleFormData,
  formData,
  handleReset,
  setStepOne,
  setStepThree,
  setFormData,
}) {
  const [validated, setValidated] = useState(true);
  const [showButtonClick, setShowButtonClick] = useState(false);
  useEffect(async () => {
    await axios
      .get(`${GET_CUSTOMER_WITH_ID}?user_id=${formData?.selected_customer_id?.id}`)
      .then((res) => {
        const dupObj = { ...formData };
        dupObj.address = res?.data?.data?.user_profile?.address;
        dupObj.road = res?.data?.data?.user_profile?.address;
        dupObj.city = res?.data?.data?.user_profile?.city;
        dupObj.state = res?.data?.data?.user_profile?.state;
        dupObj.zip_code = res?.data?.data?.user_profile?.zip_code;
        dupObj.first_name = res?.data?.data?.user_profile?.first_name;
        dupObj.last_name = res?.data?.data?.user_profile?.last_name;
        dupObj.phone_no = res?.data?.data?.user_profile?.phone_number;
        setFormData(dupObj);
      })
      .catch((err) => console.log(err));
  }, [open]);

  const handleNext = () => {
    setStepThree(true);
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
                <span>Step 2 of 4</span> Customer Information
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
          }}
        >
          <Box
            sx={{
              padding: '1rem',
              boxShadow: 'rgb(30 41 59 / 4%) 0 2px 4px 0',
              border: '1px solid rgba(98,105,118,.16)',
              borderTop: '2px solid #1D60B0',
              marginBottom: '1.5rem',
            }}
          >
            <h3>Customer</h3>
            <Box display={'flex'} alignItems="center">
              <PersonAddAltOutlinedIcon
                sx={{ width: '70px', height: '70px', marginRight: '2rem' }}
              />
              <CreditCardOutlinedIcon />
              <PhoneAndroidOutlinedIcon sx={{ marginLeft: '0.5rem' }} />
            </Box>
          </Box>
          <Box
            sx={{
              padding: '1rem',
              boxShadow: 'rgb(30 41 59 / 4%) 0 2px 4px 0',
              border: '1px solid rgba(98,105,118,.16)',
              borderTop: '2px solid #1D60B0',
              marginBottom: '1.5rem',
            }}
          >
            <h3>Service Location</h3>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  size="small"
                  fullWidth
                  type="text"
                  label="First Name"
                  inputProps={{ placeholder: 'First Name' }}
                  value={formData?.first_name}
                  name="first_name"
                  onChange={(e) => handleFormData(e.target.name, e.target.value)}
                  // error={
                  //   !validated &&
                  //   (formData.email == '' || formData.email.match(validEmailRegex) === null)
                  // }
                  // helperText={
                  //   !validated &&
                  //   (formData.email == '' || formData.email.match(validEmailRegex) === null) &&
                  //   'Email is required! and enter valid email!'
                  // }
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  size="small"
                  fullWidth
                  type="text"
                  label="Last Name"
                  inputProps={{ placeholder: 'Last Name' }}
                  value={formData?.last_name}
                  name="last_name"
                  onChange={(e) => handleFormData(e.target.name, e.target.value)}
                  // error={
                  //   !validated &&
                  //   (formData.email == '' || formData.email.match(validEmailRegex) === null)
                  // }
                  // helperText={
                  //   !validated &&
                  //   (formData.email == '' || formData.email.match(validEmailRegex) === null) &&
                  //   'Email is required! and enter valid email!'
                  // }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  size="small"
                  fullWidth
                  type="text"
                  label="Phone No"
                  inputProps={{ placeholder: 'Phone no' }}
                  value={formData?.phone_no}
                  name="phone_no"
                  onChange={(e) => handleFormData(e.target.name, e.target.value)}
                  // error={
                  //   !validated &&
                  //   (formData.email == '' || formData.email.match(validEmailRegex) === null)
                  // }
                  // helperText={
                  //   !validated &&
                  //   (formData.email == '' || formData.email.match(validEmailRegex) === null) &&
                  //   'Email is required! and enter valid email!'
                  // }
                />
              </Grid>
            </Grid>

            <p>(The service address can be changed for this Booking)</p>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  size="small"
                  fullWidth
                  label="Address"
                  type="text"
                  inputProps={{ placeholder: 'Road' }}
                  value={formData.road}
                  name="road"
                  onChange={(e) => handleFormData(e.target.name, e.target.value)}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  size="small"
                  fullWidth
                  type="text"
                  label="Apt # (optional)"
                  inputProps={{ placeholder: 'Unit/Apt/Suite#' }}
                  value={formData.apt_suite}
                  name="apt_suite"
                  onChange={(e) => handleFormData(e.target.name, e.target.value)}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  size="small"
                  fullWidth
                  type="text"
                  label="City"
                  inputProps={{ placeholder: 'City' }}
                  value={formData.city}
                  name="city"
                  onChange={(e) => handleFormData(e.target.name, e.target.value)}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  size="small"
                  fullWidth
                  type="text"
                  label="State"
                  inputProps={{ placeholder: 'State' }}
                  value={formData.state}
                  name="state"
                  onChange={(e) => handleFormData(e.target.name, e.target.value)}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  size="small"
                  fullWidth
                  type="number"
                  label="Zip Code"
                  inputProps={{ placeholder: 'Zip Code', min: 0 }}
                  value={formData.zip_code}
                  name="zip_code"
                  onChange={(e) => handleFormData(e.target.name, e.target.value)}
                />
              </Grid>
              <Grid item xs={3}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => setShowButtonClick(!showButtonClick)}
                >
                  Add Location
                </Button>
              </Grid>
              <Grid item xs={9}>
                {showButtonClick && (
                  <TextField
                    size="small"
                    fullWidth
                    type="text"
                    inputProps={{ placeholder: 'Location' }}
                    value={formData.location}
                    name="location"
                    onChange={(e) => handleFormData(e.target.name, e.target.value)}
                  />
                )}
              </Grid>
            </Grid>
          </Box>
          <Box
            sx={{
              padding: '1rem',
              boxShadow: 'rgb(30 41 59 / 4%) 0 2px 4px 0',
              border: '1px solid rgba(98,105,118,.16)',
              marginBottom: '1.5rem',
              '& p': {
                margin: 'unset',
              },
            }}
          >
            <Box
              display={'flex'}
              alignItems="center"
              justifyContent={'space-between'}
              paddingBottom="2rem"
            >
              <p>The following taxes will used for this booking</p>
              <Button variant="contained">Let Me Choose Another</Button>
            </Box>
            <Box
              display={'flex'}
              alignItems="center"
              justifyContent={'space-between'}
              sx={{
                '& h2': {
                  margin: 'unset',
                },
                '& span': {
                  margin: 'unset',
                },
                '& p': {
                  margin: 'unset',
                  fontWeight: 'bold !important',
                },
              }}
            >
              <h2>
                Tax Code: Florida Sales Tex{' '}
                <span style={{ fontSize: 'small' }}>(FL) Florida United States</span>
              </h2>
              <p>State Tax 7 (%)</p>
            </Box>
          </Box>
        </Box>
        <DialogActions
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
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
                setStepOne(true);
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
        <Toaster position="top-right" />
      </Dialog>
    </>
  );
}

export default StepTwo;
