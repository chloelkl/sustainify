import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext';
import { Avatar, Box, Button, Container, Grid, TextField, Typography } from '@mui/material';
import { Chat as ChatIcon } from '@mui/icons-material';

const UserProfile = () => {
    const { user } = useAuth();
    const [userDetails, setUserDetails] = useState({
        fullName: '',
        email: '',
        password: '',
        bio: '',
        location: '',
        phoneNumber: '',
        countryCode: '',
        points: 0
    });
    const [editMode, setEditMode] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [otpValidated, setOtpValidated] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

    useEffect(() => {
        if (user && user.userID) {
            fetchUserDetails(user.userID);
        } else {
            console.error('User ID is missing or user object is not set', user);
        }
    }, [user]);

    const fetchUserDetails = async (userID) => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/user/${userID}`);
            setUserDetails(response.data);
        } catch (error) {
            console.error('Error fetching user details:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserDetails(prevDetails => ({
            ...prevDetails,
            [name]: value
        }));
    };

    const handleSave = async () => {
        try {
            if (newPassword && newPassword === confirmNewPassword) {
                await axios.put(`${import.meta.env.VITE_API_URL}/user/${user.userID}`, {
                    ...userDetails,
                    password: newPassword
                });
            } else {
                await axios.put(`${import.meta.env.VITE_API_URL}/user/${user.userID}`, userDetails);
            }
            setErrorMessage('');
            setEditMode(false);
            fetchUserDetails(user.userID);
        } catch (error) {
            console.error('Error updating user profile:', error);
            setErrorMessage('Failed to update profile. Please try again.');
        }
    };

    const sendOTP = async () => {
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/user/send-otp`, { email: userDetails.email });
            setOtpSent(true);
            alert('OTP sent to your email. Please check your inbox.');
        } catch (error) {
            console.error('Error sending OTP:', error);
            alert('Failed to send OTP. Please try again.');
        }
    };

    const validateOTP = async () => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/user/validate-otp`, { email: userDetails.email, otp });
            if (response.data.success) {
                setOtpValidated(true);
                alert('OTP validated. You can now change your password.');
            } else {
                alert('Invalid OTP. Please try again.');
            }
        } catch (error) {
            console.error('Error validating OTP:', error);
            alert('Failed to validate OTP. Please try again.');
        }
    };    

    return (
        <Container>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', py: 4 }}>
                <Avatar sx={{ width: 100, height: 100, mb: 2 }}>
                    <ChatIcon fontSize="large" />
                </Avatar>
                <Typography variant="h4" component="h1" gutterBottom>
                    User's Profile
                </Typography>
            </Box>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1" gutterBottom>
                        Full name
                    </Typography>
                    <TextField
                        name="fullName"
                        value={userDetails.fullName || ''}
                        onChange={handleChange}
                        fullWidth
                        disabled={!editMode}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1" gutterBottom>
                        Email address
                    </Typography>
                    <TextField
                        name="email"
                        value={userDetails.email || ''}
                        onChange={handleChange}
                        fullWidth
                        disabled={!editMode}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom>
                        Bio
                    </Typography>
                    <TextField
                        name="bio"
                        value={userDetails.bio || ''}
                        onChange={handleChange}
                        fullWidth
                        multiline
                        rows={3}
                        disabled={!editMode}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1" gutterBottom>
                        Location
                    </Typography>
                    <TextField
                        name="location"
                        value={userDetails.location || ''}
                        onChange={handleChange}
                        fullWidth
                        disabled={!editMode}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Grid container spacing={2}>
                        <Grid item xs={4}>
                            <Typography variant="subtitle1" gutterBottom>
                                Country Code
                            </Typography>
                            <TextField
                                name="countryCode"
                                value={userDetails.countryCode || ''}
                                onChange={handleChange}
                                fullWidth
                                disabled={!editMode}
                            />
                        </Grid>
                        <Grid item xs={8}>
                            <Typography variant="subtitle1" gutterBottom>
                                Phone number
                            </Typography>
                            <TextField
                                name="phoneNumber"
                                value={userDetails.phoneNumber || ''}
                                onChange={handleChange}
                                fullWidth
                                disabled={!editMode}
                            />
                        </Grid>
                    </Grid>
                </Grid>
                {editMode ? (
                    <>
                        <Grid item xs={12}>
                            <Typography variant="subtitle1" gutterBottom>
                                Current Password
                            </Typography>
                            <TextField
                                name="password"
                                type="password"
                                value={userDetails.password ? '********' : ''}
                                fullWidth
                                disabled
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Button variant="contained" color="primary" onClick={sendOTP}>
                                Send OTP
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Enter OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                fullWidth
                            />
                            <Button variant="contained" color="primary" onClick={validateOTP}>
                                Validate OTP
                            </Button>
                        </Grid>
                        {otpValidated && (
                            <>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle1" gutterBottom>
                                        New Password
                                    </Typography>
                                    <TextField
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle1" gutterBottom>
                                        Confirm New Password
                                    </Typography>
                                    <TextField
                                        type="password"
                                        value={confirmNewPassword}
                                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                                        fullWidth
                                    />
                                </Grid>
                            </>
                        )}
                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Button variant="contained" color="primary" onClick={handleSave}>
                                    Save changes
                                </Button>
                                <Button variant="outlined" color="secondary" onClick={() => setEditMode(false)}>
                                    Cancel
                                </Button>
                            </Box>
                        </Grid>
                    </>
                ) : (
                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body1">
                                <strong>Points earned:</strong> {userDetails.points}
                            </Typography>
                            <Button variant="contained" color="primary" onClick={() => setEditMode(true)}>
                                Edit Profile
                            </Button>
                        </Box>
                    </Grid>
                )}
                {errorMessage && (
                    <Grid item xs={12}>
                        <Typography variant="body1" color="error">
                            {errorMessage}
                        </Typography>
                    </Grid>
                )}
            </Grid>
        </Container>
    );
};

export default UserProfile;
