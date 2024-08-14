import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Grid,
    Container,
    Typography,
    TextField,
    Paper,
    IconButton,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    Snackbar,
    Alert,
    Button,
} from '@mui/material';
import { Delete } from '@mui/icons-material';
import Spinner from '../../../components/Spinner';

const CommunicationTools = () => {
    const [formData, setFormData] = useState({ subject: '', message: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [sentEmails, setSentEmails] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState(''); // State to hold Snackbar message

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
        setIsLoading(true); // Show spinner

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/communication/send-email`, formData);
            setSuccess(response.data.message);
            setSnackbarMessage('Email has been sent successfully!');
            setSnackbarOpen(true); // Show Snackbar on success
            fetchSentEmails();
        } catch (error) {
            setError(error.response ? error.response.data.error : 'An error occurred.');
        } finally {
            setIsLoading(false); // Hide spinner after the request is complete
        }
    };

    const handleDeleteEmail = async (emailID) => {
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/communication/sent-emails/${emailID}`);
            setSnackbarMessage('Email deleted successfully!');
            setSnackbarOpen(true); // Show Snackbar on success
            fetchSentEmails(); // Refresh the list of emails after deletion
        } catch (error) {
            console.error('Failed to delete email:', error.response ? error.response.data : error.message);
            setError('Failed to delete email.');
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    return (
        <Container>
            {isLoading && <Spinner />}
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
                        {success && <Typography color="success.main">{success}</Typography>}
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
                                            secondary={
                                                <>
                                                    <Typography variant="body2" gutterBottom>
                                                        <strong>Message:</strong> {email.message}
                                                    </Typography>
                                                    <Typography variant="body2" gutterBottom>
                                                        <strong>Sent by:</strong> {email.senderEmail}
                                                    </Typography>
                                                    <Typography variant="body2" gutterBottom>
                                                        <strong>Sent to:</strong> {email.recipientEmails.split(',').join(', ')}
                                                    </Typography>
                                                    <Typography variant="body2" gutterBottom>
                                                        <strong>Date:</strong> {new Date(email.sentAt).toLocaleString()}
                                                    </Typography>
                                                </>
                                            }
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
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={handleSnackbarClose}
            >
                <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
                    {snackbarMessage} {/* Display the dynamic Snackbar message */}
                </Alert>
            </Snackbar>
        </Container>
    );
};

const formStyle = {
    display: 'flex',
    flexDirection: 'column',
};

export default CommunicationTools;
