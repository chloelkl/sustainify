import React, { useState, useEffect } from "react";
import theme from '../../themes/MyTheme.js'
import { styled } from '@mui/system';
import { Typography } from "@mui/material";
import dayjs from 'dayjs';

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
})

const ManageContainer = styled('div')({
  width: '80%',
  height: '80%',
  background: theme.palette.secondary.light,
  margin: '5% auto',
  overflow: 'auto',
  boxShadow: '',
})


function PastChallenges() {
  const [challenges, setChallenges] = useState([]);

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/challenge/get`);
      const result = await response.json();
      setChallenges(result);
    } catch (error) {
      console.error('Error fetching challenges:', error);
    }
  };

  const filteredChallenges = challenges.filter(chal => {
    const challengeDate = dayjs(chal.date);
    const yesterday = dayjs().subtract(1, 'day').startOf('day');
    return challengeDate.isBefore(yesterday) || challengeDate.isSame(yesterday, 'day');
  }).sort((a, b) => dayjs(b.date).diff(dayjs(a.date)));;

  const Cont = styled('div')({
    width: '95%',
    margin: 'auto',
    display: 'flex',
    justifyContent: 'space-around',
    height: '5vh',
  
    '& .MuiTypography-root': {
      fontSize: '.8rem',
      verticalAlign: 'center',
      margin: 'auto 0'
    }
  });

  return (
    <StyledContainer>
      <PlaceholderSidebar></PlaceholderSidebar>
      <ManageParent>
        <ManageContainer sx={{ boxShadow: 2 }}>
          <Typography style={{ width: '90%', margin: '2% auto'}}>Past Challenges</Typography>
          <hr style={{ width: '95%', margin: '0 auto', height: '.5px', background: 'black' }} />

          <div>
            {filteredChallenges.map((chal, index) => (
              <div key={index}>
                <Cont>
                  <Typography width="15%">{dayjs(chal.date).format('DD/MM/YYYY')}</Typography>
                  <Typography width="60%">{chal.challenge}</Typography>
                  <div style={{ 'width': '10%', display: 'flex', justifyContent: 'center' }}>
                    
                  </div>
                </Cont>
                <hr style={{ width: '95%', margin: '0 auto' }} />
              </div>
            ))}
          </div>
        </ManageContainer>
      </ManageParent>


    </StyledContainer>

  )
}

export default PastChallenges;