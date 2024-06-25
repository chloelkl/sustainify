import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '/src/context/AuthContext';

const UserMain = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
    };

    return (
        <div style={{ textAlign: 'center', position: 'relative', height: '100vh' }}>
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
            <button onClick={handleLogout} style={logoutButtonStyle}>Logout</button>
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
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
};

const logoutButtonStyle = {
    position: 'fixed',
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    padding: '10px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#ff0000',
    color: 'white',
    cursor: 'pointer',
};

export default UserMain;
