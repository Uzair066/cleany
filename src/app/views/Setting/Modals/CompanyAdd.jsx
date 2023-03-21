import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
import toast, { Toaster } from 'react-hot-toast';
import { LoadingButton } from '@mui/lab';
import { Grid, MenuItem, styled, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import axios from '../../../../axios';
import { MAKE_COMPANY_PROFILE } from 'app/api';

const Container = styled('div')(({ theme }) => ({
  borderTop: '1px solid #d5d1d1',
  '& .formMain': {},
  '& .heading': {
    marginTop: '1rem',
    marginBottom: '1rem',
    color: 'rgba(52, 49, 76, 1)',
  },
}));

function CompanyAdd({ open, handleClose }) {
  const [loading, setLoading] = useState(false);
  const schema = Yup.object().shape({
    title: Yup.string().required('Company name is required'),
    company_timezone: Yup.string().required('Timezone is required'),
    email: Yup.string().email('Enter proper email address').required('Email is required'),
    phone: Yup.string()
      .matches(/^\+[0-9]+$/, 'Must be only digits')
      .required('Phone no is required!'),
    street_address: Yup.string().required('Address is required'),
    city: Yup.string().required('City is required'),
    state: Yup.string().required('State is required'),
    zip_code: Yup.number('Zip Code is required!')
      .min(0, 'invalid Zip Code')
      .required('Zip Code is required!')
      .nullable(),
    website: Yup.string().url('Url is invalid'),
    facebook: Yup.string().url('Url is invalid'),
    linkedin: Yup.string().url('Url is invalid'),
    twitter: Yup.string().url('Url is invalid'),
    instagram: Yup.string().url('Url is invalid'),
    latitude: Yup.number('Latitude is required!')
      .min(0, 'invalid Latitude')
      .required('Latitude is required!')
      .nullable(),
    longitude: Yup.number('Longitude is required!')
      .min(0, 'invalid Longitude')
      .required('Longitude is required!')
      .nullable(),
  });
  const formik = useFormik({
    initialValues: {
      title: '',
      company_timezone: '-6',
      email: '',
      phone: '',
      street_address: '',
      city: '',
      state: 'Florida',
      zip_code: '',
      website: '',
      facebook: '',
      linkedin: '',
      twitter: '',
      instagram: '',
      latitude: '',
      longitude: '',
    },
    validationSchema: schema,
    onSubmit: (values) => {
      setLoading(true);
      toast.promise(
        axios.post(`${MAKE_COMPANY_PROFILE}`, values, {
          headers: { 'Content-Type': 'application/json' },
        }),
        {
          loading: () => {
            return `Making Company Profile`;
          },
          success: (res) => {
            setLoading(false);
            setTimeout(() => {
              handleClose();
              resetForm();
            }, 1000);

            return res?.data?.message;
          },
          error: (err) => {
            setLoading(false);
            return err?.message;
          },
        }
      );
    },
  });

  const { errors, touched, resetForm, handleSubmit, getFieldProps } = formik;
  return (
    <Dialog
      open={open}
      onClose={() => {
        handleClose();
        resetForm();
      }}
      maxWidth={'md'}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title" style={{ fontSize: '1.5rem' }}>
        {'Add Company Profile'}
      </DialogTitle>
      <DialogContent>
        <Container className="formMain">
          <Typography variant="h5" className="heading">
            Company Information:
          </Typography>
          <FormikProvider value={formik}>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item lg={6} md={6} sm={12} xs={12}>
                  <TextField
                    size="small"
                    fullWidth
                    autoComplete="username"
                    type="text"
                    label="Company Name*"
                    {...getFieldProps('title')}
                    error={Boolean(touched.title && errors.title)}
                    helperText={touched.title && errors.title}
                  />
                </Grid>
                <Grid item lg={6} md={6} sm={12} xs={12}>
                  <TextField
                    size="small"
                    fullWidth
                    select
                    type="text"
                    label="Timezone*"
                    {...getFieldProps('company_timezone')}
                    error={Boolean(touched.company_timezone && errors.company_timezone)}
                    helperText={touched.company_timezone && errors.company_timezone}
                  >
                    <MenuItem value={'-6'}>-6</MenuItem>
                    <MenuItem value={'+5'}>+5</MenuItem>
                  </TextField>
                </Grid>
                <Grid item lg={6} md={6} sm={12} xs={12}>
                  <TextField
                    size="small"
                    fullWidth
                    type="text"
                    label="Email*"
                    {...getFieldProps('email')}
                    error={Boolean(touched.email && errors.email)}
                    helperText={touched.email && errors.email}
                  />
                  <span style={{ fontSize: 'small' }}>
                    We'll never share your email with anyone else.
                  </span>
                </Grid>
                <Grid item lg={6} md={6} sm={12} xs={12}>
                  <TextField
                    size="small"
                    fullWidth
                    type="text"
                    label="Phone*"
                    {...getFieldProps('phone')}
                    error={Boolean(touched.phone && errors.phone)}
                    helperText={touched.phone && errors.phone}
                  ></TextField>
                </Grid>
              </Grid>
              <Typography variant="h5" className="heading">
                Contact Information:
              </Typography>
              <Grid container spacing={2}>
                <Grid item sm={12} xs={12}>
                  <TextField
                    size="small"
                    fullWidth
                    type="text"
                    label="Address*"
                    {...getFieldProps('street_address')}
                    error={Boolean(touched.street_address && errors.street_address)}
                    helperText={touched.street_address && errors.street_address}
                  />
                  <span style={{ fontSize: 'small' }}>
                    e.g.: Bld Mihail Kogalniceanu, nr. 8 Bl 1, Sc 1, Ap 09
                  </span>
                </Grid>
                <Grid item lg={4} md={6} sm={12} xs={12}>
                  <TextField
                    size="small"
                    fullWidth
                    type="text"
                    label="City*"
                    {...getFieldProps('city')}
                    error={Boolean(touched.city && errors.city)}
                    helperText={touched.city && errors.city}
                  />
                </Grid>
                <Grid item lg={4} md={6} sm={12} xs={12}>
                  <TextField
                    size="small"
                    fullWidth
                    type="text"
                    label="State*"
                    select
                    {...getFieldProps('state')}
                    error={Boolean(touched.state && errors.state)}
                    helperText={touched.state && errors.state}
                  >
                    <MenuItem value={'Florida'}>Florida</MenuItem>
                    <MenuItem value={'New York'}>New York</MenuItem>
                  </TextField>
                </Grid>
                <Grid item lg={4} md={6} sm={12} xs={12}>
                  <TextField
                    size="small"
                    fullWidth
                    type="number"
                    label="Zip code*"
                    {...getFieldProps('zip_code')}
                    error={Boolean(touched.zip_code && errors.zip_code)}
                    helperText={touched.zip_code && errors.zip_code}
                  />
                </Grid>

                <Grid item sm={6} xs={12}>
                  <TextField
                    size="small"
                    fullWidth
                    type="number"
                    label="Latitude"
                    {...getFieldProps('latitude')}
                    error={Boolean(touched.latitude && errors.latitude)}
                    helperText={touched.latitude && errors.latitude}
                  />
                </Grid>
                <Grid item sm={6} xs={12}>
                  <TextField
                    size="small"
                    fullWidth
                    type="number"
                    label="Longitude"
                    {...getFieldProps('longitude')}
                    error={Boolean(touched.longitude && errors.longitude)}
                    helperText={touched.longitude && errors.longitude}
                  />
                </Grid>
                <Grid item sm={12} xs={12}>
                  <TextField
                    size="small"
                    fullWidth
                    type="url"
                    label="Website"
                    {...getFieldProps('website')}
                    error={Boolean(touched.website && errors.website)}
                    helperText={touched.website && errors.website}
                  />
                </Grid>
                <Grid item lg={6} md={6} sm={12} xs={12}>
                  <TextField
                    size="small"
                    fullWidth
                    type="url"
                    label="Facebook"
                    {...getFieldProps('facebook')}
                    error={Boolean(touched.facebook && errors.facebook)}
                    helperText={touched.facebook && errors.facebook}
                  />
                </Grid>
                <Grid item lg={6} md={6} sm={12} xs={12}>
                  <TextField
                    size="small"
                    fullWidth
                    type="url"
                    label="Linkedin"
                    {...getFieldProps('linkedin')}
                    error={Boolean(touched.linkedin && errors.linkedin)}
                    helperText={touched.linkedin && errors.linkedin}
                  />
                </Grid>
                <Grid item lg={6} md={6} sm={12} xs={12}>
                  <TextField
                    size="small"
                    fullWidth
                    type="url"
                    label="Twitter"
                    {...getFieldProps('twitter')}
                    error={Boolean(touched.twitter && errors.twitter)}
                    helperText={touched.twitter && errors.twitter}
                  />
                </Grid>
                <Grid item lg={6} md={6} sm={12} xs={12}>
                  <TextField
                    size="small"
                    fullWidth
                    type="url"
                    label="Instagram"
                    {...getFieldProps('instagram')}
                    error={Boolean(touched.instagram && errors.instagram)}
                    helperText={touched.instagram && errors.instagram}
                  />
                </Grid>
              </Grid>
              <Box
                display={'flex'}
                alignItems="center"
                justifyContent={'end'}
                sx={{ mb: 2, mt: 3 }}
              >
                <Button
                  onClick={() => {
                    handleClose();
                    resetForm();
                  }}
                  variant="outlined"
                  color="primary"
                  sx={{ mr: 2 }}
                >
                  Cancel
                </Button>
                <LoadingButton type="submit" color="primary" loading={loading} variant="contained">
                  Submit
                </LoadingButton>
              </Box>
            </Form>
          </FormikProvider>
        </Container>
      </DialogContent>
      <Toaster position="top-right" />
    </Dialog>
  );
}

export default CompanyAdd;
