import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext';
import {
    Box,
    Button,
    Container,
    Grid,
    Paper,
    TextField,
    Typography,
    IconButton,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    ListSubheader,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Snackbar,
    Alert,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from '@mui/material';
import { Delete, Backup } from '@mui/icons-material';

const SystemOverview = () => {
    const { admin } = useAuth();
    const [originalAdminDetails, setOriginalAdminDetails] = useState({});
    const [adminDetails, setAdminDetails] = useState({
        fullName: '',
        email: '',
        passwordLength: 0, // Store the length of the password
        location: '',
        username: '',
        phoneNumber: '',
        countryCode: '',
        adminID: ''
    });
    const [admins, setAdmins] = useState([]);
    const [signupLink, setSignupLink] = useState('');
    const [otp, setOtp] = useState('');
    const [otpTimer, setOtpTimer] = useState(300);
    const [linkValid, setLinkValid] = useState(true);
    const [backupType, setBackupType] = useState('full');
    const [fileFormat, setFileFormat] = useState('csv');
    const [backupHistory, setBackupHistory] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [deletionDialogOpen, setDeletionDialogOpen] = useState(false);
    const [deletionAdminID, setDeletionAdminID] = useState('');
    const [passwordInput, setPasswordInput] = useState('');

    useEffect(() => {
        if (admin && admin.adminID) {
            fetchAdminDetails(admin.adminID);
        }
        fetchAdmins();
    }, [admin]);

    useEffect(() => {
        let timerInterval;
        if (otp && otpTimer > 0) {
            timerInterval = setInterval(() => {
                setOtpTimer((prevTimer) => prevTimer - 1);
            }, 1000);
        } else if (otpTimer === 0) {
            setLinkValid(false);
            clearInterval(timerInterval);
        }
        return () => clearInterval(timerInterval);
    }, [otp, otpTimer]);

    const fetchAdminDetails = async (adminID) => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/admin/${adminID}`);
            setAdminDetails({
                ...response.data,
                password: '*'.repeat(response.data.passwordLength), // Display asterisks based on actual password length
            });
            setOriginalAdminDetails({
                ...response.data,
                password: '*'.repeat(response.data.passwordLength),
            });
        } catch (error) {
            console.error('Failed to fetch admin details:', error);
        }
    };

    const fetchAdmins = () => {
        axios.get(`${import.meta.env.VITE_API_URL}/admin/list`)
            .then(response => setAdmins(response.data))
            .catch(error => console.error('Failed to fetch admins:', error));
    };

    const fetchBackupHistory = () => {
        axios.get(`${import.meta.env.VITE_API_URL}/admin/backup-history`)
            .then(response => {
                if (Array.isArray(response.data)) {
                    setBackupHistory(response.data);
                } else {
                    throw new Error('Backup history response is not an array.');
                }
            })
            .catch(error => console.error('Failed to fetch backup history:', error));
    };

    const handleSaveChanges = async () => {
        try {
            const updatedDetails = {};

            // Check each field to see if it was changed and only include those in the update
            Object.keys(adminDetails).forEach(key => {
                if (adminDetails[key] !== originalAdminDetails[key] && key !== 'password') {
                    updatedDetails[key] = adminDetails[key];
                }
            });

            // Only send the update request if there's something to update
            await axios.put(`${import.meta.env.VITE_API_URL}/admin/${admin.adminID}`, updatedDetails);
            setSnackbarMessage('Profile updated successfully.');
            setSnackbarOpen(true);
            setEditMode(false);
            fetchAdminDetails(admin.adminID);
        } catch (error) {
            console.error('Failed to update profile:', error.response ? error.response.data : error.message);
            setSnackbarMessage('Failed to update profile.');
            setSnackbarOpen(true);
        }
    };

    const handleGenerateAdminSignupLink = () => {
        axios.post(`${import.meta.env.VITE_API_URL}/auth/generate-admin-signup`)
            .then(response => {
                setSignupLink(response.data.signupLink);
                setOtp(response.data.otp);
                setOtpTimer(300);
                setLinkValid(true);
                setSnackbarMessage('Admin signup link generated successfully.');
                setSnackbarOpen(true);
            })
            .catch(error => {
                console.error('Failed to generate admin signup link:', error);
                setSnackbarMessage('Failed to generate admin signup link.');
                setSnackbarOpen(true);
            });
    };

    const handleRevokeLink = () => {
        setSignupLink('');
        setOtp('');
        setLinkValid(false);
        setSnackbarMessage('Admin signup link revoked.');
        setSnackbarOpen(true);
    };

    const handleBackupNow = () => {
        axios.post(`${import.meta.env.VITE_API_URL}/admin/backup`, { type: backupType, format: fileFormat })
            .then(() => {
                fetchBackupHistory();
                setSnackbarMessage('Backup created successfully.');
                setSnackbarOpen(true);
            })
            .catch(error => {
                console.error('Failed to create backup:', error);
                setSnackbarMessage('Failed to create backup.');
                setSnackbarOpen(true);
            });
    };

    const handleDeleteBackup = (id) => {
        axios.delete(`${import.meta.env.VITE_API_URL}/admin/backup/${id}`)
            .then(() => {
                fetchBackupHistory();
                setSnackbarMessage('Backup deleted successfully.');
                setSnackbarOpen(true);
            })
            .catch(error => {
                console.error('Failed to delete backup:', error);
                setSnackbarMessage('Failed to delete backup.');
                setSnackbarOpen(true);
            });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAdminDetails(prevDetails => ({
            ...prevDetails,
            [name]: value
        }));
    };

    const handleDeleteAdmin = (adminID) => {
        setDeletionAdminID(adminID);
        setDeletionDialogOpen(true);
    };

    const confirmDeleteAdmin = async () => {
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/admin/delete`, { data: { adminID: deletionAdminID, password: passwordInput } });
            setSnackbarMessage('Admin deleted successfully.');
            setSnackbarOpen(true);
            setSnackbarSeverity('success');  // Set severity to success for successful deletion
            setDeletionDialogOpen(false);
            fetchAdmins();
        } catch (error) {
            console.error('Failed to delete admin:', error);
            setSnackbarMessage('Failed to delete admin. Incorrect password.');
            setSnackbarSeverity('error');  // Set severity to error for incorrect password
            setSnackbarOpen(true);
        }
    };

    return (
        <Container>
            <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 2, borderRadius: '10px' }}>
                        <Typography variant="h6" gutterBottom>Edit Profile</Typography>
                        <TextField
                            label="Full name"
                            name="fullName"
                            value={adminDetails.fullName || ''}
                            onChange={handleInputChange}
                            fullWidth
                            sx={{ mb: 2 }}
                            disabled={!editMode}
                        />
                        <TextField
                            label="Email address"
                            name="email"
                            value={adminDetails.email || ''}
                            onChange={handleInputChange}
                            fullWidth
                            sx={{ mb: 2 }}
                            disabled={!editMode}
                        />
                        <TextField
                            label="Password"
                            name="password"
                            type="password"
                            value={'*'.repeat(adminDetails.passwordLength)} // Show asterisks based on actual password length
                            fullWidth
                            sx={{ mb: 2 }}
                            disabled
                        />
                        <TextField
                            label="Location"
                            name="location"
                            value={adminDetails.location || ''}
                            onChange={handleInputChange}
                            fullWidth
                            sx={{ mb: 2 }}
                            disabled={!editMode}
                        />
                        <TextField
                            label="Username"
                            name="username"
                            value={adminDetails.username || ''}
                            onChange={handleInputChange}
                            fullWidth
                            sx={{ mb: 2 }}
                            disabled={!editMode}
                        />
                        <TextField
                            label="Phone Number"
                            name="phoneNumber"
                            value={adminDetails.phoneNumber || ''}
                            onChange={handleInputChange}
                            fullWidth
                            sx={{ mb: 2 }}
                            disabled={!editMode}
                        />
                        <TextField
                            label="Country Code"
                            name="countryCode"
                            value={adminDetails.countryCode || ''}
                            onChange={handleInputChange}
                            fullWidth
                            sx={{ mb: 2 }}
                            disabled={!editMode}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={editMode ? handleSaveChanges : () => setEditMode(true)}
                        >
                            {editMode ? 'Save changes' : 'Edit Profile'}
                        </Button>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 2, borderRadius: '10px' }}>
                        <Typography variant="h6" gutterBottom>Admins List</Typography>
                        <List>
                            {admins.map((admin) => (
                                <ListItem key={admin.adminID} divider>
                                    <ListItemText
                                        primary={admin.username}
                                        secondary={`Status: ${admin.status || 'Active'}`}
                                    />
                                    <ListItemSecondaryAction>
                                        <IconButton edge="end" onClick={() => handleDeleteAdmin(admin.adminID)}>
                                            <Delete />
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                    <Paper elevation={3} sx={{ p: 2, borderRadius: '10px', mt: 2 }}>
                        <Typography variant="h6" gutterBottom>Generate Admin Signup Link</Typography>
                        <Button variant="contained" onClick={handleGenerateAdminSignupLink}>
                            Generate Link
                        </Button>
                        {signupLink && linkValid && (
                            <Box sx={{ mt: 2 }}>
                                <Typography sx={{ wordBreak: 'break-all' }}>
                                    Admin Signup Link: <a href={signupLink} target="_blank" rel="noopener noreferrer">{signupLink}</a>
                                </Typography><br />
                                <Typography>OTP: {otp}</Typography><br />
                                <Typography>OTP valid for: {otpTimer} seconds</Typography>
                                <Button variant="outlined" onClick={handleRevokeLink} sx={{ mt: 1 }}>Revoke Link</Button>
                            </Box>
                        )}
                    </Paper>
                    <Paper elevation={3} sx={{ p: 2, borderRadius: '10px', mt: 2 }}>
                        <Typography variant="h6" gutterBottom>Backup History</Typography>
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Backup Type</InputLabel>
                            <Select value={backupType} onChange={(e) => setBackupType(e.target.value)} label="Backup Type">
                                <MenuItem value="full">Full</MenuItem>
                                <MenuItem value="analytics">Analytics</MenuItem>
                                <MenuItem value="users">Users</MenuItem>
                                <MenuItem value="admin">Admin</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>File Format</InputLabel>
                            <Select value={fileFormat} onChange={(e) => setFileFormat(e.target.value)} label="File Format">
                                <MenuItem value="csv">CSV</MenuItem>
                                <MenuItem value="pdf">PDF</MenuItem>
                            </Select>
                        </FormControl>
                        <Button variant="contained" onClick={handleBackupNow} startIcon={<Backup />}>
                            Backup Now
                        </Button>
                        <List subheader={<ListSubheader>Backup History</ListSubheader>} sx={{ mt: 2 }}>
                            {backupHistory.map((backup, index) => (
                                <ListItem key={index} divider>
                                    <ListItemText
                                        primary={backup.name}
                                        secondary={`Date: ${backup.date}`}
                                    />
                                    <ListItemSecondaryAction>
                                        <IconButton edge="end" onClick={() => handleDeleteBackup(backup.id)}>
                                            <Delete />
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                </Grid>
            </Grid>

            {/* Password confirmation dialog for deletion */}
            <Dialog open={deletionDialogOpen} onClose={() => setDeletionDialogOpen(false)}>
                <DialogTitle>Confirm Admin Deletion</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please enter your password to confirm the deletion of the admin.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Password"
                        type="password"
                        fullWidth
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeletionDialogOpen(false)} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={confirmDeleteAdmin} color="primary">
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar for messages */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackbarOpen(false)}
            >
                <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default SystemOverview;
