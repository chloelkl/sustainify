import React from "react";
import theme from '../../themes/MyTheme.js'
import { styled } from '@mui/system';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, IconButton } from "@mui/material";

const Sidebar = styled('div')({
  width: '100px',
  height: '100px',
  background: theme.palette.primary.light
});
const StyledSideLink = styled(Link)({
  color: theme.palette.secondary.light,
  textDecoration: 'none',
  '&:hover': {
    background: theme.palette.primary.main,
  },
});


function DailyChallenge() {

  return (
    <Sidebar>
      <StyledSideLink>
        <Typography>weifekl</Typography>
      </StyledSideLink>
    </Sidebar>
  );
}

export default DailyChallenge;