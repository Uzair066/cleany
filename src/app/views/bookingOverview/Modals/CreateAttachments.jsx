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
import { Checkbox, FormControlLabel, FormGroup, Grid, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import Dropzone from '../../../components/DropZone/Dropzone';
import createNftDocuments from '../../../../assets/createNftDocuments.png';
import ImageBox from '../../../components/DropZone/ImageBox';
import { CREATE_BOOKING_ATTACHMENTS } from 'app/api';

function CreateAttachments({ open, handleClose, serviceListAPI }) {
  const [loading, setLoading] = useState(false);
  const params = useParams();
  let formData = new FormData();

  const schema = Yup.object().shape({
    file: Yup.array().min(1, 'Attachment is required!').required('Attachment is required!'),
  });
  const formik = useFormik({
    initialValues: {
      share_with_customer: false,
      share_with_cleaner: false,
      booking: null,
      file: null,
    },
    validationSchema: schema,
    onSubmit: (values) => {
      formData.append('share_with_customer', values?.share_with_customer ? 'True' : 'False');
      formData.append('share_with_cleaner', values?.share_with_cleaner ? 'True' : 'False');
      formData.append('booking', values?.booking);
      formData.append('file', values?.file[0]);
      setLoading(true);
      toast.promise(
        axios.post(`${CREATE_BOOKING_ATTACHMENTS}`, formData, {
          headers: { 'Content-Type': 'application/json' },
        }),
        {
          loading: () => {
            return `Creating Attachment!`;
          },
          success: (res) => {
            setLoading(false);
            resetForm();
            serviceListAPI();
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
    setFieldValue('booking', +params?.id);
  }, []);

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
          New Attachments
        </DialogTitle>
        <DialogContent>
          <FormikProvider value={formik}>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
              <Grid container spacing={2} sx={{ marginTop: '2px' }}>
                <Grid item sm={12} xs={12}>
                  <Typography gutterBottom variant="h6" component="div">
                    Attachment
                  </Typography>
                  <Typography variant="subtitle1">
                    File types supported: All supported formats. Max size: 5 MB
                  </Typography>
                  <Dropzone
                    setFieldValue={(acceptedFiles) => setFieldValue('file', acceptedFiles)}
                    error={touched.file && Boolean(errors.file)}
                    helperText={touched.file && errors.file}
                    uploadedFiles={values.file}
                  >
                    <ImageBox src={createNftDocuments} className="h-[249px] w-full" />
                  </Dropzone>
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
                          checked={values.share_with_customer}
                          onChange={(e) => setFieldValue('share_with_customer', e.target.checked)}
                        />
                      }
                      label="Show Attachments to Company *"
                    />
                  </FormGroup>
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
                          checked={values.share_with_cleaner}
                          onChange={(e) => setFieldValue('share_with_cleaner', e.target.checked)}
                        />
                      }
                      label="Show Attachments to Cleaner *"
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
                  Create
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

export default CreateAttachments;
