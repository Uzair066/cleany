import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import toast, { Toaster } from 'react-hot-toast';
import { Box } from '@mui/system';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import {
  Divider,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import JsPDF from 'jspdf';
import moment from 'moment';
import { LoadingButton } from '@mui/lab';
import cleanyIcon from '../../../../assets/logo.png';

function GenerateInvoice({ open, handleClose, bookindDetails }) {
  const [loading, setLoading] = useState(false);
  const generatePDF = () => {
    setLoading(true);
    const report = new JsPDF('portrait', 'pt', 'a4');
    report.html(document.querySelector('#report')).then(() => {
      report.save('invoice.pdf');
      setLoading(false);
    });
  };
  return (
    <>
      <Dialog
        open={open}
        maxWidth={'sm'}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: '100%',
          },
        }}
        aria-labelledby="package-item"
        aria-describedby="package-item-description"
      >
        <Box id="report">
          <DialogTitle
            id="package-item"
            style={{ fontSize: '1.5rem', display: 'flex', justifyContent: 'space-between' }}
          >
            Invoice {bookindDetails?.id}{' '}
            <img style={{ width: '150px' }} src={cleanyIcon} alt="logo" />
            {!loading && (
              <LoadingButton
                onClick={generatePDF}
                startIcon={<FileDownloadIcon />}
                color="primary"
                loading={loading}
                variant="contained"
              >
                PDF
              </LoadingButton>
            )}
          </DialogTitle>
          <Divider />
          <DialogContent>
            <p
              style={{
                textAlign: 'center',
                margin: 'unset',
                fontSize: '1rem',
                paddingBottom: '0.5rem',
              }}
            >
              {bookindDetails?.service?.name}
            </p>
            <Box sx={{ padding: '0px 3rem' }}>
              <Grid container>
                <Grid
                  item
                  xs={4}
                  sx={{ fontSize: '1rem', fontWeight: 'bold', paddingBottom: '5px' }}
                >
                  Customer Details
                </Grid>
                <Grid item xs={8}></Grid>
                <Grid item xs={4} sx={{ paddingLeft: '1rem', paddingBottom: '5px' }}>
                  Name:
                </Grid>
                <Grid item xs={8} sx={{ paddingBottom: '5px' }}>
                  {bookindDetails?.bod?.bod_contact_info?.first_name}{' '}
                  {bookindDetails?.bod?.bod_contact_info?.last_name}
                </Grid>
                <Grid item xs={4} sx={{ paddingLeft: '1rem', paddingBottom: '5px' }}>
                  Email:
                </Grid>
                <Grid item xs={8} sx={{ paddingBottom: '5px' }}>
                  {bookindDetails?.bod?.bod_contact_info?.email}
                </Grid>
                <Grid item xs={4} sx={{ paddingLeft: '1rem', paddingBottom: '5px' }}>
                  Phone No:
                </Grid>
                <Grid item xs={8} sx={{ paddingBottom: '5px' }}>
                  {bookindDetails?.bod?.bod_contact_info?.phone}
                </Grid>
                <Grid
                  item
                  xs={4}
                  sx={{ fontSize: '1rem', fontWeight: 'bold', paddingBottom: '5px' }}
                >
                  Invoice
                </Grid>
                <Grid item xs={8}></Grid>
                <Grid item xs={4} sx={{ paddingLeft: '1rem', paddingBottom: '5px' }}>
                  Creation Date:
                </Grid>
                <Grid item xs={8} sx={{ paddingBottom: '5px' }}>
                  {moment(new Date()).format('lll')}
                </Grid>
                <Grid item xs={4} sx={{ paddingLeft: '1rem', paddingBottom: '5px' }}>
                  Status:
                </Grid>
                <Grid item xs={8} sx={{ textTransform: 'capitalize', paddingBottom: '5px' }}>
                  {bookindDetails?.outstanding?.status}
                </Grid>
                <Grid item xs={12} sx={{ fontSize: '1rem', fontWeight: 'bold' }}>
                  Service Items:
                </Grid>
                <Grid item xs={12}>
                  <Table aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell>NAME</TableCell>
                        <TableCell align="right">DISCOUNT(%)</TableCell>
                        <TableCell align="right">UNIT PRICE</TableCell>
                        <TableCell align="right">AMOUNT</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {bookindDetails?.items?.map((row, index) => (
                        <TableRow
                          key={index}
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                          <TableCell>{row.title}</TableCell>
                          <TableCell align="right">{row.discount_percent}%</TableCell>
                          <TableCell align="right">${row.price}</TableCell>
                          <TableCell align="right">
                            ${+row.price - (+row.price * row.discount_percent) / 100}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Grid>
                <Grid item xs={12} sx={{ fontSize: '1rem', fontWeight: 'bold' }}>
                  Extras:
                </Grid>
                <Grid item xs={12}>
                  <Table aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell>NAME</TableCell>
                        <TableCell align="right">Quantity</TableCell>
                        <TableCell align="right">UNIT PRICE</TableCell>
                        <TableCell align="right">AMOUNT</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {bookindDetails?.extras?.map((row, index) => (
                        <TableRow
                          key={index}
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                          <TableCell>{row.title}</TableCell>
                          <TableCell align="right">{row?.quantity}</TableCell>
                          <TableCell align="right">${row.price}</TableCell>
                          <TableCell align="right">${+row.price * row?.quantity}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Grid>
                <Grid item xs={6}></Grid>
                <Grid item xs={3} sx={{ fontWeight: 'bold' }}>
                  Sub Total
                </Grid>
                <Grid item xs={3} sx={{ textAlign: 'right' }}>
                  $
                  {bookindDetails?.extras
                    ?.map((item) => {
                      const price = parseFloat(item?.price) * item?.quantity;
                      return price.toFixed(2);
                    })
                    .reduce((accumulator, value) => {
                      return +accumulator + +value;
                    }, 0) +
                    bookindDetails?.items
                      ?.map((item) => {
                        const percent =
                          +item?.price - (item?.discount_percent * +item?.price) / 100;
                        return percent;
                      })
                      .reduce((accumulator, value) => {
                        return +accumulator + +value;
                      }, 0)}
                </Grid>
                <Grid item xs={6}></Grid>
                <Grid item xs={3} sx={{ fontWeight: 'bold' }}>
                  Tax({bookindDetails?.service?.tax_amount}%)
                </Grid>
                <Grid item xs={3} sx={{ textAlign: 'right' }}>
                  $
                  {(
                    ((bookindDetails?.extras
                      ?.map((item) => {
                        const price = parseFloat(item?.price) * item?.quantity;
                        return price.toFixed(2);
                      })
                      .reduce((accumulator, value) => {
                        return +accumulator + +value;
                      }, 0) +
                      bookindDetails?.items
                        ?.map((item) => {
                          const percent =
                            +item?.price - (item?.discount_percent * +item?.price) / 100;
                          return percent;
                        })
                        .reduce((accumulator, value) => {
                          return +accumulator + +value;
                        }, 0)) *
                      bookindDetails?.service?.tax_amount) /
                    100
                  ).toFixed(2)}
                </Grid>
                <Grid item xs={6}></Grid>
                <Grid item xs={3} sx={{ fontWeight: 'bold' }}>
                  Total Amount
                </Grid>
                <Grid item xs={3} sx={{ textAlign: 'right', fontSize: '1.2rem' }}>
                  $
                  {(
                    bookindDetails?.extras
                      ?.map((item) => {
                        const price = parseFloat(item?.price) * item?.quantity;
                        return price.toFixed(2);
                      })
                      .reduce((accumulator, value) => {
                        return +accumulator + +value;
                      }, 0) +
                    bookindDetails?.items
                      ?.map((item) => {
                        const percent =
                          +item?.price - (item?.discount_percent * +item?.price) / 100;
                        return percent;
                      })
                      .reduce((accumulator, value) => {
                        return +accumulator + +value;
                      }, 0) +
                    ((bookindDetails?.extras
                      ?.map((item) => {
                        const price = parseFloat(item?.price) * item?.quantity;
                        return price.toFixed(2);
                      })
                      .reduce((accumulator, value) => {
                        return +accumulator + +value;
                      }, 0) +
                      bookindDetails?.items
                        ?.map((item) => {
                          const percent =
                            +item?.price - (item?.discount_percent * +item?.price) / 100;
                          return percent;
                        })
                        .reduce((accumulator, value) => {
                          return +accumulator + +value;
                        }, 0)) *
                      bookindDetails?.service?.tax_amount) /
                      100
                  ).toFixed(2)}
                </Grid>
              </Grid>
              <h1 style={{ textAlign: 'center' }}>Thank You For Your Purchase</h1>
            </Box>
            {!loading && (
              <Box
                display={'flex'}
                alignItems="center"
                justifyContent={'end'}
                sx={{ mb: 2, mt: 3 }}
              >
                <Button
                  onClick={() => {
                    handleClose();
                  }}
                  variant="outlined"
                  color="primary"
                  sx={{ mr: 2 }}
                >
                  Close
                </Button>
              </Box>
            )}
          </DialogContent>
        </Box>
        <Toaster position="top-right" />
      </Dialog>
    </>
  );
}

export default GenerateInvoice;
