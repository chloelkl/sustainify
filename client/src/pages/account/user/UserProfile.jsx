import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserProfile = ({ userId }) => {
    const [user, setUser] = useState({});
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        axios.get(`/user/${userId}`)
            .then(response => setUser(response.data))
            .catch(error => console.error("There was an error fetching the user!", error));
    }, [userId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSave = () => {
        axios.put(`/user/${userId}`, user)
            .then(response => {
                console.log(response.data);
                setEditMode(false);
            })
            .catch(error => console.error("There was an error updating the user!", error));
    };

    return (
        <div style={containerStyle}>
            <div style={leftContainerStyle}>
                <div style={profileImageContainer}>
                    <img src={user.profilePicture || '/default-profile.png'} alt="Profile" style={profileImageStyle} />
                </div>
                <h1>{user.fullName}</h1>
                <p>Points earned: {user.pointsEarned}</p>
            </div>
            <div style={rightContainerStyle}>
                {editMode ? (
                    <div style={formStyle}>
                        <label>Full name:</label>
                        <input type="text" name="fullName" value={user.fullName} onChange={handleChange} />
                        <label>Email address:</label>
                        <input type="email" name="email" value={user.email} onChange={handleChange} />
                        <label>Password:</label>
                        <input type="password" name="password" value={user.password} onChange={handleChange} />
                        <label>Location:</label>
                        <input type="text" name="location" value={user.location} onChange={handleChange} />
                        <label>Bio:</label>
                        <textarea name="bio" value={user.bio} onChange={handleChange} />
                        <div style={buttonContainerStyle}>
                            <button onClick={() => setEditMode(false)}>Cancel changes</button>
                            <button onClick={handleSave}>Save changes</button>
                        </div>
                    </div>
                ) : (
                    <div>
                        <p>Full name: {user.fullName}</p>
                        <p>Email address: {user.email}</p>
                        <p>Location: {user.location}</p>
                        <p>Bio: {user.bio}</p>
                        <button onClick={() => setEditMode(true)}>Edit</button>
                    </div>
                )}
            </div>
        </div>
    );
};

const containerStyle = {
    display: 'flex',
    padding: '20px',
    backgroundColor: '#f0f0f0',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)'
};

const leftContainerStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px'
};

const rightContainerStyle = {
    flex: 2,
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    padding: '20px',
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    boxShadow: '0 0 5px rgba(0,0,0,0.1)'
};

const profileImageContainer = {
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    overflow: 'hidden',
    marginBottom: '10px'
};

const profileImageStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
};

const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
};

const buttonContainerStyle = {
    display: 'flex',
    gap: '10px'
};

export default UserProfile;
