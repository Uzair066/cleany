import React, { useState } from 'react';
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
import { Grid, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import Dropzone from '../../../components/DropZone/Dropzone';
import createNftDocuments from '../../../../assets/createNftDocuments.png';
import ImageBox from '../../../components/DropZone/ImageBox';
import { IMPORT_CUSTOMERS } from 'app/api';

function ImportCustomers({ open, handleClose, serviceListAPI }) {
  const [loading, setLoading] = useState(false);
  let formData = new FormData();

  const schema = Yup.object().shape({
    file: Yup.array()
      .min(1, 'Attachment is required and can only be .csv format!')
      .required('Attachment is required and can only be .csv format!'),
  });
  const formik = useFormik({
    initialValues: {
      file: null,
    },
    validationSchema: schema,
    onSubmit: (values) => {
      formData.append('file', values?.file[0]);
      setLoading(true);
      toast.promise(
        axios.post(`${IMPORT_CUSTOMERS}`, formData, {
          headers: { 'Content-Type': 'application/json' },
        }),
        {
          loading: () => {
            return `Importing Customers!`;
          },
          success: (res) => {
            setLoading(false);
            resetForm();
            serviceListAPI();
            setTimeout(() => {
              handleClose();
            }, 200);

            return 'Customers Imported!';
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
          Import Customers
        </DialogTitle>
        <DialogContent>
          <FormikProvider value={formik}>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
              <Grid container spacing={2} sx={{ marginTop: '2px' }}>
                <Grid item sm={12} xs={12}>
                  <Typography variant="subtitle1">File types supported: .csv!</Typography>
                  <Dropzone
                    setFieldValue={(acceptedFiles) => setFieldValue('file', acceptedFiles)}
                    error={touched.file && Boolean(errors.file)}
                    helperText={touched.file && errors.file}
                    uploadedFiles={values.file}
                    type={true}
                  >
                    <ImageBox src={createNftDocuments} className="h-[249px] w-full" />
                  </Dropzone>
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
                  Import
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

export default ImportCustomers;
