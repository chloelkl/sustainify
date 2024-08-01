import React, { useState, useEffect } from "react";
import theme from '../../themes/MyTheme.js';
import { styled } from '@mui/system';
import { Typography, Button } from "@mui/material";
import dayjs from 'dayjs';
import { useAuth } from '../../context/AuthContext';

import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';

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

const SideLink = styled('a')({
  color: theme.palette.secondary.light,
  textDecoration: 'none',
  width: '130px'
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

const Complete = styled(Button)(({ disabled }) => ({
  backgroundColor: disabled ? 'grey' : theme.palette.secondary.dark,
  color: theme.palette.secondary.light,
  fontSize: '1rem',
  height: '50px',
  width: '35%',
  margin: '10% auto 0',
  display: 'flex',
  justifyContent: 'space-around',
  pointerEvents: 'fill !important',
  cursor: disabled ? 'not-allowed !important' : 'pointer',
  '&:hover': {
    backgroundColor: 'grey'
  },
  '& p': {
    color: disabled ? 'lightgrey' : theme.palette.secondary.light,
  } 
}));

function DailyChallenge() {

  const { user, admin } = useAuth();

  const [daily, setDaily] = useState(null);
  const [completed, setCompleted] = useState(null);

  useEffect(() => {
    fetchDaily();
  }, []);

  useEffect(() => {
    if (daily && user) {
      fetchCompleted(user.userID, daily.id);
    }
  }, [daily, user]);

  const fetchDaily = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/challenge/getDaily`);
      const result = await response.json();
      setDaily(result);
    } catch (error) {
      console.error('Error fetching challenge:', error);
    }
  };

  const fetchCompleted = async (userId, challengeId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/challenge/checkCompletion?userId=${userId}&challengeId=${challengeId}`);
      const result = await response.json();
      setCompleted(result.completed);
    } catch (error) {
      console.error('Error checking completion:', error);
    }
  };

  const handleComplete = async (userId, challengeId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/challenge/completeChallenge`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, challengeId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      const result = await response.json();
      console.log(result);
      setCompleted(true); // Mark challenge as completed
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  return (
    <StyledContainer>
      {admin ? (
        <Sidebar>
          <SideNav sx={{ background: theme.palette.secondary.dark }}>
            <AssignmentOutlinedIcon sx={{ color: theme.palette.secondary.light, paddingRight: '5%' }} />
            <SideLink href="/challenges">Today's Challenge</SideLink>
          </SideNav>
          <SideNav>
            <AssessmentOutlinedIcon sx={{ color: theme.palette.secondary.light, paddingRight: '5%' }} />
            <SideLink href="/challenges/statistics">Statistics</SideLink>
          </SideNav>
          <SideNav>
            <ManageAccountsOutlinedIcon sx={{ color: theme.palette.secondary.light, paddingRight: '5%' }} />
            <SideLink href="/challenges/manage">Manage</SideLink>
          </SideNav>
          <SideNav>
            <GroupsOutlinedIcon sx={{ color: theme.palette.secondary.light, paddingRight: '5%' }} />
            <SideLink href="/challenges/participation">Participation</SideLink>
          </SideNav>
        </Sidebar>
      ) : (
        <Sidebar>
          <SideNav sx={{ background: theme.palette.primary.main }}>
            <AssignmentOutlinedIcon sx={{ color: theme.palette.secondary.light, paddingRight: '5%' }} />
            <SideLink href="/challenges">Today's Challenge</SideLink>
          </SideNav>
          <SideNav>
            <AssessmentOutlinedIcon sx={{ color: theme.palette.secondary.light, paddingRight: '5%' }} />
            <SideLink href="/challenges/mystatistics">My Statistics</SideLink>
          </SideNav>
          <SideNav>
            <HistoryOutlinedIcon sx={{ color: theme.palette.secondary.light, paddingRight: '5%' }} />
            <SideLink href="/challenges/past">Past Challenges</SideLink>
          </SideNav>
        </Sidebar>
      )}

      <ManageParent>
        <DailyContainer sx={{ boxShadow: 2 }}>
          <ChallengeIcon src="/ChallengeIcon.png" alt="" />
          <Typography style={{ fontWeight: 'bold' }} variant="h6">Challenge of the Day</Typography>
          <Typography variant="body2">{dayjs(daily?.date).format('DD/MM/YYYY')}</Typography>
          <br />
          <Typography>
            {daily?.challenge ? daily.challenge : "No challenge set for today!"}
          </Typography>
          <Complete onClick={() => handleComplete(user.userID, daily.id)} disabled={completed}>
            <Typography>
              COMPLETE CHALLENGE
            </Typography>
            <CameraAltOutlinedIcon />
          </Complete>
          <Typography marginTop="10px" >
            {completed ? "You've completed the challenge!" : ""}
          </Typography>
        </DailyContainer>
      </ManageParent>
    </StyledContainer>
  );
}

export default DailyChallenge;
