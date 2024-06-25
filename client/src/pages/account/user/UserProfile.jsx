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

    const handleDelete = () => {
        axios.delete(`/user/${userId}`)
            .then(response => {
                console.log(response.data);
                // Redirect or update UI accordingly
            })
            .catch(error => console.error("There was an error deleting the user!", error));
    };

    return (
        <div>
            {editMode ? (
                <div>
                    <input type="text" name="fullName" value={user.fullName} onChange={handleChange} />
                    <input type="email" name="email" value={user.email} onChange={handleChange} />
                    <input type="password" name="password" value={user.password} onChange={handleChange} />
                    <textarea name="bio" value={user.bio} onChange={handleChange} />
                    <input type="text" name="location" value={user.location} onChange={handleChange} />
                    <button onClick={handleSave}>Save</button>
                </div>
            ) : (
                <div>
                    <h1>{user.fullName}</h1>
                    <p>{user.email}</p>
                    <p>{user.bio}</p>
                    <p>{user.location}</p>
                    <p>{user.points}</p>
                    <button onClick={() => setEditMode(true)}>Edit</button>
                    <button onClick={handleDelete}>Delete</button>
                </div>
            )}
        </div>
    );
};

export default UserProfile;
