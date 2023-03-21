import { Box, Button, Grid, styled } from '@mui/material';
import { Breadcrumb, SimpleCard } from 'app/components';
import React from 'react';

const Container = styled('div')(({ theme }) => ({
  margin: '30px',
  [theme.breakpoints.down('sm')]: { margin: '16px' },
  '& .breadcrumb': {
    marginBottom: '30px',
    [theme.breakpoints.down('sm')]: { marginBottom: '16px' },
    '& h5': {
      margin: 'unset',
    },
  },
}));

function ApprecisteUs() {
  return (
    <Container>
      <Box className="breadcrumb">
        <h5>OVERVIEW</h5>
        <Breadcrumb routeSegments={[{ name: 'Appreciate Us' }]} />
      </Box>
      <Grid container>
        <Grid item xs={6}>
          <SimpleCard title="Appreciate Us">
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
                gap: 1.5,
                '& a': {
                  fontSize: '1.05rem',
                },
              }}
            >
              <Button
                href="https://www.yelp.com/"
                target={'_blank'}
                color="error"
                fullWidth
                variant="contained"
              >
                Yelp
              </Button>
              <Button
                href="https://www.google.com/business/"
                target={'_blank'}
                color="success"
                fullWidth
                variant="contained"
              >
                Google Business
              </Button>
              <Button
                href="https://lastpass.com/"
                target={'_blank'}
                color="primary"
                fullWidth
                variant="contained"
              >
                Youtube
              </Button>
              <Button
                href="https://www.yelp.com/"
                target={'_blank'}
                color="warning"
                fullWidth
                variant="contained"
              >
                Instagram
              </Button>
              <Button
                href="https://www.google.com/business/"
                target={'_blank'}
                color="info"
                fullWidth
                variant="contained"
              >
                Amazon Shop
              </Button>
            </Box>
          </SimpleCard>
        </Grid>
        <Grid item xs={6}></Grid>
      </Grid>
    </Container>
  );
}

export default ApprecisteUs;
