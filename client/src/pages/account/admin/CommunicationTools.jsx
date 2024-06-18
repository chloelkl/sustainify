import React from 'react';

const CommunicationTools = () => {
    return (
        <div style={containerStyle}>
            <h2 style={headingStyle}>Communication Tools</h2>
            <div style={emailListStyle}>
                <h3>Email List</h3>
                <form style={formStyle}>
                    <input type="text" placeholder="To" style={inputStyle} />
                    <input type="text" placeholder="Subject" style={inputStyle} />
                    <textarea placeholder="Message" style={textareaStyle}></textarea>
                    <button type="submit" style={buttonStyle}>Compose Email</button>
                </form>
            </div>
            <div style={emailHistoryStyle}>
                <h3>Email History</h3>
                <ul style={listStyle}>
                    <li style={listItemStyle}>
                        <p>Subject: Monthly Report</p>
                        <p>Date: 01/01/2024</p>
                        <button style={deleteButtonStyle}>Delete Email</button>
                    </li>
                    {/* Add more email history items here */}
                </ul>
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

const emailListStyle = {
    marginBottom: '20px',
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
};

const buttonStyle = {
    padding: '10px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#4CAF50',
    color: 'white',
    cursor: 'pointer',
};

const emailHistoryStyle = {
    marginBottom: '20px',
};

const listStyle = {
    listStyleType: 'none',
    padding: '0',
};

const listItemStyle = {
    marginBottom: '10px',
    padding: '10px',
    backgroundColor: '#f9f9f9',
    borderRadius: '5px',
    boxShadow: '0 0 5px rgba(0,0,0,0.1)',
};

const deleteButtonStyle = {
    padding: '5px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#e74c3c',
    color: 'white',
    cursor: 'pointer',
};

export default CommunicationTools;
