import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  MenuItem,
  styled,
  TextField,
  Typography,
} from '@mui/material';
import { CREATE_CUSTOMER_SIDE_BOOKING, GET_BOOKING_DATA, USER_CARD_DETAILS } from 'app/api';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../../../axios';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import Logo from '../../../assets/logo.png';
import CoverImage from '../../../assets/coverImage.png';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import SavedSearchIcon from '@mui/icons-material/SavedSearch';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
import toast, { Toaster } from 'react-hot-toast';
import moment from 'moment';
import { LoadingButton } from '@mui/lab';
import * as _ from 'lodash';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import GooglePlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-google-places-autocomplete';

const MainBox = styled(Box)(({ theme }) => ({
  '& .topHeader': {
    position: 'fixed',
    width: '100%',
    backgroundColor: '#3498db',
    zIndex: '999',
    '& .signInBtn': {
      color: 'white',
      fontSize: '1rem',
      fontWeight: '600',
    },
    '& .bodyTxt': {
      color: 'white',
      paddingRight: '0.3rem',
    },
  },
  '& .secondHeader': {
    position: 'fixed',
    width: '100%',
    backgroundColor: 'rgb(52 152 219 / 50%);',
    top: '40px',
    padding: '10px',
    zIndex: '999',
    '& .logoContainer': {
      '& img': {
        width: '200px',
      },
    },
    '& .btn1': {
      color: 'white',
      fontSize: '1.5rem',
      fontWeight: 'bold',
      marginRight: '10px',
    },
  },
  '& .contentMain': {
    paddingTop: '10rem',
    '& .bookingTitle': {
      textAlign: 'center',
      fontWeight: 'bold',
      paddingBottom: '1rem',
      paddingTop: '1rem',
    },
    '& .coverImage': {
      width: '100%',
    },
    '& .tell-us': {},
    '& .subHeadings': {
      fontWeight: 'bold',
      fontSize: '1.4rem',
      paddingTop: '1rem',
      paddingBottom: '1rem',
    },
  },
}));

