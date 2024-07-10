import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import { useFormik } from 'formik';
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
});

function EditForm({ forum, onClose, onSave, onDelete }) {
  const { userId } = useParams();
  const formik = useFormik({
    initialValues: {
      title: forum.title,
      description: forum.description
    },
    validationSchema: validationSchema,
    onSubmit: (data) => {
      http.put(`/forum/${userId}/${forum.id}`, data)
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

  const handleDelete = () => {
    onDelete(forum.id);
  };
  

  return (
    <Box component="form" onSubmit={formik.handleSubmit} sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>Edit Forum</Typography>
      <TextField
        fullWidth margin="dense" autoComplete="off"
        label="Title"
        name="title"
        value={formik.values.title}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.title && Boolean(formik.errors.title)}
        helperText={formik.touched.title && formik.errors.title}
      />
      <TextField
        fullWidth margin="dense" autoComplete="off"
        multiline minRows={2}
        label="Description"
        name="description"
        value={formik.values.description}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.description && Boolean(formik.errors.description)}
        helperText={formik.touched.description && formik.errors.description}
      />
      <Box sx={{ mt: 2 }}>
        <Button variant="contained" type="submit">Save</Button>
        <Button variant="outlined" onClick={onClose} sx={{ ml: 2 }}>Cancel</Button>
        <Button variant="contained" color="error" onClick={handleDelete} sx={{ ml: 2 }}>
            Delete
          </Button>
      </Box>
    </Box>
  );
}

export default EditForm;
