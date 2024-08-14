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
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Snackbar,
    Alert,
} from '@mui/material';
import { RemoveCircleOutline, Visibility } from '@mui/icons-material';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState(null);
    const [searchBy, setSearchBy] = useState('name');
    const [openDialog, setOpenDialog] = useState(false);
    const [confirmUsername, setConfirmUsername] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

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

    const handleOpenDialog = (user) => {
        setSelectedUser(user);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setConfirmUsername('');
    };

    const handleRemoveUser = async () => {
        if (confirmUsername !== selectedUser.username) {
            setSnackbarSeverity('error');
            setSnackbarMessage('Username does not match. Please try again.');
            setSnackbarOpen(true);
            return;
        }
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/user/${selectedUser.userID}`);
            fetchUsers();
            setSelectedUser(null);
            handleCloseDialog();
            setSnackbarSeverity('success');
            setSnackbarMessage('User deleted successfully.');
            setSnackbarOpen(true);
        } catch (error) {
            console.error("There was an error removing the user!", error);
            setSnackbarSeverity('error');
            setSnackbarMessage('Failed to remove user.');
            setSnackbarOpen(true);
        }
    };

    const handleViewData = (user) => {
        setSelectedUser(user);
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
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
                                    onClick={() => handleOpenDialog(user)}
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

                {/* Confirmation Dialog */}
                <Dialog open={openDialog} onClose={handleCloseDialog}>
                    <DialogTitle>Confirm Deletion</DialogTitle>
                    <DialogContent>
                        <Typography>
                            Are you sure you want to delete <strong>{selectedUser?.username}</strong>?
                        </Typography>
                        <TextField
                            label={`Type ${selectedUser?.username} to confirm`}
                            fullWidth
                            value={confirmUsername}
                            onChange={(e) => setConfirmUsername(e.target.value)}
                            sx={{ mt: 2 }}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog} color="secondary">
                            Cancel
                        </Button>
                        <Button onClick={handleRemoveUser} color="error">
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
            </Paper>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={handleSnackbarClose}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default UserManagement;
