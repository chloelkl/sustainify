import React, { useState } from 'react';
import { Container, TextField, Button, Grid, Typography, Box, MenuItem, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import './CreateEventAdmin.css';
import EventAdminSidebar from '../../components/EventAdminSidebar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateEventAdmin = () => {
    const [open, setOpen] = useState(false);
    const [formValues, setFormValues] = useState(null);
    const initialValues = {
        eventname: '',
        eventdate: '',
        eventtime: '',
        venue: '',
        eventdescription: ''
    };

    const validationSchema = Yup.object({
        eventname: Yup.string().trim().min(3, 'Event name must be at least 3 characters').max(100, 'Event name cannot exceed 100 characters').required('Required'),
        eventdate: Yup.string().trim().matches(/^\d{2}\/\d{2}\/\d{4}$/, 'Date must be in the format dd/mm/yyyy').required('Required'),
        eventtime: Yup.string().trim().matches(/^([01]\d|2[0-3]):?([0-5]\d)$/, 'Time must be in 24-hour format (HH:MM)').required('Required'),
        venue: Yup.string().trim().min(3, 'Venue must be at least 3 characters').max(100, 'Venue cannot exceed 100 characters').required('Required'),
        eventdescription: Yup.string().trim().min(3, 'Description must be at least 3 characters').max(500, 'Description cannot exceed 500 characters').required('Required')
    });

    const navigate = useNavigate();

    const handleOpen = (values) => {
        setFormValues(values);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setFormValues(null);
    };

    const handleConfirm = () => {
        axios.post(`${import.meta.env.VITE_API_URL}/eventpost`, formValues)
            .then(response => {
                console.log('Form data saved:', response.data);
                navigate('/posteventadmin');
            })
            .catch(error => {
                console.error('There was an error!', error);
            })
            .finally(() => {
                handleClose();
            });
    };

    const onSubmit = (values, { resetForm }) => {
        handleOpen(values);
    };

    return (
        <div className="event-posting-page">
            <EventAdminSidebar />
            <Container className="event-posting-container">
                <Box className="form-box">
                    <Typography variant="h4" component="h1" className="form-title">
                        Create Event Post
                    </Typography>
                    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
                        {formik => (
                            <Form className="event-form">
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <Field
                                            as={TextField}
                                            label="Event Name"
                                            name="eventname"
                                            fullWidth
                                            required
                                            helperText={<ErrorMessage name="eventname" />}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Field
                                            as={TextField}
                                            label="Event Date"
                                            name="eventdate"
                                            type="text"
                                            placeholder="dd/mm/yyyy"
                                            fullWidth
                                            required
                                            helperText={<ErrorMessage name="eventdate" />}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Field
                                            as={TextField}
                                            label="Event Time"
                                            name="eventtime"
                                            type="text"
                                            placeholder="HH:MM"
                                            fullWidth
                                            required
                                            helperText={<ErrorMessage name="eventtime" />}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Field
                                            as={TextField}
                                            label="Event Venue"
                                            name="venue"
                                            select
                                            fullWidth
                                            required
                                            helperText={<ErrorMessage name="venue" />}
                                        >
                                            <MenuItem value="Ang Mo Kio CC">Ang Mo Kio CC</MenuItem>
                                            <MenuItem value="Bedok CC">Bedok CC</MenuItem>
                                            <MenuItem value="Tampines CC">Tampines CC</MenuItem>
                                        </Field>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Field
                                            as={TextField}
                                            label="Event Description (Include Event Name)"
                                            name="eventdescription"
                                            multiline
                                            rows={4}
                                            fullWidth
                                            required
                                            helperText={<ErrorMessage name="eventdescription" />}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Button variant="contained" color="primary" type="submit" className="submit-button">
                                            Create
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Form>
                        )}
                    </Formik>
                </Box>
            </Container>
            <Dialog
                open={open}
                onClose={handleClose}
            >
                <DialogTitle>Confirm Create Event</DialogTitle>
                <DialogContent sx={{ padding: '24px' }}>
                    <DialogContentText>
                        Are you sure you want to create this event post?
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ padding: '16px 24px' }}>
                    <Button onClick={handleConfirm} sx={{ color: 'black' }}>
                        Confirm
                    </Button>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default CreateEventAdmin;
