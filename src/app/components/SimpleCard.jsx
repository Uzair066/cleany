import { Card } from '@mui/material';
import { Box, styled } from '@mui/system';

const CardRoot = styled(Card)(() => ({
  height: '100%',
  padding: '20px 24px',
}));

const CardTitle = styled('div')(({ subtitle }) => ({
  fontSize: '1rem',
  fontWeight: '500',
  marginBottom: !subtitle && '16px',
}));

const SimpleCard = ({ children, title, subtitle, icon, padding }) => {
  return (
    <CardRoot elevation={6}>
      <CardTitle
        style={
          padding
            ? {
                paddingLeft: '10px',
                paddingRight: '10px',
              }
            : {}
        }
        subtitle={subtitle}
      >
        {title}
      </CardTitle>
      {subtitle && <Box sx={{ mb: 2 }}>{subtitle}</Box>}
      {children}
    </CardRoot>
  );
};

export default SimpleCard;
