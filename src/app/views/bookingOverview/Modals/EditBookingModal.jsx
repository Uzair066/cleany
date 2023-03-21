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
import {
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { UPDATE_BOOKING } from 'app/api';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import * as _ from 'lodash';

function EditBookingModal({
  open,
  handleClose,
  getEventList,
  bookindDetails,
  bookingData,
  getBookingData,
}) {
  const [loading, setLoading] = useState(false);

  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedExtras, setSelectedExtras] = useState([]);
  const params = useParams();

  const schema = Yup.object().shape({
    package_selection: Yup.string().required('Select minimum 1 package!'),
  });
  const formik = useFormik({
    initialValues: {
      package_selection: '',
    },
    validationSchema: schema,
    onSubmit: (values) => {
      let itemMapData = [];
      bookingData?.packages?.forEach((a, index) => {
        if (a?.item?.length > 0) {
          a?.item?.forEach((b) => {
            _.compact(selectedItems)?.forEach((c) => {
              if (c === b.id) {
                itemMapData?.push({ item_id: c, package: a.id });
              }
            });
          });
        }
      });

      const extras = _.compact(selectedExtras);
      const formData = {
        booking: bookindDetails?.id,
        service_id: bookingData?.id,
        item: itemMapData,
        extra: extras,
      };

      setLoading(true);
      toast.promise(
        axios.put(`${UPDATE_BOOKING}`, formData, {
          headers: { 'Content-Type': 'application/json' },
        }),
        {
          loading: () => {
            return `Updating Booking!`;
          },
          success: (res) => {
            setLoading(false);
            resetForm();
            getEventList();
            getBookingData();
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

  const handleSelectPackageData = (value, index, packageData) => {
    const dupArr = [...selectedItems];
    dupArr[index] = value;
    if (value !== null) {
      setFieldValue('package_selection', value);
    } else if (!dupArr.some((iData) => iData?.id)) {
      setFieldValue('package_selection', '');
    }
    setSelectedItems(dupArr);
  };
  const handleExtrasClick = (data, index) => {
    const dupArr = [...selectedExtras];
    if (selectedExtras[index]?.quantity) {
      dupArr[index] = undefined;
      setSelectedExtras(dupArr);
    } else {
      dupArr[index] = { extra_id: data.id, quantity: 1, price: data?.price };
      setSelectedExtras(dupArr);
    }
  };
  const handleDecrement = (index) => {
    const dupArr = [...selectedExtras];
    if (dupArr[index].quantity > 1) {
      dupArr[index].quantity = dupArr[index].quantity - 1;
      setSelectedExtras(dupArr);
    }
  };
  const handleIncrement = (index) => {
    const dupArr = [...selectedExtras];
    dupArr[index].quantity = dupArr[index].quantity + 1;
    setSelectedExtras(dupArr);
  };

  const { errors, touched, resetForm, setFieldValue, handleSubmit, getFieldProps, values } = formik;
  useEffect(() => {
    setFieldValue('booking', +params?.id);
  }, []);
  useEffect(() => {
    const dupItems = [...selectedItems];
    const dupExtras = [...selectedExtras];
    bookingData?.packages?.forEach((a, index) => {
      if (a?.item?.length > 0) {
        a?.item?.forEach((b) => {
          bookindDetails?.items?.forEach((c) => {
            if (c.id === b.id) {
              dupItems[index] = c.id;
            }
          });
        });
      } else {
        dupItems[index] = null;
      }
    });
    setSelectedItems(dupItems);
    if (!!bookingData?.extras?.length) {
      bookingData?.extras?.forEach((a, index) => {
        bookindDetails?.extras?.forEach((b) => {
          if (a.id === b.id) {
            dupExtras[index] = { extra_id: b.id, quantity: b?.quantity, price: b?.price };
          }
        });
      });
      setSelectedExtras(dupExtras);
    }
  }, [bookingData, open]);

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
          Update B-{params?.id}
        </DialogTitle>
        <DialogContent>
          <FormikProvider value={formik}>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
              <Typography variant="h6" className="subHeadings">
                Tell us about your cleaning
              </Typography>
              <Grid container spacing={3}>
                {bookingData?.packages?.length > 0 &&
                  bookingData?.packages?.map((data, index) => (
                    <Grid key={index} item xs={12} md={6} lg={4}>
                      <FormControl fullWidth>
                        <InputLabel
                          id={`demo-simple-select-label${index}`}
                        >{`${data?.title}*`}</InputLabel>
                        <Select
                          fullWidth
                          labelId={`demo-simple-select-label${index}`}
                          id={`demo-simple-select${index}`}
                          label={`${data?.title}*`}
                          value={selectedItems[index]}
                          onChange={(e) => {
                            handleSelectPackageData(e.target.value, index, data);
                          }}
                          error={Boolean(touched.package_selection && errors.package_selection)}
                          helperText={touched.package_selection && errors.package_selection}
                        >
                          <MenuItem value={null}>None</MenuItem>
                          {data?.item?.length > 0 &&
                            data?.item?.map((item) => (
                              <MenuItem value={item.id}>
                                {item?.title} ${item?.price}
                              </MenuItem>
                            ))}
                        </Select>
                        <FormHelperText sx={{ color: 'rgb(244, 67, 54)' }}>
                          {touched.package_selection && errors.package_selection}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                  ))}
              </Grid>
              <Divider sx={{ marginTop: '2rem', marginBottom: '1rem' }} />
              <Typography variant="h6" className="subHeadings">
                Extras
              </Typography>
              <Typography variant="body1" style={{ paddingBottom: '1rem' }}>
                Select the extras you require for your booking. Price per cleaning:
              </Typography>
              <Grid container spacing={5} sx={{ paddinTop: '1rem' }}>
                {bookingData?.extras?.length > 0 &&
                  bookingData?.extras.map((data, index) => (
                    <Grid item xs={4}>
                      <Box sx={{ width: '100%', height: '100%' }}>
                        <Box
                          sx={{
                            width: '100%',
                            height: '150px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'column',
                            color: '#212529',
                            backgroundColor: selectedExtras[index]?.quantity
                              ? '#d3d9df'
                              : '#c7c8c8',
                            borderColor: selectedExtras[index]?.quantity ? '#d3d9df' : '#c7c8c8',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            '&:hover': {
                              backgroundColor: '#d3d9df',
                              borderColor: '#d3d9df',
                            },
                            '& h3': {
                              marginTop: '5px',
                              marginBottom: 'unset',
                            },
                          }}
                          onClick={() => handleExtrasClick(data, index)}
                        >
                          <Box
                            sx={{
                              width: '5rem',
                              height: '5rem',
                              borderRadius: '50%',
                              background: 'white',
                              border: '2px solid white',
                            }}
                          ></Box>
                          <h3>{data?.title}</h3>
                        </Box>
                        {selectedExtras[index]?.quantity && (
                          <Box
                            sx={{
                              width: '100%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              padding: '10px',
                              backgroundColor: '#d3d9df',
                              borderColor: '#d3d9df',
                            }}
                          >
                            <RemoveCircleOutlineIcon
                              sx={{ cursor: 'pointer' }}
                              onClick={() => handleDecrement(index)}
                            />
                            <Box
                              sx={{
                                marginLeft: '5px',
                                marginRight: '5px',
                                width: '4rem',
                                textAlign: 'center',
                                background: 'white',
                                fontSize: '1rem',
                                border: '1px solid black',
                                borderRadius: '4px',
                              }}
                            >
                              {selectedExtras[index]?.quantity}
                            </Box>
                            <AddCircleOutlineIcon
                              sx={{ cursor: 'pointer' }}
                              onClick={() => handleIncrement(index)}
                            />
                          </Box>
                        )}
                      </Box>
                    </Grid>
                  ))}
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
                  Update
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

export default EditBookingModal;
