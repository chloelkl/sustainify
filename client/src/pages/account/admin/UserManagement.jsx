import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = () => {
        axios.get('http://localhost:3000/admin/users')
            .then(response => {
                console.log('Users response:', response.data);
                if (Array.isArray(response.data)) {
                    setUsers(response.data);
                } else {
                    throw new Error('Users response is not an array.');
                }
            })
            .catch(error => {
                console.error("There was an error fetching the users!", error);
                setError('Failed to fetch users.');
            });
    };

    const handleRemoveUser = (id) => {
        axios.delete(`http://localhost:3000/admin/users/${id}`)
            .then(response => {
                console.log(response.data);
                fetchUsers();
            })
            .catch(error => {
                console.error("There was an error removing the user!", error);
                setError('Failed to remove user.');
            });
    };

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div style={containerStyle}>
            <div style={searchContainerStyle}>
                <label style={labelStyle}>
                    Search by: 
                    <select style={selectStyle}>
                        <option value="name">Name</option>
                        <option value="email">Email</option>
                        {/* Add more search options as needed */}
                    </select>
                </label>
                <input
                    type="text"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={inputStyle}
                />
            </div>
            <ul style={listStyle}>
                {users.filter(user => user.name.includes(searchTerm)).map((user, index) => (
                    <li key={index} style={listItemStyle}>
                        <span>{user.name}</span>
                        <button style={viewButtonStyle}>View Data</button>
                        <button style={removeButtonStyle} onClick={() => handleRemoveUser(user.id)}>Remove User</button>
                    </li>
                ))}
            </ul>
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

const labelStyle = {
    marginRight: '10px',
};

const selectStyle = {
    marginRight: '10px',
    padding: '5px',
    borderRadius: '5px',
    border: '1px solid #ccc',
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

export default UserManagement;
