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
import { Checkbox, FormControlLabel, MenuItem, TextField } from '@mui/material';
import { CREATE_PAYROLL_LEDGER, GET_BOOKING_PAYROLL, GET_SERVICE_PROVIDER_LIST } from 'app/api';
import * as _ from 'lodash';

function AddPayment({ open, handleClose, getPaymentList }) {
  const [loading, setLoading] = useState(false);
  const [serviceProviderList, setServiceProviderList] = useState([]);
  const [checkBoxArray, setCheckBoxArray] = useState([]);
  useEffect(() => {
    serviceListAPI();
  }, []);

  const serviceListAPI = async () => {
    await axios
      .get(`${GET_SERVICE_PROVIDER_LIST}`, {
        headers: { 'Content-Type': 'application/json' },
      })
      .then((res) => {
        setServiceProviderList(res?.data?.data);
      })
      .catch((err) => console.log(err));
  };

  const schema = Yup.object().shape({
    service_provider: Yup.string().required('Service Provider is Required'),
    total_amount: Yup.number().required('Amount is Required').min(1),
  });
  const formik = useFormik({
    initialValues: {
      service_provider: '',
      total_amount: '',
    },
    validationSchema: schema,
    onSubmit: (values) => {
      const obgToSend = {
        ...values,
        payroll: _.compact(
          checkBoxArray.map((item) => {
            if (item.checkBox === true) {
              return item.id;
            }
          })
        ),
      };
      setLoading(true);
      toast.promise(
        axios.post(`${CREATE_PAYROLL_LEDGER}`, obgToSend, {
          headers: { 'Content-Type': 'application/json' },
        }),
        {
          loading: () => {
            return `Adding Payment!`;
          },
          success: (res) => {
            setLoading(false);
            getPaymentList();
            resetForm();
            setTimeout(() => {
              handleClose();
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
    if (values.service_provider !== '') {
      getCheckbox();
    }
  }, [values.service_provider]);
  const getCheckbox = async () => {
    await axios
      .get(
        `${GET_BOOKING_PAYROLL}?service_provider=${
          values.service_provider === '' ? '' : values.service_provider
        }`
      )
      .then((res) => {
        const mapData = res?.data?.data?.map((item) => {
          return { ...item, checkBox: false };
        });
        setCheckBoxArray(mapData);
      })
      .catch((err) => console.log(err));
  };
  const handleChangeCheckBox = (e, index) => {
    const dupObj = [...checkBoxArray];
    dupObj[index].checkBox = e.target.checked;
    setCheckBoxArray(dupObj);
  };
  const handleSelectAll = () => {
    const mapData = checkBoxArray?.map((item) => {
      return { ...item, checkBox: true };
    });
    setCheckBoxArray(mapData);
  };
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
          Add Payment
        </DialogTitle>
        <DialogContent>
          <FormikProvider value={formik}>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
              <TextField
                style={{ marginTop: '0.4rem' }}
                inputProps={{ min: 0 }}
                size="small"
                type="text"
                label="Service Provider"
                select
                {...getFieldProps('service_provider')}
                sx={{ width: '100%' }}
                error={Boolean(touched.service_provider && errors.service_provider)}
                helperText={touched.service_provider && errors.service_provider}
              >
                {!!serviceProviderList.length &&
                  serviceProviderList.map((data, index) => (
                    <MenuItem key={index} value={data?.id}>
                      {data?.user_profile?.first_name} {data?.user_profile?.last_name}
                    </MenuItem>
                  ))}
              </TextField>
              <h3 style={{ marginBottom: 'unset' }}>Select Payroll Ids</h3>
              <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 4 }}>
                {!!checkBoxArray.length &&
                  values.service_provider !== '' &&
                  checkBoxArray?.map((data, index) => (
                    <FormControlLabel
                      key={index}
                      label={`${data?.id}`}
                      control={
                        <Checkbox
                          checked={data?.checkBox}
                          onChange={(e) => handleChangeCheckBox(e, index)}
                        />
                      }
                    />
                  ))}
                {!!checkBoxArray.length && (
                  <Button variant="contained" onClick={handleSelectAll}>
                    Select All
                  </Button>
                )}
              </Box>
              {checkBoxArray.length === 0 && values.service_provider !== '' && (
                <p style={{ margin: 'unset' }}>No payroll available for this service provider!</p>
              )}
              {values.service_provider === '' && (
                <p style={{ margin: 'unset' }}>Select service provider to show payroll!</p>
              )}
              <TextField
                inputProps={{ min: 0, placeholder: 'Enter amount!' }}
                size="small"
                style={{ marginTop: '1rem' }}
                type="number"
                label="Amount"
                {...getFieldProps('total_amount')}
                sx={{ width: '100%' }}
                error={Boolean(touched.total_amount && errors.total_amount)}
                helperText={touched.total_amount && errors.total_amount}
              ></TextField>
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

export default AddPayment;
