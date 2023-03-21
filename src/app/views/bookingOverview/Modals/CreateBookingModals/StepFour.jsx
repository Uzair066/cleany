import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import toast, { Toaster } from 'react-hot-toast';
import { Box } from '@mui/system';
import CloseIcon from '@mui/icons-material/Close';
import BookOutlinedIcon from '@mui/icons-material/BookOutlined';
import { DialogActions, Switch, Typography } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function StepFour({
  open,
  handleClose,
  setFormData,
  formData,
  handleReset,
  setStepThree,
  setStepFive,
}) {
  const [validated, setValidated] = useState(true);

  const handleNext = () => {
    setStepFive(true);
    handleClose();
    if (validateVendorForm()) {
    }
  };

  const handleToggleChange = (value, index) => {
    const dupObj = { ...formData };
    dupObj.switch_component[index].value = value;
    setFormData(dupObj);
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
                <span>Step 4 of 6</span> Customer Information
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
              paddingBottom: '5px',
            },
          }}
        >
          {formData?.switch_component?.map((item, index) => (
            <Box display="flex" alignItems={'center'} justifyContent="space-between">
              <p>{item?.title}</p>
              <Switch
                checked={item?.value}
                onChange={(event) => handleToggleChange(event.target.checked, index)}
                inputProps={{ 'aria-label': 'controlled' }}
              />
            </Box>
          ))}
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
                setStepThree(true);
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
        <Toaster position="top-right" />
      </Dialog>
    </>
  );
}

export default StepFour;
