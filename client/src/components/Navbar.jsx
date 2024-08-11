// client/src/components/Navbar.jsx
import React from 'react';
import { AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { styled } from '@mui/system';
import AccountCircle from '@mui/icons-material/AccountCircle';
import theme from '../themes/MyTheme.js';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, admin, role, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleProfileClick = () => {
    if (role === 'admin') {
      navigate('/account/admin/main');
    } else {
      navigate(`/forum/by/${user.userID}`);
    }
  };

  const handleEventsClick = () => {
    if (role === 'admin') {
      navigate('/posteventadmin');
    } else if (user) {
      navigate('/eventoverview');
    } else {
      navigate('/account/login');
    }
  };
  const handleForumsClick = () => {
    if (role === 'admin') {
      navigate('/forum/admin');
    } else if (user) {
      navigate('/forum');
    } else {
      navigate('/account/login');
    }
  };

  const handleRewardsClick = () => {
    if (role === 'admin') {
      navigate('/rewards/Rewards');
    } else if (user){
      navigate(`/userreward/${user.userID}`);
    }
  };

  return (
    <AppBar position="fixed" style={{ zIndex: 1300, backgroundColor: '#84a9ac' }}>
      <StyledToolbar>
        <NavLinks>
          <StyledLink to="/challenges">
            <Typography>CHALLENGES</Typography>
          </StyledLink>
          {(role === 'admin' || user) ? (
            <IconButton color="inherit" onClick={handleEventsClick}>
          <StyledLink >
            <Typography>EVENTS</Typography>
          </StyledLink>
          </IconButton>
          ): (
            <AuthLinks>
              <StyledLink to="/account/signup">
                <Typography variant='body2'>EVENTS</Typography>
              </StyledLink>
            </AuthLinks>

          )}
          
          <StyledLink to="/">
            <Logo src="/Logo.png" alt="sustainify" />
          </StyledLink>
          {(role === 'admin' || user) ? (
            <IconButton color="inherit" onClick={handleForumsClick}>
            <StyledLink >
              <Typography>FORUM</Typography>
            </StyledLink>
            </IconButton>
          ): (
            <AuthLinks>
              <StyledLink to="/account/signup">
                <Typography variant='body2'>FORUM</Typography>
              </StyledLink>
            </AuthLinks>
          )}
          {user || admin ? (
            <IconButton color="inherit" onClick={handleRewardsClick}>
              <StyledLink>
                <Typography>REWARDS</Typography>
              </StyledLink>
            </IconButton>
          ) : (
            <AuthLinks>
              <StyledLink to="/account/signup">
                <Typography variant="body2">REWARDS</Typography>
              </StyledLink>
            </AuthLinks>
          )}          
          {user || admin ? (
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
