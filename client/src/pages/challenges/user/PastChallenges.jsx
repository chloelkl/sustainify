import React, { useState, useEffect } from "react";
import theme from '../../../themes/MyTheme.js'
import { styled } from '@mui/system';
import { Typography } from "@mui/material";
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import { useAuth } from '../../../context/AuthContext.jsx';

import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import DoneOutlinedIcon from '@mui/icons-material/DoneOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';

const StyledContainer = styled('div')({
  margin: '5vh 2vw',
  display: 'flex',
  justifyContent: 'space-around'
});

const Sidebar = styled('div')({
  width: '22vw',
  height: '75vh',
  background: theme.palette.primary.light,
});

const SideNav = styled('div')({
  height: '10%',
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
});

const SideLink = styled(Link)({
  color: theme.palette.secondary.light,
  textDecoration: 'none',
  width: '130px'
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

function PastChallenges() {
  const { user } = useAuth();
  const [challenges, setChallenges] = useState([]);
  const [completionStatus, setCompletionStatus] = useState({});

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/challenge/get`);
      const result = await response.json();
      setChallenges(result);
      fetchAllCompletionStatus(result);
    } catch (error) {
      console.error('Error fetching challenges:', error);
    }
  };

  const fetchAllCompletionStatus = async (challenges) => {
    const status = {};
    for (let chal of challenges) {
      const isCompleted = await checkCompletion(user.userID, chal.id);
      status[chal.id] = isCompleted;
    }
    setCompletionStatus(status);
  };

  const checkCompletion = async (userId, challengeId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/challenge/checkCompletion?userId=${userId}&challengeId=${challengeId}`);
      const result = await response.json();
      return result.completed;
    } catch (error) {
      console.error('Error checking completion of challenge ' + challengeId + ':' + error);
      return false;
    }
  };

  const filteredChallenges = challenges.filter(chal => {
    const challengeDate = dayjs(chal.date);
    const today = dayjs().startOf('day');
    return challengeDate.isBefore(today) || challengeDate.isSame(today, 'day');
  }).sort((a, b) => dayjs(b.date).diff(dayjs(a.date)));

  return (
    <StyledContainer>
      <Sidebar>
        <SideNav>
          <AssignmentOutlinedIcon sx={{ color: theme.palette.secondary.light, paddingRight: '5%' }}/>
          <SideLink to="/challenges">Today's Challenge</SideLink>
        </SideNav>
        <SideNav>
          <AssessmentOutlinedIcon sx={{ color: theme.palette.secondary.light, paddingRight: '5%' }}/>
          <SideLink to="/challenges/mystatistics">My Statistics</SideLink>
        </SideNav>
        <SideNav sx={{ background: theme.palette.primary.main }}>
          <HistoryOutlinedIcon sx={{ color: theme.palette.secondary.light, paddingRight: '5%' }}/>
          <SideLink to="/challenges/past">Past Challenges</SideLink>
        </SideNav>
      </Sidebar>
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
                    {completionStatus[chal.id] ? (
                      <DoneOutlinedIcon sx={{ color: theme.palette.primary.main, margin: "auto" }}/>
                    ) : (
                      <CloseOutlinedIcon sx={{ color: theme.palette.error.main, margin: "auto" }}/>
                    )}
                  </div>
                </Cont>
                <hr style={{ width: '95%', margin: '0 auto' }} />
              </div>
            ))}
          </div>
        </ManageContainer>
      </ManageParent>
    </StyledContainer>
  );
}

export default PastChallenges;
