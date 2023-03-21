import React, { useState } from 'react';
import { Box, Card, Grid, Icon, MenuItem, styled, TextField } from '@mui/material';
import { Small } from 'app/components/Typography';
import { GET_CARD_DATA } from '../../../../api';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import axios from '../../../../../axios';

const StyledCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: ' 24px  !important',
  background: theme.palette.background.paper,
  [theme.breakpoints.down('sm')]: { padding: '16px !important' },
}));

const ContentBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  '& small': { color: theme.palette.text.secondary },
  '& .icon': { opacity: 0.6, fontSize: '44px', color: theme.palette.primary.main },
}));

const Heading = styled('h6')(({ theme }) => ({
  margin: 0,
  fontSize: '14px',
  fontWeight: '500',
  color: theme.palette.primary.main,
}));

const StatCards = () => {
  const iconList = [
    'widgets_outlined_icon',
    'group',
    'engineering_icon',
    'preview_icon',
    'store',
    'attach_money',
    'alarm',
    'accessibility_icon',
  ];

  const [cardList, setCardList] = React.useState([]);
  const [showHide, setShowHide] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState([
    '7_days',
    '7_days',
    '7_days',
    '7_days',
    '7_days',
    '7_days',
    '7_days',
  ]);

  React.useEffect(() => {
    getCardData();
  }, [selectedFilter]);

  const getCardData = async () => {
    await axios
      .get(
        `${GET_CARD_DATA}?customer_filter=${selectedFilter[1]}&page_view_filter=${selectedFilter[3]}&booking_filter=${selectedFilter[4]}&amount_filter=${selectedFilter[5]}&hours_filter=${selectedFilter[6]}&cleaner_filter=${selectedFilter[2]}&service_filter${selectedFilter[0]}`
      )
      .then((res) => {
        const dataToMap = res?.data?.data;
        dataToMap.forEach((object, index) => {
          object.icon = iconList[index];
        });
        setCardList(dataToMap);
      })
      .catch((err) => console.log(err));
  };
  const handleSelectChange = (value, index) => {
    let dupArr = [...selectedFilter];
    dupArr[index] = value;
    setSelectedFilter(dupArr);
  };
  return (
    <Grid container spacing={2} sx={{ mb: '24px' }}>
      {cardList.map((item, index) => (
        <Grid item xs={4} md={4} lg={4} xl={3} key={index}>
          <StyledCard elevation={6} sx={{ position: 'relative', paddingTop: '3rem !important' }}>
            {index === 7 ? null : (
              <Box
                sx={{
                  position: 'absolute',
                  right: '10px',
                  top: '0px',
                  '& .MuiSelect-outlined': {
                    fontSize: '10px',
                    paddingTop: '3px',
                    paddingBottom: '3px',
                  },
                }}
              >
                <TextField
                  select
                  variant="outlined"
                  size="small"
                  value={selectedFilter[index]}
                  onChange={(e) => handleSelectChange(e.target.value, index)}
                  margin="dense"
                >
                  <MenuItem value="7_days">Last 7 days</MenuItem>
                  <MenuItem value="30_days">Last 30 days</MenuItem>
                  <MenuItem value="90_days">Last 3 months</MenuItem>
                </TextField>
              </Box>
            )}

            <ContentBox>
              <Icon className="icon">{item.icon}</Icon>
              <Box ml="12px">
                <Small style={{ fontWeight: 'bold' }}>{item.name}</Small>
                <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '4px' }} gap={1}>
                  {index === 5 ? (
                    <>
                      {showHide && (
                        <Heading>
                          {item?.value?.toString()?.includes('.')
                            ? item.value.toFixed(4)
                            : item.value}
                        </Heading>
                      )}
                    </>
                  ) : (
                    <Heading>
                      {item?.value?.toString()?.includes('.')
                        ? item.value.toFixed(4)
                        : item.value === null
                        ? 0
                        : item.value}
                    </Heading>
                  )}
                  {index === 5 && (
                    <>
                      {showHide ? (
                        <VisibilityOffIcon
                          sx={{ fontSize: '1.2rem', cursor: 'pointer' }}
                          onClick={() => setShowHide(false)}
                        />
                      ) : (
                        <RemoveRedEyeIcon
                          sx={{ fontSize: '1.2rem', cursor: 'pointer' }}
                          onClick={() => setShowHide(true)}
                        />
                      )}
                    </>
                  )}
                </Box>
              </Box>
            </ContentBox>
          </StyledCard>
        </Grid>
      ))}
    </Grid>
  );
};

export default StatCards;
