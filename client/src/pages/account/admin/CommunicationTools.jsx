import React, { useState } from 'react';
import axios from 'axios';

const CommunicationTools = () => {
    const [emailData, setEmailData] = useState({
        to: '',
        subject: '',
        message: ''
    });

    const [emailHistory, setEmailHistory] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEmailData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSendEmail = () => {
        axios.post('/admin/send-email', emailData)
            .then(response => {
                console.log(response.data);
                setEmailHistory(prevHistory => [emailData, ...prevHistory]);
            })
            .catch(error => console.error("There was an error sending the email!", error));
    };

    return (
        <div>
            <div>
                <h2>Email Blast</h2>
                <input type="text" name="to" placeholder="To" value={emailData.to} onChange={handleChange} />
                <input type="text" name="subject" placeholder="Subject" value={emailData.subject} onChange={handleChange} />
                <textarea name="message" placeholder="Message" value={emailData.message} onChange={handleChange} />
                <button onClick={handleSendEmail}>Send</button>
            </div>
            <div>
                <h2>Email History</h2>
                <ul>
                    {emailHistory.map((email, index) => (
                        <li key={index}>
                            <strong>To:</strong> {email.to} <br />
                            <strong>Subject:</strong> {email.subject} <br />
                            <strong>Message:</strong> {email.message}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default CommunicationTools;
