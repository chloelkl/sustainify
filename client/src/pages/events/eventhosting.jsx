import React, { useState } from 'react';
import { Container, TextField, Button, Grid, Typography, Box, MenuItem, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton } from '@mui/material';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import CloseIcon from '@mui/icons-material/Close';
import './EventHosting.css';
import EventHostingSidebar from '../../components/EventHostingSidebar';
import axios from 'axios';

const EventHosting = () => {
    const [openConfirm, setOpenConfirm] = useState(false);
    const [openThankYou, setOpenThankYou] = useState(false);
    const [formValues, setFormValues] = useState(null);
    const [resetFormFunction, setResetFormFunction] = useState(null);

    const initialValues = {
        eventhoster: '',
        phonenumber: '',
        eventname: '',
        email: '',
        eventdate: '',
        eventtime: '',
        venue: '',
        eventdescription: ''
    };

    const validationSchema = Yup.object({
        eventhoster: Yup.string().trim().min(3, 'Name must be at least 3 characters').max(100, 'Name cannot exceed 100 characters').required('Required'),
        phonenumber: Yup.string().trim().matches(/^[6-9]\d{7}$/, 'Phone number must be a valid 8-digit Singaporean number starting with 6, 8, or 9').required('Required'),
        email: Yup.string().trim().email('Invalid email address').required('Required'),
        eventname: Yup.string().trim().min(3, 'Event name must be at least 3 characters').max(100, 'Event name cannot exceed 100 characters').required('Required'),
        eventdate: Yup.string().trim().matches(/^\d{2}\/\d{2}\/\d{4}$/, 'Date must be in the format dd/mm/yyyy').required('Required'),
        eventtime: Yup.string().trim().matches(/^([01]\d|2[0-3]):?([0-5]\d)$/, 'Time must be in 24-hour format (HH:MM)').required('Required'),
        venue: Yup.string().trim().min(3, 'Venue must be at least 3 characters').max(100, 'Venue cannot exceed 100 characters').required('Required'),
        eventdescription: Yup.string().trim().min(3, 'Description must be at least 3 characters').max(500, 'Description cannot exceed 500 characters').required('Required')
    });

    const handleSubmit = (values, { resetForm }) => {
        setFormValues(values);
        setResetFormFunction(() => resetForm);  // Save the resetForm function to call it later
        setOpenConfirm(true);
    };

    const handleConfirm = () => {
        // Make POST request to backend
        axios.post(`${import.meta.env.VITE_API_URL}/event`, formValues)
            .then(response => {
                console.log('Form data saved:', response.data);
                setOpenConfirm(false);
                setOpenThankYou(true);
                if (resetFormFunction) {
                    resetFormFunction();  // Reset the form
                }
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    };

    const handleCloseConfirm = () => {
        setOpenConfirm(false);
    };

    const handleCloseThankYou = () => {
        setOpenThankYou(false);
    };

    return (
        <div className="event-hosting-page">
            <EventHostingSidebar />
            <Container className="event-hosting-container">
                <Box className="form-box">
                    <Typography variant="h4" component="h1" className="form-title">
                        Hosting With Us
                    </Typography>
                    <Typography variant="body1" component="p" className="form-subtitle">
                        We love to hear from you! Propose to us an event and we'll be in touch.
                    </Typography>
                    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                        {formik => (
                            <Form className="event-form">
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={6}>
                                        <Field
                                            as={TextField}
                                            label="Name"
                                            name="eventhoster"
                                            fullWidth
                                            required
                                            helperText={<ErrorMessage name="eventhoster" />}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Field
                                            as={TextField}
                                            label="Phone No."
                                            name="phonenumber"
                                            fullWidth
                                            required
                                            helperText={<ErrorMessage name="phonenumber" />}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Field
                                            as={TextField}
                                            label="Email"
                                            name="email"
                                            type="email"
                                            fullWidth
                                            required
                                            helperText={<ErrorMessage name="email" />}
                                        />
                                    </Grid>
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
                                            Submit
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Form>
                        )}
                    </Formik>
                </Box>
            </Container>

            <Dialog open={openConfirm} onClose={handleCloseConfirm}>
                <DialogTitle sx={{ padding: '24px' }}>
                    Confirmation
                    <IconButton
                        aria-label="close"
                        onClick={handleCloseConfirm}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ padding: '24px' }}>
                    <DialogContentText>
                        Are you sure you want to submit this proposal?
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ padding: '16px 24px' }}>
                    <Button onClick={handleConfirm} sx={{ color: 'black' }}>
                        Confirm
                    </Button>
                    <Button onClick={handleCloseConfirm} color="primary">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openThankYou} onClose={handleCloseThankYou}>
                <DialogTitle sx={{ padding: '24px' }}>
                    Thank You
                    <IconButton
                        aria-label="close"
                        onClick={handleCloseThankYou}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ padding: '24px' }}>
                    <DialogContentText>
                        Thank you for submitting your event. Please allow 1-2 days for us to review and upload it. Have a great day!
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ padding: '16px 24px' }}>
                    <Button onClick={handleCloseThankYou} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default EventHosting;
