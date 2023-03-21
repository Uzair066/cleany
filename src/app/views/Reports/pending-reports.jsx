import React from 'react'
import { DataGrid, gridClasses } from '@mui/x-data-grid'
import { BOOKING_REPORTS } from 'app/api';
import axios from '../../../axios'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import moment from 'moment';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import { styled, Button, Box, Typography, } from '@mui/material';

import { Breadcrumb, SimpleCard } from 'app/components';

const TableHeading = styled('p')(() => ({
    fontWeight: '400',
    fontSize: '16px',
    color: '#0F0F0F',
    whiteSpace: 'break-spaces',
    margin: 'unset',
}));
const DataTableBox = styled(Box)(() => ({
    width: '100%',
    '& .MuiDataGrid-main': {},
    '& .MuiDataGrid-columnHeaders': {
        border: 'none !important',
    },
    '& .MuiDataGrid-columnHeaderTitle': {
        fontWeight: '700',
        fontSize: '18px',
        color: '#0F0F0F',
    },
    '& .MuiDataGrid-root': {
        border: 'none !important',
        '& .MuiDataGrid-columnHeader': {
            background: 'unset !important',
            '&:focus': {
                outline: 'none !important',
            },
            '&:focus-within': {
                outline: 'none !important',
            },
        },
        '& .MuiDataGrid-cell': {
            '&:focus': {
                outline: 'none !important',
            },
            '&:focus-within': {
                outline: 'none !important',
            },
        },
        '& .MuiDataGrid-columnSeparator': {
            visibility: 'hidden',
        },
    },
}));
const columns = [
    { field: 'id', headerName: 'ID', width: 150 },
    {
        field: 'customer',
        headerName: 'CUSTOMER',
        width: 250,
        height: 250,
        renderCell: (item) => {
            return (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box>
                        <TableHeading>
                            <Typography sx={{ fontWeight: 900 }}>

                                {item?.row?.bod?.bod_contact_info?.first_name} {item?.row?.bod?.bod_contact_info?.last_name}
                            </Typography>
                        </TableHeading>
                        <Box display={'flex'} alignItems="center">
                            <EmailOutlinedIcon sx={{ paddingRight: '5px' }} />
                            <TableHeading>
                                {item?.row?.bod?.bod_contact_info?.email}
                            </TableHeading>
                        </Box>
                        <Box display={'flex'} alignItems="center">
                            <LocalPhoneOutlinedIcon sx={{ paddingRight: '5px' }} />
                            <TableHeading>
                                {item?.row?.bod?.bod_contact_info?.phone}
                            </TableHeading>
                        </Box>
                    </Box>
                </Box>

            )
        }
    },
    {
        field: 'scheduled',
        headerName: 'SCHEDULED',
        width: 250,
        renderCell: (item) => {
            return (
                <Box>
                    <Box display={'flex'} alignItems="center">
                        <CalendarMonthOutlinedIcon sx={{ paddingRight: '5px' }} />
                        <TableHeading>
                            {moment.utc(item?.row?.appointment_date_time).format('YYYY-MM-DD')}
                        </TableHeading>
                    </Box>

                    <Box display={'flex'} alignItems="center">
                        <AccessTimeOutlinedIcon sx={{ paddingRight: '5px' }} />
                        <TableHeading>
                            {item?.row?.bod?.start_time} - ({item?.row?.bod?.total_hours}hrs)
                        </TableHeading>
                    </Box>

                    <TableHeading>B-{item?.row?.id}</TableHeading>
                </Box>
            )
        }
    },
    {
        field: 'status',
        headerName: 'STATUS',
        width: 150,
        renderCell: (item) => {
            return (
                <Button sx={{ textTransform: 'uppercase' }} variant="contained" color="primary">
                    {item?.row?.bod?.status}
                </Button>
            );
        },
    },
    {
        field: 'amount',
        headerName: 'AMOUNT',
        width: 150,
        renderCell: (item) => {
            return (
                <Box sx={{ textTransform: 'uppercase' }} variant="contained" color="primary">
                    <TableHeading>
                        {item?.row?.bod?.total_amount}
                    </TableHeading>
                </Box>
            );
        },

    },
    {
        field: 'action',
        headerName: 'ACTIONS',
        width: 150,
        renderCell: (item) => {
            return (
                <Box sx={{ textTransform: 'uppercase' }} variant="contained" color="primary">
                    {console.log(item)}
                    <Button variant='contained'>
                        Edit
                    </Button>
                </Box>
            );
        },

    },
];



const Reports = () => {
    const [data, setData] = React.useState([]);

    React.useEffect(() => {
        const getEventList = async () => {
            await axios
                .get(`${BOOKING_REPORTS}?booking_status=scheduled`)
                .then((res) => {

                    const dataToMap = res?.data?.data
                    setData(dataToMap);
                })
                .catch((err) => console.log(err));
        };

        getEventList();
    }, []);
    return (
        <Box sx={{ p: 4 }}>
            <Box className="breadcrumb">
                <Breadcrumb
                    routeSegments={[
                        { name: 'Home', path: '/' },
                        { name: 'Reports', path: '/dashboard/Reports' },
                    ]}
                />
            </Box>
            <Box sx={{ mt: 5 }}>

                <SimpleCard>
                    <DataTableBox >

                        <DataGrid
                            sx={{
                                [`& .${gridClasses.cell}`]: {
                                    py: 1,
                                },
                            }}
                            rows={data}
                            columns={columns}
                            pageSize={10}
                            rowsPerPageOptions={[5]}
                            getRowHeight={() => 'auto'}
                            disableColumnMenu={true}
                            autoHeight={true}
                            checkboxSelection={false}
                            disableSelectionOnClick
                        />
                    </DataTableBox>
                </SimpleCard>
            </Box>
        </Box>
    )
}

export default Reports