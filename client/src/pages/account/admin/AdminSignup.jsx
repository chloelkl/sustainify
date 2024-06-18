import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const AdminSignup = () => {
    const [formData, setFormData] = useState({ fullName: '', email: '', password: '', otp: '' });
    const [errors, setErrors] = useState([]);
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([]);
        setSuccess('');

        const query = new URLSearchParams(location.search);
        const token = query.get('token');

        try {
            const response = await axios.post(`http://localhost:3000/auth/admin-signup?token=${token}`, formData);
            const { token: authToken, role } = response.data;
            localStorage.setItem('token', authToken);
            setSuccess('Admin registered successfully!');
            navigate('/account/admin/main');
        } catch (error) {
            setErrors(error.response ? error.response.data.errors : [{ msg: 'Server error' }]);
        }
    };

    return (
        <div style={container}>
            <div style={leftContainer}>
                <img src="/path/to/your/image.png" alt="Admin Signup" style={imageStyle} />
            </div>
            <div style={rightContainer}>
                <h2>Admin Sign Up</h2>
                <button style={googleButtonStyle}>Continue with Google</button>
                <form onSubmit={handleSubmit} style={formStyle}>
                    <input
                        type="text"
                        name="fullName"
                        placeholder="Full Name"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                        style={inputStyle}
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        style={inputStyle}
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        style={inputStyle}
                    />
                    <input
                        type="text"
                        name="otp"
                        placeholder="OTP"
                        value={formData.otp}
                        onChange={handleChange}
                        required
                        style={inputStyle}
                    />
                    <button type="submit" style={buttonStyle}>Sign Up</button>
                </form>
                {errors.length > 0 && (
                    <div style={errorStyle}>
                        {errors.map((error, index) => <p key={index}>{error.msg}</p>)}
                    </div>
                )}
                {success && <div style={successStyle}>{success}</div>}
            </div>
        </div>
    );
};

const container = {
    display: 'flex',
    height: '100vh',
};

const leftContainer = {
    flex: 1,
    backgroundColor: '#f0f0f0',
};

const imageStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
};

const rightContainer = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: '#fff',
};

const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    width: '80%',
    maxWidth: '400px',
};

const inputStyle = {
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

const googleButtonStyle = {
    backgroundColor: '#4285F4',
    color: 'white',
    border: 'none',
    padding: '10px',
    borderRadius: '5px',
    cursor: 'pointer',
    marginBottom: '20px',
};

const errorStyle = {
    marginTop: '10px',
    color: 'red',
};

const successStyle = {
    marginTop: '10px',
    color: 'green',
};

export default AdminSignup;
