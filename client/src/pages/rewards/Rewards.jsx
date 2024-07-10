import React, { useState, useEffect } from "react";
import { Button, Box, Typography, Card, CardContent, IconButton } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import http from '../../http';
import { Link } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import dayjs from 'dayjs';

const styles = {
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '16px', // Adjust spacing as needed
  },
  item: {
    flex: '0 1 calc(20% - 16px)', // Ensure each item takes up 20% width minus the gap
    maxWidth: 'calc(20% - 16px)', // Ensure maximum width of 20% minus the gap
    boxSizing: 'border-box',
  },
};

function ManageReward() {
  const [rewardList, setRewardList] = useState([]);
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

  useEffect(() => {
    http.get('/reward').then((res) => {
      console.log(res.data);
      setRewardList(res.data);
    });
  }, []);

  return (
    <>
      <Box sx={{ textAlign: 'center', paddingTop: '100px' }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>Management</Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingLeft: '60px', paddingRight: '90px', paddingTop: '50px', paddingBottom: '20px' }}>
        <Typography variant="h5">Voucher Reset: {timeLeft.hours}:{timeLeft.minutes}:{timeLeft.seconds}</Typography>
        <Link to="/rewards/AddReward" style={{ textDecoration: 'none' }}>
          <Button variant='contained'>
            Add
          </Button>
        </Link>
      </Box>
      <Box>
        
        <div style={styles.container}>
          {rewardList.map((reward, i) => (
            <div style={styles.item} key={reward.id}>
              <Card>
              <Typography variant="h4" sx={{ fontWeight: 'bold',textAlign: 'center', paddingTop: '50px' }}>IMAGE</Typography>
                <CardContent  style={{ textAlign: 'center', paddingTop: '50px', paddingBottom: '3 0px' }}>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    {reward.rewardname}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1, color: 'grey' }}>
                    {reward.points} points
                  </Typography>
                  <Link to={`/rewards/EditReward/${reward.id}`} style={{ textDecoration: 'none' }}>
                    <IconButton color="primary" style={{ paddingRight: '20px', paddingTop: '20px'}}>
                      <EditIcon />
                    </IconButton>
                  </Link>
                  <Link to={`/rewards/DeleteReward/${reward.id}`} style={{ textDecoration: 'none'}}>
                    <IconButton color="primary" style={{ paddingLeft: '20px', paddingTop: '20px'}}>
                      <DeleteIcon />
                    </IconButton>
                  </Link>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>


      </Box>
    </>
  );
}

export default ManageReward;
