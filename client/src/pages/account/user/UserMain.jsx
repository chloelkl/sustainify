import React from 'react';
import { useNavigate } from 'react-router-dom';

const UserMain = () => {
    const navigate = useNavigate();

    return (
        <div style={{ textAlign: 'center' }}>
            <h2>User Main</h2>
            <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
                <div onClick={() => navigate('/account/user/profile')} style={cardStyle}>
                    <h3>Edit Profile</h3>
                </div>
                <div onClick={() => navigate('/account/user/settings')} style={cardStyle}>
                    <h3>Settings</h3>
                </div>
                <div onClick={() => navigate('/account/user/analytics')} style={cardStyle}>
                    <h3>Analytics</h3>
                </div>
                <div onClick={() => navigate('/account/user/chat')} style={cardStyle}>
                    <h3>Chat with Friends</h3>
                </div>
            </div>
        </div>
    );
};

const cardStyle = {
    margin: '20px',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '10px',
    cursor: 'pointer',
    width: '150px',
    textAlign: 'center',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
};

export default UserMain;
