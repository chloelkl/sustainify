// client/src/components/Navbar.jsx
import React from 'react';
import { AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { styled } from '@mui/system';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useAuth } from '../context/AuthContext'; // Import the Auth context

const StyledToolbar = styled(Toolbar)({
  display: 'flex',
  justifyContent: 'space-around',
  alignItems: 'center',
});

const NavLinks = styled('div')({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  justifyContent: 'space-between',
  padding: '0 20px',
});

const Logo = styled('img')({
  height: '40px',
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

const AuthLinks = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
});

function Navbar() {
  const { isAuthenticated, user } = useAuth(); // Get the auth status and user details
  const navigate = useNavigate();

  const handleProfileClick = () => {
    if (user.role === 'admin') {
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
            <Logo src="/src/assets/Logo_XBG.png" alt="LOGO" /> {/* Use your logo image path */}
          </StyledLink>
          <StyledLink to="/forum">
            <Typography>FORUM</Typography>
          </StyledLink>
          <StyledLink to="/rewards">
            <Typography>REWARDS</Typography>
          </StyledLink>
          {isAuthenticated ? (
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

export default Navbar;
