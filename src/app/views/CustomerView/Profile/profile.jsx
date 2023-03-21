import { Box, Button, Grid, MenuItem, styled, TextField, Typography } from '@mui/material';
import { Breadcrumb, SimpleCard } from 'app/components';
import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';

import { useFormik, Form, FormikProvider } from 'formik';
import toast, { Toaster } from 'react-hot-toast';
import { LoadingButton } from '@mui/lab';
import axios from '../../../../axios';
import { GET_CUSTOMER_PROFILE, UPDATE_CUSTOMER_PROFILE } from 'app/api';

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

const StyledButton = styled(Button)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

function Profile() {
  const [loading, setLoading] = useState(false);
  const [formData, setformData] = useState([]);
  useEffect(() => {
    customerProfileApi();
  }, []);

  const customerProfileApi = async () => {
    await axios
      .get(`${GET_CUSTOMER_PROFILE}`, {
        headers: { 'Content-Type': 'application/json' },
      })
      .then((res) => {
        setformData(res?.data);
      })
      .catch((err) => console.log(err));
  };

  const schema = Yup.object().shape({
    first_name: Yup.string().required('First name is required'),
    last_name: Yup.string().required('Last name is required'),
    time_zone: Yup.string().required('Timezone is required'),
    email: Yup.string().email('Enter proper email address').required('Email is required'),
    phone_number: Yup.string()
      .matches(/^\+[0-9]+$/, 'Must be only digits')
      .required('Phone no is required!'),
    address: Yup.string().required('Address is required'),
    city: Yup.string().required('City is required'),
    country: Yup.string().required('Country is required'),
    state: Yup.string().required('State is required'),
    zip_code: Yup.number('Zip Code is required!')
      .min(0, 'invalid Zip Code')
      .required('Zip Code is required!')
      .nullable(),
    gender: Yup.string().required('Gender is required!'),
    language: Yup.string().required('Language is required!'),
  });

  const formik = useFormik({
    initialValues: {
      first_name: '',
      last_name: '',
      time_zone: '-6',
      email: '',
      phone_number: '',
      address: '',
      city: '',
      country: '',
      state: 'Florida',
      zip_code: '',
      role: 'Customer',
      gender: '',
      language: '',
    },
    validationSchema: schema,
    onSubmit: (values) => {
      setLoading(true);
      toast.promise(
        axios.put(`${UPDATE_CUSTOMER_PROFILE}`, values, {
          headers: { 'Content-Type': 'application/json' },
        }),
        {
          loading: () => {
            return `Updating Profile`;
          },
          success: (res) => {
            setLoading(false);
            setTimeout(() => {
              customerProfileApi();
            }, 1000);

            return 'Profile Updated Successfully!';
          },
          error: (err) => {
            setLoading(false);
            return err?.message;
          },
        }
      );
    },
  });
  const { errors, touched, setFieldValue, handleSubmit, getFieldProps } = formik;

  useEffect(() => {
    setFieldValue('first_name', formData?.profile?.first_name);
    setFieldValue('last_name', formData?.profile?.last_name);
    setFieldValue('time_zone', formData?.profile?.time_zone);
    setFieldValue('email', formData?.email);
    setFieldValue('phone_number', formData?.profile?.phone_number);
    setFieldValue('address', formData?.profile?.address);
    setFieldValue('city', formData.profile?.city);
    setFieldValue('state', formData.profile?.state);
    setFieldValue('zip_code', formData.profile?.zip_code);
    setFieldValue('country', formData.profile?.country);
    setFieldValue('gender', formData.profile?.gender);
    setFieldValue('language', formData.profile?.language);
  }, [formData]);

  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb
          routeSegments={[
            { name: 'Settings', path: '/dashboard/settings/profile' },
            { name: 'Profile' },
          ]}
        />
      </Box>

      <SimpleCard title="My Account">
        <Box className="formMain">
          <Typography variant="h5" className="heading">
            User Information:
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
                    label="First Name*"
                    {...getFieldProps('first_name')}
                    error={Boolean(touched.first_name && errors.first_name)}
                    helperText={touched.first_name && errors.first_name}
                  />
                </Grid>
                <Grid item lg={6} md={6} sm={12} xs={12}>
                  <TextField
                    size="small"
                    fullWidth
                    autoComplete="username"
                    type="text"
                    label="Last Name*"
                    {...getFieldProps('last_name')}
                    error={Boolean(touched.last_name && errors.last_name)}
                    helperText={touched.last_name && errors.first_name}
                  />
                </Grid>
                <Grid item lg={6} md={6} sm={12} xs={12}>
                  <TextField
                    size="small"
                    fullWidth
                    select
                    type="text"
                    label="Timezone*"
                    {...getFieldProps('time_zone')}
                    error={Boolean(touched.time_zone && errors.time_zone)}
                    helperText={touched.time_zone && errors.time_zone}
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
                    inputProps={{ readOnly: true }}
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
                    {...getFieldProps('phone_number')}
                    error={Boolean(touched.phone_number && errors.phone_number)}
                    helperText={touched.phone_number && errors.phone_number}
                  ></TextField>
                </Grid>
                <Grid item lg={6} md={6} sm={12} xs={12}>
                  <TextField
                    size="small"
                    select
                    label="Gender*"
                    variant="outlined"
                    fullWidth
                    {...getFieldProps('gender')}
                    helperText={touched.gender && errors.gender}
                    error={Boolean(errors.gender && touched.gender)}
                  >
                    <MenuItem value={'Male'}>Male</MenuItem>
                    <MenuItem value={'Female'}>Female</MenuItem>
                    <MenuItem value={'Unspecified'}>Unspecified</MenuItem>
                  </TextField>
                </Grid>
                <Grid item lg={6} md={6} sm={12} xs={12}>
                  <TextField
                    size="small"
                    select
                    label="Language*"
                    variant="outlined"
                    fullWidth
                    {...getFieldProps('language')}
                    helperText={touched.language && errors.language}
                    error={Boolean(errors.language && touched.language)}
                  >
                    <MenuItem value={'English'}>English</MenuItem>
                    <MenuItem value={'French'}>French</MenuItem>
                  </TextField>
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
                    {...getFieldProps('address')}
                    error={Boolean(touched.address && errors.address)}
                    helperText={touched.address && errors.address}
                  />
                  <span style={{ fontSize: 'small' }}>
                    e.g.: Bld Mihail Kogalniceanu, nr. 8 Bl 1, Sc 1, Ap 09
                  </span>
                </Grid>
                <Grid item lg={6} md={6} sm={12} xs={12}>
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
                <Grid item lg={6} md={6} sm={12} xs={12}>
                  <TextField
                    size="small"
                    fullWidth
                    type="text"
                    label="Country*"
                    {...getFieldProps('country')}
                    error={Boolean(touched.country && errors.country)}
                    helperText={touched.country && errors.country}
                  />
                </Grid>
                <Grid item lg={6} md={6} sm={12} xs={12}>
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
                <Grid item lg={6} md={6} sm={12} xs={12}>
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
              </Grid>
              <LoadingButton
                type="submit"
                color="primary"
                loading={loading}
                variant="contained"
                sx={{ mb: 2, mt: 3 }}
                fullWidth
              >
                Update
              </LoadingButton>
            </Form>
          </FormikProvider>
        </Box>
      </SimpleCard>
      <Toaster position="top-right" />
    </Container>
  );
}

export default Profile;
