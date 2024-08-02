import React, { useState, useEffect } from 'react';
import { Button, Box, Typography, Card, CardContent, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
import http from '../../http'; // Make sure this import is correct

const styles = {
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '16px',
  },
  item: {
    flex: '0 1 calc(20% - 16px)',
    maxWidth: 'calc(20% - 16px)',
    boxSizing: 'border-box',
  },
};

function ManageReward() {
  const [rewardList, setRewardList] = useState([]);
  const expiryTime = dayjs().add(72, 'hour');
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

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

  const getRewards = () => {
    http.get('/reward').then((res) => {
      console.log('API response:', res.data);
      if (Array.isArray(res.data)) {
        setRewardList(res.data);
      } else {
        setRewardList([]);
      }
    }).catch((error) => {
      console.error('API error:', error);
      setRewardList([]);
    });
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    getRewards();
  }, []);

  return (
    <>
      <Box sx={{ textAlign: 'center', paddingTop: '100px' }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>Management</Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingLeft: '60px', paddingRight: '90px', paddingTop: '50px', paddingBottom: '20px' }}>
        <Typography variant="h5">Voucher Reset: {timeLeft.hours}:{timeLeft.minutes}:{timeLeft.seconds}</Typography>
        <Link to="/rewards/AddReward" style={{ textDecoration: 'none' }}>
          <Button variant='contained'>Add</Button>
        </Link>
      </Box>
      <div style={styles.container}>
        {rewardList.map((reward) => (
          <div style={styles.item} key={reward.id}>
            <Card>
              <CardContent style={{ textAlign: 'center', paddingTop: '20px', paddingBottom: '20px' }}>
                {reward.rewardImage && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px', marginBottom: '40px', marginTop: '20px' }}>
                    <img
                      alt="reward"
                      src={`${import.meta.env.VITE_FILE_BASE_URL}${reward.rewardImage}`}
                      style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                    />
                  </Box>
                )}
                <Typography variant="h6" sx={{ mb: 1 }}>
                  {reward.rewardname}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1, color: 'grey' }}>
                  {reward.points} points
                </Typography>
                <Link to={`/rewards/EditReward/${reward.id}`} style={{ textDecoration: 'none' }}>
                  <IconButton color="primary" style={{ paddingRight: '10px', paddingTop: '10px' }}>
                    <EditIcon />
                  </IconButton>
                </Link>
                <Link to={`/rewards/DeleteReward/${reward.id}`} style={{ textDecoration: 'none' }}>
                  <IconButton color="primary" style={{ paddingLeft: '10px', paddingTop: '10px' }}>
                    <DeleteIcon />
                  </IconButton>
                </Link>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </>
  );
}

export default ManageReward;
