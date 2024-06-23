import React, { useState, useEffect } from "react";
import theme from '../../themes/MyTheme.js'
import { styled } from '@mui/system';
import { Link } from 'react-router-dom';
import { AppBar, Button, Typography, IconButton } from "@mui/material";
import dayjs from 'dayjs';

import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';

const StyledContainer = styled('div')({
  margin: '5vh 2vw',
  display: 'flex',
  justifyContent: 'space-around'
});

const PlaceholderSidebar = styled('div')({
  width: '20vw',
  height: '80vh',
  background: theme.palette.primary.light,
});

const ManageParent = styled('div')({
  width: '80vw',
  height: '80vh',
});

const DailyContainer = styled('div')({
  width: '80%',
  height: '80%',
  background: theme.palette.secondary.light,
  margin: '5% auto',
  overflow: 'auto',
  textAlign: 'center'
});

const ChallengeIcon = styled('img')({
  width: '20%',
  margin: '10% auto 0'
});

const Complete = styled(Button)({
  backgroundColor: theme.palette.secondary.dark,
  color: theme.palette.secondary.light,
  fontSize: '1rem',
  height: '50px',
  width: '35%',
  margin: '10% auto 0',
  display: 'flex',
  justifyContent: 'space-around',
  '&:hover': {
    backgroundColor: 'grey'
  }
})


function DailyChallenge() {

  const [daily, setDaily] = useState('');
  useEffect(() => {
    fetchDaily();
  }, []);
  
  const fetchDaily = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/challenge/getDaily`);
      const result = await response.json();
      setDaily(result);
    } catch (error) {
      console.error('Error fetching challenge:', error);
    }
  };


  return (
    <StyledContainer>
      <PlaceholderSidebar></PlaceholderSidebar>
      <ManageParent>
        <DailyContainer sx={{ boxShadow: 2 }}>
          <ChallengeIcon src="/ChallengeIcon.png" alt=""/>
          <Typography style={{ fontWeight: 'bold'}} variant="h6">Challenge of the Day</Typography>
          <Typography variant="body2">{dayjs(daily.date).format('DD/MM/YYYY')}</Typography>
          <br/>
          <Typography>
            {daily.challenge}
          </Typography>

          <Complete>
            <Typography>
              COMPLETE CHALLENGE
            </Typography>
            <CameraAltOutlinedIcon/>
          </Complete>
        </DailyContainer>
      </ManageParent>
    </StyledContainer>
  );
}

export default DailyChallenge;