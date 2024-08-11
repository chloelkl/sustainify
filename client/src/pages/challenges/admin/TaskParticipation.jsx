import React, { useState, useEffect } from "react";
import { styled } from '@mui/system';
import { Box, Typography, Card, CardMedia, CardContent, TextField } from '@mui/material';
import { Link } from 'react-router-dom';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import Masonry from "react-responsive-masonry";
import { useAuth } from '../../../context/AuthContext';
import theme from '../../../themes/MyTheme.js';

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

const SideLink = styled(Link)({
  color: theme.palette.secondary.light,
  textDecoration: 'none',
  width: '130px'
});

const ManageParent = styled('div')({
  width: '80vw',
  height: '80vh',
});

const ManageContainer = styled('div')({
  width: '80%',
  height: '80%',
  background: theme.palette.secondary.light,
  margin: '5% auto',
  overflow: 'auto',
  boxShadow: '',
});

function TaskParticipation() {
  const { authToken } = useAuth();
  const [forumList, setForumList] = useState([]);
  const [selectedDate, setSelectedDate] = useState(dayjs());

  // Fetch forums by the selected date
  const fetchForumsByCompletionDate = async (date) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/challenge/forumsByCompletionDate?date=${date.format('YYYY-MM-DD')}`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      const data = await response.json();
      if (Array.isArray(data)) {
        setForumList(data);
      } else {
        setForumList([]);
      }
    } catch (error) {
      console.error('Error fetching forums by completion date:', error);
    }
  };

  useEffect(() => {
    fetchForumsByCompletionDate(selectedDate);
  }, [selectedDate]);

  const ForumItems = forumList.map((item) => {
    return (
      <Card key={item.id} sx={{ mb: 2, boxShadow: 3 }}>
        <Link to={`/forum/by/${item.userId}`} style={{ textDecoration: 'none' }}>
          <CardMedia
            component="img"
            image={item.image ? `${import.meta.env.VITE_API_URL}/${item.image}` : 'https://images.pexels.com/photos/355508/pexels-photo-355508.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'}
            alt={item.title}
            sx={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: '4px 4px 0 0' }}
          />
          <CardContent sx={{ padding: 2 }}>
            <Typography
              variant="h5"
              component="div"
              sx={{ wordWrap: 'break-word', mb: 1, fontWeight: 'bold' }}
            >
              {item.title}
            </Typography>
            <Typography
              variant="body1"
              component="div"
              sx={{ wordWrap: 'break-word', mb: 2 }}
            >
              {item.description}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {item.User?.username}
            </Typography>
          </CardContent>
        </Link>
      </Card>
    );
  });

  return (
    <StyledContainer>
      <Sidebar>
        <SideNav>
          <AssignmentOutlinedIcon sx={{ color: theme.palette.secondary.light, paddingRight: '5%' }} />
          <SideLink to="/challenges">Today's Challenge</SideLink>
        </SideNav>
        <SideNav>
          <AssessmentOutlinedIcon sx={{ color: theme.palette.secondary.light, paddingRight: '5%' }} />
          <SideLink to="/challenges/statistics">Statistics</SideLink>
        </SideNav>
        <SideNav>
          <ManageAccountsOutlinedIcon sx={{ color: theme.palette.secondary.light, paddingRight: '5%' }} />
          <SideLink to="/challenges/manage">Manage</SideLink>
        </SideNav>
        <SideNav sx={{ background: theme.palette.secondary.dark }}>
          <GroupsOutlinedIcon sx={{ color: theme.palette.secondary.light, paddingRight: '5%' }} />
          <SideLink to="/challenges/participation">Participation</SideLink>
        </SideNav>
      </Sidebar>
      <ManageParent>
        <ManageContainer sx={{ boxShadow: 2 }}>
          <Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: 2,
                backgroundColor: 'white',
                borderRadius: 2,
                padding: 1,
                boxShadow: 1,
              }}
            >
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  maxDate={dayjs()}
                  value={selectedDate}
                  onChange={(newValue) => {
                    setSelectedDate(newValue);
                  }}
                  format="DD/MM/YYYY"
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </Box>
            <div className="Forum" style={{ padding: "20px" }}>
              {forumList.length > 0 ? (
                <Masonry columnsCount={3} gutter="10px">
                {ForumItems}
              </Masonry>
              ) : (
                <Typography>No participation on this date</Typography>
              )}
              
            </div>
          </Box>
        </ManageContainer>
      </ManageParent>
    </StyledContainer>
  );
}

export default TaskParticipation;
