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
import { Grid, MenuItem, TextField, Tooltip } from '@mui/material';
import { UPDATE_PACKAGE } from 'app/api';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import CreatePackageItem from './CreateItem';
import UpdatePackageItem from './UpdatePackageItem';

function UpdatePackageModal({
  open,
  handleClosePackage,
  serviceData,
  retrieveService,
  selectedPackageData,
}) {
  const [loading, setLoading] = useState(false);
  const [UpdateItemModal, setUpdateItemModal] = useState(false);
  const [packageData, setPackageData] = useState({});

  const schema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    front_end_field_type: Yup.string().required('Front end field type is required!'),
  });
  const formik = useFormik({
    initialValues: {
      title: '',
      front_end_field_type: '',
      service: '',
      id: '',
    },
    validationSchema: schema,
    onSubmit: (values) => {
      setLoading(true);
      toast.promise(
        axios.put(`${UPDATE_PACKAGE}`, values, {
          headers: { 'Content-Type': 'application/json' },
        }),
        {
          loading: () => {
            return `Updating Package!`;
          },
          success: (res) => {
            setPackageData(res?.data?.data);
            setLoading(false);
            resetForm();
            setUpdateItemModal(true);

            setTimeout(() => {
              handleClosePackage();
              retrieveService();
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
    setFieldValue('service', serviceData?.id);
    setFieldValue('id', selectedPackageData?.id);
    setFieldValue('title', selectedPackageData?.title);
    setFieldValue('front_end_field_type', selectedPackageData?.front_end_field_type);
  }, [serviceData, selectedPackageData, open]);

  return (
    <>
      <Dialog
        open={open}
        onClose={() => {
          handleClosePackage();
          resetForm();
        }}
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
          Update {selectedPackageData?.title}
        </DialogTitle>
        <DialogContent>
          <FormikProvider value={formik}>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
              <Grid container spacing={2} sx={{ marginTop: '2px' }}>
                <Grid item sm={12} xs={12}>
                  <TextField
                    size="small"
                    fullWidth
                    type="text"
                    label="Title"
                    {...getFieldProps('title')}
                    error={Boolean(touched.title && errors.title)}
                    helperText={touched.title && errors.title}
                  />
                </Grid>
                <Grid item sm={12} xs={12}>
                  <TextField
                    size="small"
                    fullWidth
                    type="text"
                    label="Front end field type*"
                    select
                    {...getFieldProps('front_end_field_type')}
                    error={Boolean(touched.front_end_field_type && errors.front_end_field_type)}
                    helperText={touched.front_end_field_type && errors.front_end_field_type}
                  >
                    <MenuItem value={'select'}>Selection</MenuItem>
                    <MenuItem value={'card'}>Card</MenuItem>
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
                    handleClosePackage();
                    resetForm();
                  }}
                  variant="outlined"
                  color="primary"
                  sx={{ mr: 2 }}
                >
                  Cancel
                </Button>
                <LoadingButton
                  type="submit"
                  color="primary"
                  startIcon={<KeyboardArrowRightIcon />}
                  loading={loading}
                  variant="contained"
                >
                  Next
                </LoadingButton>
              </Box>
            </Form>
          </FormikProvider>
        </DialogContent>
        <Toaster position="top-right" />
      </Dialog>
      <UpdatePackageItem
        open={UpdateItemModal}
        handleClose={() => setUpdateItemModal(false)}
        packageData={packageData}
        retrieveService={retrieveService}
        selectedPackageData={selectedPackageData}
      />
    </>
  );
}

export default UpdatePackageModal;
