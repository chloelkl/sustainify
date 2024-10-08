import React, { useState, useEffect } from "react";
import theme from '../../../themes/MyTheme.js'
import { styled, shadows } from '@mui/system';
import { Button, TextField, Typography, Modal, Box } from "@mui/material";
import { Link } from 'react-router-dom';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';

import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';

const StyledContainer = styled('div')({
  margin: '5vh 2vw',
  display: 'flex',
  justifyContent: 'space-around',
  padding: '0 3rem'
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
  minHeight: '35vw',
  background: theme.palette.secondary.light,
  margin: '2% auto',
  overflow: 'auto',
  boxShadow: '',
})

const Add = styled(Button)({
  backgroundColor: theme.palette.secondary.dark,
  color: theme.palette.secondary.light,
  fontSize: '.7rem',
  height: '30px',
  width: '15%',
  margin: '2vh auto 0',
  '&:hover': {
    backgroundColor: 'grey'
  }
})

const Close = styled(Button)({
  backgroundColor: theme.palette.secondary.light,
  color: theme.palette.secondary.dark,
  border: '1px solid black',
  fontSize: '.7rem',
  height: '30px',
  width: '45%',
  margin: '2vh auto 0',
  '&:hover': {
    backgroundColor: 'grey'
  }
})
const SelectDate = styled(DatePicker)({
  width: '15%',
  margin: '2vh auto 0',
  '& .MuiInputBase-root': {
    height: '30px',
    '& input': {
      height: '30px',
      fontSize: '.7rem'
    }
  },
  '& .MuiSvgIcon-root': {
    fontSize: '1rem',
    margin: '-5px'
  }
})

const ModalDate = styled(DatePicker)({
  width: '20%',
  margin: '2vh auto 0',
  '& .MuiInputBase-root': {
    height: '40px',
    '& input': {
      height: '40px',
      fontSize: '.8rem'
    }
  },
  '& .MuiSvgIcon-root': {
    fontSize: '1rem',
    margin: '-5px'
  }
})

const NewChal = styled(TextField)({
  width: '60%',
  margin: '2vh auto 0',
  '& .MuiInputBase-input': {
    height: '15px',
    fontSize: '.8rem',
    '& input': {
      height: '15px',
    }
  },
  '& .MuiInputLabel-root': {
    fontSize: '.8rem',
    margin: '0'
  }
});

const ModalChal = styled(TextField)({
  width: '75%',
  margin: '2vh auto 0',
  '& .MuiInputBase-input': {
    height: '23px',
    fontSize: '.8rem',
    '& input': {
      height: '23px',
    }
  },
  '& .MuiInputLabel-root': {
    fontSize: '.8rem'
  }
});

const Response = styled(Typography)(({ type }) => ({
  fontSize: '.7rem',
  fontWeight: 'bold',
  width: '100%',
  textAlign: 'center',
  height: '3vh',
  color: type === 'success' ? theme.palette.primary.main : theme.palette.error.main
}));

const Cont = styled('div')({
  width: '95%',
  margin: 'auto',
  display: 'flex',
  justifyContent: 'space-around',
  height: '5vh',

  '& .MuiTypography-root': {
    fontSize: '.8rem',
    verticalAlign: 'center',
    margin: 'auto 0'
  }
});

const SelectManage = styled(SettingsOutlinedIcon)({
  color: theme.palette.primary.main,
  margin: 'auto',
  padding: '5%',
  cursor: 'pointer',
  '&:hover': {
    background: 'lightgrey'
  }
})

const SelectDelete = styled(DeleteOutlineOutlinedIcon)({
  color: theme.palette.error.main,
  margin: 'auto 10%',
  cursor: 'pointer',
  padding: '5%',
  '&:hover': {
    background: 'lightgrey'
  }
})

const ModalBox = styled(Box)({
  width: '60%',
  background: 'white',
  margin: '5% auto',
  padding: '5%'
})

