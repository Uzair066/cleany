import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import toast, { Toaster } from 'react-hot-toast';
import { LoadingButton } from '@mui/lab';
import { Box } from '@mui/system';
import axios from '../../../../axios';
import { Divider, Grid, TextField } from '@mui/material';
import { CREATE_ITEM, DELETE_ITEM, UPDATE_ITEM } from 'app/api';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';

function UpdatePackageItem({
  open,
  handleClose,
  packageData,
  retrieveService,
  selectedPackageData,
}) {
  const initialState = {
    items: [
      {
        title: '',
        time_hrs: '',
        price: '',
        discount_percent: '',
        package: '',
      },
    ],
  };
  const [formData, setFormData] = useState(initialState);
  const [validated, setValidated] = useState([true]);
  const [readOnly, setReadOnly] = useState([false]);

  useEffect(() => {
    let arr = [];
    let validateArr = [];
    let readOnlyArr = [];
    if (Object.keys(selectedPackageData).length > 0) {
      if (selectedPackageData?.item?.length > 0) {
        selectedPackageData?.item?.forEach((item) => {
          arr.push({
            created_at: item?.created_at,
            discount_percent: item?.discount_percent.toString(),
            id: item?.id,
            price: item?.price,
            time_hrs: item?.time_hrs,
            title: item?.title,
            updated_at: item?.updated_at,
          });
          validateArr.push(true);
          readOnlyArr.push(true);
        });
        setValidated(validateArr);
        setReadOnly(readOnlyArr);
        setFormData({ items: arr });
      } else {
        setValidated([true]);
        setReadOnly([false]);
        setFormData({
          items: [
            {
              title: '',
              time_hrs: '',
              price: '',
              discount_percent: '',
              package: packageData?.id,
            },
          ],
        });
      }
    }
  }, [packageData, open]);

  const handleFormData = (field, value, index) => {
    const dupFormData = { ...formData };
    dupFormData.items[index][`${field}`] = value;
    setFormData(dupFormData);
  };
  const saveItem = (index, item) => {
    const dupObj = { ...formData };
    if (validateVendorForm(index)) {
      const dupReadOnly = [...readOnly];
      if (item?.id) {
        toast.promise(
          axios.put(`${UPDATE_ITEM}`, item, {
            headers: { 'Content-Type': 'application/json' },
          }),
          {
            loading: () => {
              return `Updating Item!`;
            },
            success: (res) => {
              dupObj.items[index] = res?.data?.data;
              dupReadOnly[index] = true;
              setFormData(dupObj);
              setReadOnly(dupReadOnly);
              return res?.data?.message;
            },
            error: (err) => {
              return err?.message;
            },
          }
        );
      } else {
        toast.promise(
          axios.post(`${CREATE_ITEM}`, item, {
            headers: { 'Content-Type': 'application/json' },
          }),
          {
            loading: () => {
              return `Creating Item!`;
            },
            success: (res) => {
              dupObj.items[index] = res?.data?.data;
              dupReadOnly[index] = true;
              setFormData(dupObj);
              setReadOnly(dupReadOnly);
              return res?.data?.message;
            },
            error: (err) => {
              return err?.message;
            },
          }
        );
      }
    }
  };
  const validateVendorForm = (index) => {
    if (
      formData.items[index].title == '' ||
      formData.items[index].time_hrs == '' ||
      formData.items[index].time_hrs.includes('-') ||
      formData.items[index].price == '' ||
      formData.items[index].price.includes('-') ||
      formData.items[index].discount_percent == '' ||
      formData.items[index].discount_percent.includes('-')
    ) {
      const dupValidate = [...validated];
      dupValidate[index] = false;
      setValidated(dupValidate);
      return false;
    }
    const dupValidate = [...validated];
    dupValidate[index] = true;
    setValidated(dupValidate);
    return true;
  };

  const addMoreItems = () => {
    const dupObj = { ...formData };
    const dupValidate = [...validated];
    const dupReadOnly = [...readOnly];
    dupObj.items.push({
      title: '',
      time_hrs: '',
      price: '',
      discount_percent: '',
      package: packageData?.id,
    });
    dupValidate.push(true);
    dupReadOnly.push(false);
    setFormData(dupObj);
    setValidated(dupValidate);
    setReadOnly(dupReadOnly);
  };
  const deleteItems = (index, item) => {
    const dupObj = { ...formData };
    const dupValidate = [...validated];
    const dupReadOnly = [...readOnly];
    if (item?.id) {
      toast.promise(
        axios.delete(`${DELETE_ITEM}/${item?.id}`, {
          headers: { 'Content-Type': 'application/json' },
        }),
        {
          loading: () => {
            return `Deleting Item!`;
          },
          success: (res) => {
            dupObj.items.splice(index, 1);
            dupValidate.splice(index, 1);
            dupReadOnly.splice(index, 1);
            setFormData(dupObj);
            setValidated(dupValidate);
            setReadOnly(dupReadOnly);
            return res?.data?.message;
          },
          error: (err) => {
            return err?.message;
          },
        }
      );
    } else {
      dupObj.items.splice(index, 1);
      dupValidate.splice(index, 1);
      dupReadOnly.splice(index, 1);
      setFormData(dupObj);
      setValidated(dupValidate);
      setReadOnly(dupReadOnly);
    }
  };
  const readOnlyOff = (index) => {
    const dupReadOnly = [...readOnly];
    dupReadOnly[index] = false;
    setReadOnly(dupReadOnly);
  };
  return (
    <Dialog
      open={open}
      maxWidth={'md'}
      PaperProps={{
        sx: {
          width: '100%',
        },
      }}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title" style={{ fontSize: '1.5rem' }}>
        {packageData?.title} {'>> Items'}
      </DialogTitle>
      <DialogContent>
        {formData?.items?.map((item, index) => {
          return (
            <>
              <Grid key={index} container sx={{ paddingTop: '10px' }}>
                <Grid item xs={10}>
                  <Grid key={index} container spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        inputProps={{ readOnly: readOnly[index] }}
                        size="small"
                        fullWidth
                        name="title"
                        value={formData.items[index].title}
                        onChange={(e) => handleFormData(e.target.name, e.target.value, index)}
                        type="text"
                        label="Title"
                        error={!validated[index] && formData.items[index].title == ''}
                        helperText={
                          !validated[index] &&
                          formData.items[index].title == '' &&
                          'Title is required!'
                        }
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        size="small"
                        fullWidth
                        name="price"
                        type="number"
                        value={formData.items[index].price}
                        onChange={(e) => handleFormData(e.target.name, e.target.value, index)}
                        inputProps={{ min: 0, readOnly: readOnly[index] }}
                        label="Cost"
                        error={
                          !validated[index] &&
                          (formData.items[index].price == '' ||
                            formData.items[index].price.includes('-'))
                        }
                        helperText={
                          !validated[index] && formData.items[index].price === ''
                            ? 'Price is required!'
                            : !validated[index] && formData.items[index].price.includes('-')
                            ? 'Price cannot be negative!'
                            : ''
                        }
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        size="small"
                        fullWidth
                        name="time_hrs"
                        value={formData.items[index].time_hrs}
                        inputProps={{ min: 0, readOnly: readOnly[index] }}
                        type="number"
                        label="Hours"
                        error={
                          !validated[index] &&
                          (formData.items[index].time_hrs == '' ||
                            formData.items[index].time_hrs.includes('-'))
                        }
                        onChange={(e) => handleFormData(e.target.name, e.target.value, index)}
                        helperText={
                          !validated[index] && formData.items[index].time_hrs == ''
                            ? 'Hours are required!'
                            : !validated[index] && formData.items[index].time_hrs.includes('-')
                            ? 'Hours cannot be negative!'
                            : ''
                        }
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        size="small"
                        fullWidth
                        name="discount_percent"
                        value={formData.items[index].discount_percent}
                        inputProps={{ min: 0, readOnly: readOnly[index] }}
                        type="number"
                        label="Discount %"
                        error={
                          !validated[index] &&
                          (formData.items[index].discount_percent == '' ||
                            formData.items[index].discount_percent.includes('-'))
                        }
                        onChange={(e) => handleFormData(e.target.name, e.target.value, index)}
                        helperText={
                          !validated[index] && formData.items[index].discount_percent == ''
                            ? 'Discount % required!'
                            : !validated[index] &&
                              formData.items[index].discount_percent.includes('-')
                            ? 'Discount % cannot be negative!'
                            : ''
                        }
                      />
                    </Grid>
                  </Grid>
                </Grid>

                <Grid
                  item
                  xs={2}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    '& button': {
                      minWidth: 'unset !important',
                      padding: '6px !important',
                    },
                  }}
                >
                  {readOnly[index] ? (
                    <Button
                      variant="outlined"
                      style={{ marginRight: '10px' }}
                      onClick={() => readOnlyOff(index)}
                      color="primary"
                    >
                      <BorderColorOutlinedIcon />
                    </Button>
                  ) : (
                    <Button
                      variant="outlined"
                      style={{ marginRight: '10px' }}
                      onClick={() => saveItem(index, item)}
                      color="primary"
                    >
                      <SaveOutlinedIcon />
                    </Button>
                  )}

                  {formData.items.length > 1 && (
                    <Button
                      variant="outlined"
                      onClick={() => deleteItems(index, item)}
                      color="error"
                    >
                      <DeleteOutlineOutlinedIcon />
                    </Button>
                  )}
                </Grid>
              </Grid>

              {index === formData.items.length - 1 ? null : (
                <Divider sx={{ mt: 2.5, mb: 1, mx: 'auto' }} />
              )}
            </>
          );
        })}

        <Box
          display={'flex'}
          alignItems="center"
          justifyContent={'space-between'}
          sx={{ mb: 2, mt: 3 }}
        >
          <Button variant="text" color="primary" onClick={addMoreItems}>
            Add more item
          </Button>
          <Box>
            <Button
              onClick={() => {
                handleClose();
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
              loading={false}
              variant="contained"
              onClick={() => {
                retrieveService();
                setTimeout(() => {
                  handleClose();
                }, 200);
              }}
            >
              Save & Close
            </LoadingButton>
          </Box>
        </Box>
      </DialogContent>
      <Toaster position="top-right" />
    </Dialog>
  );
}

export default UpdatePackageItem;
