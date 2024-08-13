import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext';
import {
    Box,
    Button,
    Container,
    Typography,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Grid,
    Paper,
    IconButton,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    ListSubheader,
    Divider
} from '@mui/material';
import { Delete, Backup } from '@mui/icons-material';

const SystemOverview = () => {
    const { admin } = useAuth();
    const [adminDetails, setAdminDetails] = useState({
        fullName: '',
        email: '',
        password: '',
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

    const fetchAdminDetails = (adminID) => {
        axios.get(`${import.meta.env.VITE_API_URL}/admin/${adminID}`)
            .then(response => setAdminDetails(response.data))
            .catch(error => console.error('Failed to fetch admin details:', error));
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

    const handleDeleteAdmin = (adminID) => {
        const password = prompt('Enter admin password to confirm deletion');
        axios.delete(`${import.meta.env.VITE_API_URL}/admin/delete`, { data: { adminID: adminID, password } })
        .then(response => {
            console.log(response.data.message);
            // Handle successful deletion
            setAdmins(prevAdmins => prevAdmins.filter(admin => admin.adminID !== adminID));
            fetchAdmins();
        })
        .catch(error => {
            console.error('Failed to delete admin:', error);
            // Handle errors
        });
    
    };

    const handleSaveChanges = () => {    
        axios.put(`${import.meta.env.VITE_API_URL}/admin/${admin.adminID}`, adminDetails)
            .then(response => {
                console.log('Profile updated successfully:', response.data);
                fetchAdminDetails(admin.adminID);
                alert('Profile updated successfully.');
            })
            .catch(error => {
                console.error('Failed to update profile:', error.response ? error.response.data : error.message);
                alert('Failed to update profile.');
            });
    };

    const handleGenerateAdminSignupLink = () => {
        axios.post(`${import.meta.env.VITE_API_URL}/auth/generate-admin-signup`)
            .then(response => {
                setSignupLink(response.data.signupLink);
                setOtp(response.data.otp);
                setOtpTimer(300);
                setLinkValid(true);
            })
            .catch(error => console.error('Failed to generate admin signup link:', error));
    };

    const handleRevokeLink = () => {
        setSignupLink('');
        setOtp('');
        setLinkValid(false);
    };

    const handleBackupNow = () => {
        axios.post(`${import.meta.env.VITE_API_URL}/admin/backup`, { type: backupType, format: fileFormat })
            .then(() => fetchBackupHistory())
            .catch(error => console.error('Failed to create backup:', error));
    };

    const handleDeleteBackup = (id) => {
        axios.delete(`${import.meta.env.VITE_API_URL}/admin/backup/${id}`)
            .then(() => fetchBackupHistory())
            .catch(error => console.error('Failed to delete backup:', error));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAdminDetails(prevDetails => ({
            ...prevDetails,
            [name]: value
        }));
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
                        />
                        <TextField
                            label="Email address"
                            name="email"
                            value={adminDetails.email || ''}
                            onChange={handleInputChange}
                            fullWidth
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            label="Password"
                            name="password"
                            type="password"
                            value={adminDetails.password}
                            onChange={handleInputChange}
                            fullWidth
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            label="Location"
                            name="location"
                            value={adminDetails.location || ''}
                            onChange={handleInputChange}
                            fullWidth
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            label="Username"
                            name="username"
                            value={adminDetails.username || ''}
                            onChange={handleInputChange}
                            fullWidth
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            label="Phone Number"
                            name="phoneNumber"
                            value={adminDetails.phoneNumber || ''}
                            onChange={handleInputChange}
                            fullWidth
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            label="Country Code"
                            name="countryCode"
                            value={adminDetails.countryCode || ''}
                            onChange={handleInputChange}
                            fullWidth
                            sx={{ mb: 2 }}
                        />
                        <Button variant="contained" color="primary" onClick={handleSaveChanges}>
                            Save changes
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
        </Container>
    );
};

export default SystemOverview;
