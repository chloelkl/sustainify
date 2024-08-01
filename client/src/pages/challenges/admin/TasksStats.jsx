import React, { useState, useEffect } from "react";
import theme from '../../../themes/MyTheme.js';
import ParticipationChart from '../charts/ParticipationChart.jsx';
import { styled, shadows } from '@mui/system';
import { Button, TextField, Typography, Modal, Box } from "@mui/material";
import { Link } from 'react-router-dom';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';

import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';

const StyledContainer = styled('div')({
  margin: '5vh 2vw',
  display: 'flex',
  justifyContent: 'space-around'
});

const Sidebar = styled('div')({
  width: '22vw',
  height: '75vh',
  background: theme.palette.primary.light,
});

const SideNav = styled('div')({
  height: '10%',
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
});

const  SideLink = styled(Link)({
  color: theme.palette.secondary.light,
  textDecoration: 'none',
  width: '130px'
});

const ManageParent = styled('div')({
  width: '80vw',
  height: '80vh',
})

const ManageContainer = styled('div')({
  width: '80%',
  height: '80%',
  background: theme.palette.secondary.light,
  margin: '5% auto',
  overflow: 'auto',
  boxShadow: '',
})



function TasksStats() {
  



  return (
    <StyledContainer>
      <Sidebar>
        <SideNav>
          <AssignmentOutlinedIcon sx={{ color: theme.palette.secondary.light, paddingRight: '5%' }}/>
          <SideLink to="/challenges">Today's Challenge</SideLink>
        </SideNav>
        <SideNav sx={{ background: theme.palette.secondary.dark }}>
          <AssessmentOutlinedIcon sx={{ color: theme.palette.secondary.light, paddingRight: '5%' }}/>
          <SideLink to="/challenges/statistics">Statistics</SideLink>
        </SideNav>
        <SideNav>
          <ManageAccountsOutlinedIcon sx={{ color: theme.palette.secondary.light, paddingRight: '5%' }}/>
          <SideLink to="/challenges/manage">Manage</SideLink>
        </SideNav>
        <SideNav>
          <GroupsOutlinedIcon sx={{ color: theme.palette.secondary.light, paddingRight: '5%' }}/>
          <SideLink to="/challenges/participation">Participation</SideLink>
        </SideNav>
      </Sidebar>
      <ManageParent>
        <ManageContainer sx={{ boxShadow: 2 }}>
          <ParticipationChart/>
        </ManageContainer>
      </ManageParent>

      

    </StyledContainer>

  )
}
export default TasksStats;