import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
import toast, { Toaster } from 'react-hot-toast';
import { LoadingButton } from '@mui/lab';
import { Grid, MenuItem, styled, TextField } from '@mui/material';
import { Box } from '@mui/system';
import axios from '../../../../axios';
import { COMPANY_PROFILE_DATA, CREATE_TAX, UPDATE_TAX } from 'app/api';
import InputAdornment from '@mui/material/InputAdornment';

const Container = styled('div')(({ theme }) => ({
  paddingTop: '1rem',
  '& .formMain': {},
  '& .heading': {
    marginTop: '1rem',
    marginBottom: '1rem',
    color: 'rgba(52, 49, 76, 1)',
  },
}));

function TaxAdd({ open, handleClose, taxListAPI, editData }) {
  const [loading, setLoading] = useState(false);
  const [companyData, setCompanyData] = useState([]);

  useEffect(async () => {
    await axios
      .get(`${COMPANY_PROFILE_DATA}`, {
        headers: { 'Content-Type': 'application/json' },
      })
      .then((res) => setCompanyData(res?.data?.data))
      .catch((err) => console.log(err));
  }, []);

  const schema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    tax_code: Yup.string().required('Tax code is required'),

    tax_code_short: Yup.string().required('Tax code short is required'),
    tax_code_number: Yup.string().required('Tax number is required'),
    additional_info: Yup.string().required('Additional info is required'),
    tax_rate: Yup.number('Tax rate is required!')
      .min(0, 'invalid tax rate')
      .required('Tax rate is required!')
      .nullable(),
    company: Yup.string().required('Company is required!'),
  });

  const formik = useFormik({
    initialValues: {
      id: '',
      name: '',
      tax_code: '',
      tax_code_short: '',
      tax_code_number: '',
      tax_rate: undefined,
      additional_info: '',
      company: '',
    },
    validationSchema: schema,
    onSubmit: (values) => {
      setLoading(true);
      if (!editData) {
        toast.promise(
          axios.post(`${CREATE_TAX}`, values, {
            headers: { 'Content-Type': 'application/json' },
          }),
          {
            loading: () => {
              return `Creating Tax`;
            },
            success: (res) => {
              setLoading(false);
              taxListAPI();
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
      } else {
        toast.promise(
          axios.put(`${UPDATE_TAX}`, values, {
            headers: { 'Content-Type': 'application/json' },
          }),
          {
            loading: () => {
              return `Updating Tax`;
            },
            success: (res) => {
              setLoading(false);
              taxListAPI();
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
      }
    },
  });

  const { errors, touched, resetForm, setFieldValue, handleSubmit, getFieldProps } = formik;
  useEffect(() => {
    setFieldValue('id', editData?.id || '');
    setFieldValue('name', editData?.name || '');
    setFieldValue('tax_code', editData?.tax_code || '');
    setFieldValue('tax_code_short', editData?.tax_code_short || '');
    setFieldValue('tax_code_number', editData?.tax_code_number || '');
    setFieldValue('tax_rate', editData?.tax_rate || undefined);
    setFieldValue('additional_info', editData?.additional_info || '');
    setFieldValue('company', editData?.company || '');
  }, [editData]);

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
        {!editData ? 'Create Tax' : 'Update Tax'}
      </DialogTitle>
      <DialogContent>
        <Container className="formMain">
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
                    autoComplete="username"
                    type="text"
                    label="Name*"
                    {...getFieldProps('name')}
                    error={Boolean(touched.name && errors.name)}
                    helperText={touched.name && errors.name}
                  />
                </Grid>
                <Grid item lg={8} md={8} sm={12} xs={12}>
                  <TextField
                    size="small"
                    fullWidth
                    autoComplete="username"
                    type="text"
                    label="Tax Code*"
                    {...getFieldProps('tax_code')}
                    error={Boolean(touched.tax_code && errors.tax_code)}
                    helperText={touched.tax_code && errors.tax_code}
                  />
                </Grid>
                <Grid item lg={4} md={4} sm={12} xs={12}>
                  <TextField
                    size="small"
                    fullWidth
                    autoComplete="username"
                    type="text"
                    label="Tax Code Short*"
                    {...getFieldProps('tax_code_short')}
                    error={Boolean(touched.tax_code_short && errors.tax_code_short)}
                    helperText={touched.tax_code_short && errors.tax_code_short}
                  />
                </Grid>
                <Grid item lg={8} md={8} sm={12} xs={12}>
                  <TextField
                    size="small"
                    fullWidth
                    autoComplete="username"
                    type="text"
                    label="Tax Number*"
                    {...getFieldProps('tax_code_number')}
                    error={Boolean(touched.tax_code_number && errors.tax_code_number)}
                    helperText={touched.tax_code_number && errors.tax_code_number}
                  />
                </Grid>
                <Grid item lg={4} md={4} sm={12} xs={12}>
                  <TextField
                    size="small"
                    fullWidth
                    autoComplete="username"
                    type="number"
                    InputProps={{
                      startAdornment: <InputAdornment position="start">%</InputAdornment>,
                    }}
                    label="Tax Rate*"
                    {...getFieldProps('tax_rate')}
                    error={Boolean(touched.tax_rate && errors.tax_rate)}
                    helperText={touched.tax_rate && errors.tax_rate}
                  />
                </Grid>
                <Grid item sm={12} xs={12}>
                  <TextField
                    size="small"
                    fullWidth
                    multiline
                    rows={5}
                    autoComplete="username"
                    type="text"
                    label="Additional Info*"
                    {...getFieldProps('additional_info')}
                    error={Boolean(touched.additional_info && errors.additional_info)}
                    helperText={touched.additional_info && errors.additional_info}
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
                  {!editData ? 'Create' : 'Update'}
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

export default TaxAdd;
