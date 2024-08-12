import React, { useState, useEffect } from "react";
import theme from '../../themes/MyTheme.js';
import { styled } from '@mui/system';
import { Typography, Button, Modal, Box, TextField } from "@mui/material";
import { Link, useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { useAuth } from '../../context/AuthContext';
import { Formik, Form, ErrorMessage } from 'formik';
import * as yup from 'yup';
import http from '../../http';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
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

const DailyContainer = styled('div')({
  width: '80%',
  height: '80%',
  minHeight: '35vw',
  background: theme.palette.secondary.light,
  margin: '2% auto',
  textAlign: 'center'
});

const ChallengeIcon = styled('img')({
  width: '20%',
  maxWidth: '15vh',
  margin: '10% auto 0'
});

const Complete = styled(Button)(({ disabled }) => ({
  backgroundColor: disabled ? 'grey' : theme.palette.secondary.dark,
  color: theme.palette.secondary.light,
  fontSize: '1rem',
  height: '50px',
  width: '35%',
  margin: '5% auto 0',
  display: 'flex',
  justifyContent: 'space-around',
  pointerEvents: 'fill !important',
  cursor: disabled ? 'not-allowed !important' : 'pointer',
  '&:hover': {
    backgroundColor: 'grey'
  },
  '& p': {
    color: disabled ? 'lightgrey' : theme.palette.secondary.light,
  } 
}));

function DailyChallenge() {
  const { user, admin, authToken } = useAuth();
  const [daily, setDaily] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [participants, setParticipants] = useState(0);
  const [imagePreview, setImagePreview] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    fetchDaily();
  }, []);

  useEffect(() => {
    if (daily && user) {
      fetchCompleted(user.userID, daily.id);
    } else if (daily && admin) {
      fetchParticipants(daily.id);
    }
  }, [daily, user, admin]);


  const fetchDaily = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/challenge/getDaily`);
      const result = await response.json();
      setDaily(result);
    } catch (error) {
      console.error('Error fetching challenge:', error);
    }
  };

  const fetchCompleted = async (userId, challengeId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/challenge/checkCompletion?userId=${userId}&challengeId=${challengeId}`);
      const result = await response.json();
      setCompleted(result.completed);
    } catch (error) {
      console.error('Error checking completion:', error);
    }
  };

  const fetchParticipants = async (challengeId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/challenge/countToday?challengeId=${challengeId}`);
      const result = await response.json();
      setParticipants(result);
    } catch (error) {
      console.error('Error fetching participants:', error);
    }
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleComplete = async () => {
    if (!daily) return;
    handleOpenModal(); // Open the modal
  };

  const handlePublish = async (values) => {
    if (!daily) return;
  
    const formData = new FormData();
    formData.append('userId', user.userID);
    formData.append('title', values.title.trim());
    formData.append('description', values.description.trim());
    formData.append('image', values.image);
    formData.append('challengeId', daily.id);
    try {
      // Post the challenge completion and forum data
      const response = await fetch(`${import.meta.env.VITE_API_URL}/challenge/completeChallenge`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
        body: formData,
      });
  
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }
  
      setCompleted(true); // Mark challenge as completed
      handleCloseModal(); // Close the modal after successful submission
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const initialValues = {
    title: "",
    description: "",
    image: null
  };

  const validationSchema = yup.object({
    title: yup.string().trim()
      .min(3, 'Title must be at least 3 characters')
      .max(100, 'Title must be at most 100 characters')
      .required('Title is required'),
    description: yup.string().trim()
      .min(3, 'Description must be at least 3 characters')
      .max(500, 'Description must be at most 500 characters')
      .required('Description is required'),
    image: yup.mixed().required('Image is required')
  });

  return (
    <StyledContainer>
      {admin ? (
        <Sidebar>
          <SideNav sx={{ background: theme.palette.secondary.dark }}>
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
          <SideNav>
            <GroupsOutlinedIcon sx={{ color: theme.palette.secondary.light, paddingRight: '5%' }} />
            <SideLink to="/challenges/participation">Participation</SideLink>
          </SideNav>
        </Sidebar>
      ) : (
        <Sidebar>
          <SideNav sx={{ background: theme.palette.primary.main }}>
            <AssignmentOutlinedIcon sx={{ color: theme.palette.secondary.light, paddingRight: '5%' }} />
            <SideLink to="/challenges">Today's Challenge</SideLink>
          </SideNav>
          <SideNav>
            <HistoryOutlinedIcon sx={{ color: theme.palette.secondary.light, paddingRight: '5%' }} />
            <SideLink to="/challenges/past">Past Challenges</SideLink>
          </SideNav>
        </Sidebar>
      )}

      <ManageParent>
        <DailyContainer sx={{ boxShadow: 2 }}>
          <ChallengeIcon src="/ChallengeIcon.png" alt="" />
          <Typography style={{ fontWeight: 'bold' }} variant="h6">Challenge of the Day</Typography>
          <Typography variant="body2">{dayjs(daily?.date).format('DD/MM/YYYY')}</Typography>
          <br />
          <Typography>
            {daily?.challenge ? daily.challenge : "No challenge set for today."}
          </Typography>
          <Complete disabled={completed || !daily?.challenge || admin} onClick={handleComplete}>
            <p>Complete</p>
            <CameraAltOutlinedIcon />
          </Complete>
          {completed && (
            <Typography sx={{ mt: '3%' }}>You've completed today's challenge!</Typography>
          )}
          {admin && (
            <Typography sx={{ mt: '3%' }}>
              {participants.count > 0 ? `${participants.count} people have participated today!` : "No one has participated yet."}
            </Typography>
          )}
        </DailyContainer>
      </ManageParent>

      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            maxWidth: '600px',
            width: '100%',
            mx: 'auto',
            p: 3,
            backgroundColor: 'white',
            borderRadius: 2,
            boxShadow: 3,
            mt: '10%'
          }}
        >
          <Typography variant="h5" sx={{ my: 2, fontWeight: 'bold', textAlign: 'center' }}>
            Complete Challenge
          </Typography>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handlePublish}
            enableReinitialize
          >
            {formik => (
              <Form>
                <TextField
                  fullWidth
                  margin="dense"
                  autoComplete="off"
                  label="Title"
                  name="title"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.title && Boolean(formik.errors.title)}
                  helperText={formik.touched.title && formik.errors.title}
                />
                <TextField
                  fullWidth
                  margin="dense"
                  autoComplete="off"
                  multiline
                  minRows={3}
                  label="Describe your experience doing today's challenge!"
                  name="description"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.description && Boolean(formik.errors.description)}
                  helperText={formik.touched.description && formik.errors.description}
                />
                <Button variant="contained" component="label" fullWidth sx={{ mt: 2 }}>
                  Upload Image
                  <input
                    type="file"
                    hidden
                    onChange={(event) => {
                      const file = event.currentTarget.files[0];
                      formik.setFieldValue('image', file);
                      if (file) {
                        setImagePreview(URL.createObjectURL(file));
                      }
                    }}
                  />
                </Button>
                <ErrorMessage name="image" component="div" className="field-error" />
                {imagePreview && (
                  <Box mt={2}>
                    <Typography variant="body2">Selected file:</Typography>
                    <img src={imagePreview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '120px', marginTop: '10px' }} />
                  </Box>
                )}
                <Box sx={{ mt: 3, textAlign: 'center' }}>
                  <Button variant="contained" type="submit">
                    Publish
                  </Button>
                </Box>
              </Form>
            )}
          </Formik>
        </Box>
      </Modal>
    </StyledContainer>
  );
}

export default DailyChallenge;
