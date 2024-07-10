import React from 'react';
import { Box, Typography, TextField, Button, Grid } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../../http';
import { useNavigate } from 'react-router-dom';


const allowedPoints = [100, 300, 400, 500, 600]

function AddReward() {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      rewardname: '',
      points: '',
    },
    validationSchema: yup.object({
      rewardname: yup.string().trim()
        .min(3, 'Reward name must be at least 3 characters')
        .max(100, 'Reward name must be at most 100 characters')
        .required('Reward name is required'),
      points: yup.number()
        .required('Points are required')
        .oneOf(allowedPoints, 'Select one: 100, 300, 400, 500, 600')
        .typeError('Points must be a number')
        .positive('Points must be a positive number')
        .integer('Points must be an integer'),
    }),
    onSubmit: (values) => {
      http.post('/reward', values)
        .then((res) => {
          console.log(res.data);
          navigate('/rewards/Rewards'); // Navigate to the correct route after adding a reward
        })
        .catch((error) => {
          console.error('Error adding reward:', error);
          // Handle error appropriately, e.g., show error message to the user
        });
    },
  });

  return (
    <Box sx={{ bgcolor: 'white', p: 2, borderRadius: 8, marginTop: '100px', paddingLeft: '120px', paddingRight: '120px', paddingTop: '50px', paddingBottom: '50px'}}>
      <Typography variant="h5" sx={{ mb: 2, fontSize: '40px', fontWeight: 'bold', textAlign: 'center' }}>
        Add Reward
      </Typography>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={8}>
            <TextField
              fullWidth
              margin="normal"
              autoComplete="off"
              label="Reward Name"
              name="rewardname"
              value={formik.values.rewardname}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.rewardname && Boolean(formik.errors.rewardname)}
              helperText={formik.touched.rewardname && formik.errors.rewardname}
            />
          </Grid>
          <Grid item  xs={4}>
            <TextField
              fullWidth
              margin="normal"
              autoComplete="off"
              label="Points"
              name="points"
              type="number"
              value={formik.values.points}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.points && Boolean(formik.errors.points)}
              helperText={formik.touched.points && formik.errors.points}
            />
          </Grid>
        </Grid>
        <Box sx={{ mt: 2, fontWeight: 'bold', textAlign: 'center' }}>
          <Button variant="contained" color="secondary" type="submit">
            Add
          </Button>
        </Box>
      </form>
    </Box>
  );
}

export default AddReward;