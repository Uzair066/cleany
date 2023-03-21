import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import toast, { Toaster } from 'react-hot-toast';
import { LoadingButton } from '@mui/lab';
import { Box } from '@mui/system';
import axios from '../../../../axios';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
import { Grid, InputAdornment, TextField, Tooltip } from '@mui/material';
import { MuiColorInput } from 'mui-color-input';
import { UPDATE_SERVICE } from 'app/api';

function UpdateServiceModal({ open, handleClose, serviceData, retrieveService }) {
  const [loading, setLoading] = useState(false);

  const schema = Yup.object().shape({
    name: Yup.string().required('Service name is required'),
    slug: Yup.string().required('Service url is required'),
    title: Yup.string().required('Service title is required'),
    colour: Yup.string().required('Colour is required'),
  });
  const formik = useFormik({
    initialValues: {
      name: '',
      slug: '',
      title: '',
      description: '',
      status: '',
      type: 'Regular',
      colour: '#fff000',
      id: '',
    },
    validationSchema: schema,
    onSubmit: (values) => {
      setLoading(true);
      toast.promise(
        axios.put(`${UPDATE_SERVICE}`, values, {
          headers: { 'Content-Type': 'application/json' },
        }),
        {
          loading: () => {
            return `Updating Service`;
          },
          success: (res) => {
            setLoading(false);
            setTimeout(() => {
              resetForm();
              handleClose();
              retrieveService();
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

  const { errors, touched, resetForm, setFieldValue, handleSubmit, getFieldProps, values } = formik;
  useEffect(() => {
    setFieldValue('name', serviceData?.name);
    setFieldValue('slug', serviceData?.slug);
    setFieldValue('title', serviceData?.title);
    setFieldValue('colour', serviceData?.colour);
    setFieldValue('status', serviceData?.status);
    setFieldValue('id', serviceData?.id);
  }, [serviceData]);
  useEffect(() => {
    setFieldValue('slug', values?.name?.replaceAll(' ', '-')?.toLowerCase());
  }, [values.name]);

  return (
    <Dialog
      open={open}
      onClose={() => {
        handleClose();
      }}
      maxWidth={'sm'}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title" style={{ fontSize: '1.5rem' }}>
        Update Service Basics
      </DialogTitle>
      <DialogContent>
        <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3} sx={{ marginTop: '2px' }}>
              <Grid item sm={12} xs={12}>
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
              <Grid item sm={12} xs={12}>
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
              <Button
                onClick={() => {
                  handleClose();
                }}
                variant="outlined"
                color="primary"
                sx={{ mr: 2 }}
              >
                Cancel
              </Button>
              <LoadingButton type="submit" color="primary" loading={loading} variant="contained">
                Update
              </LoadingButton>
            </Box>
          </Form>
        </FormikProvider>
      </DialogContent>
      <Toaster position="top-right" />
    </Dialog>
  );
}

export default UpdateServiceModal;
