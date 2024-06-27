import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserSettings = ({ userId }) => {
    const [userDetails, setUserDetails] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        phoneNumber: '',
        countryCode: '',
        location: ''
    });

    useEffect(() => {
        axios.get(`/user/${userId}/settings`)
            .then(response => setUserDetails(response.data))
            .catch(error => console.error("There was an error fetching the user details!", error));
    }, [userId]);

    const handleChange = (e) => {
        setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        if (userDetails.password !== userDetails.confirmPassword) {
            alert('Passwords do not match.');
            return;
        }

        axios.put(`/user/${userId}`, userDetails)
            .then(response => {
                alert('Profile updated successfully!');
            })
            .catch(error => console.error("There was an error updating the user details!", error));
    };

    return (
        <div>
            <h2>User Settings</h2>
            <form onSubmit={handleSave}>
                <label>Username</label>
                <input
                    type="text"
                    name="username"
                    value={userDetails.username}
                    onChange={handleChange}
                />
                <label>Email</label>
                <input
                    type="email"
                    name="email"
                    value={userDetails.email}
                    onChange={handleChange}
                />
                <label>Password</label>
                <input
                    type="password"
                    name="password"
                    value={userDetails.password}
                    onChange={handleChange}
                />
                <label>Confirm Password</label>
                <input
                    type="password"
                    name="confirmPassword"
                    value={userDetails.confirmPassword}
                    onChange={handleChange}
                />
                <label>Phone Number</label>
                <input
                    type="text"
                    name="phoneNumber"
                    value={userDetails.phoneNumber}
                    onChange={handleChange}
                />
                <label>Country Code</label>
                <input
                    type="text"
                    name="countryCode"
                    value={userDetails.countryCode}
                    onChange={handleChange}
                />
                <label>Location</label>
                <input
                    type="text"
                    name="location"
                    value={userDetails.location}
                    onChange={handleChange}
                />
                <button type="submit">Save</button>
            </form>
        </div>
    );
};

export default UserSettings;
