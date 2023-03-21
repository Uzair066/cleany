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
import { CHARGE_TIP_FROM_CUSTOMER, CUSTOMER_ALL_BOOKINGS } from 'app/api';

function CustomerChargeTipModal({ open, handleClose, bookindDetails, getEventList }) {
  const [loading, setLoading] = useState(false);
  const [bookingList, setBookingList] = useState([]);

  useEffect(async () => {
    await axios
      .get(`${CUSTOMER_ALL_BOOKINGS}`, {
        headers: { 'Content-Type': 'application/json' },
      })
      .then((res) => {
        setBookingList(res?.data?.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const schema = Yup.object().shape({
    amount: Yup.number().required('Amount is Required').min(1),
    booking_id: Yup.number().required('Booking id is Required'),
  });
  const formik = useFormik({
    initialValues: {
      booking_id: null,
      amount: null,
    },
    validationSchema: schema,
    onSubmit: (values) => {
      setLoading(true);
      toast.promise(
        axios.post(`${CHARGE_TIP_FROM_CUSTOMER}`, values, {
          headers: { 'Content-Type': 'application/json' },
        }),
        {
          loading: () => {
            return `Charging Tip!`;
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
          Charge Tip
        </DialogTitle>
        <DialogContent>
          Do you want to charge tip from the customer or record a collection?
          <FormikProvider value={formik}>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
              <Grid container spacing={4} sx={{ marginTop: '2px' }}>
                <Grid item xs={4}>
                  Booking id
                </Grid>
                <Grid item sm={8} xs={8}>
                  <TextField
                    inputProps={{ min: 0 }}
                    size="small"
                    type="number"
                    select
                    {...getFieldProps('booking_id')}
                    sx={{ width: '100%' }}
                    error={Boolean(touched.booking_id && errors.booking_id)}
                    helperText={touched.booking_id && errors.booking_id}
                  >
                    {bookingList?.map((booking, index) => (
                      <MenuItem key={index} value={booking?.id}>
                        {booking?.id}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={4}>
                  Total Tip Amount
                </Grid>
                <Grid item sm={8} xs={8}>
                  <TextField
                    inputProps={{ min: 0 }}
                    size="small"
                    type="number"
                    {...getFieldProps('amount')}
                    sx={{ width: '100%' }}
                    error={Boolean(touched.amount && errors.amount)}
                    helperText={touched.amount && errors.amount}
                  ></TextField>
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
                  Charge Now
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

export default CustomerChargeTipModal;
