import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import http from '../../http';
import { Box, Typography, TextField, Button, Grid } from "@mui/material";
import { useFormik } from 'formik';
import * as yup from 'yup';

function EditReward() {
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

  const formik = useFormik({
    initialValues: reward,
    enableReinitialize: true,
    validationSchema: yup.object({
      rewardname: yup.string().trim()
        .min(3, 'Reward Name must be at least 3 characters')
        .max(100, 'Reward Name must be at most 100 characters')
        .required('Reward Name is required'),
      points: yup.number()
        .required('Points are required')
        .typeError('Points must be a number')
        .positive('Points must be a positive number')
        .integer('Points must be an integer')
    }),
    onSubmit: async (data) => {
      try {
        data.rewardname = data.rewardname.trim();
        data.points = data.points.toString().trim();
        const res = await http.put(`/reward/${id}`, data);
        console.log(res.data);
        navigate("/rewards/Rewards");
      } catch (error) {
        console.error("Error updating reward data: ", error);
      }
    }
  });

  return (
    <Box sx={{ bgcolor: 'white', p: 2, borderRadius: 8, marginTop: '100px', paddingLeft: '120px', paddingRight: '120px', paddingTop: '50px', paddingBottom: '50px' }}>
      <Typography variant="h5" sx={{ mb: 2, fontSize: '40px', fontWeight: 'bold', textAlign: 'center' }}>
        Edit Reward
      </Typography>
      {
        !loading && (
          <Box>
            

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
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    margin="normal"
                    autoComplete="off"
                    label="Points"
                    name="points"
                    value={formik.values.points}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.points && Boolean(formik.errors.points)}
                    helperText={formik.touched.points && formik.errors.points}
                  />

                </Grid>
                </Grid>

                <Box sx={{ mt: 2, fontWeight: 'bold', textAlign: 'center'}}>
                  <Button variant="contained" color="secondary" type="submit">
                    Edit
                  </Button>
                </Box>
              </form>
            

          </Box>
        )
      }
    </Box>
  );
}

export default EditReward;




