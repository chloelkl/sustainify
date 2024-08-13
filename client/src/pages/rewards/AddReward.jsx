import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Grid } from '@mui/material';
import { useFormik, ErrorMessage, Formik, Form } from 'formik';
import * as yup from 'yup';
import http from '../../http';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

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

const allowedPoints = [100, 300, 400, 500, 600]

function AddReward() {
  const { authToken } = useAuth();
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState(null);

  const initialValues = {
    rewardname: '',
    points: "",
    rewardImage: null
  };
  const validationSchema = yup.object({
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
    rewardImage: yup.mixed().notRequired()
  })

  const onSubmit = (values) => {
    const formData = new FormData();
    formData.append('rewardname', values.rewardname.trim());
    formData.append('points', values.points.trim());
    if (values.rewardImage) {
      formData.append('rewardImage', values.rewardImage);
    }

    http.post("/reward", formData, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'multipart/form-data'
      }
    })
      .then((res) => {
        console.log(res.data);
        navigate("/rewards/Rewards");
      })
      .catch((error) => {
        console.error("Error adding reward:", error);
      });
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
        Add Reward
      </Typography>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        enableReinitialize
      >
        {formik => (
          <Form>
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={8}>
                <TextField
                  fullWidth
                  margin="dense"
                  autoComplete="off"
                  label="Reward Name"
                  name="rewardname"
                  value={formik.values.rewardname}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.rewardname && Boolean(formik.errors.rewardname)}
                  helperText={formik.touched.rewardname && formik.errors.rewardname}
                  sx={{
                    maxWidth: '100%' // Ensure the TextField does not exceed the container
                  }}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  margin="dense"
                  autoComplete="off"
                  label="Points"
                  name="points"
                  value={formik.values.points}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.points && Boolean(formik.errors.points)}
                  helperText={formik.touched.points && formik.errors.points}
                  sx={{
                    maxWidth: '100%' // Ensure the TextField does not exceed the container
                  }}
                />
              </Grid>
            </Grid>
            <Box sx={{ textAlign: 'center' }}>
              <Button
                variant="contained"
                component="label"
                sx={{
                  mt: 2,
                  textAlign: 'center'
                }}
              >
                Upload Image
                <input
                  type="file"
                  hidden
                  onChange={(event) => {
                    const file = event.currentTarget.files[0];
                    formik.setFieldValue('rewardImage', file);
                    if (file) {
                      setImagePreview(URL.createObjectURL(file));
                    }
                  }}
                />
              </Button>
            </Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '300px',
                marginBottom: '20px',
                marginTop: '20px',
                paddingTop: '25px',
                paddingBottom: '25px',
                border: '2px solid lightgrey',
                borderRadius: '8px',
                overflow: 'hidden'
              }}
            >
              {imagePreview ? (
                <>
                  <Typography variant="body2">Selected file:</Typography>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{ maxWidth: '100%', maxHeight: '300px', marginTop: '5px' }}
                  />
                </>
              ) : (
                <Typography variant="body2" color="textSecondary">
                  No image selected
                </Typography>
              )}
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Button variant="contained" type="submit">
                Create
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Box>

    <Box sx = {{ height: '1rem'
    }}>
      <Typography>
      </Typography>
    </Box>
    </>

  );
}

export default AddReward;

