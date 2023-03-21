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
import RemoveIcon from '@mui/icons-material/Remove';
import InputAdornment from '@mui/material/InputAdornment';

function StepFive({
  open,
  handleClose,
  setFormData,
  formData,
  handleReset,
  setStepFive,
  setStepSix,
  setStepFour,
}) {
  const [validated, setValidated] = useState(true);

  const handleNext = () => {
    setStepSix(true);
    handleClose();
    if (validateVendorForm()) {
    }
  };

  var validEmailRegex =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const validateVendorForm = () => {
    if (formData.email == '' || formData.email.match(validEmailRegex) == null) {
      setValidated(false);
      return false;
    }
    setValidated(true);
    return true;
  };

  const handleAddOption = () => {
    const dupObj = { ...formData };
    dupObj.custom_options.push({ title: '', cost: '', time: '' });
    setFormData(dupObj);
  };
  const handleOptionChange = (key, value, index) => {
    const dupObj = { ...formData };
    dupObj.custom_options[index][key] = value;
    setFormData(dupObj);
  };
  const removeOption = (index) => {
    const dupObj = { ...formData };
    dupObj.custom_options.splice(index, 1);
    setFormData(dupObj);
  };
  const handleAddDiscount = () => {
    const dupObj = { ...formData };
    dupObj.custom_discount.push({ title: '', cost: '', time: '' });
    setFormData(dupObj);
  };
  const handleDiscountChange = (key, value, index) => {
    const dupObj = { ...formData };
    dupObj.custom_discount[index][key] = value;
    setFormData(dupObj);
  };
  const removeDiscount = (index) => {
    const dupObj = { ...formData };
    dupObj.custom_discount.splice(index, 1);
    setFormData(dupObj);
  };
  const handleAddExtra = () => {
    const dupObj = { ...formData };
    dupObj.custom_extras.push({ title: '', cost: '', time: '' });
    setFormData(dupObj);
  };
  const handleExtraChange = (key, value, index) => {
    const dupObj = { ...formData };
    dupObj.custom_extras[index][key] = value;
    setFormData(dupObj);
  };
  const removeExtra = (index) => {
    const dupObj = { ...formData };
    dupObj.custom_extras.splice(index, 1);
    setFormData(dupObj);
  };
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
                <span>Step 5 of 6</span> Custom Detials
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
            '& p': {
              margin: 'unset',
            },
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={5}>
              <p>Custom Options</p>
            </Grid>
            <Grid item xs={3}>
              <p>Cost</p>
            </Grid>
            <Grid item xs={3}>
              <p>Time</p>
            </Grid>
            <Grid item xs={1}></Grid>
            {!!formData.custom_options.length &&
              formData?.custom_options?.map((item, index) => (
                <>
                  <Grid item xs={5}>
                    <TextField
                      size="small"
                      fullWidth
                      type="text"
                      inputProps={{ placeholder: 'New Booking Option' }}
                      value={item?.title}
                      name="option"
                      onChange={(e) => handleOptionChange('title', e.target.value, index)}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      size="small"
                      fullWidth
                      type="text"
                      inputProps={{ placeholder: '0' }}
                      value={item?.cost}
                      name="option"
                      InputProps={{
                        endAdornment: <InputAdornment position="end">$</InputAdornment>,
                      }}
                      onChange={(e) => handleOptionChange('cost', e.target.value, index)}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      size="small"
                      fullWidth
                      type="number"
                      inputProps={{ placeholder: '1' }}
                      value={item?.time}
                      name="option"
                      InputProps={{
                        endAdornment: <InputAdornment position="end">(hrs)</InputAdornment>,
                      }}
                      onChange={(e) => handleOptionChange('time', e.target.value, index)}
                    />
                  </Grid>
                  <Grid item xs={1}>
                    <Button
                      fullWidth
                      sx={{
                        paddingLeft: '0px !important',
                        paddingRight: '0px !important',
                        minWidth: 'unset !important',
                      }}
                      variant="outlined"
                      color="inherit"
                      onClick={() => removeOption(index)}
                    >
                      <RemoveIcon />
                    </Button>
                  </Grid>
                </>
              ))}
          </Grid>
          <Button
            variant="contained"
            fullWidth
            onClick={handleAddOption}
            sx={{ marginTop: '0.5rem' }}
          >
            Add custom booking option $<sup style={{ marginTop: '-10px' }}>+</sup>
          </Button>
          <Grid container spacing={2} sx={{ marginTop: '1rem' }}>
            <Grid item xs={5}>
              <p>Custom Discount</p>
            </Grid>
            <Grid item xs={3}>
              <p>Cost</p>
            </Grid>
            <Grid item xs={3}>
              <p>Time</p>
            </Grid>
            <Grid item xs={1}></Grid>
            {!!formData.custom_discount.length &&
              formData.custom_discount.map((item, index) => (
                <>
                  <Grid item xs={5}>
                    <TextField
                      size="small"
                      fullWidth
                      type="text"
                      inputProps={{ placeholder: 'Custom Discount' }}
                      value={item?.title}
                      name="option"
                      onChange={(e) => handleDiscountChange('title', e.target.value, index)}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      size="small"
                      fullWidth
                      type="text"
                      inputProps={{ placeholder: '0' }}
                      value={item?.cost}
                      name="option"
                      InputProps={{
                        endAdornment: <InputAdornment position="end">$</InputAdornment>,
                      }}
                      onChange={(e) => handleDiscountChange('cost', e.target.value, index)}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      size="small"
                      fullWidth
                      type="number"
                      inputProps={{ placeholder: '1' }}
                      value={item?.time}
                      name="option"
                      InputProps={{
                        endAdornment: <InputAdornment position="end">(hrs)</InputAdornment>,
                      }}
                      onChange={(e) => handleDiscountChange('time', e.target.value, index)}
                    />
                  </Grid>
                  <Grid item xs={1}>
                    <Button
                      fullWidth
                      sx={{
                        paddingLeft: '0px !important',
                        paddingRight: '0px !important',
                        minWidth: 'unset !important',
                      }}
                      variant="outlined"
                      color="inherit"
                      onClick={() => removeDiscount(index)}
                    >
                      <RemoveIcon />
                    </Button>
                  </Grid>
                </>
              ))}
          </Grid>
          <Button
            variant="contained"
            fullWidth
            onClick={handleAddDiscount}
            sx={{ marginTop: '0.5rem' }}
          >
            Add custom discount $<sup style={{ marginTop: '-10px' }}>+</sup>
          </Button>
          <Grid container spacing={2} sx={{ marginTop: '1rem' }}>
            <Grid item xs={5}>
              <p>Custom Extras</p>
            </Grid>
            <Grid item xs={3}>
              <p>Cost</p>
            </Grid>
            <Grid item xs={3}>
              <p>Time</p>
            </Grid>
            <Grid item xs={1}></Grid>
            {!!formData.custom_extras.length &&
              formData.custom_extras.map((item, index) => (
                <>
                  <Grid item xs={5}>
                    <TextField
                      size="small"
                      fullWidth
                      type="text"
                      inputProps={{ placeholder: 'Custom Extra' }}
                      value={item?.title}
                      name="option"
                      onChange={(e) => handleExtraChange('title', e.target.value, index)}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      size="small"
                      fullWidth
                      type="text"
                      inputProps={{ placeholder: '0' }}
                      value={item?.cost}
                      name="option"
                      InputProps={{
                        endAdornment: <InputAdornment position="end">$</InputAdornment>,
                      }}
                      onChange={(e) => handleExtraChange('cost', e.target.value, index)}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      size="small"
                      fullWidth
                      type="number"
                      inputProps={{ placeholder: '1' }}
                      value={item?.time}
                      name="option"
                      InputProps={{
                        endAdornment: <InputAdornment position="end">(hrs)</InputAdornment>,
                      }}
                      onChange={(e) => handleExtraChange('time', e.target.value, index)}
                    />
                  </Grid>
                  <Grid item xs={1}>
                    <Button
                      fullWidth
                      sx={{
                        paddingLeft: '0px !important',
                        paddingRight: '0px !important',
                        minWidth: 'unset !important',
                      }}
                      variant="outlined"
                      color="inherit"
                      onClick={() => removeExtra(index)}
                    >
                      <RemoveIcon />
                    </Button>
                  </Grid>
                </>
              ))}
          </Grid>
          <Button
            variant="contained"
            fullWidth
            onClick={handleAddExtra}
            sx={{ marginTop: '0.5rem' }}
          >
            Add custom extra $<sup style={{ marginTop: '-10px' }}>+</sup>
          </Button>
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
            <Button
              variant="contained"
              color="primary"
              startIcon={<ArrowBackIcon />}
              onClick={() => {
                setStepFour(true);
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
              onClick={() => handleNext()}
            >
              Next
            </Button>
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
                  <p>$279.0</p>
                  <p>$0.00</p>
                  <p>$0.00</p>
                  <p>$19.53</p>
                  <p>$298.53</p>
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

export default StepFive;
