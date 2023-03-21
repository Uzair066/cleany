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
import { Grid, TextField, Tooltip } from '@mui/material';
import { CREATE_EXTRA, UPDATE_EXTRA } from 'app/api';

function CreateExtraModal({ open, handleClose, serviceData, retrieveService, selectedExtra }) {
  const [loading, setLoading] = useState(false);

  const schema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    time_hrs: Yup.number('Time in hours is required!')
      .min(0, 'Invalid time')
      .required('Time in hours is required!')
      .nullable(),
    tool_tip: Yup.string().required('Additional info (Tooltip) is required!'),
    price: Yup.number('Price is required!')
      .min(0, 'Invalid price')
      .required('Price is required!')
      .nullable(),
  });
  const formik = useFormik({
    initialValues: {
      title: '',
      time_hrs: null,
      tool_tip: '',
      price: null,
    },
    validationSchema: schema,
    onSubmit: (values) => {
      setLoading(true);
      if (Object.keys(selectedExtra).length === 0) {
        const dupObj = { ...values };
        dupObj.service = serviceData?.id;
        toast.promise(
          axios.post(`${CREATE_EXTRA}`, dupObj, {
            headers: { 'Content-Type': 'application/json' },
          }),
          {
            loading: () => {
              return `Creating Extra!`;
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
      } else {
        const dupObj = { ...values };
        dupObj.id = selectedExtra?.id;
        toast.promise(
          axios.put(`${UPDATE_EXTRA}`, dupObj, {
            headers: { 'Content-Type': 'application/json' },
          }),
          {
            loading: () => {
              return `Updating Extra!`;
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
      }
    },
  });

  const { errors, touched, resetForm, setFieldValue, handleSubmit, getFieldProps, values } = formik;
  useEffect(() => {
    setFieldValue('title', selectedExtra.title || '');
    setFieldValue('time_hrs', selectedExtra.time_hrs || null);
    setFieldValue('tool_tip', selectedExtra.tool_tip || '');
    setFieldValue('price', selectedExtra.price || null);
  }, [selectedExtra]);

  return (
    <Dialog
      open={open}
      onClose={() => {
        handleClose();
        resetForm();
      }}
      maxWidth={'sm'}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title" style={{ fontSize: '1.5rem' }}>
        {Object.keys(selectedExtra).length === 0
          ? 'Add a new extra'
          : `Update ${selectedExtra?.title}`}
      </DialogTitle>
      <DialogContent>
        <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3} sx={{ marginTop: '2px' }}>
              <Grid item sm={12} xs={12}>
                <TextField
                  size="small"
                  fullWidth
                  type="text"
                  label="Title"
                  {...getFieldProps('title')}
                  error={Boolean(touched.title && errors.title)}
                  helperText={touched.title && errors.title}
                  sx={{
                    '& input': {
                      textAlign: 'center',
                    },
                  }}
                />
              </Grid>
              <Grid item sm={12} xs={12} md={6}>
                <Tooltip title="Time is in decimal format. E.g.: 1.5 here actually means an hour and 30 minutes.">
                  <TextField
                    size="small"
                    fullWidth
                    type="number"
                    label="Time in hours"
                    inputProps={{ min: 0 }}
                    {...getFieldProps('time_hrs')}
                    error={Boolean(touched.time_hrs && errors.time_hrs)}
                    helperText={touched.time_hrs && errors.time_hrs}
                    sx={{
                      '& input': {
                        textAlign: 'center',
                      },
                    }}
                  />
                </Tooltip>
              </Grid>

              <Grid item sm={12} xs={12} md={6}>
                <TextField
                  size="small"
                  fullWidth
                  type="number"
                  label="Cost"
                  inputProps={{ min: 0 }}
                  {...getFieldProps('price')}
                  error={Boolean(touched.price && errors.price)}
                  helperText={touched.price && errors.price}
                  sx={{
                    '& input': {
                      textAlign: 'center',
                    },
                  }}
                />
              </Grid>
              <Grid item sm={12} xs={12}>
                <TextField
                  size="small"
                  fullWidth
                  multiline
                  rows={5}
                  type="text"
                  label="Additional info (Tooltip)"
                  {...getFieldProps('tool_tip')}
                  error={Boolean(touched.tool_tip && errors.tool_tip)}
                  helperText={touched.tool_tip && errors.tool_tip}
                />
              </Grid>
            </Grid>

            <Box display={'flex'} alignItems="center" justifyContent={'end'} sx={{ mb: 2, mt: 3 }}>
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
                {Object.keys(selectedExtra).length === 0 ? 'Add Extra' : 'Update'}
              </LoadingButton>
            </Box>
          </Form>
        </FormikProvider>
      </DialogContent>
      <Toaster position="top-right" />
    </Dialog>
  );
}

export default CreateExtraModal;
