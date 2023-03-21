import React, { useState } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { LoadingButton } from '@mui/lab';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { Box, Button, MenuItem, styled, TextField } from '@mui/material';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { USER_SIGNUP_PROFILE } from 'app/api';
import axios from '../../../../axios';
import useAuth from 'app/hooks/useAuth';

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  width: '150px',
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8',
  },
}));

function ProfileSubForm({ setSecondForm, formData }) {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [loading, setLoading] = useState(false);
  const initialValues = {
    address: '',
    city: '',
    zip_code: null,
    state: 'Florida',
    phone_number: '',
    country: 'United States',
  };

  // form field validation schema
  const validationSchema = Yup.object().shape({
    address: Yup.string().required('Street address is required!'),
    city: Yup.string().required('City is required!'),
    zip_code: Yup.number('Zip Code is required!')
      .min(0, 'invalid Zip Code')
      .required('Zip Code is required!')
      .nullable(),
    state: Yup.string().required('State is required!'),
    phone_number: Yup.string()
      .matches(/^\+[0-9]+$/, 'Must be only digits with (+) in start!')
      .required('Phone no is required!'),
    country: Yup.string().required('Country is required!'),
  });

  const handleFormSubmit = (values) => {
    setLoading(true);
    const obj = { ...formData, ...values };
    toast.promise(
      axios.post(`${USER_SIGNUP_PROFILE}`, obj, {
        headers: { 'Content-Type': 'application/json' },
      }),
      {
        loading: () => {
          return `Submitting data!`;
        },
        success: (res) => {
          setLoading(false);
          register(res.data);
          window.location.reload();
          setTimeout(() => {
            navigate('/');
          }, 1000);

          return res?.data?.message;
        },
        error: (err) => {
          setLoading(false);
          return err?.message;
        },
      }
    );
  };

  const handlePrevious = () => {
    setSecondForm(false);
  };
  return (
    <>
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={validationSchema}
      >
        {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              size="small"
              type="text"
              name="address"
              label="Street Address"
              variant="outlined"
              onBlur={handleBlur}
              value={values.address}
              onChange={handleChange}
              helperText={touched.address && errors.address}
              error={Boolean(errors.address && touched.address)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              size="small"
              type="text"
              name="city"
              label="City"
              variant="outlined"
              onBlur={handleBlur}
              value={values.city}
              onChange={handleChange}
              helperText={touched.city && errors.city}
              error={Boolean(errors.city && touched.city)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              size="small"
              type="text"
              name="zip_code"
              label="Zip Code"
              variant="outlined"
              onBlur={handleBlur}
              value={values.zip_code}
              onChange={handleChange}
              helperText={touched.zip_code && errors.zip_code}
              error={Boolean(errors.zip_code && touched.zip_code)}
              sx={{ mb: 2 }}
            />
            <TextField
              size="small"
              select
              name="state"
              label="State"
              variant="outlined"
              onBlur={handleBlur}
              value={values.state}
              onChange={handleChange}
              fullWidth
              helperText={touched.state && errors.state}
              error={Boolean(errors.state && touched.state)}
              sx={{ mb: 2 }}
            >
              <MenuItem value={'Florida'}>Florida</MenuItem>
              <MenuItem value={'New York'}>New York</MenuItem>
              <MenuItem value={'unspecified'}>Unspecified</MenuItem>
            </TextField>
            <TextField
              fullWidth
              size="small"
              type="text"
              name="phone_number"
              label="Phone"
              variant="outlined"
              onBlur={handleBlur}
              value={values.phone_number}
              onChange={handleChange}
              helperText={touched.phone_number && errors.phone_number}
              error={Boolean(errors.phone_number && touched.phone_number)}
              sx={{ mb: 2 }}
            />
            <TextField
              size="small"
              select
              name="country"
              label="Country"
              variant="outlined"
              onBlur={handleBlur}
              value={values.country}
              onChange={handleChange}
              fullWidth
              helperText={touched.country && errors.country}
              error={Boolean(errors.country && touched.country)}
            >
              <MenuItem value={'United States'}>United States</MenuItem>
              <MenuItem value={'Other'}>Other</MenuItem>
            </TextField>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mt: 3,
              }}
            >
              <BorderLinearProgress variant="determinate" value={100} />
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Button
                  variant="contained"
                  style={{ marginRight: '10px' }}
                  color="primary"
                  onClick={handlePrevious}
                >
                  Previous
                </Button>
                <LoadingButton type="submit" color="primary" loading={loading} variant="contained">
                  Submit
                </LoadingButton>
              </Box>
            </Box>
          </form>
        )}
      </Formik>
      <Toaster position="top-right" />
    </>
  );
}

export default ProfileSubForm;
