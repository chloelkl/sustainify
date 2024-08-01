import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Box,
    Container,
    Typography,
    TextField,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Paper
} from '@mui/material';
import { RemoveCircleOutline, Visibility } from '@mui/icons-material';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState(null);
    const [searchBy, setSearchBy] = useState('name');

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
        <Container>
            <Paper elevation={3} sx={{ p: 2, borderRadius: '10px' }}>
                <Typography variant="h6" gutterBottom>Admin's User Management</Typography>
                {error && <Typography color="error">{error}</Typography>}
                <Box display="flex" mb={2}>
                    <FormControl sx={{ minWidth: 120, mr: 2 }}>
                        <InputLabel>Search by</InputLabel>
                        <Select
                            value={searchBy}
                            onChange={(e) => setSearchBy(e.target.value)}
                        >
                            <MenuItem value="name">Name</MenuItem>
                            <MenuItem value="email">Email</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        fullWidth
                        label={`Search by ${searchBy}`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </Box>
                <List>
                    {users.filter(user => 
                        user.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        user.email.toLowerCase().includes(searchTerm.toLowerCase())
                    ).map((user, index) => (
                        <ListItem key={index} divider>
                            <ListItemText
                                primary={user.username}
                                secondary={user.email}
                            />
                            <ListItemSecondaryAction>
                                <IconButton
                                    edge="end"
                                    onClick={() => handleViewData(user)}
                                    sx={{ color: '#3498db' }}
                                >
                                    <Visibility />
                                </IconButton>
                                <IconButton
                                    edge="end"
                                    onClick={() => handleRemoveUser(user.userID)}
                                    sx={{ color: '#e74c3c', ml: 2 }}
                                >
                                    <RemoveCircleOutline />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    ))}
                </List>
                {selectedUser && (
                    <Paper elevation={3} sx={{ p: 2, mt: 2, borderRadius: '10px' }}>
                        <Typography variant="h6">User Details</Typography>
                        <Typography><strong>Username:</strong> {selectedUser.username}</Typography>
                        <Typography><strong>Email:</strong> {selectedUser.email}</Typography>
                        {/* Add more fields as necessary */}
                    </Paper>
                )}
            </Paper>
        </Container>
    );
};

export default UserManagement;
