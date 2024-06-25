import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [search, setSearch] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = () => {
        axios.get('http://localhost:5000/admin/users')
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

    const handleSearch = () => {
        // Implement search functionality here if needed
    };

    const handleSelectUser = (user) => {
        setSelectedUser(user);
        setEditMode(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSelectedUser(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSave = () => {
        axios.put(`http://localhost:5000/admin/user/${selectedUser.id}`, selectedUser)
            .then(response => {
                console.log(response.data);
                setEditMode(false);
                fetchUsers();
            })
            .catch(error => {
                console.error("There was an error updating the user!", error);
                setError('Failed to update user.');
            });
    };

    const handleDelete = () => {
        axios.delete(`http://localhost:5000/admin/user/${selectedUser.id}`)
            .then(response => {
                console.log(response.data);
                setSelectedUser(null);
                fetchUsers();
            })
            .catch(error => {
                console.error("There was an error deleting the user!", error);
                setError('Failed to delete user.');
            });
    };

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <input 
                type="text" 
                placeholder="Search by name" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <button onClick={handleSearch}>Search</button>
            <div>
                <h2>User List</h2>
                <ul>
                    {users.map(user => (
                        <li key={user.id} onClick={() => handleSelectUser(user)}>
                            {user.fullName} - {user.email}
                        </li>
                    ))}
                </ul>
            </div>
            {selectedUser && (
                <div>
                    {editMode ? (
                        <div>
                            <input type="text" name="fullName" value={selectedUser.fullName} onChange={handleChange} />
                            <input type="email" name="email" value={selectedUser.email} onChange={handleChange} />
                            <input type="password" name="password" value={selectedUser.password} onChange={handleChange} />
                            <textarea name="bio" value={selectedUser.bio} onChange={handleChange} />
                            <input type="text" name="location" value={selectedUser.location} onChange={handleChange} />
                            <input type="number" name="points" value={selectedUser.points} onChange={handleChange} />
                            <button onClick={handleSave}>Save</button>
                        </div>
                    ) : (
                        <div>
                            <h2>{selectedUser.fullName}</h2>
                            <p>{selectedUser.email}</p>
                            <p>{selectedUser.bio}</p>
                            <p>{selectedUser.location}</p>
                            <p>{selectedUser.points}</p>
                            <button onClick={() => setEditMode(true)}>Edit</button>
                            <button onClick={handleDelete}>Delete</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default UserManagement;
