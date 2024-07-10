import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ChatWithFriends = ({ userId }) => {
    const [friends, setFriends] = useState([]);
    const [selectedFriend, setSelectedFriend] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        fetchFriends();
    }, []);

    const fetchFriends = () => {
        axios.get(`/user/${userId}/friends`)
            .then(response => setFriends(response.data))
            .catch(error => console.error("There was an error fetching the friends!", error));
    };

    const fetchMessages = (friendId) => {
        axios.get(`/user/${userId}/messages/${friendId}`)
            .then(response => setMessages(response.data))
            .catch(error => console.error("There was an error fetching the messages!", error));
    };

    const handleSendMessage = () => {
        axios.post(`/user/${userId}/messages`, { to: selectedFriend.id, content: newMessage })
            .then(response => {
                setMessages(prevMessages => [...prevMessages, response.data]);
                setNewMessage('');
            })
            .catch(error => console.error("There was an error sending the message!", error));
    };

    return (
        <div>
            <div>
                <h2>Friends List</h2>
                <ul>
                    {friends.map(friend => (
                        <li key={friend.id} onClick={() => { setSelectedFriend(friend); fetchMessages(friend.id); }}>
                            {friend.fullName}
                        </li>
                    ))}
                </ul>
            </div>
            {selectedFriend && (
                <div>
                    <h2>Chat with {selectedFriend.fullName}</h2>
                    <div>
                        {messages.map((message, index) => (
                            <div key={index}>
                                <strong>{message.from === userId ? 'You' : selectedFriend.fullName}:</strong> {message.content}
                            </div>
                        ))}
                    </div>
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <button onClick={handleSendMessage}>Send</button>
                </div>
            )}
        </div>
    );
};

export default ChatWithFriends;
