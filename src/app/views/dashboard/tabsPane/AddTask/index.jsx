import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Stack,
  Typography,
  MenuItem,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import {
  GET_PROVIDER_LIST_TASK,
  CREATE_PROVIDER_LIST_TASK,
  MANAGER_LIST,
  GET_MANAGER_TASK_LIST,
} from 'app/api';
import axios from '../../../../../axios';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import toast, { Toaster } from 'react-hot-toast';
import { LoadingButton } from '@mui/lab';
import { styled } from '@mui/material';
import moment from 'moment';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import UpdateStatus from './UpdateStatus';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import DeleteTasks from './deleteTasks';

const TaskHeading = styled('h3')(({ theme }) => ({
  marginTop: 'unset',
  paddingBottom: '10px',
  typography: 'body1',
  color: 'black',
  borderBottom: '1px solid',
  borderBottomColor: theme.palette.text.secondary,
  textAlign: 'center',
  fontWeight: '900 !important',
  fontSize: '24px !important',
}));

const AddTask = () => {
  const [open, setOpen] = React.useState(false);
  const [data, setData] = React.useState([]);
  const [tasks, setTasks] = React.useState('');
  const [date, setDate] = React.useState(new Date());
  const [managerList, setManagerList] = useState([]);
  const [selectedManager, setSelectedManager] = useState(null);
  const [selectedTasks, setSelectedTasks] = useState(null);
  const [updateStatusModal, setUpdateStatusModal] = useState(false);
  const { role } = JSON.parse(localStorage.getItem('user'));
  const [deleteSelectedTask, setDeleteSelectedTask] = useState(false);

  React.useEffect(() => {
    if (role === 'Manager') {
      getManagerTaskList();
    } else {
      getEventList();
    }
  }, []);
  const getEventList = async () => {
    await axios
      .get(`${GET_PROVIDER_LIST_TASK}`)
      .then((res) => {
        const dataToMap = res?.data?.data;
        setData(dataToMap);
      })
      .catch((err) => console.log(err));
  };
  const getManagerTaskList = async () => {
    await axios
      .get(`${GET_MANAGER_TASK_LIST}`)
      .then((res) => {
        const dataToMap = res?.data?.data;
        setData(dataToMap);
      })
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    managerListAPI();
  }, []);

  const managerListAPI = async () => {
    await axios
      .get(`${MANAGER_LIST}`, {
        headers: { 'Content-Type': 'application/json' },
      })
      .then((res) => {
        setManagerList(res?.data?.data);
      })
      .catch((err) => console.log(err));
  };

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleChange = (e) => {
    setTasks(e.target.value);
  };
  const handleDateChange = (newDate) => {
    setDate(new Date(newDate));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let values = {
      description: tasks,
      due_date: moment.utc(date).format(),
      manager: selectedManager,
    };
    toast.promise(
      axios.post(`${CREATE_PROVIDER_LIST_TASK}`, values, {
        headers: { 'Content-Type': 'application/json' },
      }),
      {
        loading: () => {
          return `Creating Task`;
        },
        success: (res) => {
          getEventList();
          setOpen(false);
          return 'Task Created';
        },
        error: (err) => {
          return 'There is an error!';
        },
      }
    );
  };
  const columns =
    role === 'Manager'
      ? [
          { field: 'id', flex: 1, headerName: 'ID', minWidth: 70, maxWidth: 70 },
          { field: 'description', flex: 1, headerName: 'Tasks', minWidth: 150, maxWidth: 300 },

          {
            field: 'due_date',
            headerName: 'End Date',
            flex: 1,
            width: 170,
            minWidth: 170,
            renderCell: (item) => {
              return <>{moment(item.value).format('lll')}</>;
            },
          },
          { field: 'status', flex: 1, headerName: 'Status', minWidth: 80, maxWidth: 110 },
          {
            field: 'updated_at',
            headerName: 'Action',
            flex: 1,
            sortable: false,
            width: 170,
            renderCell: (item) => {
              return (
                <Box display="flex" alignItems={'center'} gap={2}>
                  <DesignServicesIcon
                    sx={{ cursor: 'pointer' }}
                    onClick={() => {
                      setSelectedTasks(item?.row);
                      setUpdateStatusModal(true);
                    }}
                  />
                  <DeleteForeverIcon
                    sx={{ cursor: 'pointer' }}
                    onClick={() => {
                      setSelectedTasks(item?.row);
                      setDeleteSelectedTask(true);
                    }}
                    color="error"
                  />
                </Box>
              );
            },
          },
        ]
      : [
          { field: 'id', flex: 1, headerName: 'ID', minWidth: 70, maxWidth: 70 },
          { field: 'description', flex: 1, headerName: 'Tasks', minWidth: 150, maxWidth: 300 },

          {
            field: 'due_date',
            headerName: 'End Date',
            flex: 1,
            width: 170,
            minWidth: 170,
            renderCell: (item) => {
              return <>{moment(item.value).format('lll')}</>;
            },
          },
          { field: 'status', flex: 1, headerName: 'Status', minWidth: 80, maxWidth: 110 },
        ];
  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box>
          <TaskHeading>Your Tasks</TaskHeading>
          {role !== 'Manager' && (
            <Box ml={'auto'} sx={{ p: 1 }}>
              <Button onClick={handleClickOpen} variant="contained">
                Add Task
              </Button>
            </Box>
          )}

          <Dialog open={open} onClose={handleClose} fullWidth={true} maxWidth={'md'}>
            <DialogTitle>Create a new Task</DialogTitle>
            <DialogContent>
              <form onSubmit={handleSubmit}>
                <Stack spacing={3}>
                  <TextField
                    size="small"
                    value={selectedManager}
                    onChange={(e) => setSelectedManager(e.target.value)}
                    margin="dense"
                    id="task_name"
                    select
                    label="Select Manager"
                    fullWidth
                    variant="outlined"
                  >
                    {!!managerList?.length &&
                      managerList?.map((item, index) => (
                        <MenuItem key={index} value={item?.id}>
                          {item?.user_profile?.first_name} {item?.user_profile?.last_name}
                        </MenuItem>
                      ))}
                  </TextField>
                  <TextField
                    size="small"
                    value={tasks}
                    onChange={handleChange}
                    margin="dense"
                    id="task_name"
                    label="Type Task"
                    type="text"
                    fullWidth
                    variant="outlined"
                  />
                  <DateTimePicker
                    id="task_date"
                    label="Due Date"
                    value={date}
                    onChange={handleDateChange}
                    renderInput={(params) => <TextField size="small" {...params} />}
                  />
                  <LoadingButton type="submit" variant="contained">
                    Create Task
                  </LoadingButton>
                </Stack>
              </form>
            </DialogContent>
          </Dialog>
        </Box>
        <div style={{ height: '550px', width: '100%' }}>
          <DataGrid
            getRowHeight={() => 'auto'}
            rows={data}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
            disableColumnMenu={true}
            checkboxSelection
          />
        </div>
        <Toaster position="top-right" />
      </LocalizationProvider>
      <UpdateStatus
        open={updateStatusModal}
        handleClose={() => setUpdateStatusModal(false)}
        getEventList={getManagerTaskList}
        selectedTasks={selectedTasks}
      />
      <DeleteTasks
        open={deleteSelectedTask}
        handleClose={() => setDeleteSelectedTask(false)}
        getManagerTaskList={getManagerTaskList}
        selectedTasks={selectedTasks}
      />
    </>
  );
};

export default AddTask;
