import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Typography, TextField, Button } from '@mui/material';
import { Formik, Form, ErrorMessage } from 'formik';
import * as yup from 'yup';
import http from '../../http';
import { useAuth } from '../../context/AuthContext';

function AddForum() {
  const { authToken } = useAuth();
  const { userId } = useParams();
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    http.get(`/forum/by/${userId}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    }).then(response => {
      setUser(response.data);
    }).catch(error => {
      console.error("Error fetching username:", error);
    });
  }, [authToken, userId]);

  const initialValues = {
    userName: user.username || '',
    title: "",
    description: "",
    image: null
  };

  const validationSchema = yup.object({
    title: yup.string().trim()
      .min(3, 'Title must be at least 3 characters')
      .max(100, 'Title must be at most 100 characters')
      .required('Title is required'),
    description: yup.string().trim()
      .min(3, 'Description must be at least 3 characters')
      .max(500, 'Description must be at most 500 characters')
      .required('Description is required'),
    image: yup.mixed().notRequired()
  });

  const onSubmit = (values) => {
    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('name', user.username);
    formData.append('title', values.title.trim());
    formData.append('description', values.description.trim());
    formData.append('image', values.image);

    http.post("/forum", formData, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'multipart/form-data'
      }
    })
      .then((res) => {
        console.log(res.data);
        navigate("/forum");
      })
      .catch((error) => {
        console.error("Error adding forum:", error);
      });
  };

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
        <Typography variant="h5" sx={{ my: 2, fontWeight: 'bold', textAlign: 'center' }}>
          Post A Forum
        </Typography>
        <Typography variant="h6" component="div" sx={{ mb: 2, color: 'text.secondary' }}>
          {user.username}
        </Typography>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
          enableReinitialize
        >
          {formik => (
            <Form>
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
              <Button variant="contained" component="label" fullWidth sx={{ mt: 2 }}>
                Upload Image
                <input
                  type="file"
                  hidden
                  onChange={(event) => {
                    const file = event.currentTarget.files[0];
                    formik.setFieldValue('image', file);
                    if (file) {
                      setImagePreview(URL.createObjectURL(file));
                    }
                  }}
                />
              </Button>
              <ErrorMessage name="image" component="div" className="field-error" />
              {imagePreview && (
                <Box mt={2}>
                  <Typography variant="body2">Selected file:</Typography>
                  <Typography variant="body2" color="textSecondary">{imagePreview}</Typography>
                  <img src={imagePreview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px', marginTop: '10px' }} />
                </Box>
              )}
              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Button variant="contained" type="submit">
                  Publish
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
    </Box>
  );
}

export default AddForum;
