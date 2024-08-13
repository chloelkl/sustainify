import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext';
import { Avatar, Box, Button, Container, Grid, Paper, TextField, Typography } from '@mui/material';
import { Chat as ChatIcon } from '@mui/icons-material';

const UserProfile = () => {
    const { user } = useAuth();
    const [originalUserDetails, setOriginalUserDetails] = useState({});
    const [userDetails, setUserDetails] = useState({
        fullName: '',
        email: '',
        passwordLength: 0, // Store the length of the password
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
            fetchUserPoints(user.userID);  // Fetch points when the component loads
        } else {
            console.error('User ID is missing or user object is not set', user);
        }
    }, [user]);

    const fetchUserDetails = async (userID) => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/user/${userID}`);
            setUserDetails({
                ...response.data,
                password: '*'.repeat(response.data.passwordLength), // Display asterisks based on actual password length
            });
            setOriginalUserDetails({
                ...response.data,
                password: '*'.repeat(response.data.passwordLength),
            });
        } catch (error) {
            console.error('Error fetching user details:', error);
        }
    };
    

    const fetchUserPoints = async (userID) => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/user/${userID}/points`);
            setUserDetails(prevDetails => ({
                ...prevDetails,
                points: response.data.points
            }));
        } catch (error) {
            console.error('Error fetching user points:', error);
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
            const updatedDetails = {};
    
            // Check each field to see if it was changed and only include those in the update
            Object.keys(userDetails).forEach(key => {
                if (userDetails[key] !== originalUserDetails[key] && key !== 'password') {
                    updatedDetails[key] = userDetails[key];
                }
            });
    
            // Handle password separately
            if (otpValidated && newPassword && newPassword === confirmNewPassword) {
                updatedDetails.password = newPassword;
            } else if (newPassword !== confirmNewPassword) {
                setErrorMessage('New password and confirm password do not match.');
                return;
            }
    
            // Only send the update request if there's something to update
            if (Object.keys(updatedDetails).length > 0) {
                await axios.put(`${import.meta.env.VITE_API_URL}/user/${user.userID}`, updatedDetails);
                setErrorMessage('');
                setEditMode(false);
                fetchUserDetails(user.userID);
    
                // Reset password fields and OTP validation state
                setNewPassword('');
                setConfirmNewPassword('');
                setOtpValidated(false);
                setOtpSent(false);
                setOtp('');
            } else {
                setErrorMessage('No changes to save.');
            }
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
        <Container sx={{ padding: 4, backgroundColor: '#f4f5f7', borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', py: 2 }}>
                <Avatar sx={{ width: 80, height: 80, mb: 1 }}>
                    <ChatIcon fontSize="large" />
                </Avatar>
                <Typography variant="h5" component="h1" gutterBottom>
                    User's Profile
                </Typography>
            </Box>
            <Paper sx={{ padding: 4, borderRadius: 2, backgroundColor: '#ffffff' }}>
                <Grid container spacing={4}>
                    {/* Left Column */}
                    <Grid item xs={12} sm={4} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <TextField
                            label="Full name"
                            name="fullName"
                            value={userDetails.fullName || ''}
                            onChange={handleChange}
                            fullWidth
                            disabled={!editMode}
                            sx={{ marginBottom: '20px' }}
                        />
                        <TextField
                            label="Email address"
                            name="email"
                            value={userDetails.email || ''}
                            onChange={handleChange}
                            fullWidth
                            disabled={!editMode}
                            sx={{ marginBottom: '20px' }}
                        />
                        <TextField
                            label="Password"
                            name="password"
                            type="password"
                            value={'*'.repeat(userDetails.passwordLength)} // Show asterisks based on actual password length
                            fullWidth
                            disabled
                            sx={{ marginBottom: '20px' }}
                        />
                        <TextField
                            label="Location"
                            name="location"
                            value={userDetails.location || ''}
                            onChange={handleChange}
                            fullWidth
                            disabled={!editMode}
                            sx={{ marginBottom: '20px' }}
                        />
                    </Grid>

                    {/* Middle Column */}
                    <Grid item xs={12} sm={4}>
                        <TextField
                            label="Bio"
                            name="bio"
                            value={userDetails.bio || ''}
                            onChange={handleChange}
                            fullWidth
                            multiline
                            rows={4}
                            disabled={!editMode}
                            sx={{ marginBottom: '20px' }}
                        />
                        {editMode && (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
                                <Button variant="contained" color="primary" onClick={sendOTP} fullWidth>
                                    Send OTP to change Password
                                </Button>
                                <TextField
                                    label="Enter OTP"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    fullWidth
                                    sx={{ marginBottom: '10px' }}
                                />
                                <Button variant="contained" color="primary" onClick={validateOTP} fullWidth>
                                    Validate OTP
                                </Button>
                            </Box>
                        )}
                    </Grid>

                    {/* Right Column */}
                    <Grid item xs={12} sm={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', position: 'relative' }}>
                        <Typography variant="h6" sx={{ marginBottom: 2 }}>
                            Points earned:
                        </Typography>
                        <Typography variant="h4" sx={{ marginBottom: 4 }}>
                            {userDetails.points} Pts
                        </Typography>
                        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={editMode ? handleSave : () => setEditMode(true)}
                                sx={{
                                    width: '100%',
                                    marginBottom: 2,
                                    ...(editMode && { width: 'calc(100% - 16px)', position: 'absolute', bottom: 0 }), // Align to the edit button
                                }}
                            >
                                {editMode ? 'Save changes' : 'Edit Profile'}
                            </Button>
                            {editMode && (
                                <Button variant="outlined" color="secondary" onClick={() => setEditMode(false)} sx={{ width: '100%', ml: 2 }}>
                                    Cancel changes
                                </Button>
                            )}
                        </Box>
                    </Grid>

                    {otpValidated && (
                        <>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    label="New Password"
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    fullWidth
                                    sx={{ marginBottom: '20px' }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    label="Confirm New Password"
                                    type="password"
                                    value={confirmNewPassword}
                                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                                    fullWidth
                                    sx={{ marginBottom: '20px' }}
                                />
                            </Grid>
                        </>
                    )}

                    {errorMessage && (
                        <Grid item xs={12}>
                            <Typography variant="body1" color="error">
                                {errorMessage}
                            </Typography>
                        </Grid>
                    )}
                </Grid>
            </Paper>
        </Container>
    );
};

export default UserProfile;
