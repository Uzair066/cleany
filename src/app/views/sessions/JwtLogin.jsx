import { LoadingButton } from '@mui/lab';
import { Card, Checkbox, Grid, TextField } from '@mui/material';
import { Box, styled, useTheme } from '@mui/system';
import { Paragraph } from 'app/components/Typography';
import useAuth from 'app/hooks/useAuth';
import { Formik } from 'formik';
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import InputAdornment from '@mui/material/InputAdornment';
import * as Yup from 'yup';
import logo from '../../../assets/logo.png';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import { USER_LOGIN } from 'app/api';
import toast, { Toaster } from 'react-hot-toast';
import axios from '../../../axios';
import LoginImg from '../../../assets/loginImage.png';

const FlexBox = styled(Box)(() => ({ display: 'flex', alignItems: 'center' }));

const JustifyBox = styled(FlexBox)(() => ({ justifyContent: 'center' }));

const ContentBox = styled(Box)(() => ({
  height: '100%',
  padding: '32px',
  paddingTop: '20px !important',
  position: 'relative',
  background: 'rgba(0, 0, 0, 0.01)',
  '& .logoImg': { width: '200px', marginBottom: '12px' },
  '& .password-icon': {
    cursor: 'pointer',
  },
}));

const JWTRoot = styled(JustifyBox)(() => ({
  background: '#1A2038',
  minHeight: '100% !important',
  '& .card': {
    maxWidth: 800,
    minHeight: 400,
    margin: '1rem',
    display: 'flex',
    borderRadius: 12,
    alignItems: 'center',
  },
}));

// inital login credentials
const initialValues = {
  email: '',
  password: '',
  remember: true,
};

// form field validation schema
const validationSchema = Yup.object().shape({
  password: Yup.string()
    .min(5, 'Password must be 5 character length')
    .required('Password is required!'),
  email: Yup.string().email('Invalid Email address').required('Email is required!'),
});

const JwtLogin = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();

  const handleFormSubmit = async (values) => {
    setLoading(true);
    toast.promise(
      axios.post(`${USER_LOGIN}`, values, {
        headers: { 'Content-Type': 'application/json' },
      }),
      {
        loading: () => {
          return `Login`;
        },
        success: (res) => {
          setLoading(false);

          login(res?.data);
          window.location.reload();
          setTimeout(() => {
            navigate('/dashboard/default');
          }, 1000);

          return res?.data?.message;
        },
        error: (err) => {
          setLoading(false);
          if (err?.status_code === 400) {
            return err?.message?.non_field_errors[0];
          } else {
            return err?.message?.non_field_errors[0];
          }
        },
      }
    );
  };

  return (
    <JWTRoot>
      <Card className="card">
        <Grid container>
          <Grid item sm={6} xs={12}>
            <JustifyBox
              p={4}
              height="100%"
              sx={{
                minWidth: 320,
                '& img': {
                  width: '100%',
                  height: '100%',
                },
              }}
            >
              <img src={LoginImg} alt="" />
            </JustifyBox>
          </Grid>

          <Grid item sm={6} xs={12}>
            <ContentBox>
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
                      sx={{ mb: 3 }}
                    />

                    <TextField
                      fullWidth
                      size="small"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      label="Password"
                      variant="outlined"
                      onBlur={handleBlur}
                      value={values.password}
                      onChange={handleChange}
                      helperText={touched.password && errors.password}
                      error={Boolean(errors.password && touched.password)}
                      sx={{
                        mb: 1.5,
                        '& .MuiOutlinedInput-root': {
                          paddingRight: '5px !important',
                        },
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="start">
                            {showPassword ? (
                              <VisibilityOffOutlinedIcon
                                className="password-icon"
                                onClick={() => setShowPassword(false)}
                              />
                            ) : (
                              <VisibilityOutlinedIcon
                                className="password-icon"
                                onClick={() => setShowPassword(true)}
                              />
                            )}
                          </InputAdornment>
                        ),
                      }}
                    />

                    <FlexBox justifyContent="space-between">
                      <FlexBox gap={1}>
                        <Checkbox
                          size="small"
                          name="remember"
                          onChange={handleChange}
                          checked={values.remember}
                          sx={{ padding: 0 }}
                        />

                        <Paragraph>Remember Me</Paragraph>
                      </FlexBox>

                      <NavLink
                        to="/session/forgot-password"
                        style={{ color: theme.palette.primary.main }}
                      >
                        Forgot password?
                      </NavLink>
                    </FlexBox>

                    <LoadingButton
                      type="submit"
                      color="primary"
                      loading={loading}
                      variant="contained"
                      sx={{ my: 2 }}
                    >
                      Login
                    </LoadingButton>

                    <Paragraph>
                      Don't have an account?
                      <NavLink
                        to="/session/signup"
                        style={{ color: theme.palette.primary.main, marginLeft: 5 }}
                      >
                        Register
                      </NavLink>
                    </Paragraph>
                  </form>
                )}
              </Formik>
            </ContentBox>
          </Grid>
        </Grid>
      </Card>
      <Toaster position="top-right" />
    </JWTRoot>
  );
};

export default JwtLogin;
