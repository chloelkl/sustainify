import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import http from '../../http';
import { Box, Typography, TextField, Button, Grid } from "@mui/material";

const styles = {
  NavigateButton: {
    color: 'black',
    backgroundColor: 'white', // Example background color
    border: 'none',
    borderRadius: '4px',
    padding: '8px 16px',
    fontWeight: 'bold',
    fontSize: '40px',
    cursor: 'pointer',
  },
}


function DeleteReward() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [reward, setReward] = useState({
    rewardname: "",
    points: ""
  });

  useEffect(() => {
    http.get(`/reward/${id}`).then((res) => {
      setReward(res.data);
    }).catch((error) => {
      console.error("Error fetching reward data: ", error);
    });
  }, [id]);

  const handleDelete = async () => {
    try {
      await http.delete(`/reward/${id}`);
      navigate("/rewards/Rewards");
    } catch (error) {
      console.error("Error deleting reward: ", error);
    }
  };

  const handleBack = () => {
    navigate(`/rewards/Rewards`);
  }

  return (
    <>
      <Box
        sx={{
          bgcolor: 'white',
          p: 2,
          borderRadius: 8,
          maxWidth: '800px',
          margin: '50px auto', // Space at the top and bottom, centered horizontally
          paddingLeft: '120px',
          paddingRight: '120px',
          paddingTop: '50px',
          paddingBottom: '50px',
          boxSizing: 'border-box',
        }}
      >
        <button
          onClick={handleBack}
          variant="contained"
          style={styles.NavigateButton}
        >
          &lt;
        </button>
        <Typography variant="h5" sx={{ mb: 2, fontSize: '40px', fontWeight: 'bold', textAlign: 'center' }}>
          Delete Reward
        </Typography>
        <Box>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={8}>
              <TextField
                fullWidth
                margin="normal"
                autoComplete="off"
                label="Reward Name"
                name="rewardname"
                value={reward.rewardname}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                margin="normal"
                autoComplete="off"
                label="Points"
                name="points"
                value={reward.points}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
          </Grid>
          <Box sx={{
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            height: '200px', marginBottom: '40px', marginTop: '20px',
            paddingTop: '25px', paddingBottom: '25px', border: '2px solid lightgrey',
            borderRadius: '8px', overflow: 'hidden'
          }}>
            <img
              alt="reward"
              src={`${import.meta.env.VITE_API_URL}/${reward.rewardImage}`}
              style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
            />
          </Box>


          <Box sx={{ mt: 2, fontWeight: 'bold', textAlign: 'center' }}>
            <Button variant="contained" onClick={handleDelete}>
              Delete
            </Button>
          </Box>
        </Box>
      </Box>

      <Box sx={{
        height: '1rem'
      }}>
        <Typography>
        </Typography>
      </Box>
    </>
  );
}

export default DeleteReward;
