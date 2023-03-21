import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import toast, { Toaster } from 'react-hot-toast';
import { Box } from '@mui/system';
import CloseIcon from '@mui/icons-material/Close';
import BookOutlinedIcon from '@mui/icons-material/BookOutlined';
import { DialogActions, Divider, Grid, MenuItem, TextField, Typography } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
import { GET_BOOKING_DATA } from 'app/api';
import axios from 'axios';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import * as _ from 'lodash';

function StepThree({
  open,
  handleClose,
  handleFormData,
  formData,
  handleReset,
  setStepTwo,
  setStepFour,
  setFormData,
}) {
  const [bookingData, setBookingData] = useState({});
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedExtras, setSelectedExtras] = useState([]);
  const [itemsText, setItemsText] = useState([]);
  useEffect(async () => {
    await axios
      .get(`https://api-cleany-backend.herokuapp.com${GET_BOOKING_DATA}/${formData?.service_slug}`)
      .then((res) => {
        setBookingData(res?.data?.data);
      })
      .catch((err) => console.log(err));
  }, [open]);

  const schema = Yup.object().shape({
    package_selection: Yup.string().required('Select minimum 1 package!'),
  });
  const formik = useFormik({
    initialValues: {
      package_selection: '',
    },
    validationSchema: schema,
    onSubmit: (values) => {
      const dupDataObj = { ...formData };

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

      dupDataObj.booking_extras = _.compact(selectedExtras);
      dupDataObj.booking_items = itemMapData;
      dupDataObj.packages_text = _.compact(itemsText)
        .map((item) => {
          return parseFloat(item?.price).toFixed(2);
        })
        .reduce((accumulator, value) => {
          return +accumulator + +value;
        }, 0);
      dupDataObj.discounts_text = _.compact(itemsText)
        .map((item) => {
          const percent = (item?.discount_percent * +item?.price) / 100;
          return percent;
        })
        .reduce((accumulator, value) => {
          return +accumulator + +value;
        }, 0);
      dupDataObj.extras_text = _.compact(selectedExtras)
        .map((item) => {
          const price = parseFloat(item?.price) * item?.quantity;
          return price.toFixed(2);
        })
        .reduce((accumulator, value) => {
          return +accumulator + +value;
        }, 0);
      dupDataObj.taxes_text = bookingData?.tax?.[0]?.tax_rate;
      dupDataObj.total_text =
        +bookingData?.tax?.[0]?.tax_rate +
        _.compact(selectedExtras)
          .map((item) => {
            const price = parseFloat(item?.price) * item?.quantity;
            return price.toFixed(2);
          })
          .reduce((accumulator, value) => {
            return +accumulator + +value;
          }, 0) +
        _.compact(itemsText)
          .map((item) => {
            return parseFloat(item?.price).toFixed(2);
          })
          .reduce((accumulator, value) => {
            return +accumulator + +value;
          }, 0) -
        _.compact(itemsText)
          .map((item) => {
            const percent = (item?.discount_percent * +item?.price) / 100;
            return percent;
          })
          .reduce((accumulator, value) => {
            return +accumulator + +value;
          }, 0);
      setFormData(dupDataObj);
      setStepFour(true);
      handleClose();
      // toast.promise(
      //   axios.post(
      //     `https://api-cleany-backend.herokuapp.com${CREATE_BOOKING}/${bookingData?.id}`,
      //     objToSend,
      //     {
      //       headers: { 'Content-Type': 'application/json' },
      //     }
      //   ),
      //   {
      //     loading: () => {
      //       return `Creating Booking!`;
      //     },
      //     success: (res) => {
      //       setLoading(false);
      //       setTimeout(() => {
      //         navigate(token === null ? '/session/signup' : '/dashboard/default');
      //       }, 500);

      //       return res?.data?.message;
      //     },
      //     error: (err) => {
      //       setLoading(false);
      //       return err?.message;
      //     },
      //   }
      // );
    },
  });
  const handleSelectPackageData = (value, index, packageData) => {
    const dupArr = [...selectedItems];
    const itemsTextObj = [...itemsText];
    dupArr[index] = value;

    if (value !== null) {
      // dupArr[index].packageData = packageData?.id;
      setFieldValue('package_selection', `${value}`);
      bookingData?.packages?.forEach((a, index) => {
        if (a?.item?.length > 0) {
          a?.item?.forEach((b) => {
            if (b?.id == value) {
              itemsTextObj[index] = b;
            }
          });
        }
      });
    } else if (!dupArr.some((iData) => iData?.id)) {
      setFieldValue('package_selection', '');
      itemsTextObj[index] = value;
    }
    setSelectedItems(dupArr);
    setItemsText(itemsTextObj);
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

  const {
    errors,
    touched,
    setFieldValue,
    handleSubmit,
    getFieldProps,
    values,
    handleChange,
    handleBlur,
  } = formik;

  useEffect(() => {
    const dupItems = [...selectedItems];
    const dupExtras = [...selectedExtras];
    bookingData?.packages?.forEach((a, index) => {
      if (a?.item?.length > 0) {
        a?.item?.forEach((b) => {
          formData?.booking_items?.forEach((c) => {
            if (c.id === b.id) {
              dupItems[index] = c.id;
              setFieldValue('package_selection', a.title);
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
        formData?.booking_extras?.forEach((b) => {
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
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '1.5rem',
            backgroundColor: '#1D60B0',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', color: 'white', fontSize: '1.25rem' }}>
            <BookOutlinedIcon
              sx={{
                fill: 'white',
                width: '70px',
                height: '70px',
                transform: 'rotate(-10deg)',
                marginRight: '2rem',
              }}
            />
            <Box
              sx={{
                '& h1': {
                  fontSize: '1.25rem',
                  fontWeight: '500',
                },
                '& span': {
                  fontSize: '1.4rem',
                  fontWeight: 'bold',
                },
              }}
            >
              <Typography variant="h1">Create a new Booking</Typography>
              <Typography variant="h1">
                <span>Step 3 of 4</span> Booking Details
              </Typography>
            </Box>
          </Box>
          <CloseIcon
            sx={{ cursor: 'pointer' }}
            onClick={() => {
              handleReset();
              handleClose();
            }}
          />
        </Box>
        <Box
          sx={{
            padding: '1.5rem 2rem',
            '& h3': {
              margin: 'unset',
              paddingBottom: '5px',
            },
          }}
        >
          <Typography variant="h6" className="subHeadings">
            Tell us about your cleaning
          </Typography>
          <Grid container spacing={3}>
            {bookingData?.packages?.length > 0 &&
              bookingData?.packages?.map((data, index) => (
                <Grid item xs={12} md={6} lg={4}>
                  <TextField
                    fullWidth
                    type="text"
                    label={`${data?.title}*`}
                    select
                    value={selectedItems[index]}
                    onChange={(e) => {
                      handleSelectPackageData(e.target.value, index, data);
                    }}
                    name="package_selection"
                    error={Boolean(touched.package_selection && errors.package_selection)}
                    helperText={touched.package_selection && errors.package_selection}
                  >
                    <MenuItem value={null}>None</MenuItem>
                    {data?.item?.length > 0 &&
                      data?.item?.map((item) => (
                        <MenuItem value={item?.id}>
                          {item?.title} ${item?.price}
                        </MenuItem>
                      ))}
                  </TextField>
                </Grid>
              ))}
          </Grid>
          <Divider sx={{ marginTop: '2rem' }} />
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
                        backgroundColor: selectedExtras[index]?.quantity ? '#d3d9df' : '#f8f9fa',
                        borderColor: selectedExtras[index]?.quantity ? '#d3d9df' : '#f8f9fa',
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
        </Box>
        <DialogActions
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBottom: '2rem',
            '& button': {
              fontSize: '1rem',
            },
          }}
        >
          <Box></Box>
          <Box>
            <FormikProvider value={formik}>
              <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<ArrowBackIcon />}
                  onClick={() => {
                    setStepTwo(true);
                    handleClose();
                  }}
                  sx={{ marginRight: '1rem' }}
                >
                  Back
                </Button>

                <Button
                  variant="contained"
                  color="primary"
                  endIcon={<ArrowForwardIcon />}
                  type="submit"
                >
                  Next
                </Button>
              </Form>
            </FormikProvider>
          </Box>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              handleReset();
              handleClose();
            }}
          >
            Cancel
          </Button>
        </DialogActions>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '0.5rem 2rem 1.5rem 2rem',
            backgroundColor: '#1D60B0',
            '& h3': {
              margin: 'unset',
              color: 'white',
              fontWeight: 'bold',
              paddingBottom: '5px',
            },
            '& p': {
              color: 'white',
              margin: 'unset',
            },
          }}
        >
          <Grid container spacing={5}>
            <Grid item xs={6}>
              <h3>Service: Cleany Miami - Custom Hourly</h3>
              <Grid container>
                <Grid item xs={10}>
                  <p>Minimum Time:</p>
                  <p>Maximum Price:</p>
                  <p>Base Time:</p>
                  <p>Base Price:</p>
                  <p>People:</p>
                </Grid>
                <Grid item xs={2}>
                  <p>0(hrs)</p>
                  <p>$0.00</p>
                  <p>0(hrs)</p>
                  <p>$0.00</p>
                  <p>1</p>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={6}>
              <Grid container>
                <Grid item xs={10}>
                  <p>Packages:</p>
                  <p>Discounts:</p>
                  <p>Extras:</p>
                  <p>Taxes:</p>
                  <p>Total:</p>
                </Grid>
                <Grid item xs={2}>
                  <p>
                    $
                    {_.compact(itemsText)
                      .map((item) => {
                        return parseFloat(item?.price).toFixed(2);
                      })
                      .reduce((accumulator, value) => {
                        return +accumulator + +value;
                      }, 0)}
                  </p>
                  <p>
                    $
                    {_.compact(itemsText)
                      .map((item) => {
                        const percent = (item?.discount_percent * +item?.price) / 100;
                        return percent;
                      })
                      .reduce((accumulator, value) => {
                        return +accumulator + +value;
                      }, 0)}
                  </p>
                  <p>
                    $
                    {_.compact(selectedExtras)
                      .map((item) => {
                        const price = parseFloat(item?.price) * item?.quantity;
                        return price.toFixed(2);
                      })
                      .reduce((accumulator, value) => {
                        return +accumulator + +value;
                      }, 0)}
                  </p>
                  <p>${bookingData?.tax?.[0]?.tax_rate}</p>
                  <p>
                    $
                    {+bookingData?.tax?.[0]?.tax_rate +
                      _.compact(selectedExtras)
                        .map((item) => {
                          const price = parseFloat(item?.price) * item?.quantity;
                          return price.toFixed(2);
                        })
                        .reduce((accumulator, value) => {
                          return +accumulator + +value;
                        }, 0) +
                      _.compact(itemsText)
                        .map((item) => {
                          return parseFloat(item?.price).toFixed(2);
                        })
                        .reduce((accumulator, value) => {
                          return +accumulator + +value;
                        }, 0) -
                      _.compact(itemsText)
                        .map((item) => {
                          const percent = (item?.discount_percent * +item?.price) / 100;
                          return percent;
                        })
                        .reduce((accumulator, value) => {
                          return +accumulator + +value;
                        }, 0)}
                  </p>
                </Grid>
              </Grid>
              <Divider sx={{ borderColor: 'white', marginTop: '0.5rem', marginBottom: '0.5rem' }} />

              <Grid container>
                <Grid item xs={10}>
                  <p>Time Required(hrs):</p>
                </Grid>
                <Grid item xs={2}>
                  <p>5</p>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
        <Toaster position="top-right" />
      </Dialog>
    </>
  );
}

export default StepThree;
