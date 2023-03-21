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
import { Grid, MenuItem, TextField } from '@mui/material';
import { CREATE_BOOKING_PROBLEMS } from 'app/api';

function RaiseBookingProblem({ open, handleClose, bookindDetails, bookingProblems, getEventList }) {
  const [loading, setLoading] = useState(false);

  const schema = Yup.object().shape({
    description: Yup.string().required('Problem description is required!'),
  });
  const formik = useFormik({
    initialValues: {
      description: '',
      id: bookindDetails?.id,
      status: '',
    },
    validationSchema: schema,
    onSubmit: (values) => {
      const obj = {
        message: values?.description,
        booking: values?.id,
        status: values?.status,
      };
      setLoading(true);
      toast.promise(
        axios.post(`${CREATE_BOOKING_PROBLEMS}`, obj, {
          headers: { 'Content-Type': 'application/json' },
        }),
        {
          loading: () => {
            return `Creating Problem!`;
          },
          success: (res) => {
            setLoading(false);
            resetForm();
            getEventList();
            setTimeout(() => {
              handleClose();
            }, 200);

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
    setFieldValue('id', bookindDetails?.id);
    if (bookingProblems != null) {
      setFieldValue('description', bookingProblems?.message);
      setFieldValue('status', bookingProblems?.status);
    }
  }, [bookingProblems, bookindDetails, open]);

  return (
    <>
      <Dialog
        open={open}
        maxWidth={'md'}
        PaperProps={{
          sx: {
            width: '100%',
          },
        }}
        aria-labelledby="package-item"
        aria-describedby="package-item-description"
      >
        <DialogTitle id="package-item" style={{ fontSize: '1.5rem' }}>
          {bookingProblems === null ? 'Arise Booking Problem' : 'Update Booking Problem'}
        </DialogTitle>
        <DialogContent>
          Information:
          <FormikProvider value={formik}>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
              <Grid container spacing={4} sx={{ marginTop: '2px' }}>
                <Grid item xs={3}>
                  Booking Id <span style={{ color: 'red' }}>*</span>
                </Grid>
                <Grid item sm={9} xs={9}>
                  <TextField
                    size="small"
                    type="text"
                    inputProps={{ readOnly: true }}
                    {...getFieldProps('id')}
                    sx={{ width: '100%' }}
                    error={Boolean(touched.id && errors.id)}
                    helperText={touched.id && errors.id}
                  />
                </Grid>
                <Grid item xs={3}>
                  Problem Description <span style={{ color: 'red' }}>*</span>
                </Grid>
                <Grid item sm={9} xs={9}>
                  <TextField
                    id="datetime-local"
                    type="text"
                    multiline
                    rows={5}
                    {...getFieldProps('description')}
                    sx={{ width: '100%' }}
                    error={Boolean(touched.description && errors.description)}
                    helperText={touched.description && errors.description}
                  />
                </Grid>
                <Grid item xs={3}>
                  Status <span style={{ color: 'red' }}>*</span>
                </Grid>
                <Grid item sm={9} xs={9}>
                  <TextField
                    size="small"
                    type="text"
                    select
                    {...getFieldProps('status')}
                    sx={{ width: '100%' }}
                    error={Boolean(touched.status && errors.status)}
                    helperText={touched.status && errors.status}
                  >
                    <MenuItem value={'active'}>Active</MenuItem>
                    <MenuItem value={'solved'}>Solved</MenuItem>
                  </TextField>
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
                  {bookingProblems === null ? 'Create' : 'Make Changes'}
                </LoadingButton>
              </Box>
            </Form>
          </FormikProvider>
        </DialogContent>
        <Toaster position="top-right" />
      </Dialog>
    </>
  );
}

export default RaiseBookingProblem;
