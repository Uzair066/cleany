import { LoadingButton } from '@mui/lab';
import { Card, Grid, MenuItem, TextField } from '@mui/material';
import { Box, styled } from '@mui/system';
import { Formik } from 'formik';
import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { ReactComponent as Profile } from '../../../assets/profile-new.svg';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import ProfileSubForm from './ProfileSubForm/ProfileSubForm';
import { useLocation } from 'react-router-dom';

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

const FlexBox = styled(Box)(() => ({ display: 'flex', alignItems: 'center' }));

const JustifyBox = styled(FlexBox)(() => ({ justifyContent: 'center' }));

const ContentBox = styled(JustifyBox)(() => ({
  flexDirection: 'column',
  height: '100%',
  padding: '32px',
  background: 'rgba(0, 0, 0, 0.01)',
  '& .left-img': {
    width: '100%',
    height: '100%',
  },
  '& h1': {
    margin: '0px',
    marginBottom: '0.2rem',
  },
  '& p': {
    textAlign: 'center',
    margin: '0px',
    marginBottom: '0.2rem',
  },
}));

const JWTProfile = styled(JustifyBox)(() => ({
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
}));

// inital login credentials

// form field validation schema

const NewProfile = () => {
  const { state } = useLocation();
  const initialValues = {
    first_name: '',
    last_name: '',
    gender: 'male',
    language: 'english',
    email: state?.email,
  };
  const [secondForm, setSecondForm] = useState(false);
  const [formData, setFormData] = useState(initialValues);

  const validationSchema = Yup.object().shape({
    first_name: Yup.string().required('First name is required!'),
    last_name: Yup.string().required('Last name is required!'),
    gender: Yup.string().required('Gender is required!'),
    language: Yup.string().required('Language is required!'),
  });
  const handleFormSubmit = (values) => {
    setFormData({ ...values });
    setSecondForm(true);
  };
  useEffect(() => {
    initialValues.first_name = formData.first_name;
    initialValues.gender = formData.gender;
    initialValues.language = formData.language;
    initialValues.last_name = formData.last_name;
  }, [secondForm]);

  return (
    <JWTProfile>
      <Card className="card">
        <Grid container>
          <Grid item sm={6} xs={12}>
            <ContentBox>
              <h1>Welcome to Cleany!</h1>
              <p>Please complete your profile to get started with Cleany!</p>
              <Profile className="left-img" />
            </ContentBox>
          </Grid>

          <Grid item sm={6} xs={12}>
            <Box
              p={4}
              height="100%"
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
              }}
            >
              {!secondForm ? (
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
                        name="first_name"
                        label="First Name"
                        variant="outlined"
                        onBlur={handleBlur}
                        value={values.first_name}
                        onChange={handleChange}
                        helperText={touched.first_name && errors.first_name}
                        error={Boolean(errors.first_name && touched.first_name)}
                        sx={{ mb: 2 }}
                      />
                      <TextField
                        fullWidth
                        size="small"
                        type="text"
                        name="last_name"
                        label="Last Name"
                        variant="outlined"
                        onBlur={handleBlur}
                        value={values.last_name}
                        onChange={handleChange}
                        helperText={touched.last_name && errors.last_name}
                        error={Boolean(errors.last_name && touched.last_name)}
                        sx={{ mb: 2 }}
                      />
                      <TextField
                        size="small"
                        select
                        name="gender"
                        label="Gender"
                        variant="outlined"
                        onBlur={handleBlur}
                        value={values.gender}
                        onChange={handleChange}
                        fullWidth
                        helperText={touched.gender && errors.gender}
                        error={Boolean(errors.gender && touched.gender)}
                        sx={{ mb: 2 }}
                      >
                        <MenuItem value={'male'}>Male</MenuItem>
                        <MenuItem value={'female'}>Female</MenuItem>
                        <MenuItem value={'unspecified'}>Unspecified</MenuItem>
                      </TextField>
                      <TextField
                        size="small"
                        select
                        name="language"
                        label="Language"
                        variant="outlined"
                        onBlur={handleBlur}
                        value={values.language}
                        onChange={handleChange}
                        fullWidth
                        helperText={touched.language && errors.language}
                        error={Boolean(errors.language && touched.language)}
                      >
                        <MenuItem value={'english'}>English</MenuItem>
                        <MenuItem value={'french'}>French</MenuItem>
                      </TextField>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          mt: 3,
                        }}
                      >
                        <BorderLinearProgress variant="determinate" value={50} />
                        <LoadingButton
                          type="submit"
                          color="primary"
                          loading={false}
                          variant="contained"
                        >
                          Next
                        </LoadingButton>
                      </Box>
                    </form>
                  )}
                </Formik>
              ) : (
                <ProfileSubForm
                  setSecondForm={setSecondForm}
                  setFormData={setFormData}
                  formData={formData}
                  secondForm={secondForm}
                />
              )}
            </Box>
          </Grid>
        </Grid>
      </Card>
    </JWTProfile>
  );
};

export default NewProfile;
