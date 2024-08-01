import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, TextField, Button, Grid, Typography, Box, MenuItem } from '@mui/material';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const EditHostingAdmin = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState({
        eventname: '',
        eventdate: '',
        eventtime: '',
        venue: '',
        eventdescription: '',
        image: null,
    });
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_URL}/eventpost/${id}`)
            .then(response => {
                setEvent(response.data);
                if (response.data.image) {
                    setImagePreview(`${import.meta.env.VITE_API_URL}/images/${response.data.image}`);
                }
            })
            .catch(error => {
                console.error('There was an error fetching the event data!', error);
            });
    }, [id]);

    const validationSchema = Yup.object({
        eventname: Yup.string().trim().min(3, 'Event name must be at least 3 characters').max(100, 'Event name cannot exceed 100 characters').required('Required'),
        eventdate: Yup.string().trim().matches(/^\d{2}\/\d{2}\/\d{4}$/, 'Date must be in the format dd/mm/yyyy').required('Required'),
        eventtime: Yup.string().trim().matches(/^([01]\d|2[0-3]):?([0-5]\d)$/, 'Time must be in 24-hour format (HH:MM)').required('Required'),
        venue: Yup.string().trim().min(3, 'Venue must be at least 3 characters').max(100, 'Venue cannot exceed 100 characters').required('Required'),
        eventdescription: Yup.string().trim().min(3, 'Description must be at least 3 characters').max(500, 'Description cannot exceed 500 characters').required('Required'),
    });

    const handleSubmit = (values) => {
        const formData = new FormData();
        formData.append('eventname', values.eventname);
        formData.append('eventdate', values.eventdate);
        formData.append('eventtime', values.eventtime);
        formData.append('venue', values.venue);
        formData.append('eventdescription', values.eventdescription);
        if (values.image) {
            formData.append('image', values.image);
        }

        axios.put(`${import.meta.env.VITE_API_URL}/eventpost/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
            .then(response => {
                console.log('Event updated successfully:', response.data);
                navigate('/posteventadmin');
            })
            .catch(error => {
                console.error('There was an error updating the event!', error);
            });
    };

    const handleCancel = () => {
        navigate('/posteventadmin');
    };

    return (
        <Container>
            <Box>
                <Typography variant="h5" sx={{ my: 2 }}>
                    Edit Event
                </Typography>
                <Formik
                    initialValues={event}
                    enableReinitialize={true}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
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
                                        label="Event Description"
                                        name="eventdescription"
                                        multiline
                                        rows={4}
                                        fullWidth
                                        required
                                        helperText={<ErrorMessage name="eventdescription" />}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Button
                                        variant="contained"
                                        component="label"
                                        color="primary"
                                    >
                                        Choose File
                                        <input
                                            type="file"
                                            hidden
                                            onChange={(event) => {
                                                const file = event.currentTarget.files[0];
                                                formik.setFieldValue("image", file);
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
                                        </Box>
                                    )}
                                </Grid>
                            </Grid>
                            <Box sx={{ my: 2 }}>
                                <Button type="submit" variant="contained" color="primary">
                                    Update
                                </Button>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={handleCancel}
                                    sx={{
                                        ml: 2,
                                        ':hover': {
                                            backgroundColor: '#94C4BB',
                                            color: 'white',
                                        }
                                    }}
                                >
                                    Cancel
                                </Button>
                            </Box>
                        </Form>
                    )}
                </Formik>
            </Box>
        </Container>
    );
};

export default EditHostingAdmin;
