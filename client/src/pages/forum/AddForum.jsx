import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Typography, TextField, Button } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../../http';

function AddForum() {
    const { userId } = useParams();
    const [user, setUser] = useState({});
    const navigate = useNavigate();
    
    useEffect(() => {
        http.get(`/forum/user/${userId}/forums`).then(response => {
            setUser(response.data);
        }).catch(error => {
            console.error("Error fetching username:", error);
        });
    }, []);
    
    const formik = useFormik({
        initialValues: {
            userName: user.username,
            title: "",
            description: ""
        },
        validationSchema: yup.object({
            title: yup.string().trim()
                .min(3, 'Title must be at least 3 characters')
                .max(100, 'Title must be at most 100 characters')
                .required('Title is required'),
            description: yup.string().trim()
                .min(3, 'Description must be at least 3 characters')
                .max(500, 'Description must be at most 500 characters')
                .required('Description is required')
            // Add validation for image if needed
        }),
        onSubmit: (data) => {
            // User Account
            data.name = user.username;
            data.title = data.title.trim();
            data.description = data.description.trim();
            data.userId = userId;
            // image handling
            http.post("/forum", data)
                .then((res) => {
                    console.log(res.data);
                    navigate("/forum");
                })
                .catch((error) => {
                    console.error("Error adding forum:", error);
                });
        },
        enableReinitialize: true, // Allows Formik to reinitialize when initialValues change
    });

    return (
        <Box
  sx={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
  }}
>
  <Box
    sx={{
      maxWidth: '600px',
      width: '100%',
      mx: 'auto',
      p: 3,
      backgroundColor: 'white',
      borderRadius: 2,
      boxShadow: 3,
    }}
  >
    <Typography variant="h5" sx={{ my: 2, fontWeight: 'bold', textAlign: 'center'}}>
      Post A Forum
    </Typography>
    <Typography variant="h6" component="div" sx={{ mb: 2, color: 'text.secondary' }}>
      {user.username}
    </Typography>
    <Box component="form" onSubmit={formik.handleSubmit}>
      <TextField
        fullWidth
        margin="dense"
        autoComplete="off"
        label="Title"
        name="title"
        value={formik.values.title}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.title && Boolean(formik.errors.title)}
        helperText={formik.touched.title && formik.errors.title}
      />
      <TextField
        fullWidth
        margin="dense"
        autoComplete="off"
        multiline
        minRows={3}
        label="Description"
        name="description"
        value={formik.values.description}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.description && Boolean(formik.errors.description)}
        helperText={formik.touched.description && formik.errors.description}
      />
      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Button variant="contained" type="submit">
          Publish
        </Button>
      </Box>
    </Box>
  </Box>
</Box>


    );
}

export default AddForum;
