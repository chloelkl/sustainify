import React from 'react';
import { Link } from 'react-router-dom';

function Homepage() {
    return (
        <div style={containerStyle}>
            <h1>Homepage</h1>
            <div style={linkContainerStyle}>
                <Link to="/account/signup" style={linkStyle}>
                    Sign Up
                </Link>
                <Link to="/account/login" style={linkStyle}>
                    Login
                </Link>
                <Link to="/account/admin/main" style={linkStyle}>
                    Admin Main
                </Link>
                <Link to="/account/user/main" style={linkStyle}>
                    User Main
                </Link>
            </div>
        </div>
    );
}

const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    textAlign: 'center',
};

const linkContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginTop: '20px',
};

const linkStyle = {
    textDecoration: 'none',
    color: 'white',
    backgroundColor: '#1976d2',
    padding: '10px 20px',
    borderRadius: '5px',
};

export default Homepage;
