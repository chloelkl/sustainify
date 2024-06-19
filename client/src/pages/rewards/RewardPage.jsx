import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, TextField, AccessTime, Search, Clear, Edit } from '@mui/material';
import dayjs from 'dayjs';

function RewardPage() {
  const expiryTime = dayjs().add(72, 'hour'); // Set expiry time 72 hours from now
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft()); // State to hold remaining time

  // Function to calculate time left
  function calculateTimeLeft() {
    const now = dayjs();
    const diffSeconds = expiryTime.diff(now, 'second');
    if (diffSeconds <= 0) {
      return { hours: 0, minutes: 0, seconds: 0 };
    }
    const hours = Math.floor(diffSeconds / (60 * 60));
    const minutes = Math.floor((diffSeconds % (60 * 60)) / 60);
    const seconds = diffSeconds % 60;
    return { hours, minutes, seconds };
  }


  // Function to update time left every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <Box sx={{ textAlign: 'center', paddingTop: '100px' }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>Management</Typography>
      </Box>

      <Box>
        <Typography>Voucher Reset: {timeLeft.hours}:{timeLeft.minutes}:{timeLeft.seconds}</Typography>
      </Box>

      <Box>
        <Typography variant="h5" sx={{ my: 2 }}>
          Add Tutorial
        </Typography>
        <Box component="form">
          <TextField
            fullWidth margin="dense" autoComplete="off"
            label="Title"
            name="title"
          />
          <TextField
            fullWidth margin="dense" autoComplete="off"
            multiline minRows={2}
            label="Description"
            name="description"
          />
          <Box sx={{ mt: 2 }}>
            <Button variant="contained" type="submit">
              Add
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default RewardPage;
