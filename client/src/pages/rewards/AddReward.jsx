import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Grid } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../../http';
import { useNavigate } from 'react-router-dom';


const allowedPoints = [100, 300, 400, 500, 600]

function AddReward() {
  const navigate = useNavigate();
  const [rewardImage, setImageFile] = useState(null);

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
      if (rewardImage) {
        values.rewardImage = rewardImage;
      }
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

  const onFileChange = (e) => {
    let file = e.target.files[0];
    if (file) {

      let formData = new FormData();
      formData.append('file', file);
      http.post('/file/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
        .then((res) => {
          setImageFile(res.data.filename);
        })
        .catch(function (error) {
          console.log(error.response);
        });
    }
  };

  return (
    <Box sx={{ bgcolor: 'white', p: 2, borderRadius: 8, marginTop: '100px', paddingLeft: '120px', paddingRight: '120px', paddingTop: '50px', paddingBottom: '50px' }}>
      <Typography variant="h5" sx={{ mb: 2, fontSize: '40px', fontWeight: 'bold', textAlign: 'center' }}>
        Add Reward
      </Typography>
      <Box component="form" onSubmit={formik.handleSubmit}>
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
          <Grid item xs={4}>
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
            {
                rewardImage && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center',
                    height: '200px', marginBottom: '40px', marginTop: '20px', 
                    paddingTop: '25px', paddingBottom: '25px', border: '2px solid lightgrey', 
                    borderRadius: '8px', overflow: 'hidden'}}>
                    <img
                      alt="reward"
                      src={`${import.meta.env.VITE_FILE_BASE_URL}${rewardImage}`}
                      style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                    />
                  </Box>
                )
              }
              <Box sx={{ mt: 2, fontWeight: 'bold', textAlign: 'center' }}>
              <Button class="button-upload" variant="contained" component="label">
                Upload Image
                <input hidden accept="image/*" multiple type="file"
                  onChange={onFileChange} />
              </Button>
            </Box> 
              

        <Box sx={{ mt: 2, fontWeight: 'bold', textAlign: 'center' }}>
          <Button variant="contained" color="secondary" type="submit">
            Add
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default AddReward;
   
