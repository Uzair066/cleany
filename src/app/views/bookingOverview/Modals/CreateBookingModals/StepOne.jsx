import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import toast, { Toaster } from 'react-hot-toast';
import { Box } from '@mui/system';
import CloseIcon from '@mui/icons-material/Close';
import BookOutlinedIcon from '@mui/icons-material/BookOutlined';
import axios from '../../../../../axios';
import {
  DialogActions,
  Divider,
  Grid,
  MenuItem,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { ADMIN_SIDE_CUSTOMER_LIST, GET_SERVICE_LIST } from 'app/api';

function StepOne({
  open,
  handleClose,
  handleFormData,
  formData,
  handleReset,
  setStepTwo,
  setFormData,
}) {
  const [validated, setValidated] = useState(true);
  const [alignment, setAlignment] = React.useState('custom');
  const [serviceList, setServiceList] = useState([]);
  const [customerList, setCustomerList] = useState([]);

  useEffect(() => {
    serviceListAPI();
  }, []);

  const serviceListAPI = async () => {
    await axios
      .get(`${GET_SERVICE_LIST}`, {
        headers: { 'Content-Type': 'application/json' },
      })
      .then((res) => {
        setServiceList(res?.data?.data);
      })
      .catch((err) => console.log(err));
    await axios
      .get(`${ADMIN_SIDE_CUSTOMER_LIST}`, {
        headers: { 'Content-Type': 'application/json' },
      })
      .then((res) => {
        setCustomerList(res?.data?.data);
      })
      .catch((err) => console.log(err));
  };

  const handleChange = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

  const handleNext = () => {
    if (validateVendorForm()) {
      handleClose();
      setStepTwo(true);
    }
  };

  var validEmailRegex =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const validateVendorForm = () => {
    if (
      formData.email == '' ||
      formData.email.match(validEmailRegex) == null ||
      formData?.service == '' ||
      formData?.service === 'select' ||
      formData?.service === null ||
      formData?.service === undefined
    ) {
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
                <span>Step 1 of 4</span> Initial Information
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
          <h3>Customers</h3>
          <TextField
            size="small"
            fullWidth
            type="email"
            inputProps={{ placeholder: 'Email' }}
            select
            defaultValue="select"
            value={formData.email}
            name="email"
            onChange={(e) => {
              const dupObj = { ...formData };
              dupObj.email = e.target.value;
              const id = customerList?.find((data) => data.email === e.target.value);
              dupObj.selected_customer_id = id;

              setFormData(dupObj);
            }}
            error={
              !validated && (formData.email == '' || formData.email.match(validEmailRegex) === null)
            }
            helperText={
              !validated &&
              (formData.email == '' || formData.email.match(validEmailRegex) === null) &&
              'Email is required! and enter valid email!'
            }
          >
            {!!customerList?.length &&
              customerList?.map((customer) => (
                <MenuItem key={customer?.id} value={customer?.email}>
                  {customer?.email}
                </MenuItem>
              ))}
          </TextField>
          <Divider sx={{ marginBottom: '2rem', marginTop: '2rem' }} />
          <Box
            sx={{
              paddingBottom: '1.5rem',
              '& .MuiToggleButtonGroup-root': {
                width: '100%',
                '& button': {
                  width: '50%',
                  textTransform: 'none',
                  fontSize: '1rem',
                },
              },
              '& .Mui-selected': {
                color: 'white !important',
                background: '#1976d2 !important',
              },
            }}
          >
            <ToggleButtonGroup
              color="primary"
              value={alignment}
              exclusive
              onChange={handleChange}
              aria-label="Platform"
            >
              <ToggleButton value="existing">Use an Existing Booking Page</ToggleButton>
              {/* <ToggleButton value="custom">Create a Custom Booking</ToggleButton> */}
            </ToggleButtonGroup>
          </Box>
          {/* {alignment !== 'custom' && ( */}
          <Grid container>
            <Grid item xs={6}>
              <h3>From a Service Booking Page *</h3>
            </Grid>
            <Grid item xs={6}>
              <TextField
                id="outlined-select-currency"
                select
                fullWidth
                defaultValue={'select'}
                name="service"
                inputProps={{ placeholder: '--Select a Service Booking Page--' }}
                value={formData?.service}
                onChange={(e) => {
                  const dupObj = { ...formData };
                  dupObj.service = e.target.value;
                  const id = serviceList?.find((data) => data.id === e.target.value);
                  dupObj.service_slug = id?.slug;
                  setFormData(dupObj);
                }}
                error={
                  !validated &&
                  (formData?.service == '' ||
                    formData?.service === 'select' ||
                    formData?.service === null ||
                    formData?.service === undefined)
                }
                helperText={
                  !validated &&
                  (formData?.service == '' ||
                    formData?.service === 'select' ||
                    formData?.service === null ||
                    formData?.service === undefined) &&
                  'Service is required!'
                }
              >
                <MenuItem value={'select'}>--Select a Service Booking Page--</MenuItem>
                {serviceList.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.title}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
          {/* )} */}
        </Box>
        <DialogActions
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            '& button': {
              fontSize: '1rem',
            },
          }}
        >
          <Button
            variant="contained"
            color="primary"
            endIcon={<ArrowForwardIcon />}
            onClick={() => handleNext()}
          >
            Next
          </Button>
        </DialogActions>
        <Toaster position="top-right" />
      </Dialog>
    </>
  );
}

export default StepOne;
