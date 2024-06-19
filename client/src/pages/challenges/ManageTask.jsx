import React, { useState } from "react";
import theme from '../../themes/MyTheme.js'
import { styled, shadows } from '@mui/system';
import { Button, TextField } from "@mui/material";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';

const StyledContainer = styled('div')({
  margin: '5vh 2vw',
  display: 'flex',
  justifyContent: 'space-around'
});

const PlaceholderSidebar = styled('div')({
  width: '20vw',
  height: '80vh',
  background: theme.palette.primary.light,
});

const ManageParent = styled('div')({
  width: '80vw',
  height: '80vh',
})

const ManageContainer = styled('div')({
  width: '80%',
  height: '80%',
  background: theme.palette.secondary.light,
  margin: '5% auto'
})

const Add = styled(Button)({
  backgroundColor: theme.palette.secondary.dark,
  color: theme.palette.secondary.light,
  fontSize: '.7rem',
  height: '30px',
  width: '15%',
  margin: '3vh auto',
  '&:hover': {
    backgroundColor: 'grey'
  }
})
const SelectDate = styled(DatePicker)({
  width: '20%',
  margin: '3vh auto',
  '& .MuiInputBase-root': {
    height: '30px',
    '& input': {
      height: '30px',
      fontSize: '.7rem'
    }
  },
  '& .MuiSvgIcon-root' : {
    fontSize: '1rem',
    margin: '-5px'
  }
})
const NewChal = styled(TextField)({
  width: '50%', 
  margin: '3vh auto', 
  '& .MuiInputBase-input': {
    height: '15px',
  fontSize: '.7rem',
    '& input': {
      height: '15px',
    }
  },
  '& .MuiInputLabel-root': {
    fontSize: '.7rem'
  }
});

function ManageTask() {
  const [challenge, setChallenge] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [responseMessage, setResponseMessage] = useState('');

  const handleChallengeChange = (e) => {
    setChallenge(e.target.value);
  };

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      challenge,
      date: selectedDate ? selectedDate.format('YYYY-MM-DD'): null,
    };
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/challenge/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("An error has occured")
      }

      const result = await response.json();
      setResponseMessage(`Success: Challenge ${result.name} created!`);
      setName('');
      setSelectedDate(null);
    } catch (error) {
      console.error('Error:', error);
      setResponseMessage(`Error: ${error.message}`);
    };
    
  }



  return (
    <StyledContainer>
      <PlaceholderSidebar></PlaceholderSidebar>
      <ManageParent>
        <ManageContainer sx={{ boxShadow: 2 }}>
          <form onSubmit={handleSubmit} style={{width: '100%', display: 'flex', justifyContent: 'center'}} >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <SelectDate value={selectedDate} onChange={handleDateChange} minDate={dayjs()}/>
            </LocalizationProvider>
            
            <NewChal value={challenge} onChange={handleChallengeChange} label="Enter new challenge" size="small"></NewChal>
            <Add type="submit">Add</Add>
          </form>
          <hr style={{width: '95%', margin: '0 auto'}}/>
          
        </ManageContainer>
      </ManageParent>

    </StyledContainer>

  )
}
export default ManageTask;