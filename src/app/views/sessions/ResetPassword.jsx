import { LoadingButton } from '@mui/lab';
import { Box, Button, Card, Grid, styled, TextField } from '@mui/material';
import { useState } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import axios from '../../../axios';
import { Formik } from 'formik';
import { FORGET_PASSWORD, RESET_PASSWORD } from 'app/api';
import * as Yup from 'yup';
import { useSearchParams } from 'react-router-dom';

const FlexBox = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
}));

const JustifyBox = styled(FlexBox)(() => ({
  justifyContent: 'center',
}));

const ContentBox = styled(Box)(({ theme }) => ({
  padding: 32,
  background: theme.palette.background.default,
}));

const ForgotPasswordRoot = styled(JustifyBox)(() => ({
  background: '#1A2038',
  minHeight: '100vh !important',
  '& .card': {
    maxWidth: 400,
    margin: '1rem',
    borderRadius: 12,
  },
}));

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = (values) => {
    setLoading(true);
    toast.promise(
      axios.post(`${RESET_PASSWORD}`, values, {
        headers: { 'Content-Type': 'application/json' },
      }),
      {
        loading: () => {
          return `Changing Password!`;
        },
        success: (res) => {
          setLoading(false);
          setTimeout(() => {
            navigate('/session/signin');
          }, 500);

          return res?.data?.message;
        },
        error: (err) => {
          setLoading(false);
          return err?.message;
        },
      }
    );
  };
  const initialValues = {
    email: searchParams.get('email'),
    password: '',
    confirmPassword: '',
    code: '',
  };

  // form field validation schema
  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .min(8, 'Password must be 8 character length')
      .required('Password is required!'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm password is required!'),
    code: Yup.string().required('Pin code is required!').min(0, 'Should be greater than 0!'),
  });
  return (
    <ForgotPasswordRoot>
      <Card className="card">
        <Grid container>
          <Grid item xs={12}>
            <JustifyBox p={4}>
              <img width="300" src="/assets/images/illustrations/dreamer.svg" alt="" />
            </JustifyBox>

            <ContentBox>
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
                      type="number"
                      name="code"
                      label="Pin Code"
                      variant="outlined"
                      onBlur={handleBlur}
                      value={values.code}
                      onChange={handleChange}
                      helperText={touched.code && errors.code}
                      error={Boolean(errors.code && touched.code)}
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      autoComplete="off"
                      fullWidth
                      size="small"
                      name="password"
                      type="password"
                      label="New Password"
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

                    <LoadingButton
                      type="submit"
                      color="primary"
                      loading={loading}
                      variant="contained"
                      sx={{ mt: 3 }}
                      fullWidth
                    >
                      Reset Password
                    </LoadingButton>
                  </form>
                )}
              </Formik>
              <Button
                fullWidth
                color="primary"
                variant="outlined"
                onClick={() => navigate(-1)}
                sx={{ mt: 2 }}
              >
                Go Back
              </Button>
            </ContentBox>
          </Grid>
        </Grid>
      </Card>
      <Toaster position="top-right" />
    </ForgotPasswordRoot>
  );
};

export default ResetPassword;
