import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../../assets/AdminLogo_XBG.png'; // Replace with the path to the admin logo

const AdminMain = () => {
    const navigate = useNavigate();

    return (
        <div style={mainContainer}>
            <div style={centerLogoContainer}>
                <img src={logo} alt="Admin Logo" style={centerLogo} />
            </div>
            <div style={sectionsContainer}>
                <div onClick={() => navigate('/account/admin/user-management')} style={{ ...cardStyle, ...topSection }}>
                    <h3>User Management</h3>
                </div>
                <div onClick={() => navigate('/account/admin/communication-tools')} style={{ ...cardStyle, ...rightSection }}>
                    <h3>Communication Tools</h3>
                </div>
                <div onClick={() => navigate('/account/admin/system-overview')} style={{ ...cardStyle, ...bottomSection }}>
                    <h3>System Overview</h3>
                </div>
                <div onClick={() => navigate('/account/admin/dashboard')} style={{ ...cardStyle, ...leftSection }}>
                    <h3>Dashboard</h3>
                </div>
            </div>
        </div>
    );
};

const mainContainer = {
    position: 'relative',
    textAlign: 'center',
    height: '100vh',
    backgroundColor: '#f0f4f7',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
};

const centerLogoContainer = {
    position: 'absolute',
    width: '200px',
    height: '200px',
    borderRadius: '50%',
    backgroundColor: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    zIndex: 1
};

const centerLogo = {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
};

const sectionsContainer = {
    position: 'relative',
    width: '100%',
    height: '100%'
};

const cardStyle = {
    position: 'absolute',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '10px',
    cursor: 'pointer',
    width: '150px',
    textAlign: 'center',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    backgroundColor: '#fff',
    zIndex: 0
};

const topSection = {
    top: '10%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
};

const rightSection = {
    top: '50%',
    left: '90%',
    transform: 'translate(-50%, -50%)'
};

const bottomSection = {
    top: '90%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
};

const leftSection = {
    top: '50%',
    left: '10%',
    transform: 'translate(-50%, -50%)'
};

export default AdminMain;