function CustomerBooking() {
  const token = localStorage.getItem('accessToken');
  const navigate = useNavigate();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [bookingData, setBookingData] = useState({});
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedExtras, setSelectedExtras] = useState([]);
  const [frequency, setFrequency] = useState('biweekly');
  const [expanded, setExpanded] = useState(false);
  const [userCardDetails, setUserCardDetails] = useState(null);
  const [streetValue, setStreetValue] = useState(null);

  const handleChangeAccordian = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const schema = Yup.object().shape({
    start_time: Yup.string()
      .required('Start time is required!')
      .test('Time should be between 9 to 5', (value, { createError }) => {
        if (+value?.split(':')[0] < 9 || +value?.split(':')[0] > 17) {
          return createError({ message: 'Time should be between 9 to 5' });
        }
        if (+value?.split(':')[0] === 17 && +value?.split(':')[1] > 0) {
          return createError({ message: 'Time should be between 9 to 5' });
        }
        return true;
      }),
    start_date: Yup.string().required('Start date is required!'),
    first_name: Yup.string().required('First name is required!'),
    last_name: Yup.string().required('Last name is required!'),
    email: Yup.string().email('Enter proper email address!').required('Email is required!'),
    phone: Yup.string()
      .matches(/^\+[0-9]+$/, 'Must be only digits with (+) !')
      .required('Phone no is required!'),
    street_address: Yup.string().required('Street address is required!'),
    city: Yup.string().required('City is required!'),
    state: Yup.string().required('State is required!'),
    zip_code: Yup.number('Zip Code is required!')
      .min(0, 'invalid Zip Code!')
      .required('Zip Code is required!')
      .nullable(),
    // additional_info: Yup.string().required('Additional information is required!'),
    // customer_notes: Yup.string().required('Customer notes are required!'),
    // how_to_enter_on_premise: Yup.string().required('This field is required!'),
    package_selection: Yup.string().required('Select minimum 1 package!'),
  });

  const formik = useFormik({
    initialValues: {
      start_time: '',
      start_date: '',
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      street_address: '',
      apt_suite: '',
      city: '',
      state: '',
      zip_code: '',
      hear_about_us: '',
      promo_code: '',
      additional_info: '',
      how_to_enter_on_premise: '',
      package_selection: '',
      customer_notes: '',
      latitude: '',
      longitude: '',
    },
    validationSchema: schema,
    onSubmit: (values) => {
      setLoading(true);
      const itemMapData = _.compact(selectedItems).map((item) => {
        return { item_id: item?.id, package: item?.packageData };
      });
      const objToSend = {
        contact_info: {
          first_name: values?.first_name,
          last_name: values?.last_name,
          email: values?.email,
          phone: values?.phone,
          how_to_enter_on_premise: values?.how_to_enter_on_premise,
        },
        service_location: {
          street_address: values?.street_address,
          apt_suite: values?.apt_suite,
          city: values?.city,
          state: values?.state,
          zip_code: values?.zip_code,
          let_long: '',
        },
        extras: _.compact(selectedExtras),
        items: itemMapData,
        booking_type: frequency,
        service_id: bookingData?.id,
        start_time: values?.start_time,
        start_date: values?.start_date,
        additional_info: values?.additional_info,
        customer_notes: values?.customer_notes,
        latitude: values?.latitude,
        longitude: values?.longitude,
      };
      toast.promise(
        axios.post(`${CREATE_CUSTOMER_SIDE_BOOKING}/${bookingData?.id}`, objToSend, {
          headers: { 'Content-Type': 'application/json' },
        }),
        {
          loading: () => {
            return `Creating Booking!`;
          },
          success: (res) => {
            setLoading(false);
            setTimeout(() => {
              navigate(token === null ? '/session/signup' : '/dashboard/default');
            }, 500);

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

  useEffect(async () => {
    await axios
      .get(`${GET_BOOKING_DATA}/${params?.slug}`)
      .then((res) => {
        setBookingData(res?.data?.data);
      })
      .catch((err) => console.log(err));

    await axios
      .get(`${USER_CARD_DETAILS}`)
      .then((res) => {
        setUserCardDetails(res?.data?.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleSelectPackageData = (value, index, packageData) => {
    const dupArr = [...selectedItems];
    dupArr[index] = value;

    if (value !== null) {
      dupArr[index].packageData = packageData?.id;
      setFieldValue('package_selection', value.title);
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
  const btnArray = [
    { value: 'daily', label: 'Onetime' },
    { value: 'weekly', label: 'Weekly - 20% Off' },
    { value: 'biweekly', label: 'Biweekly - 15% Off' },
    { value: 'monthly', label: 'Monthly - 10% Off' },
  ];
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
    if (!!streetValue) {
      setFieldValue('street_address', streetValue?.label);
      getLatLong(streetValue?.label);
    }
  }, [streetValue]);

  const getLatLong = async (args) => {
    await geocodeByAddress(args)
      .then((results) => getLatLng(results[0]))
      .then(({ lat, lng }) => {
        setFieldValue('latitude', lat);
        setFieldValue('longitude', lng);
      });
  };
  return (
    <MainBox>
      <Box className="topHeader">
        <Container maxWidth="lg">
          <Box
            display={'flex'}
            sx={{ height: '40px' }}
            alignItems="center"
            justifyContent={'space-between'}
          >
            <Box></Box>
            <Box display={'flex'} alignItems="center">
              <Box display={'flex'} alignItems="center">
                <PhoneIcon className="bodyTxt" />
                <Typography variant="body1" className="bodyTxt">
                  +12128516134
                </Typography>
              </Box>
              <Box display={'flex'} alignItems="center" sx={{ marginLeft: '1rem' }}>
                <EmailIcon className="bodyTxt" />
                <Typography variant="body1" className="bodyTxt">
                  support@bookcleany.com
                </Typography>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
      <Box className="secondHeader">
        <Container maxWidth="lg">
          <Box display={'flex'} alignItems="center" justifyContent={'space-between'}>
            <Box className="logoContainer">
              <img src={Logo} alt="logo" className="logoImg" />
            </Box>
            <Box display={'flex'} alignItems="center">
              <Button variant="text" className="btn1">
                Book Now
              </Button>
              <Button variant="text" className="btn1">
                Contact Us
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
      <Container maxWidth="lg" className="contentMain">
        <Grid container columnSpacing={4}>
          <Grid item xs={8}>
            <Box
              sx={{
                background: 'white',
                padding: '1rem',
                paddingTop: '2rem',
                width: '100%',
                border: '1px solid #dddada',
              }}
            >
              <Typography variant="h4" className="bookingTitle">
                {bookingData?.title}
              </Typography>
              <img src={CoverImage} alt="cover-image" className="coverImage" />
              <Typography variant="h4" className="bookingTitle">
                Booking in just 60 seconds!
              </Typography>
              <Divider />
              <Box className="tell-us">
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
                          onChange={(e) => handleSelectPackageData(e.target.value, index, data)}
                          name="package_selection"
                          error={Boolean(touched.package_selection && errors.package_selection)}
                          helperText={touched.package_selection && errors.package_selection}
                        >
                          <MenuItem value={null}>None</MenuItem>
                          {data?.item?.length > 0 &&
                            data?.item?.map((item) => (
                              <MenuItem value={item}>
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
                              backgroundColor: selectedExtras[index]?.quantity
                                ? '#d3d9df'
                                : '#f8f9fa',
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

                <Divider sx={{ marginTop: '2rem' }} />
                <Typography variant="h6" className="subHeadings">
                  Choose your frequency
                </Typography>
                <Typography variant="body1">
                  You can always adjust the frequency, reschedule, or postpone cleanings.
                </Typography>

                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    marginTop: '1.5rem',
                    '& button': {
                      borderRadius: ' 15px 0px',
                      padding: '1rem 1.3rem',
                      fontSize: '1rem',
                      '&:hover': {
                        background: '#1976d2',
                        color: 'white',
                      },
                    },
                  }}
                  gap={3}
                >
                  {btnArray.map((data, index) => (
                    <Button
                      size="large"
                      key={index}
                      variant="outlined"
                      onClick={() => setFrequency(data.value)}
                      sx={{
                        background: frequency === data.value ? '#1976d2' : '',
                        color: frequency === data.value ? 'white' : '',
                      }}
                    >
                      {data.label}
                    </Button>
                  ))}
                </Box>
                {frequency !== 'once' && (
                  <>
                    <Box display="flex" alignItems={'center'} justifyContent="space-between">
                      <Typography variant="h6" className="subHeadings">
                        Get more savings
                      </Typography>
                      <Button variant="text" color="inherit" startIcon={<SavedSearchIcon />}>
                        How it works
                      </Button>
                    </Box>

                    <Typography variant="body1">
                      The Cleany Happiness Guarantee applies to all bookings. When you commit to a
                      longer term plan, you will save more.
                    </Typography>
                  </>
                )}

                <Divider sx={{ marginTop: '2rem' }} />
                <FormikProvider value={formik}>
                  <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                    <Typography variant="h6" className="subHeadings">
                      Select a Date and Time
                    </Typography>
                    <Grid container spacing={5}>
                      <Grid item lg={6} md={6} sm={12} xs={12}>
                        <h3 style={{ marginTop: 'unset', marginBottom: '5px' }}>
                          Date<span style={{ color: 'red' }}>*</span>
                        </h3>
                        <TextField
                          size="small"
                          fullWidth
                          type="date"
                          inputProps={{ min: `${moment(new Date()).format('YYYY-MM-DD')}` }}
                          {...getFieldProps('start_date')}
                          error={Boolean(touched.start_date && errors.start_date)}
                          helperText={touched.start_date && errors.start_date}
                        />
                      </Grid>
                      <Grid item lg={6} md={6} sm={12} xs={12}>
                        <h3 style={{ marginTop: 'unset', marginBottom: '5px' }}>
                          Time<span style={{ color: 'red' }}>*</span>
                        </h3>
                        <TextField
                          size="small"
                          fullWidth
                          type="time"
                          {...getFieldProps('start_time')}
                          error={Boolean(touched.start_time && errors.start_time)}
                          helperText={touched.start_time && errors.start_time}
                        />
                      </Grid>
                    </Grid>
                    <Divider sx={{ marginTop: '2rem' }} />
                    <Typography variant="h6" className="subHeadings">
                      Service Address
                    </Typography>
                    <Grid container rowSpacing={2} columnSpacing={5}>
                      <Grid item lg={6} md={6} sm={12} xs={12}>
                        <h3 style={{ marginTop: 'unset', marginBottom: '5px' }}>
                          First Name<span style={{ color: 'red' }}>*</span>
                        </h3>
                        <TextField
                          size="small"
                          fullWidth
                          type="text"
                          inputProps={{ placeholder: 'First name' }}
                          {...getFieldProps('first_name')}
                          error={Boolean(touched.first_name && errors.first_name)}
                          helperText={touched.first_name && errors.first_name}
                        />
                      </Grid>
                      <Grid item lg={6} md={6} sm={12} xs={12}>
                        <h3 style={{ marginTop: 'unset', marginBottom: '5px' }}>
                          Last Name<span style={{ color: 'red' }}>*</span>
                        </h3>
                        <TextField
                          size="small"
                          fullWidth
                          type="text"
                          inputProps={{ placeholder: 'Last name' }}
                          {...getFieldProps('last_name')}
                          error={Boolean(touched.last_name && errors.last_name)}
                          helperText={touched.last_name && errors.last_name}
                        />
                      </Grid>
                      <Grid item lg={6} md={6} sm={12} xs={12}>
                        <h3 style={{ marginTop: 'unset', marginBottom: '5px' }}>
                          Street Address<span style={{ color: 'red' }}>*</span>
                        </h3>
                        <GooglePlacesAutocomplete
                          fetchDetails={true}
                          selectProps={{
                            streetValue,
                            onChange: setStreetValue,
                          }}
                        />
                        <span
                          style={{
                            fontWeight: 400,
                            fontSize: '0.75rem',
                            lineHeight: 1.66,
                            letterSpacing: '0.03333em',
                            textAlign: 'left',
                            marginTop: '4px',
                            marginRight: '14px',
                            marginBottom: '0',
                            marginLeft: '14px',
                            color: '#FF3D57',
                          }}
                        >
                          {Boolean(touched.street_address && errors.street_address)
                            ? touched.street_address && errors.street_address
                            : null}
                        </span>
                      </Grid>
                      <Grid item lg={6} md={6} sm={12} xs={12}>
                        <h3 style={{ marginTop: 'unset', marginBottom: '5px' }}>
                          Apt # (optional)
                        </h3>
                        <TextField
                          size="small"
                          fullWidth
                          type="text"
                          inputProps={{ placeholder: 'Apartment, Studio or Floor' }}
                          {...getFieldProps('apt_suite')}
                          error={Boolean(touched.apt_suite && errors.apt_suite)}
                          helperText={touched.apt_suite && errors.apt_suite}
                        />
                      </Grid>
                      <Grid item lg={6} md={6} sm={12} xs={12}>
                        <h3 style={{ marginTop: 'unset', marginBottom: '5px' }}>
                          City<span style={{ color: 'red' }}>*</span>
                        </h3>
                        <TextField
                          size="small"
                          fullWidth
                          type="text"
                          {...getFieldProps('city')}
                          error={Boolean(touched.city && errors.city)}
                          helperText={touched.city && errors.city}
                        />
                      </Grid>
                      <Grid item lg={6} md={6} sm={12} xs={12}>
                        <h3 style={{ marginTop: 'unset', marginBottom: '5px' }}>
                          State<span style={{ color: 'red' }}>*</span>
                        </h3>
                        <TextField
                          size="small"
                          fullWidth
                          type="text"
                          {...getFieldProps('state')}
                          error={Boolean(touched.state && errors.state)}
                          helperText={touched.state && errors.state}
                        />
                      </Grid>
                      <Grid item lg={6} md={6} sm={12} xs={12}>
                        <h3 style={{ marginTop: 'unset', marginBottom: '5px' }}>
                          Zip Code<span style={{ color: 'red' }}>*</span>
                        </h3>
                        <TextField
                          size="small"
                          fullWidth
                          type="number"
                          {...getFieldProps('zip_code')}
                          error={Boolean(touched.zip_code && errors.zip_code)}
                          helperText={touched.zip_code && errors.zip_code}
                        />
                      </Grid>
                      <Grid item lg={6} md={6} sm={12} xs={12}>
                        <h3 style={{ marginTop: 'unset', marginBottom: '5px' }}>
                          Phone Number<span style={{ color: 'red' }}>*</span>
                        </h3>
                        <TextField
                          size="small"
                          fullWidth
                          type="text"
                          {...getFieldProps('phone')}
                          error={Boolean(touched.phone && errors.phone)}
                          helperText={touched.phone && errors.phone}
                        />
                      </Grid>
                      <Grid item lg={6} md={6} sm={12} xs={12}>
                        <h3 style={{ marginTop: 'unset', marginBottom: '5px' }}>
                          Email<span style={{ color: 'red' }}>*</span>
                        </h3>
                        <TextField
                          size="small"
                          fullWidth
                          type="text"
                          {...getFieldProps('email')}
                          error={Boolean(touched.email && errors.email)}
                          helperText={touched.email && errors.email}
                        />
                      </Grid>
                      <Grid item lg={12} md={12} sm={12} xs={12}>
                        <h3 style={{ marginTop: 'unset', marginBottom: '5px' }}>
                          How did you hear about us? (Optional)
                        </h3>
                        <TextField
                          size="small"
                          fullWidth
                          type="text"
                          {...getFieldProps('hear_about_us')}
                          error={Boolean(touched.hear_about_us && errors.hear_about_us)}
                          helperText={touched.hear_about_us && errors.hear_about_us}
                        />
                      </Grid>
                      <Grid item lg={6} md={6} sm={12} xs={12}>
                        <h3 style={{ marginTop: 'unset', marginBottom: '5px' }}>
                          Promo Code (Optional)
                        </h3>
                        <TextField
                          size="small"
                          fullWidth
                          type="text"
                          {...getFieldProps('promo_code')}
                          error={Boolean(touched.promo_code && errors.promo_code)}
                          helperText={touched.promo_code && errors.promo_code}
                        />
                      </Grid>
                      <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'end' }}>
                        <Button variant="contained">Apply</Button>
                      </Grid>
                    </Grid>
                    <Divider sx={{ marginTop: '2rem' }} />
                    <Typography variant="h6" className="subHeadings">
                      How Will We Get In?
                    </Typography>
                    <Grid container rowSpacing={2} columnSpacing={5}>
                      <Grid item sm={12} xs={12}>
                        <TextField
                          size="small"
                          multiline
                          rows={5}
                          fullWidth
                          type="text"
                          inputProps={{ placeholder: 'How Will We Get In?' }}
                          {...getFieldProps('how_to_enter_on_premise')}
                          error={Boolean(
                            touched.how_to_enter_on_premise && errors.how_to_enter_on_premise
                          )}
                          helperText={
                            touched.how_to_enter_on_premise && errors.how_to_enter_on_premise
                          }
                        />
                      </Grid>
                    </Grid>
                    <Divider sx={{ marginTop: '2rem' }} />
                    <Typography
                      variant="h6"
                      className="subHeadings"
                      style={{ paddingBottom: '0px' }}
                    >
                      Are there any addtional details we need to know?
                    </Typography>
                    <Typography variant="body1" style={{ paddingBottom: '1rem' }}>
                      You can email us at info@cleany.com with photos, floorplan or anyother
                      relevent informations
                    </Typography>
                    <Grid container rowSpacing={2} columnSpacing={5}>
                      <Grid item sm={12} xs={12}>
                        <h3 style={{ marginTop: 'unset', marginBottom: '5px' }}>
                          Additional Information<span style={{ color: 'red' }}>*</span>
                        </h3>
                        <TextField
                          size="small"
                          multiline
                          rows={5}
                          fullWidth
                          type="text"
                          inputProps={{ placeholder: 'Additional information...' }}
                          {...getFieldProps('additional_info')}
                          error={Boolean(touched.additional_info && errors.additional_info)}
                          helperText={touched.additional_info && errors.additional_info}
                        />
                      </Grid>
                    </Grid>
                    <Divider sx={{ marginTop: '2rem' }} />

                    <Grid container rowSpacing={2} columnSpacing={5}>
                      <Grid item sm={12} xs={12}>
                        <h3 style={{ marginTop: '1rem', marginBottom: '5px' }}>
                          Customer Notes<span style={{ color: 'red' }}>*</span>
                        </h3>
                        <TextField
                          size="small"
                          multiline
                          rows={5}
                          fullWidth
                          type="text"
                          inputProps={{ placeholder: 'Customer notes...' }}
                          {...getFieldProps('customer_notes')}
                          error={Boolean(touched.customer_notes && errors.customer_notes)}
                          helperText={touched.customer_notes && errors.customer_notes}
                        />
                      </Grid>
                    </Grid>
                    <Divider sx={{ marginTop: '2rem' }} />
                    <Typography variant="h6" className="subHeadings">
                      Payment Details
                    </Typography>
                    <Typography variant="body1" style={{ paddingBottom: '1rem' }}>
                      First apply card then click on book now!
                    </Typography>
                    <Box
                      sx={{
                        width: '100%',
                        '& h4': {
                          margin: 'unset',
                        },
                        '& p': {
                          margin: 'unset',
                        },
                      }}
                    >
                      <Grid container rowGap={2}>
                        <Grid item xs={6}>
                          <h4>Card name</h4>
                          <p>{userCardDetails?.brand}</p>
                        </Grid>
                        <Grid item xs={6}>
                          <h4>Card no</h4>
                          <p>**** **** **** {userCardDetails?.card}</p>
                        </Grid>
                        <Grid item xs={6}>
                          <h4>Expiry month</h4>
                          <p>{userCardDetails?.exp_month}</p>
                        </Grid>
                        <Grid item xs={6}>
                          <h4>Expiry year</h4>
                          <p>{userCardDetails?.exp_year}</p>
                        </Grid>
                      </Grid>
                    </Box>

                    <LoadingButton
                      type="submit"
                      size="large"
                      color="primary"
                      loading={loading}
                      variant="contained"
                      sx={{ mb: 2, mt: 3 }}
                      fullWidth
                      onClick={() => {
                        if (Object.keys(errors).length > 0) {
                          toast.error('There are some fields missing. Please fill data properly!');
                        }
                      }}
                    >
                      Book Now
                    </LoadingButton>
                  </Form>
                </FormikProvider>
              </Box>
            </Box>
            <Box
              sx={{
                background: 'white',
                padding: '1rem',
                paddingTop: '2rem',
                width: '100%',
                border: '1px solid #dddada',
                marginTop: '4rem',
                marginBottom: '4rem',
                '& h4': {
                  textAlign: 'start !important',
                  paddingBottom: '2rem !important',
                },
              }}
            >
              <Typography variant="h4" className="bookingTitle">
                Here’s why Cleany is different
              </Typography>
              <Accordion
                expanded={expanded === 'panel1'}
                onChange={handleChangeAccordian('panel1')}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography sx={{ fontSize: '16px' }}>
                    Instant online booking with 7am-11pm availability
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography sx={{ fontSize: '16px' }}>
                    Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry
                    richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor
                    brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor,
                    sunt aliqua put a bird on it squid single-origin coffee nulla assumenda
                    shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson
                    cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo.
                    Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt
                    you probably haven't heard of them accusamus labore sustainable VHS.
                  </Typography>
                </AccordionDetails>
              </Accordion>
              <Accordion
                expanded={expanded === 'panel2'}
                onChange={handleChangeAccordian('panel2')}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography sx={{ fontSize: '16px' }}>Friendly, vetted professionals</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography sx={{ fontSize: '16px' }}>
                    Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry
                    richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor
                    brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor,
                    sunt aliqua put a bird on it squid single-origin coffee nulla assumenda
                    shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson
                    cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo.
                    Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt
                    you probably haven't heard of them accusamus labore sustainable VHS.
                  </Typography>
                </AccordionDetails>
              </Accordion>
              <Accordion
                expanded={expanded === 'panel3'}
                onChange={handleChangeAccordian('panel3')}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography sx={{ fontSize: '16px' }}>Cleaned the way you want</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography sx={{ fontSize: '16px' }}>
                    Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry
                    richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor
                    brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor,
                    sunt aliqua put a bird on it squid single-origin coffee nulla assumenda
                    shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson
                    cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo.
                    Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt
                    you probably haven't heard of them accusamus labore sustainable VHS.
                  </Typography>
                </AccordionDetails>
              </Accordion>
              <Accordion
                expanded={expanded === 'panel4'}
                onChange={handleChangeAccordian('panel4')}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography sx={{ fontSize: '16px' }}>Same cleaner every time</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography sx={{ fontSize: '16px' }}>
                    Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry
                    richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor
                    brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor,
                    sunt aliqua put a bird on it squid single-origin coffee nulla assumenda
                    shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson
                    cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo.
                    Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt
                    you probably haven't heard of them accusamus labore sustainable VHS.
                  </Typography>
                </AccordionDetails>
              </Accordion>
              <Accordion
                expanded={expanded === 'panel5'}
                onChange={handleChangeAccordian('panel5')}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography sx={{ fontSize: '16px' }}>Flexible scheduling</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography sx={{ fontSize: '16px' }}>
                    Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry
                    richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor
                    brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor,
                    sunt aliqua put a bird on it squid single-origin coffee nulla assumenda
                    shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson
                    cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo.
                    Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt
                    you probably haven't heard of them accusamus labore sustainable VHS.
                  </Typography>
                </AccordionDetails>
              </Accordion>
              <Accordion
                expanded={expanded === 'panel6'}
                onChange={handleChangeAccordian('panel6')}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography sx={{ fontSize: '16px' }}>Easy and secure online payments</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography sx={{ fontSize: '16px' }}>
                    Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry
                    richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor
                    brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor,
                    sunt aliqua put a bird on it squid single-origin coffee nulla assumenda
                    shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson
                    cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo.
                    Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt
                    you probably haven't heard of them accusamus labore sustainable VHS.
                  </Typography>
                </AccordionDetails>
              </Accordion>
              <Accordion
                expanded={expanded === 'panel7'}
                onChange={handleChangeAccordian('panel7')}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography sx={{ fontSize: '16px' }}>
                    See the progress of your cleaning from your phone
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography sx={{ fontSize: '16px' }}>
                    Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry
                    richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor
                    brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor,
                    sunt aliqua put a bird on it squid single-origin coffee nulla assumenda
                    shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson
                    cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo.
                    Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt
                    you probably haven't heard of them accusamus labore sustainable VHS.
                  </Typography>
                </AccordionDetails>
              </Accordion>
              <Accordion
                expanded={expanded === 'panel8'}
                onChange={handleChangeAccordian('panel8')}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography sx={{ fontSize: '16px' }}>The Cleany Happiness Guarantee</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography sx={{ fontSize: '16px' }}>
                    Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry
                    richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor
                    brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor,
                    sunt aliqua put a bird on it squid single-origin coffee nulla assumenda
                    shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson
                    cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo.
                    Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt
                    you probably haven't heard of them accusamus labore sustainable VHS.
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box sx={{ position: 'sticky', top: '8rem' }}>
              <Box
                sx={{
                  width: '100%',
                  background: 'white',
                  padding: '1rem',
                  paddingTop: '1rem',
                  paddingBottom: '1rem',
                  border: '1px solid #dddada',
                }}
              >
                <Typography
                  variant="h6"
                  style={{ paddingBottom: '0.2rem' }}
                  className="subHeadings"
                >
                  {frequency === 'once' && 'One Time Cleaning Plan'}
                  {frequency === 'weekly' && 'Weekly Cleaning Plan'}
                  {frequency === 'biweekly' && 'Biweekly Cleaning Plan'}
                  {frequency === 'monthly' && 'Daily Cleaning Plan'}
                </Typography>
                {frequency !== 'once' && (
                  <Typography variant="body1" style={{ fontSize: '1rem' }}>
                    6 Months
                  </Typography>
                )}
                <Divider sx={{ marginTop: '1rem', marginBottom: '1rem' }} />
                <Box
                  display={'flex'}
                  alignItems="center"
                  justifyContent={'space-between'}
                  paddingBottom="1rem"
                >
                  <Typography variant="body1" style={{ fontSize: '1rem' }}>
                    Per cleaning
                  </Typography>
                  <Typography variant="body1" style={{ fontSize: '1rem' }}>
                    $
                    {_.compact(selectedItems)
                      .map((item) => {
                        return parseFloat(item?.price).toFixed(2);
                      })
                      .reduce((accumulator, value) => {
                        return +accumulator + +value;
                      }, 0)}
                  </Typography>
                </Box>
                <Box
                  display={'flex'}
                  alignItems="center"
                  justifyContent={'space-between'}
                  paddingBottom="1rem"
                >
                  <Typography variant="body1" style={{ fontSize: '1rem' }}>
                    Discounts
                  </Typography>
                  <Typography variant="body1" style={{ fontSize: '1rem' }}>
                    $
                    {_.compact(selectedItems)
                      .map((item) => {
                        const percent = (item?.discount_percent * +item?.price) / 100;
                        return percent;
                      })
                      .reduce((accumulator, value) => {
                        return +accumulator + +value;
                      }, 0)}
                  </Typography>
                </Box>
                <Box
                  display={'flex'}
                  alignItems="center"
                  justifyContent={'space-between'}
                  paddingBottom="1rem"
                >
                  <Typography variant="body1" style={{ fontSize: '1rem' }}>
                    Extras
                  </Typography>
                  <Typography variant="body1" style={{ fontSize: '1rem' }}>
                    $
                    {_.compact(selectedExtras)
                      .map((item) => {
                        const price = parseFloat(item?.price) * item?.quantity;
                        return price.toFixed(2);
                      })
                      .reduce((accumulator, value) => {
                        return +accumulator + +value;
                      }, 0)}
                  </Typography>
                </Box>
                <Box
                  display={'flex'}
                  alignItems="center"
                  justifyContent={'space-between'}
                  paddingBottom="1rem"
                >
                  <Typography variant="body1" style={{ fontSize: '1rem' }}>
                    Estimated Tax
                  </Typography>
                  <Typography variant="body1" style={{ fontSize: '1rem' }}>
                    ${bookingData?.tax?.[0]?.tax_rate}
                  </Typography>
                </Box>
                <Divider sx={{ marginTop: '1rem', marginBottom: '1rem' }} />
                <Box display={'flex'} alignItems="center" justifyContent={'space-between'}>
                  <Typography variant="h6" className="subHeadings" style={{ paddingTop: 'unset' }}>
                    TODAY'S TOTAL
                  </Typography>
                  <Typography variant="body1" style={{ fontSize: '1rem' }}>
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
                      _.compact(selectedItems)
                        .map((item) => {
                          return parseFloat(item?.price).toFixed(2);
                        })
                        .reduce((accumulator, value) => {
                          return +accumulator + +value;
                        }, 0) -
                      _.compact(selectedItems)
                        .map((item) => {
                          const percent = (item?.discount_percent * +item?.price) / 100;
                          return percent;
                        })
                        .reduce((accumulator, value) => {
                          return +accumulator + +value;
                        }, 0)}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
      <Toaster position="top-right" />
    </MainBox>
  );
}

export default CustomerBooking;
