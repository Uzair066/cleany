import { useTheme } from '@emotion/react';
import { LoadingButton } from '@mui/lab';
import { Card, Checkbox, Grid, TextField } from '@mui/material';
import { Box, styled } from '@mui/system';
import { Paragraph } from 'app/components/Typography';
import axios from '../../../axios';
import { Formik } from 'formik';
import { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import logo from '../../../assets/logo.png';
import toast, { Toaster } from 'react-hot-toast';

import { USER_REGISTRATION } from 'app/api';

const FlexBox = styled(Box)(() => ({ display: 'flex', alignItems: 'center' }));

const JustifyBox = styled(FlexBox)(() => ({ justifyContent: 'center' }));

const ContentBox = styled(JustifyBox)(() => ({
  height: '100%',
  padding: '32px',
  background: 'rgba(0, 0, 0, 0.01)',
}));

const JWTRegister = styled(JustifyBox)(() => ({
  background: '#1A2038',
  minHeight: '100vh !important',
  '& .card': {
    maxWidth: 800,
    minHeight: 400,
    margin: '1rem',
    display: 'flex',
    borderRadius: 12,
    alignItems: 'center',
  },
  '& .logoImg': { width: '200px', marginBottom: '12px' },
}));

// inital login credentials

const JwtRegister = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  const handleFormSubmit = async (values) => {
    setLoading(true);
    toast.promise(
      axios.post(`${USER_REGISTRATION}`, values, {
        headers: { 'Content-Type': 'application/json' },
      }),
      {
        loading: () => {
          return `Registering User`;
        },
        success: (res) => {
          setLoading(false);
          setTimeout(() => {
            navigate('/session/new-profile', { state: { email: values.email } });
          }, 1000);

          return res?.data?.message;
        },
        error: (err) => {
          setLoading(false);
          if (err.status_code === 400) {
            return 'User with this email already exists!';
          } else {
            return err?.message.email[0];
          }
        },
      }
    );
  };
  const initialValues = {
    email: location?.state ? location?.state : '',
    password: '',
    confirmPassword: '',
    remember: true,
  };
  // form field validation schema
  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .min(8, 'Password must be 8 character length')
      .required('Password is required!'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm password is required!'),
    email: Yup.string().email('Invalid Email address').required('Email is required!'),
  });
  return (
    <JWTRegister>
      <Card className="card">
        <Grid container>
          <Grid item sm={6} xs={12}>
            <ContentBox>
              <img
                width="100%"
                alt="Register"
                src="/assets/images/illustrations/posting_photo.svg"
              />
            </ContentBox>
          </Grid>

          <Grid item sm={6} xs={12}>
            <Box p={4} height="100%">
              <img src={logo} alt="Cleany" className="logoImg" />
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
                      type="email"
                      name="email"
                      label="Email"
                      variant="outlined"
                      onBlur={handleBlur}
                      value={values.email}
                      onChange={handleChange}
                      helperText={touched.email && errors.email}
                      error={Boolean(errors.email && touched.email)}
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      autoComplete="off"
                      fullWidth
                      size="small"
                      name="password"
                      type="password"
                      label="Password"
                      variant="outlined"
                      onBlur={handleBlur}
                      value={values.password}
                      onChange={handleChange}
                      helperText={touched.password && errors.password}
                      error={Boolean(errors.password && touched.password)}
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      autoComplete="off"
                      fullWidth
                      size="small"
                      name="confirmPassword"
                      type="password"
                      label="Confirm password"
                      variant="outlined"
                      onBlur={handleBlur}
                      value={values.confirmPassword}
                      onChange={handleChange}
                      helperText={touched.confirmPassword && errors.confirmPassword}
                      error={Boolean(errors.confirmPassword && touched.confirmPassword)}
                      sx={{ mb: 2 }}
                    />

                    <FlexBox gap={1} alignItems="center">
                      <Checkbox
                        size="small"
                        name="remember"
                        onChange={handleChange}
                        checked={values.remember}
                        sx={{ padding: 0 }}
                      />

                      <Paragraph fontSize={13}>
                        I have read and agree to the{' '}
                        <a href="#" style={{ color: '#1a569d', cursor: 'pointer' }}>
                          terms and policy.
                        </a>
                      </Paragraph>
                    </FlexBox>

                    <LoadingButton
                      type="submit"
                      color="primary"
                      loading={loading}
                      variant="contained"
                      sx={{ mb: 2, mt: 3 }}
                      fullWidth
                      disabled={!values.remember}
                    >
                      Create new account
                    </LoadingButton>

                    <Paragraph>
                      Already have an account?
                      <NavLink
                        to="/session/signin"
                        style={{ color: theme.palette.primary.main, marginLeft: 5 }}
                      >
                        Login
                      </NavLink>
                    </Paragraph>
                  </form>
                )}
              </Formik>
            </Box>
          </Grid>
        </Grid>
      </Card>
      <Toaster position="top-right" />
    </JWTRegister>
  );
};

export default JwtRegister;
