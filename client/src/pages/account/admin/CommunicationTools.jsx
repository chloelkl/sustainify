import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CommunicationTools = () => {
    const [formData, setFormData] = useState({ subject: '', message: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [sentEmails, setSentEmails] = useState([]);

    useEffect(() => {
        fetchSentEmails();
    }, []);

    const fetchSentEmails = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/communication/sent-emails`);
            console.log('Fetched sent emails:', response.data);
            setSentEmails(response.data);
        } catch (error) {
            console.error('Error fetching sent emails:', error);
        }
    };    

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/communication/send-email`, formData);
            setSuccess(response.data.message);
            fetchSentEmails();
        } catch (error) {
            setError(error.response ? error.response.data.error : 'An error occurred.');
        }
    };

    return (
        <div style={containerStyle}>
            <h2 style={headingStyle}>Send Email to All Users</h2>
            <form onSubmit={handleSubmit} style={formStyle}>
                <input
                    type="text"
                    name="subject"
                    placeholder="Subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                />
                <textarea
                    name="message"
                    placeholder="Message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    style={textareaStyle}
                />
                <button type="submit" style={buttonStyle}>Send Email</button>
            </form>
            {error && <div style={errorStyle}>{error}</div>}
            {success && <div style={successStyle}>{success}</div>}

            <h2 style={headingStyle}>Sent Emails</h2>
            <div style={emailListStyle}>
                {sentEmails.length > 0 ? (
                    sentEmails.map((email, index) => (
                        <div key={index} style={emailItemStyle}>
                            <h3>{email.subject}</h3>
                            <p><strong>Sent by:</strong> {email.senderEmail}</p>
                            <p><strong>Sent to:</strong> {email.recipientEmails}</p>
                            <p><strong>Date:</strong> {new Date(email.sentAt).toLocaleString()}</p>
                            <p>{email.message}</p>
                        </div>
                    ))
                ) : (
                    <p>No sent emails found.</p>
                )}
            </div>
        </div>
    );
};

const containerStyle = {
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
};

const headingStyle = {
    marginBottom: '20px',
    fontSize: '24px',
    color: '#333',
};

const formStyle = {
    display: 'flex',
    flexDirection: 'column',
};

const inputStyle = {
    marginBottom: '10px',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
};

const textareaStyle = {
    marginBottom: '10px',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    height: '150px'
};

const buttonStyle = {
    padding: '10px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#4CAF50',
    color: 'white',
    cursor: 'pointer',
};

const errorStyle = {
    color: 'red',
    marginTop: '10px'
};

const successStyle = {
    color: 'green',
    marginTop: '10px'
};

const emailListStyle = {
    marginTop: '20px',
    maxHeight: '400px',
    overflowY: 'auto',
};

const emailItemStyle = {
    borderBottom: '1px solid #ccc',
    padding: '10px 0',
};

export default CommunicationTools;
