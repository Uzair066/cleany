import { LoadingButton } from '@mui/lab';
import { Box, Button, Card, Grid, styled, TextField } from '@mui/material';
import { useState } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import axios from '../../../axios';
import { FORGET_PASSWORD } from 'app/api';

const FlexBox = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
}));

const JustifyBox = styled(FlexBox)(() => ({
  justifyContent: 'center',
}));

const ContentBox = styled(Box)(({ theme }) => ({
  padding: 32,
  background: theme.palette.background.default,
}));

const ForgotPasswordRoot = styled(JustifyBox)(() => ({
  background: '#1A2038',
  minHeight: '100vh !important',
  '& .card': {
    maxWidth: 800,
    margin: '1rem',
    borderRadius: 12,
  },
}));

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    toast.promise(
      axios.post(
        `${FORGET_PASSWORD}`,
        { email: email },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      ),
      {
        loading: () => {
          return `Sending Email!`;
        },
        success: (res) => {
          setLoading(false);
          setTimeout(() => {
            navigate(`/session/reset-password?email=${email}`);
          }, 500);

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
    <ForgotPasswordRoot>
      <Card className="card">
        <Grid container>
          <Grid item xs={12}>
            <JustifyBox p={4}>
              <img width="300" src="/assets/images/illustrations/dreamer.svg" alt="" />
            </JustifyBox>

            <ContentBox>
              <form onSubmit={handleFormSubmit}>
                <TextField
                  type="email"
                  name="email"
                  label="Email"
                  value={email}
                  inputProps={{ placeholder: 'user@example.com' }}
                  variant="outlined"
                  onChange={(e) => setEmail(e.target.value)}
                  sx={{ mb: 3, width: '100%' }}
                />

                <LoadingButton
                  type="submit"
                  size="large"
                  color="primary"
                  loading={loading}
                  variant="contained"
                  sx={{}}
                  fullWidth
                >
                  Send PIN
                </LoadingButton>
              </form>
              <Button
                fullWidth
                color="primary"
                variant="outlined"
                onClick={() => navigate(-1)}
                sx={{ mt: 2 }}
              >
                Go Back
              </Button>
            </ContentBox>
          </Grid>
        </Grid>
      </Card>
      <Toaster position="top-right" />
    </ForgotPasswordRoot>
  );
};

export default ForgotPassword;
