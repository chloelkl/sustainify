import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, IconButton } from '@mui/material';
import { useFormik } from 'formik';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import * as yup from 'yup';
import http from '../../http';
import { useParams } from 'react-router-dom';

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

function EditForm({ forum, onClose, onSave }) {
  const { userId } = useParams();
  const [imagePreview, setImagePreview] = useState(forum.image ? `${import.meta.env.VITE_API_URL}/${forum.image}` : null);

  const formik = useFormik({
    initialValues: {
      title: forum.title,
      description: forum.description,
      image: null // initialize as null since we'll handle file input separately
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const formData = new FormData();
      formData.append('title', values.title.trim());
      formData.append('description', values.description.trim());
      if (values.image) {
        formData.append('image', values.image);
      }

      http.put(`/forum/${userId}/${forum.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
        .then((res) => {
          onSave(res.data);
          onClose();
        })
        .catch((error) => {
          console.error("Error updating forum:", error);
        });
    },
    enableReinitialize: true,
  });

  const handleDelete = async() => {
    await http.delete(`/forum/${userId}/${forum.id}`)
      .then(() => {
        window.location.reload();
        onClose();
      })
      .catch((error) => {
        console.error("Error deleting forum:", error);
      });
  };

  const handleImageChange = (event) => {
    const file = event.currentTarget.files[0];
    formik.setFieldValue('image', file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <Box
      component="form"
      onSubmit={formik.handleSubmit}
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "row",
        gap: 2,
      }}
    >
      {/* Left Section */}
      <Box sx={{ width: '40%', position: 'relative' }}>
        {imagePreview && (
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              height: 'auto',
              overflow: 'hidden',
              borderRadius: 1,
            }}
          >
            <img
              src={imagePreview}
              alt="Preview"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
            <IconButton
              aria-label="upload"
              component="label"
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                },
              }}
            >
              <input
                type="file"
                hidden
                onChange={handleImageChange}
              />
              <UploadFileIcon />
            </IconButton>
          </Box>
        )}
      </Box>

      {/* Right Section */}
      <Box sx={{ width: '60%' }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Edit Forum
        </Typography>
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
          minRows={2}
          label="Description"
          name="description"
          value={formik.values.description}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.description && Boolean(formik.errors.description)}
          helperText={formik.touched.description && formik.errors.description}
        />
         <Box
          sx={{
            mt: 2,
            display: 'flex',
            justifyContent: 'flex-end',
            flexGrow: 1,
            alignItems: 'flex-end',
          }}
        >
          <Button variant="contained" type="submit">
            Save
          </Button>
          <Button variant="outlined" onClick={onClose} sx={{ ml: 2 }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDelete}
            sx={{ ml: 2 }}
          >
            Delete
          </Button>
        </Box>
      </Box>
    </Box>


  );
}

export default EditForm;
