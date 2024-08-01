import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext';

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
            await axios.put(`${import.meta.env.VITE_API_URL}/user/${user.userID}`, userDetails);
            alert('Profile updated successfully!');
            setEditMode(false);
            fetchUserDetails(user.userID);
        } catch (error) {
            console.error('Error updating user profile:', error);
            alert('Failed to update profile.');
        }
    };

    return (
        <div style={containerStyle}>
            <h2 style={headingStyle}>User Profile</h2>
            <div style={profileContainerStyle}>
                <div style={sectionStyle}>
                    <h3>Profile Details</h3>
                    {editMode ? (
                        <div style={editProfileContainerStyle}>
                            <label>Full Name:</label>
                            <input
                                type="text"
                                name="fullName"
                                value={userDetails.fullName || ''}
                                onChange={handleChange}
                                style={inputStyle}
                            />
                            <label>Email:</label>
                            <input
                                type="email"
                                name="email"
                                value={userDetails.email || ''}
                                onChange={handleChange}
                                style={inputStyle}
                            />
                            <label>Password:</label>
                            <input
                                type="password"
                                name="password"
                                value={userDetails.password || ''}
                                onChange={handleChange}
                                style={inputStyle}
                            />
                            <label>Bio:</label>
                            <textarea
                                name="bio"
                                value={userDetails.bio || ''}
                                onChange={handleChange}
                                style={textareaStyle}
                            />
                            <label>Location:</label>
                            <input
                                type="text"
                                name="location"
                                value={userDetails.location || ''}
                                onChange={handleChange}
                                style={inputStyle}
                            />
                            <label>Phone Number:</label>
                            <input
                                type="text"
                                name="phoneNumber"
                                value={userDetails.phoneNumber || ''}
                                onChange={handleChange}
                                style={inputStyle}
                            />
                            <label>Country Code:</label>
                            <input
                                type="text"
                                name="countryCode"
                                value={userDetails.countryCode || ''}
                                onChange={handleChange}
                                style={inputStyle}
                            />
                            <div style={buttonsContainerStyle}>
                                <button onClick={handleSave} style={saveButtonStyle}>Save changes</button>
                                <button onClick={() => setEditMode(false)} style={cancelButtonStyle}>Cancel</button>
                            </div>
                        </div>
                    ) : (
                        <div style={viewProfileContainerStyle}>
                            <p><strong>Full Name:</strong> {userDetails.fullName}</p>
                            <p><strong>Email:</strong> {userDetails.email}</p>
                            <p><strong>Bio:</strong> {userDetails.bio}</p>
                            <p><strong>Location:</strong> {userDetails.location}</p>
                            <p><strong>Phone Number:</strong> {userDetails.phoneNumber}</p>
                            <p><strong>Country Code:</strong> {userDetails.countryCode}</p>
                            <p><strong>Points:</strong> {userDetails.points}</p>
                            <button onClick={() => setEditMode(true)} style={editButtonStyle}>Edit Profile</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Styles
const containerStyle = {
    padding: '20px',
    backgroundColor: '#f0f0f0',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
};

const headingStyle = {
    marginBottom: '20px',
};

const profileContainerStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gridGap: '20px',
};

const sectionStyle = {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
};

const editProfileContainerStyle = {
    display: 'grid',
    gridGap: '10px',
};

const viewProfileContainerStyle = {
    display: 'grid',
    gridGap: '10px',
};

const inputStyle = {
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
};

const textareaStyle = {
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    resize: 'vertical',
    height: '100px',
};

const buttonsContainerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '20px',
};

const saveButtonStyle = {
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '10px',
    borderRadius: '5px',
    border: 'none',
    cursor: 'pointer',
};

const cancelButtonStyle = {
    backgroundColor: '#e74c3c',
    color: 'white',
    padding: '10px',
    borderRadius: '5px',
    border: 'none',
    cursor: 'pointer',
};

const editButtonStyle = {
    backgroundColor: '#3498db',
    color: 'white',
    padding: '10px',
    borderRadius: '5px',
    border: 'none',
    cursor: 'pointer',
};

export default UserProfile;
