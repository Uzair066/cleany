import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import toast, { Toaster } from 'react-hot-toast';
import { LoadingButton } from '@mui/lab';
import { Box } from '@mui/system';
import axios from '../../../../../axios';
import { DELETE_TASK } from 'app/api';

function DeleteTasks({ open, handleClose, selectedTasks, getManagerTaskList }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = () => {
    setLoading(true);
    toast.promise(
      axios.delete(`${DELETE_TASK}/${selectedTasks?.id}`, {
        headers: { 'Content-Type': 'application/json' },
      }),
      {
        loading: () => {
          return `Deleting Task`;
        },
        success: (res) => {
          setLoading(false);
          getManagerTaskList();
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
      sx={{ '& .MuiPaper-elevation': { width: '525px !important' } }}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title" style={{ fontSize: '1.5rem' }}>
        Delete Task
      </DialogTitle>
      <DialogContent>
        Are you sure you want to delete this task?
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
            Yes, delete this Task
          </LoadingButton>
        </Box>
      </DialogContent>
      <Toaster position="top-right" />
    </Dialog>
  );
}

export default DeleteTasks;
