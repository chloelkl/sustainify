import React from 'react';
import { Outlet } from 'react-router-dom';
import { Container } from '@mui/material';

const MainLayout = () => {
  return (
    <Container style={{ padding: 0, maxWidth: '100%' }}>
      {/* Main app-specific styles */}
      <Outlet />  {/* This renders the matched child route */}
    </Container>
  );
};

export default MainLayout;
