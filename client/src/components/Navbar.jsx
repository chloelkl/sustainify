import React from "react";
import { AppBar, Toolbar, Typography, IconButton } from "@mui/material";
import { Link } from 'react-router-dom';
import { styled } from '@mui/system';
import AccountCircle from '@mui/icons-material/AccountCircle';


// using mui to style navbar
const StyledToolbar = styled(Toolbar)({
  display: 'flex',
  justifyContent: 'space-around',
  height: '100px'
});

const NavLinks = styled('div')({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  justifyContent: 'space-around'
});


const Logo = styled('img')({
  textAlign: 'center',
  height: '100px',
  '&:hover': {
    opacity: '0.7',
  }

});

const StyledLink = styled(Link)(({ theme }) => ({
  color: theme.palette.secondary.light,
  textDecoration: 'none',
  '& .MuiTypography-root': {
    fontSize: '1.2rem'
  },
  '&:hover': {
    textDecoration: 'underline',
  },
}));

function Navbar() {
  return (
    <AppBar position="static">
      <StyledToolbar>
        <NavLinks>
          <StyledLink to="/challenges">
            <Typography>CHALLENGES</Typography>
          </StyledLink>
          <StyledLink to="/events">
            <Typography>EVENTS</Typography>
          </StyledLink>
          <StyledLink to="/">
            <Logo src="Logo.png" alt="sustainify" />
          </StyledLink>
          

          <StyledLink to="/forum">
            <Typography>FORUM</Typography>
          </StyledLink>
          <StyledLink to="/rewards">
            <Typography>REWARDS</Typography>
          </StyledLink>
          <IconButton color="inherit">
            <AccountCircle />
          </IconButton>
        </NavLinks>
      </StyledToolbar>
    </AppBar>
  );
};


export default Navbar;