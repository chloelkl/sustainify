import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext';
import {
    Box,
    Grid,
    TextField,
    Button,
    List,
    ListItem,
    ListItemText,
    Typography,
    Paper,
    Divider,
    ListItemAvatar,
    Avatar,
    Snackbar,
    Alert,
    IconButton
} from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';

const ChatWithFriends = () => {
    const { user } = useAuth();
    const [friends, setFriends] = useState([]);
    const [friendRequests, setFriendRequests] = useState([]);
    const [selectedFriend, setSelectedFriend] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [socket, setSocket] = useState(null);
    const [searchResults, setSearchResults] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [sentRequests, setSentRequests] = useState([]); // Track sent friend requests
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    useEffect(() => {
        let ws;

        const connectWebSocket = () => {
            const ws = new WebSocket('ws://localhost:3001');

            ws.onopen = () => {
                console.log('WebSocket connection established');
                ws.send(JSON.stringify({ type: 'connect', userID: user.userID }));
            };

            ws.onmessage = (event) => {
                const message = JSON.parse(event.data);
                setMessages((prevMessages) => [...prevMessages, message]);
            };

            ws.onerror = (error) => {
                console.error('WebSocket error:', error);
            };

            ws.onclose = (event) => {
                console.log('WebSocket connection closed:', event);
                if (!event.wasClean) {
                    console.log('Reconnecting WebSocket...');
                    setTimeout(connectWebSocket, 1000); // Retry connection after 1 second
                }
            };

            setSocket(ws); // Set the WebSocket instance to state
        };

        connectWebSocket();

        return () => {
            if (ws) {
                ws.close();
            }
        };
    }, [user?.userID]);

    useEffect(() => {
        if (user?.userID) {
            fetchFriends();
            fetchFriendRequests();
        }
    }, [user?.userID]);

    const fetchFriends = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/user/${user.userID}/friends`);
            console.log('Friends fetched:', response.data);
            setFriends(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error("There was an error fetching the friends!", error);
            setFriends([]); // Set friends to an empty array on error
        }
    };

    const fetchFriendRequests = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/user/${user.userID}/friend-requests`);
            console.log('Friend requests fetched:', response.data);
            setFriendRequests(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('There was an error fetching the friend requests!', error);
            setFriendRequests([]); // Set requests to an empty array on error
        }
    };

    const handleSearch = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/user/search?username=${searchQuery}`);
            const filteredResults = response.data.filter((result) => result.userID !== user.userID); // Filter out current user
            console.log('Search response:', filteredResults);
            setSearchResults(Array.isArray(filteredResults) ? filteredResults : []);
        } catch (error) {
            console.error('Error searching for users:', error);
            setSearchResults([]);
        }
    };

    const handleSendFriendRequest = async (recipientID) => {
        const requesterID = user?.userID;

        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/user/friend-request`, { requesterID, recipientID });
            console.log('Friend request sent');

            // Add to sent requests to disable the button
            setSentRequests([...sentRequests, recipientID]);

            // Move to friend requests with pending status
            const recipient = searchResults.find(user => user.userID === recipientID);
            setFriendRequests([...friendRequests, { ...recipient, id: Date.now(), status: 'Pending' }]);

            setSnackbarMessage('Friend request sent!');
            setSnackbarOpen(true); // Show the Snackbar
        } catch (error) {
            console.error('Error sending friend request:', error);
            if (error.response) {
                console.error('Server response:', error.response.data); // Log server response
            }
        }
    };

    const handleCancelFriendRequest = async (recipientID, username) => {
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/user/friend-request`, { data: { requesterID: user.userID, recipientID } });
            console.log('Friend request canceled');

            // Remove from friend requests list
            setFriendRequests(friendRequests.filter(request => request.userID !== recipientID));

            // Re-enable the "Add Friend" button by removing from sentRequests
            setSentRequests(sentRequests.filter(id => id !== recipientID));

            // Show cancellation Snackbar with the correct username
            setSnackbarMessage(`Friend request for ${username} has been cancelled!`);
            setSnackbarOpen(true);
        } catch (error) {
            console.error('Error canceling friend request:', error);
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
        setSnackbarMessage(''); // Clear message after closing
    };

    return (
        <Box sx={{ display: 'flex', height: '100%' }}>
            <Grid container spacing={2}>
                <Grid item xs={4}>
                    <Paper sx={{ padding: 2, height: '100%', overflowY: 'auto' }}>
                        <Typography variant="h6">Search Users</Typography>
                        <TextField
                            fullWidth
                            variant="outlined"
                            placeholder="Search by username"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            sx={{ marginBottom: 2 }}
                        />
                        <Button variant="contained" onClick={handleSearch} fullWidth>
                            Search
                        </Button>
                        <List>
                            {searchResults.map(user => (
                                <ListItem key={user.userID}>
                                    <ListItemText primary={user.fullName || user.username} />
                                    <Button
                                        onClick={() => handleSendFriendRequest(user.userID)}
                                        disabled={sentRequests.includes(user.userID)} // Disable if request has been sent
                                        sx={{
                                            backgroundColor: sentRequests.includes(user.userID) ? '#d3d3d3' : 'primary.main',
                                            color: sentRequests.includes(user.userID) ? '#7d7d7d' : 'white',
                                            cursor: sentRequests.includes(user.userID) ? 'not-allowed' : 'pointer',
                                        }}
                                    >
                                        {sentRequests.includes(user.userID) ? 'Request Sent' : 'Add Friend'}
                                    </Button>
                                </ListItem>
                            ))}
                        </List>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="h6">Friend Requests</Typography>
                        <List>
                            {friendRequests.length === 0 ? (
                                <Typography>No pending friend requests.</Typography>
                            ) : (
                                friendRequests.map(request => (
                                    <ListItem key={request.id}>
                                        <ListItemText primary={request.fullName || request.username || 'Unknown'} />
                                        <Typography variant="body2" sx={{ marginLeft: 2 }}>{request.status}</Typography>
                                        <IconButton onClick={() => handleCancelFriendRequest(request.userID, request.username)} sx={{ marginLeft: 1 }}>
                                            <CancelIcon />
                                        </IconButton>
                                    </ListItem>
                                ))
                            )}
                        </List>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="h6">Friends List</Typography>
                        <List>
                            {friends.length > 0 ? (
                                friends.map((friend) => (
                                    <ListItem key={friend.userID} button onClick={() => handleFriendClick(friend)}>
                                        <ListItemAvatar>
                                            <Avatar>{friend.fullName ? friend.fullName[0] : friend.username ? friend.username[0] : 'U'}</Avatar>
                                        </ListItemAvatar>
                                        <ListItemText primary={friend.fullName || friend.username} />
                                    </ListItem>
                                ))
                            ) : (
                                <Typography>No friends found.</Typography>
                            )}
                        </List>
                    </Paper>
                </Grid>
                <Grid item xs={8}>
                    {selectedFriend ? (
                        <Paper sx={{ padding: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <Typography variant="h6">Chat with {selectedFriend.fullName || selectedFriend.username}</Typography>
                            <Box sx={{ flexGrow: 1, overflowY: 'auto', marginBottom: 2, border: 1, borderColor: 'divider', padding: 2 }}>
                                {messages.map((message, index) => (
                                    <Box key={index} sx={{ marginBottom: 1 }}>
                                        <Typography variant="body2" color="textSecondary">
                                            <strong>{message.from === user.userID ? 'You' : selectedFriend.fullName || selectedFriend.username}:</strong> {message.content}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    sx={{ marginRight: 2 }}
                                />
                                <Button variant="contained" onClick={handleSendMessage}>
                                    Send
                                </Button>
                            </Box>
                        </Paper>
                    ) : (
                        <Paper sx={{ padding: 2, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Typography variant="h6" color="textSecondary">
                                Select a friend to start chatting
                            </Typography>
                        </Paper>
                    )}
                </Grid>
            </Grid>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={handleSnackbarClose}
            >
                <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default ChatWithFriends;
