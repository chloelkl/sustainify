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
} from '@mui/material';

const ChatWithFriends = () => {
    const { user } = useAuth();
    const [friends, setFriends] = useState([]);
    const [incomingRequests, setIncomingRequests] = useState([]);
    const [selectedFriend, setSelectedFriend] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [socket, setSocket] = useState(null);
    const [searchResults, setSearchResults] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

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
            fetchIncomingRequests();
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
    
    const fetchIncomingRequests = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/user/${user.userID}/friend-requests`);
            console.log('Incoming requests response:', response.data);
            setIncomingRequests(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('There was an error fetching the friend requests!', error);
            setIncomingRequests([]); // Set requests to an empty array on error
        }
    };
    
    const handleSearch = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/user/search?username=${searchQuery}`);
            console.log('Search response:', response.data);
            setSearchResults(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Error searching for users:', error);
            setSearchResults([]);
        }
    };

    const handleSendFriendRequest = async (recipientID) => {
        const requesterID = user?.userID;
        console.log('User object:', user);
        console.log('Requester ID:', requesterID);
        console.log('Recipient ID:', recipientID);

        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/user/friend-request`, { requesterID, recipientID });
            console.log('Friend request sent');
            fetchFriends();
        } catch (error) {
            console.error('Error sending friend request:', error);
        }
    };

    const handleAcceptFriendRequest = async (requestID) => {
        try {
            console.log('Accepting friend request with ID:', requestID); // Log the requestID
            await axios.put(`${import.meta.env.VITE_API_URL}/user/friend-request/accept`, { id: requestID });
            console.log('Friend request accepted');
            fetchFriends();
            fetchIncomingRequests(); // Refresh the list of incoming requests
        } catch (error) {
            console.error('Error accepting friend request:', error);
        }
    };    

    const fetchMessages = async (friendID) => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/user/${user.userID}/messages/${friendID}`);
            setMessages(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error("There was an error fetching the messages!", error);
            setMessages([]); // Set messages to an empty array on error
        }
    };

    const handleSendMessage = () => {
        if (socket && selectedFriend) {
            const message = {
                type: 'message',
                senderID: user.userID, // The logged-in user's ID
                recipientID: selectedFriend.userID, // The selected friend's ID
                content: newMessage,
            };
            socket.send(JSON.stringify(message));
            setMessages(prevMessages => [...prevMessages, message]);
            setNewMessage('');
        }
    };

    const handleFriendClick = (friend) => {
        setSelectedFriend(friend);
        fetchMessages(friend.userID);
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
                                    <Button onClick={() => handleSendFriendRequest(user.userID)}>Add Friend</Button>
                                </ListItem>
                            ))}
                        </List>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="h6">Incoming Friend Requests</Typography>
                        <List>
                            {incomingRequests.length === 0 ? (
                                <Typography>No incoming friend requests.</Typography>
                            ) : (
                                incomingRequests.map(request => (
                                    <ListItem key={request.id}>
                                        <ListItemText primary={request.Requester?.fullName || request.Requester?.username || 'Unknown'} />
                                        <Button onClick={() => handleAcceptFriendRequest(request.id)}>Accept</Button>
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
                                            <Avatar>{friend.fullName[0]}</Avatar>
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
                            <Typography variant="h6">Chat with {selectedFriend.fullName}</Typography>
                            <Box sx={{ flexGrow: 1, overflowY: 'auto', marginBottom: 2, border: 1, borderColor: 'divider', padding: 2 }}>
                                {messages.map((message, index) => (
                                    <Box key={index} sx={{ marginBottom: 1 }}>
                                        <Typography variant="body2" color="textSecondary">
                                            <strong>{message.from === user.userID ? 'You' : selectedFriend.fullName}:</strong> {message.content}
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
        </Box>
    );
};

export default ChatWithFriends;
