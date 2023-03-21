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
import { Grid, MenuItem, TextField } from '@mui/material';
import { UPDATE_TASKS } from 'app/api';

function UpdateStatus({ open, handleClose, selectedTasks, getEventList }) {
  const [loading, setLoading] = useState(false);

  const schema = Yup.object().shape({
    status: Yup.string().required('Status is Required'),
  });
  const formik = useFormik({
    initialValues: {
      id: selectedTasks?.id,
      status: '',
    },
    validationSchema: schema,
    onSubmit: (values) => {
      setLoading(true);
      toast.promise(
        axios.put(`${UPDATE_TASKS}`, values, {
          headers: { 'Content-Type': 'application/json' },
        }),
        {
          loading: () => {
            return `Changing Status!`;
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
    setFieldValue('id', selectedTasks?.id);
    setFieldValue('status', selectedTasks?.status);
  }, [selectedTasks, open]);

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
          Change Status
        </DialogTitle>
        <DialogContent>
          <FormikProvider value={formik}>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
              <Grid container spacing={4} sx={{ marginTop: '2px' }}>
                <Grid item xs={4}>
                  Status
                </Grid>
                <Grid item sm={8} xs={8}>
                  <TextField
                    size="small"
                    select
                    {...getFieldProps('status')}
                    sx={{ width: '100%' }}
                    error={Boolean(touched.status && errors.status)}
                    helperText={touched.status && errors.status}
                  >
                    <MenuItem value={'Pending'}>Pending</MenuItem>
                    <MenuItem value={'In_Progress'}>In Progress</MenuItem>
                    <MenuItem value={'Complete'}>Completed</MenuItem>
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
                  Change
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

export default UpdateStatus;
