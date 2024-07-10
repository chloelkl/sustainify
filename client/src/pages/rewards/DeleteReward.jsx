import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import http from '../../http';
import { Box, Typography, TextField, Button, Grid } from "@mui/material";

function DeleteReward() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [reward, setReward] = useState({
    rewardname: "",
    points: ""
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    http.get(`/reward/${id}`).then((res) => {
      setReward(res.data);
      setLoading(false);
    }).catch((error) => {
      console.error("Error fetching reward data: ", error);
      setLoading(false);
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

  return (
    <Box sx={{ bgcolor: 'white', p: 2, borderRadius: 8, marginTop: '100px', paddingLeft: '120px', paddingRight: '120px', paddingTop: '50px', paddingBottom: '50px' }}>
      <Typography variant="h5" sx={{ mb: 2, fontSize: '40px', fontWeight: 'bold', textAlign: 'center' }}>
        Delete Reward
      </Typography>
      {
        !loading && (
          <Box>
            <Grid container spacing={6} alignItems="center">
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

            <Box sx={{ mt: 2, fontWeight: 'bold', textAlign: 'center'}}>
              <Button variant="contained" color="secondary" onClick={handleDelete}>
                Delete
              </Button>
            </Box>
          </Box>
        )
      }
    </Box>
  );
}

export default DeleteReward;
