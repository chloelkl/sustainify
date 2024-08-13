import React from 'react';
import { Outlet } from 'react-router-dom';
import { Container } from '@mui/material';

const AccountLayout = () => {
  return (
    <Container>
      {/* Account-specific styles */}
      <Outlet />  {/* This renders the matched child route */}
    </Container>
  );
};

export default AccountLayout;
