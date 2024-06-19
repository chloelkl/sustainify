import React from 'react';
import { AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import { styled } from '@mui/system';
import AccountCircle from '@mui/icons-material/AccountCircle';

const StyledToolbar = styled(Toolbar)({
  display: 'flex',
  justifyContent: 'space-around',
});

const NavLinks = styled('div')({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  justifyContent: 'space-around',
});

const Logo = styled(Typography)({
  textAlign: 'center',
});

const StyledLink = styled(Link)(({ theme }) => ({
  margin: theme.spacing(1),
  color: 'white',
  textDecoration: 'none',
  '&:hover': {
    textDecoration: 'underline',
  },
}));

function Navbar() {
  return (
    <AppBar position="fixed" style={{ zIndex: 1300 }}>
      <StyledToolbar>
        <NavLinks>
          <StyledLink to="/challenges">
            <Typography>CHALLENGES</Typography>
          </StyledLink>
          <StyledLink to="/events">
            <Typography>EVENTS</Typography>
          </StyledLink>
          <StyledLink to="/">
            <Logo>LOGO</Logo>
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
}

export default Navbar;
