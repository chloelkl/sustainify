import React, { useState, useEffect } from 'react';
import { Button, Box, Typography, Card, CardContent, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Link } from 'react-router-dom';
import http from '../../http'; // Make sure this import is correct
import RedeemedChart from './RewardChart';

const styles = {
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '16px',
    paddingBottom: '50px',
    justifyContent: 'flex-start',
    margin: '0 auto',
    maxWidth: '1300px', // Optional: set a max-width for the container
  },
  item: {
    flex: '0 1 calc(20% - 16px)',
    maxWidth: 'calc(20% - 16px)',
    boxSizing: 'border-box',
    borderRadius: '12px', // Adjust the border radius as needed
    overflow: 'hidden',
    maxWidth: '80%',
  },
};

function ManageReward() {
  const [rewardList, setRewardList] = useState([]);

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
    getRewards();
  }, []);

  return (
    <>
      <Box sx={{ textAlign: 'center', paddingTop: '100px' }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>Management</Typography>
      </Box>
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: '100px',
        paddingRight: '120px', // Ensure paddingRight is correctly set 
        paddingTop: '50px',
        paddingBottom: '20px',
        maxWidth: '100%', // Ensure the Box doesn't exceed the viewport width
        boxSizing: 'border-box', // Include padding in the element's width
        overflow: 'hidden'
      }}>
        <Typography variant="">Voucher Reset Every Sunday 12:00Am</Typography>
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
                      src={`${import.meta.env.VITE_API_URL}/${reward.rewardImage}`}
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
      <RedeemedChart />
    </>
  );
}

export default ManageReward;
