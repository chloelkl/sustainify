import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Grid,
    Box,
    Button,
    Container,
    Typography,
    TextField,
    Paper,
    IconButton,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    ListSubheader,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Divider,
} from '@mui/material';
import { Delete } from '@mui/icons-material';

const CommunicationTools = () => {
    const [formData, setFormData] = useState({ subject: '', message: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [sentEmails, setSentEmails] = useState([]);

    useEffect(() => {
        fetchSentEmails();
    }, []);

    const fetchSentEmails = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/communication/sent-emails`);
            setSentEmails(response.data);
        } catch (error) {
            console.error('Error fetching sent emails:', error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/communication/send-email`, formData);
            setSuccess(response.data.message);
            fetchSentEmails();
        } catch (error) {
            setError(error.response ? error.response.data.error : 'An error occurred.');
        }
    };

    const handleDeleteEmail = async (emailID) => {
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/communication/sent-emails/${emailID}`);
            setSuccess('Email deleted successfully!');
            fetchSentEmails(); // Refresh the list of emails after deletion
        } catch (error) {
            console.error('Failed to delete email:', error.response ? error.response.data : error.message);
            setError('Failed to delete email.');
        }
    };

    return (
        <Container>
            <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 2, borderRadius: '10px' }}>
                        <Typography variant="h6" gutterBottom>Email Blast</Typography>
                        <form onSubmit={handleSubmit} style={formStyle}>
                            <TextField
                                label="Subject"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                fullWidth
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                label="Message"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                fullWidth
                                multiline
                                rows={4}
                                sx={{ mb: 2 }}
                            />
                            <Button type="submit" variant="contained" color="primary">
                                Compose Email
                            </Button>
                        </form>
                        {error && <Typography color="error">{error}</Typography>}
                        {success && <Typography color="success">{success}</Typography>}
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 2, borderRadius: '10px' }}>
                        <Typography variant="h6" gutterBottom>Email History</Typography>
                        <List>
                            {sentEmails.length > 0 ? (
                                sentEmails.map((email) => (
                                    <ListItem key={email.emailID} divider>
                                        <ListItemText
                                            primary={email.subject}
                                            secondary={`Sent by: ${email.senderEmail} | Sent to: ${email.recipientEmails} | Date: ${new Date(email.sentAt).toLocaleString()}`}
                                        />
                                        <ListItemSecondaryAction>
                                            <IconButton edge="end" onClick={() => handleDeleteEmail(email.emailID)}>
                                                <Delete />
                                            </IconButton>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                ))
                            ) : (
                                <Typography>No sent emails found.</Typography>
                            )}
                        </List>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

const formStyle = {
    display: 'flex',
    flexDirection: 'column',
};

export default CommunicationTools;
