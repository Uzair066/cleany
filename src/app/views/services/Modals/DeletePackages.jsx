import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import toast, { Toaster } from 'react-hot-toast';
import { LoadingButton } from '@mui/lab';
import { Box } from '@mui/system';
import axios from '../../../../axios';
import { DELETE_PACKAGE } from 'app/api';

function DeletePackage({ open, handleClose, id, retrieveService }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = () => {
    setLoading(true);
    toast.promise(
      axios.delete(`${DELETE_PACKAGE}/${id}`, {
        headers: { 'Content-Type': 'application/json' },
      }),
      {
        loading: () => {
          return `Deleting Package`;
        },
        success: (res) => {
          setLoading(false);
          retrieveService();
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
  };
  return (
    <Dialog
      open={open}
      onClose={() => {
        handleClose();
      }}
      maxWidth={'md'}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title" style={{ fontSize: '1.5rem' }}>
        Delete Package
      </DialogTitle>
      <DialogContent>
        Are you sure you want to delete this package with it's related items?
        <Box display={'flex'} alignItems="center" justifyContent={'end'} sx={{ mb: 2, mt: 3 }}>
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
          <LoadingButton onClick={handleDelete} color="error" loading={loading} variant="contained">
            Yes, delete this Package
          </LoadingButton>
        </Box>
      </DialogContent>
      <Toaster position="top-right" />
    </Dialog>
  );
}

export default DeletePackage;
