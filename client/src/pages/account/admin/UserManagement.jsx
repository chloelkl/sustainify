import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/user`);
            setUsers(response.data);
        } catch (error) {
            console.error("There was an error fetching the users!", error);
            setError('Failed to fetch users.');
        }
    };

    const handleRemoveUser = async (userID) => {
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/user/${userID}`);
            fetchUsers();
            setSelectedUser(null);
        } catch (error) {
            console.error("There was an error removing the user!", error);
            setError('Failed to remove user.');
        }
    };

    const handleViewData = (user) => {
        setSelectedUser(user);
    };

    return (
        <div style={containerStyle}>
            {error && <div style={errorStyle}>{error}</div>}
            <div style={searchContainerStyle}>
                <input
                    type="text"
                    placeholder="Search by name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={inputStyle}
                />
            </div>
            <ul style={listStyle}>
                {users.filter(user => user.username.toLowerCase().includes(searchTerm.toLowerCase())).map((user, index) => (
                    <li key={index} style={listItemStyle}>
                        <span>{user.username}</span>
                        <div>
                            <button style={viewButtonStyle} onClick={() => handleViewData(user)}>View Data</button>
                            <button style={removeButtonStyle} onClick={() => handleRemoveUser(user.userID)}>Remove User</button>
                        </div>
                    </li>
                ))}
            </ul>
            {selectedUser && (
                <div style={detailStyle}>
                    <h3>User Details</h3>
                    <p><strong>Username:</strong> {selectedUser.username}</p>
                    <p><strong>Email:</strong> {selectedUser.email}</p>
                    {/* Add more fields as necessary */}
                </div>
            )}
        </div>
    );
};

const containerStyle = {
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
};

const searchContainerStyle = {
    display: 'flex',
    marginBottom: '20px',
};

const inputStyle = {
    padding: '5px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    flex: 1,
};

const listStyle = {
    listStyleType: 'none',
    padding: '0',
};

const listItemStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px',
    backgroundColor: '#f9f9f9',
    borderRadius: '5px',
    marginBottom: '10px',
};

const viewButtonStyle = {
    padding: '5px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#3498db',
    color: 'white',
    cursor: 'pointer',
    marginRight: '10px',
};

const removeButtonStyle = {
    padding: '5px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#e74c3c',
    color: 'white',
    cursor: 'pointer',
};

const detailStyle = {
    marginTop: '20px',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '10px',
};

const errorStyle = {
    color: 'red',
    marginBottom: '20px',
};

export default UserManagement;
