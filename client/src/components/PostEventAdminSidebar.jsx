import React from 'react';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
// import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import { Sidebar, SideNav, SideLink } from './PostEventAdminSidebar.styles'; // Adjust the path as needed
import theme from '../themes/MyTheme'; // Adjust the path to where your theme is located

const SidebarComponent = () => {
  return (
    <Sidebar>
      <SideNav sx={{ background: theme.palette.secondary.dark }}>
        <ManageAccountsOutlinedIcon sx={{ color: theme.palette.secondary.light, paddingRight: '5%' }}/>
        <SideLink to="../posteventadmin">Upcoming Events</SideLink>
      </SideNav>
      <SideNav>
        <AssignmentOutlinedIcon sx={{ color: theme.palette.secondary.light, paddingRight: '5%' }}/>
        <SideLink to="../createeventadmin">Create Events</SideLink>
      </SideNav>
      <SideNav >
        <AssessmentOutlinedIcon sx={{ color: theme.palette.secondary.light, paddingRight: '5%' }}/>
        <SideLink to="../eventhostingadmin">Hosting Details</SideLink>
      </SideNav>
      <SideNav >
        <AssessmentOutlinedIcon sx={{ color: theme.palette.secondary.light, paddingRight: '5%' }}/>
        <SideLink to="../eventstatisticsadmin">Event Statistics</SideLink>
      </SideNav>
    </Sidebar>
  );
};

export default SidebarComponent;
