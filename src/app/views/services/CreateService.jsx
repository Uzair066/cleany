import { Box, Button, Grid, InputAdornment, MenuItem, TextField, Tooltip } from '@mui/material';
import { Breadcrumb, SimpleCard } from 'app/components';
import React, { useEffect, useState } from 'react';
import axios from '../../../axios';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
import toast, { Toaster } from 'react-hot-toast';
import { LoadingButton } from '@mui/lab';
import { COMPANY_PROFILE_DATA, CREATE_SERVICE, GET_TAX_LIST } from 'app/api';
import { MuiColorInput } from 'mui-color-input';

const Container = styled('div')(({ theme }) => ({
  margin: '30px',
  [theme.breakpoints.down('sm')]: { margin: '16px' },
  '& .breadcrumb': {
    marginBottom: '30px',
    [theme.breakpoints.down('sm')]: { marginBottom: '16px' },
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  fontSize: '16px',
}));
function CreateServices() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [companyData, setCompanyData] = useState([]);
  const [taxData, setTaxData] = useState([]);

  useEffect(async () => {
    await axios
      .get(`${COMPANY_PROFILE_DATA}`, {
        headers: { 'Content-Type': 'application/json' },
      })
      .then((res) => setCompanyData(res?.data?.data))
      .catch((err) => console.log(err));
    await axios
      .get(`${GET_TAX_LIST}`, {
        headers: { 'Content-Type': 'application/json' },
      })
      .then((res) => setTaxData(res?.data?.data))
      .catch((err) => console.log(err));
  }, []);

  const schema = Yup.object().shape({
    name: Yup.string().required('Service name is required'),
    slug: Yup.string().required('Service url is required'),
    company: Yup.string().required('Company name is required!'),
    tax: Yup.string().required('Tax name is required!'),
    title: Yup.string().required('Service title is required'),
    colour: Yup.string().required('Colour is required'),
  });
  const formik = useFormik({
    initialValues: {
      name: '',
      slug: '',
      title: '',
      description: '',
      status: 'Draft',
      type: 'Regular',
      colour: '#fff000',
      company: '',
      tax: '',
    },
    validationSchema: schema,
    onSubmit: (values) => {
      setLoading(true);
      toast.promise(
        axios.post(`${CREATE_SERVICE}`, values, {
          headers: { 'Content-Type': 'application/json' },
        }),
        {
          loading: () => {
            return `Creating Service`;
          },
          success: (res) => {
            setLoading(false);
            setTimeout(() => {
              resetForm();
              navigate(`/dashboard/services/details/${res.data.data.slug}`, {
                state: res.data.data,
              });
            }, 1000);

            return 'Service Created';
          },
          error: (err) => {
            setLoading(false);
            return err?.message;
          },
        }
      );
    },
  });

  const { errors, touched, resetForm, setFieldValue, handleSubmit, getFieldProps, values } = formik;
  useEffect(() => {
    setFieldValue('slug', values.name.replaceAll(' ', '-').toLowerCase());
  }, [values.name]);

  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb
          routeSegments={[
            { name: 'Services', path: '/dashboard/services' },
            { name: 'Create Service' },
          ]}
        />
      </Box>

      <Box display={'flex'} justifyContent={'end'} gap={2}>
        <StyledButton disabled startIcon={<AddIcon />} variant="contained" color="primary">
          Package
        </StyledButton>
        <StyledButton disabled startIcon={<AddIcon />} variant="contained" color="primary">
          Extra
        </StyledButton>
      </Box>

      <SimpleCard>
        <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item lg={6} md={6} sm={12} xs={12}>
                <TextField
                  size="small"
                  fullWidth
                  type="text"
                  label="Company*"
                  select
                  {...getFieldProps('company')}
                  error={Boolean(touched.company && errors.company)}
                  helperText={touched.company && errors.company}
                >
                  {companyData.length > 0 &&
                    companyData.map((data) => (
                      <MenuItem key={data?.id} value={data?.id}>
                        {data?.title}
                      </MenuItem>
                    ))}
                </TextField>
              </Grid>
              <Grid item lg={6} md={6} sm={12} xs={12}>
                <TextField
                  size="small"
                  fullWidth
                  type="text"
                  label="Tax*"
                  select
                  {...getFieldProps('tax')}
                  error={Boolean(touched.tax && errors.tax)}
                  helperText={touched.tax && errors.tax}
                >
                  {taxData.length > 0 &&
                    taxData.map((data) => (
                      <MenuItem key={data?.id} value={data?.id}>
                        {data?.name}
                      </MenuItem>
                    ))}
                </TextField>
              </Grid>
              <Grid item lg={6} md={6} sm={12} xs={12}>
                <Tooltip title="A name will only appear internally to reference this booking page">
                  <TextField
                    size="small"
                    fullWidth
                    type="text"
                    label="Service Name*"
                    {...getFieldProps('name')}
                    error={Boolean(touched.name && errors.name)}
                    helperText={touched.name && errors.name}
                  />
                </Tooltip>
              </Grid>
              <Grid item lg={6} md={6} sm={12} xs={12}>
                <Tooltip
                  title="A consumer facing service title will appear in bookings and emails to identify
                  your service."
                >
                  <TextField
                    size="small"
                    fullWidth
                    type="text"
                    label="Service Title*"
                    {...getFieldProps('title')}
                    error={Boolean(touched.title && errors.title)}
                    helperText={touched.title && errors.title}
                  />
                </Tooltip>
              </Grid>

              <Grid item sm={12} xs={12}>
                <TextField
                  size="small"
                  fullWidth
                  type="text"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <span style={{ color: 'black' }}>https://cleany.com/booking/</span>
                      </InputAdornment>
                    ),
                  }}
                  label="Service URL*"
                  {...getFieldProps('slug')}
                  error={Boolean(touched.slug && errors.slug)}
                  helperText={touched.slug && errors.slug}
                />
              </Grid>
              <Grid item sm={12} xs={12}>
                <MuiColorInput
                  format="hex"
                  size="small"
                  value={values.colour}
                  error={Boolean(touched.colour && errors.colour)}
                  helperText={touched.colour && errors.colour}
                  onChange={(color) => setFieldValue('colour', color)}
                  fullWidth
                />
              </Grid>
            </Grid>

            <Box display={'flex'} alignItems="center" justifyContent={'end'} sx={{ mb: 2, mt: 3 }}>
              <LoadingButton type="submit" color="primary" loading={loading} variant="contained">
                Create
              </LoadingButton>
            </Box>
          </Form>
        </FormikProvider>
      </SimpleCard>
      <Toaster position="top-right" />
    </Container>
  );
}

export default CreateServices;
