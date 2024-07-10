// client/src/components/Navbar.jsx
import React from 'react';
import { AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { styled } from '@mui/system';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, role, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleProfileClick = () => {
    if (role === 'admin') {
      navigate('/account/admin/main');
    } else {
      navigate('/account/user/main');
    }
  };

  return (
    <AppBar position="fixed" style={{ zIndex: 1300, backgroundColor: '#84a9ac' }}>
      <StyledToolbar>
        <NavLinks>
          <StyledLink to="/challenges">
            <Typography>CHALLENGES</Typography>
          </StyledLink>
          <StyledLink to="/events">
            <Typography>EVENTS</Typography>
          </StyledLink>
          <StyledLink to="/">
            <Logo src="/Logo.png" alt="sustainify" />
          </StyledLink>
          <StyledLink to="/forum">
            <Typography>FORUM</Typography>
          </StyledLink>
          <StyledLink to="/rewards">
            <Typography>REWARDS</Typography>
          </StyledLink>
          {user ? (
            <IconButton color="inherit" onClick={handleProfileClick}>
              <AccountCircle />
            </IconButton>
          ) : (
            <AuthLinks>
              <StyledLink to="/account/signup">
                <Typography variant="body2">SIGNUP</Typography>
              </StyledLink>
              <StyledLink to="/account/login">
                <Typography variant="body2">LOGIN</Typography>
              </StyledLink>
            </AuthLinks>
          )}
        </NavLinks>
      </StyledToolbar>
    </AppBar>
  );
}


const StyledToolbar = styled(Toolbar)({
  display: 'flex',
  justifyContent: 'space-around',
  height: '100px'
});

const NavLinks = styled('div')({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  justifyContent: 'space-between',
  padding: '0 20px',
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

const AuthLinks = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
});

export default Navbar;