function ManageTask() {
  const [challenge, setChallenge] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [responseMessage, setResponseMessage] = useState('');
  const [responseType, setResponseType] = useState('');
  const [challenges, setChallenges] = useState([]);
  const [openManageModal, setOpenManageModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [currentChallenge, setCurrentChallenge] = useState(null);
  const [currentDate, setCurrentDate] = useState(null);
  const [currentID, setCurrentID] = useState(null)

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/challenge/get`);
      const result = await response.json();
      setChallenges(result);
    } catch (error) {
      console.error('Error fetching challenges:', error);
    }
  };

  const filteredChallenges = challenges.filter(chal => {
    const challengeDate = dayjs(chal.date);
    const tomorrow = dayjs().add(1, 'day').startOf('day');
    return challengeDate.isAfter(tomorrow) || challengeDate.isSame(tomorrow, 'day');
  });

  const handleChallengeChange = (e) => {
    setChallenge(e.target.value);
  };

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
  };

  const handleChallengeEdit = (e) => {
    setCurrentChallenge(e.target.value)
  }
  const handleDateEdit = (date) => {
    setCurrentDate(date)
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      challenge,
      date: selectedDate ? selectedDate.format('YYYY-MM-DD') : null,
    };
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/challenge/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });


      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.errors || result.message || "An error has occurred");
      }
      setResponseMessage(`Success: Challenge '${result.challenge}' created!`);
      setResponseType('success')
      setChallenge('');
      setSelectedDate(null);
      fetchChallenges();
    } catch (error) {
      console.error('Error:', error);
      setResponseMessage(error.message);
      setResponseType('error')
    };

  };

  const handleEdit = async (e) => {
    e.preventDefault();
    const updatedData = {
      challenge: currentChallenge,
      date: currentDate ? currentDate.format('YYYY-MM-DD') : null,
    };
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/challenge/update/${currentID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });


      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.errors || result.message || "An error has occurred");
      }
      setResponseMessage(`Success: Challenge '${updatedData.challenge}' updated!`);
      setResponseType('success')
      setChallenge('');
      setSelectedDate(null);
      fetchChallenges();
    } catch (error) {
      console.error('Error:', error);
      setResponseMessage(error.message);
      setResponseType('error')
    };

  };

  const handleManageClick = (chal) => {
    setCurrentChallenge(chal.challenge);
    setCurrentDate(dayjs(chal.date));
    setCurrentID(chal.id);
    setOpenManageModal(true);
    setResponseMessage('');
  };

  const handleDeleteClick = (chal) => {
    setCurrentChallenge(chal.challenge);
    setCurrentDate(dayjs(chal.date));
    setCurrentID(chal.id);
    setOpenDeleteModal(true);
    setResponseMessage('');
  };

  const handleManageClose = () => {
    setOpenManageModal(false);
    setChallenge('');
    setSelectedDate(null);
    setCurrentChallenge(null);
    setResponseMessage('')
  };

  const handleDeleteClose = () => {
    setOpenDeleteModal(false);
    setChallenge('');
    setSelectedDate(null);
    setCurrentChallenge(null);
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/challenge/delete/${currentID}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error("Failed to delete the challenge");
      }

      setResponseMessage(`Success: Challenge '${currentChallenge}' deleted!`);
      setResponseType('success');
      fetchChallenges();
    } catch (error) {
      console.error('Error:', error);
      setResponseMessage(`Error: ${error.message}`);
      setResponseType('error');
    }
    handleDeleteClose();
  };



  return (
    <StyledContainer>
      <Sidebar>
        <SideNav>
          <AssignmentOutlinedIcon sx={{ color: theme.palette.secondary.light, paddingRight: '5%' }}/>
          <SideLink to="/challenges">Today's Challenge</SideLink>
        </SideNav>
        <SideNav>
          <AssessmentOutlinedIcon sx={{ color: theme.palette.secondary.light, paddingRight: '5%' }}/>
          <SideLink to="/challenges/statistics">Statistics</SideLink>
        </SideNav>
        <SideNav sx={{ background: theme.palette.secondary.dark }}>
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
          <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', justifyContent: 'center', flexDirection: 'row' }} >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <SelectDate value={selectedDate} onChange={handleDateChange} minDate={dayjs()} format="DD/MM/YYYY" />
            </LocalizationProvider>

            <NewChal value={challenge} onChange={handleChallengeChange} label="Enter new challenge" size="small"></NewChal>
            <Add type="submit">Add</Add>
          </form>
          {<Response type={responseType}>{responseMessage}</Response>}
          <hr style={{ width: '95%', margin: '0 auto', height: '.5px', background: 'black' }} />

          <div>
            {filteredChallenges.map((chal, index) => (
              <div key={index}>
                <Cont>
                  <Typography width="15%">{dayjs(chal.date).format('DD/MM/YYYY')}</Typography>
                  <Typography width="60%">{chal.challenge}</Typography>
                  <div style={{ 'width': '10%', display: 'flex', justifyContent: 'center' }}>
                    <SelectManage onClick={() => handleManageClick(chal)} />
                    <SelectDelete onClick={() => handleDeleteClick(chal)} />
                  </div>
                </Cont>
                <hr style={{ width: '95%', margin: '0 auto' }} />
              </div>
            ))}
          </div>
        </ManageContainer>
      </ManageParent>

      {/* for manage modal pop ups */}
      <Modal open={openManageModal} onClose={handleManageClose}>
        <ModalBox>
          <Typography>Edit Challenge</Typography>
          <hr />

          <form onSubmit={handleEdit} style={{ width: '100%', }} >
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <ModalDate value={currentDate} onChange={handleDateEdit} minDate={dayjs()} format="DD/MM/YYYY" />
              </LocalizationProvider>

              <ModalChal value={currentChallenge} onChange={handleChallengeEdit} label="Edit challenge" size="small"></ModalChal>
            </div>
            {<Response type={responseType}>{responseMessage}</Response>}
            <div style={{ margin: '5% auto 0', width: '40%', display: 'flex', justifyContent: 'space-between' }}>
              <Close onClick={handleManageClose}>Close</Close>
              <Add sx={{ width: '45%' }} type="submit">Confirm</Add>
            </div>

          </form>
        </ModalBox>
      </Modal>

      {/* for delete modal pop ups */}
      <Modal open={openDeleteModal} onClose={handleDeleteClose}>
        <ModalBox>
          <Typography>Are you sure you want to Delete:</Typography>
          <hr />

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <ModalDate disabled sx={{ width: '20%' }} value={currentDate} format="DD/MM/YYYY" />
            </LocalizationProvider>

            <ModalChal disabled sx={{ width: '75%' }} value={currentChallenge} label="Challenge" size="small"></ModalChal>
          </div>
          {<Response type={responseType}>{responseMessage}</Response>}
          <div style={{ margin: '5% auto 0', width: '40%', display: 'flex', justifyContent: 'space-between' }}>
            <Close onClick={handleDeleteClose}>Close</Close>
            <Add sx={{ width: '45%', background: theme.palette.error.main }} onClick={handleDeleteConfirm}>Delete</Add>
          </div>

        </ModalBox>
      </Modal>

    </StyledContainer>

  )
}
export default ManageTask;