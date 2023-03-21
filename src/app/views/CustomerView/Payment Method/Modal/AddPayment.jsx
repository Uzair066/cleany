import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import toast, { Toaster } from 'react-hot-toast';
import { LoadingButton } from '@mui/lab';
import { Box } from '@mui/system';
import axios from '../../../../../axios';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
import { Grid, TextField } from '@mui/material';
import { USER_SIDE_ADD_CARDS } from 'app/api';

function AddPaymentCard({ open, handleClose, getCardList }) {
  const [loading, setLoading] = useState(false);

  const schema = Yup.object().shape({
    name: Yup.string().required('Full name is required!'),
    card_no: Yup.string()
      .required('Card no is Required!')
      .test('Digits only', 'Must be digits only!', (value) => /^\d+$/.test(value))
      .test('card_no', 'Must be exactly 16 characters', (val) => val?.length === 16),

    exp_m: Yup.string()
      .required('Expiry month is Required!')
      .test('Digits only', 'Must be digits only!', (value) => /^\d+$/.test(value))
      .test('card_no', 'Must be exactly 2 characters', (val) => val?.length === 2),
    exp_y: Yup.string()
      .required('Expiry year is Required!')
      .test('Digits only', 'Must be digits only!', (value) => /^\d+$/.test(value))
      .test('card_no', 'Must be exactly 4 characters', (val) => val?.length === 4),
    cvc: Yup.string()
      .required('CVC is Required!')
      .test('Digits only', 'Must be digits only!', (value) => /^\d+$/.test(value))
      .test('card_no', 'Must be exactly 3 characters', (val) => val?.length === 3),
  });
  const formik = useFormik({
    initialValues: {
      name: '',
      card_no: '',
      exp_m: '',
      exp_y: '',
      cvc: '',
    },
    validationSchema: schema,
    onSubmit: (values) => {
      setLoading(true);
      toast.promise(
        axios.post(`${USER_SIDE_ADD_CARDS}`, values, {
          headers: { 'Content-Type': 'application/json' },
        }),
        {
          loading: () => {
            return `Adding Card!`;
          },
          success: (res) => {
            setLoading(false);
            resetForm();
            getCardList();
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
          Add Card Details
        </DialogTitle>
        <DialogContent>
          <FormikProvider value={formik}>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
              <Grid container spacing={2} sx={{ marginTop: '2px' }}>
                <Grid item xs={4}>
                  Full Name
                </Grid>
                <Grid item sm={8} xs={8}>
                  <TextField
                    size="small"
                    type="text"
                    {...getFieldProps('name')}
                    sx={{ width: '100%' }}
                    error={Boolean(touched.name && errors.name)}
                    helperText={touched.name && errors.name}
                  />
                </Grid>
                <Grid item xs={4}>
                  Card No
                </Grid>
                <Grid item sm={8} xs={8}>
                  <TextField
                    size="small"
                    type="text"
                    {...getFieldProps('card_no')}
                    sx={{ width: '100%' }}
                    error={Boolean(touched.card_no && errors.card_no)}
                    helperText={touched.card_no && errors.card_no}
                  />
                </Grid>
                <Grid item xs={4}>
                  Expiry Month
                </Grid>
                <Grid item sm={8} xs={8}>
                  <TextField
                    size="small"
                    type="text"
                    {...getFieldProps('exp_m')}
                    sx={{ width: '100%' }}
                    error={Boolean(touched.exp_m && errors.exp_m)}
                    helperText={touched.exp_m && errors.exp_m}
                  />
                </Grid>
                <Grid item xs={4}>
                  Expiry Year
                </Grid>
                <Grid item sm={8} xs={8}>
                  <TextField
                    size="small"
                    type="text"
                    {...getFieldProps('exp_y')}
                    sx={{ width: '100%' }}
                    error={Boolean(touched.exp_y && errors.exp_y)}
                    helperText={touched.exp_y && errors.exp_y}
                  />
                </Grid>
                <Grid item xs={4}>
                  CVC
                </Grid>
                <Grid item sm={8} xs={8}>
                  <TextField
                    size="small"
                    type="text"
                    {...getFieldProps('cvc')}
                    sx={{ width: '100%' }}
                    error={Boolean(touched.cvc && errors.cvc)}
                    helperText={touched.cvc && errors.cvc}
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
                  Add Now
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

export default AddPaymentCard;
