import React, { useState } from 'react';
import axios from 'axios';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    const toggleChatbot = () => {
        setIsOpen(!isOpen);
    };

    const handleInputChange = (e) => {
        setInput(e.target.value);
    };

    const handleSendMessage = () => {
        if (input.trim() === '') return;

        const userMessage = {
            sender: 'user',
            text: input
        };

        setMessages([...messages, userMessage]);
        setInput('');

        // Send message to the AI chatbot
        axios.post('http://localhost:5000/user/1/ai-chatbot', { message: input })
            .then(response => {
                const aiMessage = {
                    sender: 'ai',
                    text: response.data.response
                };
                setMessages(prevMessages => [...prevMessages, aiMessage]);
            })
            .catch(error => {
                console.error("There was an error with the AI chatbot!", error);
                setMessages(prevMessages => [...prevMessages, { sender: 'ai', text: "Error: Failed to get response from AI" }]);
            });
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    return (
        <div style={chatbotContainer}>
            {isOpen ? (
                <div style={chatbotWindow}>
                    <div style={chatbotHeader} onClick={toggleChatbot}>
                        Chat with Greenie Genie
                    </div>
                    <div style={chatbotContent}>
                        {messages.map((message, index) => (
                            <div key={index} style={message.sender === 'user' ? userMessageStyle : aiMessageStyle}>
                                {message.text}
                            </div>
                        ))}
                    </div>
                    <div style={chatbotInputContainer}>
                        <input
                            type="text"
                            value={input}
                            onChange={handleInputChange}
                            onKeyPress={handleKeyPress}
                            style={chatbotInput}
                            placeholder="Type a message..."
                        />
                        <button onClick={handleSendMessage} style={sendButton}>Send</button>
                    </div>
                </div>
            ) : (
                <div style={chatbotBar} onClick={toggleChatbot}>
                    Chat with Greenie Genie
                </div>
            )}
        </div>
    );
};

const chatbotContainer = {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    width: '300px',
    zIndex: 1000
};

const chatbotBar = {
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '10px',
    borderRadius: '10px',
    textAlign: 'center',
    cursor: 'pointer',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
};

const chatbotWindow = {
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    height: '400px'
};

const chatbotHeader = {
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '10px',
    borderTopLeftRadius: '10px',
    borderTopRightRadius: '10px',
    cursor: 'pointer',
    textAlign: 'center'
};

const chatbotContent = {
    padding: '10px',
    flex: 1,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
};

const chatbotInputContainer = {
    display: 'flex',
    borderTop: '1px solid #ccc',
    padding: '10px'
};

const chatbotInput = {
    flex: 1,
    padding: '10px',
    borderRadius: '10px',
    border: '1px solid #ccc',
    marginRight: '10px'
};

const sendButton = {
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '10px',
    cursor: 'pointer'
};

const userMessageStyle = {
    alignSelf: 'flex-end',
    backgroundColor: '#f1f1f1',
    color: '#333',
    padding: '10px',
    borderRadius: '10px',
    marginBottom: '10px',
    maxWidth: '80%'
};

const aiMessageStyle = {
    alignSelf: 'flex-start',
    backgroundColor: '#e0f7fa',
    color: '#333',
    padding: '10px',
    borderRadius: '10px',
    marginBottom: '10px',
    maxWidth: '80%'
};

export default Chatbot;
