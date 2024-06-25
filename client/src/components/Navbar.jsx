import React from "react";
import { AppBar, Toolbar, Typography, IconButton } from "@mui/material";
import { Link } from 'react-router-dom';
import { styled } from '@mui/system';
import AccountCircle from '@mui/icons-material/AccountCircle';

<<<<<<< HEAD
<<<<<<< HEAD
=======

// using mui to style navbar
>>>>>>> parent of 5c1f6df (Completed admin main)
const StyledToolbar = styled(Toolbar)({
  display: 'flex',
  justifyContent: 'space-around',
<<<<<<< HEAD
  alignItems: 'center',
=======
// using mui to style navbar
const StyledToolbar = styled(Toolbar)({
  display: 'flex',
  justifyContent: 'space-around',
  height: '100px'
>>>>>>> f08394f678773cfa212aed1ab5587775fee344c6
=======
>>>>>>> parent of ffc2fde (Improved system overview)
});

const NavLinks = styled('div')({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  justifyContent: 'space-around'
});

<<<<<<< HEAD
const Logo = styled('img')({
<<<<<<< HEAD
  height: '40px',
=======
>>>>>>> f08394f678773cfa212aed1ab5587775fee344c6
=======
const Logo = styled(Typography)({
<<<<<<< HEAD
>>>>>>> parent of ffc2fde (Improved system overview)
=======
  // flexGrow: 1,
>>>>>>> parent of 5c1f6df (Completed admin main)
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
<<<<<<< HEAD
<<<<<<< HEAD
            <Logo src="/src/assets/Logo_XBG.png" alt="LOGO" /> {/* Use your logo image path */}
=======
            <Logo src="../../public/Logo.png" alt="sustainify" />
>>>>>>> f08394f678773cfa212aed1ab5587775fee344c6
=======
            <Logo>LOGO</Logo>
>>>>>>> parent of ffc2fde (Improved system overview)
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