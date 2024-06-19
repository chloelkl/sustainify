import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import dayjs from 'dayjs';
import { useFormik } from 'formik';
import * as yup from 'yup';

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

  // Formik setup for handling form values and validation
  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
    },
    validationSchema: yup.object({
      title: yup.string().trim()
        .min(3, 'Title must be at least 3 characters')
        .max(100, 'Title must be at most 100 characters')
        .required('Title is required'),
      description: yup.string().trim()
        .min(3, 'Description must be at least 3 characters')
        .max(500, 'Description must be at most 500 characters')
        .required('Description is required'),
    }),
    onSubmit: (data) => {
      data.title = data.title.trim();
      data.description = data.description.trim();
      // Replace with your HTTP POST logic (e.g., http.post("/tutorial", data))
      console.log(data); // For demonstration purposes
    },
  });

  return (
    <>
      <Box sx={{ textAlign: 'center', paddingTop: '100px' }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>Management</Typography>
      </Box>

      <Box>
        <Typography>Voucher Reset: {timeLeft.hours}:{timeLeft.minutes}:{timeLeft.seconds}</Typography>
      </Box>

      {/* TextField for Title */}
      <TextField
        fullWidth
        margin="normal"
        autoComplete="off"
        label="Title"
        name="title"
        value={formik.values.title}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.title && Boolean(formik.errors.title)}
        helperText={formik.touched.title && formik.errors.title}
      />

      {/* Form with Submit Button */}
      <Box component="form" onSubmit={formik.handleSubmit}>
        <TextField
          fullWidth
          margin="normal"
          autoComplete="off"
          multiline
          minRows={2}
          label="Description"
          name="description"
          value={formik.values.description}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.description && Boolean(formik.errors.description)}
          helperText={formik.touched.description && formik.errors.description}
        />
        <Box sx={{ mt: 2 }}>
          <Button variant="contained" type="submit">
            Add
          </Button>
        </Box>
      </Box>
    </>
  );
}

export default RewardPage;
