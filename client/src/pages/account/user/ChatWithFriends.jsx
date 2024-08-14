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
    const [incomingRequests, setIncomingRequests] = useState([]); // Track incoming friend requests
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
                
                // Handle friend requests and updates in real-time
                if (message.type === 'friend-request') {
                    if (message.action === 'sent') {
                        // If the current user sent the request, update the sent requests
                        if (message.data.requesterID === user.userID) {
                            setSentRequests([...sentRequests, message.data.recipientID]);
                        }
                        // If the current user received the request, update incoming requests
                        if (message.data.recipientID === user.userID) {
                            setIncomingRequests([...incomingRequests, message.data]);
                        }
                    } else if (message.action === 'accepted') {
                        // Update friends list if a request was accepted
                        if (message.data.recipientID === user.userID || message.data.requesterID === user.userID) {
                            fetchFriends();
                            fetchFriendRequests();
                        }
                    } else if (message.action === 'canceled') {
                        // Handle request cancellation in real-time
                        if (message.data.requesterID === user.userID || message.data.recipientID === user.userID) {
                            fetchFriendRequests();
                        }
                    }
                } else if (message.type === 'message') {
                    setMessages((prevMessages) => [...prevMessages, message.data]);
                }
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

            // Separate incoming and sent friend requests
            const incoming = response.data.filter(request => request.Requester.userID !== user.userID);
            const sent = response.data.filter(request => request.Requester.userID === user.userID);

            setIncomingRequests(incoming);
            setSentRequests(sent.map(req => req.recipientID));
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

            // Check if the searched user is already in friends or requests list
            const updatedResults = filteredResults.map(result => {
                if (friends.some(friend => friend.userID === result.userID)) {
                    return { ...result, status: 'In Friends List' };
                } else if (sentRequests.includes(result.userID)) {
                    return { ...result, status: 'Friend Request Sent' };
                }
                return result;
            });

            setSearchResults(updatedResults);
        } catch (error) {
            console.error('Error searching for users:', error);
            setSearchResults([]);
        }
    };

    const handleSendFriendRequest = async (recipientID) => {
        const requesterID = user?.userID;

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/user/friend-request`, { requesterID, recipientID });
            console.log('Friend request sent');

            // Add to sent requests to disable the button
            setSentRequests([...sentRequests, recipientID]);

            // Emit WebSocket event for real-time update
            socket.send(JSON.stringify({
                type: 'friend-request',
                action: 'sent',
                data: { requesterID, recipientID, Requester: user }
            }));

            // Move to friend requests with pending status
            const recipient = searchResults.find(user => user.userID === recipientID);
            setFriendRequests([...friendRequests, { ...recipient, id: Date.now(), status: 'Pending' }]);

            // Update the search result immediately
            const updatedSearchResults = searchResults.map(result => {
                if (result.userID === recipientID) {
                    return { ...result, status: 'Friend Request Sent' };
                }
                return result;
            });
            setSearchResults(updatedSearchResults);

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
    
            // Emit WebSocket event for real-time update
            socket.send(JSON.stringify({
                type: 'friend-request',
                action: 'canceled',
                data: { requesterID: user.userID, recipientID }
            }));
    
            // Remove from sent requests list
            setSentRequests(sentRequests.filter(id => id !== recipientID));
    
            // Update the search result immediately to show 'Add Friend' again
            const updatedSearchResults = searchResults.map(result => {
                if (result.userID === recipientID) {
                    return { ...result, status: null }; // Reset status to null or undefined
                }
                return result;
            });
            setSearchResults(updatedSearchResults);
    
            // Show cancellation Snackbar with the correct username
            setSnackbarMessage(`Friend request for ${username} has been cancelled!`);
            setSnackbarOpen(true);
        } catch (error) {
            console.error('Error canceling friend request:', error);
        }
    };

    const handleRejectFriendRequest = async (requestID, requesterID, username) => {
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/user/friend-request`, { data: { requesterID, recipientID: user.userID } });
            console.log('Friend request rejected');

            // Remove from incoming requests list
            setIncomingRequests(incomingRequests.filter(request => request.Requester.userID !== requesterID));

            // Show rejection Snackbar with the correct username
            setSnackbarMessage(`Friend request from ${username} has been rejected!`);
            setSnackbarOpen(true);
        } catch (error) {
            console.error('Error rejecting friend request:', error);
        }
    };

    const handleAcceptFriendRequest = async (requestID, requesterID) => {
        try {
            await axios.put(`${import.meta.env.VITE_API_URL}/user/friend-request/accept`, { id: requestID });
            console.log('Friend request accepted');

            // Emit WebSocket event for real-time update
            socket.send(JSON.stringify({
                type: 'friend-request',
                action: 'accepted',
                data: { requesterID, recipientID: user.userID }
            }));

            // Move the user from the requests to the friends list
            const acceptedFriend = incomingRequests.find(request => request.Requester.userID === requesterID);
            setFriends([...friends, acceptedFriend.Requester]);
            setIncomingRequests(incomingRequests.filter(request => request.Requester.userID !== requesterID));

            setSnackbarMessage('Friend request accepted!');
            setSnackbarOpen(true);
        } catch (error) {
            console.error('Error accepting friend request:', error);
        }
    };

    const handleRemoveFriend = async (friendID) => {
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/user/friend-remove`, { data: { userID: user.userID, friendID } });
            console.log('Friend removed');

            // Emit WebSocket event for real-time update
            socket.send(JSON.stringify({
                type: 'friend-request',
                action: 'removed',
                data: { userID: user.userID, friendID }
            }));

            // Remove friend from list
            setFriends(friends.filter(friend => friend.userID !== friendID));

            setSnackbarMessage('Friend removed successfully.');
            setSnackbarOpen(true);
        } catch (error) {
            console.error('Error removing friend:', error);
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
                                    {user.status === 'In Friends List' ? (
                                        <Button
                                            variant="outlined"
                                            disabled
                                            sx={{
                                                cursor: 'not-allowed',
                                                color: '#7d7d7d',
                                                borderColor: '#7d7d7d',
                                                '&:hover': {
                                                    backgroundColor: 'transparent',
                                                },
                                            }}
                                        >
                                            In Friends List
                                        </Button>
                                    ) : user.status === 'Friend Request Sent' ? (
                                        <Button
                                            variant="outlined"
                                            disabled
                                            sx={{
                                                cursor: 'not-allowed',
                                                color: '#7d7d7d',
                                                borderColor: '#7d7d7d',
                                                '&:hover': {
                                                    backgroundColor: 'transparent',
                                                },
                                            }}
                                        >
                                            Friend Request Sent
                                        </Button>
                                    ) : (
                                        <Button
                                            onClick={() => handleSendFriendRequest(user.userID)}
                                            sx={{
                                                backgroundColor: 'primary.main',
                                                color: 'white',
                                                '&:hover': {
                                                    backgroundColor: '#0056b3',
                                                },
                                            }}
                                        >
                                            Add Friend
                                        </Button>
                                    )}
                                </ListItem>
                            ))}
                        </List>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="h6">Friend Requests</Typography>
                        <List>
                            {incomingRequests.length === 0 && sentRequests.length === 0 ? (
                                <Typography>No pending friend requests.</Typography>
                            ) : (
                                <>
                                    {incomingRequests.map(request => (
                                        <ListItem key={request.id}>
                                            <ListItemText primary={request.Requester.fullName || request.Requester.username || 'Unknown'} />
                                            <Button
                                                onClick={() => handleAcceptFriendRequest(request.id, request.Requester.userID)}
                                                sx={{
                                                    backgroundColor: 'primary.main',
                                                    color: 'white',
                                                    '&:hover': {
                                                        backgroundColor: '#0056b3',
                                                    },
                                                }}
                                            >
                                                Accept
                                            </Button>
                                            <IconButton onClick={() => handleRejectFriendRequest(request.id, request.Requester.userID, request.Requester.username)} sx={{ marginLeft: 1 }}>
                                                <CancelIcon />
                                            </IconButton>
                                        </ListItem>
                                    ))}
                                    {sentRequests.map(requestID => {
                                        const recipient = searchResults.find(user => user.userID === requestID) || {};
                                        return (
                                            <ListItem key={requestID}>
                                                <ListItemText primary={recipient.fullName || recipient.username || 'Unknown'} />
                                                <Typography variant="body2" sx={{ marginLeft: 2, color: '#7d7d7d' }}>Pending</Typography>
                                                <IconButton onClick={() => handleCancelFriendRequest(requestID, recipient.username)} sx={{ marginLeft: 1 }}>
                                                    <CancelIcon />
                                                </IconButton>
                                            </ListItem>
                                        );
                                    })}
                                </>
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
                                        <Button
                                            onClick={() => handleRemoveFriend(friend.userID)}
                                            sx={{
                                                backgroundColor: 'error.main',
                                                color: 'white',
                                                '&:hover': {
                                                    backgroundColor: '#d32f2f',
                                                },
                                            }}
                                        >
                                            Remove Friend
                                        </Button>
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
