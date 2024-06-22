import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../../http';

function AddForum() {
    const [userName, setUserName] = useState("John Lim Tan"); // Replace with actual fetching logic if needed
    const navigate = useNavigate();
    
    useEffect(() => {
        // Fetch the username from the server if not hardcoded
        // Example: 
        // http.get('/api/username').then(response => {
        //     setUserName(response.data.userName);
        // }).catch(error => {
        //     console.error("Error fetching username:", error);
        // });
    }, []);
    
    const formik = useFormik({
        initialValues: {
            userName: userName,
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
            data.name = userName;
            data.title = data.title.trim();
            data.description = data.description.trim();
            // image handling
            http.post("http://localhost:3001/forum", data)
                .then((res) => {
                    console.log(res.data);
                    navigate("/forum");
                });
        },
        enableReinitialize: true, // Allows Formik to reinitialize when initialValues change
    });
    
    useEffect(() => {
        formik.setFieldValue('userName', userName);
    }, [userName]);

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Add Forum
            </Typography>
            <Typography variant="h6" sx={{ my: 2 }}>
                Creating blog as: {userName}
            </Typography>
            <Box component="form" onSubmit={formik.handleSubmit}>
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
                    <Button variant="contained" type="submit">
                        Add
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}

export default AddForum;
