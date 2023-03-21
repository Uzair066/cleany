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
import { Checkbox, FormControlLabel, FormGroup, Grid, TextField } from '@mui/material';
import { UPDATE_BOOKING_APPOINTMENT } from 'app/api';
import moment from 'moment';

function RescheduleAppointment({ open, handleClose, bookindDetails, getEventList }) {
  const [loading, setLoading] = useState(false);

  const schema = Yup.object().shape({
    time: Yup.string().required('Start date and time is required!'),
  });
  const formik = useFormik({
    initialValues: {
      time: '',
      is_all: '',
      id: null,
    },
    validationSchema: schema,
    onSubmit: (values) => {
      const dupObj = { ...values };
      setLoading(true);
      const Date = moment(values.time).format('YYYY-MM-DD HH:mm:ss');
      dupObj.time = Date;
      toast.promise(
        axios.put(`${UPDATE_BOOKING_APPOINTMENT}`, dupObj, {
          headers: { 'Content-Type': 'application/json' },
        }),
        {
          loading: () => {
            return `Rescheduling Booking!`;
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
    setFieldValue('time', bookindDetails?.appointment_date_time.slice(0, 16));
  }, [bookindDetails, open]);

  return (
    <>
      <Dialog
        open={open}
        maxWidth={'sm'}
        PaperProps={{
          sx: {
            width: '100%',
          },
        }}
        aria-labelledby="package-item"
        aria-describedby="package-item-description"
      >
        <DialogTitle id="package-item" style={{ fontSize: '1.5rem' }}>
          Do you want to Reschedule Booking ?
        </DialogTitle>
        <DialogContent>
          Reschedule Booking
          <FormikProvider value={formik}>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
              <Grid container spacing={2} sx={{ marginTop: '2px' }}>
                <Grid item sm={12} xs={12}>
                  <TextField
                    id="datetime-local"
                    label="Start Date and Time"
                    type="datetime-local"
                    inputProps={{ min: moment(new Date()).format().slice(0, 16) }}
                    {...getFieldProps('time')}
                    sx={{ width: '100%' }}
                    error={Boolean(touched.time && errors.time)}
                    helperText={touched.time && errors.time}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item sm={12} xs={12}>
                  <FormGroup
                    sx={{
                      '& label': {
                        width: 'fit-content',
                      },
                    }}
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={values.is_all === 'on' ? true : false}
                          onChange={(e) =>
                            setFieldValue('is_all', e.target.checked === true ? 'on' : null)
                          }
                        />
                      }
                      label="Would you like to update all future recurrences?"
                    />
                  </FormGroup>
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
                  Change Now
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

export default RescheduleAppointment;
