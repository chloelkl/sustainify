import React from "react";
import theme from '../../themes/MyTheme.js'
import { styled } from '@mui/system';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, IconButton } from "@mui/material";

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

const DailyContainer = styled('div')({
  width: '80%',
  height: '80%',
  background: theme.palette.secondary.light,
  margin: '5% auto',
  overflow: 'auto'
})


function DailyChallenge() {

  return (
    <StyledContainer>
      <PlaceholderSidebar></PlaceholderSidebar>
      <ManageParent>
        <DailyContainer sx={{ boxShadow: 2 }}>

        </DailyContainer>
      </ManageParent>
    </StyledContainer>
  );
}

export default DailyChallenge;