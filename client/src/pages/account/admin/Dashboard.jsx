import React from 'react';

const Dashboard = () => {
    return (
        <div style={containerStyle}>
            <h2 style={headingStyle}>Dashboard</h2>
            <div style={cardStyle}>
                <p>New users this month:</p>
                <h3>10% Increase from last month</h3>
                <h2>14,367 users</h2>
            </div>
            <div style={cardStyle}>
                <p>Top performing challenge:</p>
                <h2>Bring your best to work!</h2>
            </div>
            <div style={statusContainerStyle}>
                <h2>System Status</h2>
                <div style={statusBarStyle}>
                    {/* Add system status details here */}
                </div>
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

const cardStyle = {
    marginBottom: '20px',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '10px',
    boxShadow: '0 0 5px rgba(0,0,0,0.1)',
};

const statusContainerStyle = {
    marginTop: '20px',
};

const statusBarStyle = {
    height: '30px',
    backgroundColor: '#4CAF50',
};

export default Dashboard;
