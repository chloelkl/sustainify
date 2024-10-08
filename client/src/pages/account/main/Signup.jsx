// Signup.jsx

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const Signup = () => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '', confirmPassword: '', phoneNumber: '', countryCode: '+65', role: 'user' });
    const [errors, setErrors] = useState([]);
    const [success, setSuccess] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([]);
        setSuccess('');

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{4,}$/;
        if (!passwordRegex.test(formData.password)) {
            setErrors([{ msg: 'Password must be at least 4 characters long, contain one uppercase, one lowercase, one number, and one special character.' }]);
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setErrors([{ msg: 'Passwords do not match.' }]);
            return;
        }

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/signup`, formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const { token, role } = response.data;
            localStorage.setItem('token', token);
            setSuccess('User registered successfully!');
            setTimeout(() => {
                navigate(role === 'admin-pending' ? '/account/admin/main' : '/account/user/main');
            }, 2000);
        } catch (error) {
            setErrors(error.response ? error.response.data.errors : [{ msg: 'Server error' }]);
        }
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleClickShowConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    return (
        <div style={container}>
            <div style={leftContainer}>
                <img src="/src/assets/Login.jpg" alt="Signup" style={imageStyle} />
            </div>
            <div style={rightContainer}>
                <h2 style={titleStyle}>Sign Up</h2>
                <button style={googleButtonStyle}>Continue with Google</button>
                <div style={dividerStyle}>or</div>
                <p style={loginTextStyle}>Have an account already? <a href="/account/login" style={loginLinkStyle}>Login here!</a></p>
                <form onSubmit={handleSubmit} style={formStyle}>
                    <label style={inputLabelStyle}>Enter your <strong>username</strong></label>
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        style={inputStyle}
                    />
                    <label style={inputLabelStyle}>Enter your <strong>email</strong></label>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        style={inputStyle}
                    />
                    <label style={inputLabelStyle}>and <strong>password</strong>!</label>
                    <div style={inputContainerStyle}>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            style={passwordInputStyle}
                        />
                        <IconButton
                            onClick={handleClickShowPassword}
                            onMouseDown={(e) => e.preventDefault()}
                            style={iconButtonStyle}
                        >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </div>
                    <div style={inputContainerStyle}>
                        <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            name="confirmPassword"
                            placeholder="One more time!"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            style={passwordInputStyle}
                        />
                        <IconButton
                            onClick={handleClickShowConfirmPassword}
                            onMouseDown={(e) => e.preventDefault()}
                            style={iconButtonStyle}
                        >
                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </div>
                    <label style={inputLabelStyle}>Enter your <strong>phone number</strong></label>
                    <div style={phoneContainerStyle}>
                        <select
                            name="countryCode"
                            value={formData.countryCode}
                            onChange={handleChange}
                            style={selectStyle}
                        >
                            <option value="+65">Singapore (+65)</option>
                            <option value="+60">Malaysia (+60)</option>
                        </select>
                        <input
                            type="text"
                            name="phoneNumber"
                            placeholder="Phone Number"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            style={inputStyle}
                        />
                    </div>
                    <button type="submit" style={submitButtonStyle}>Sign Up</button>
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
    height: 'calc(100vh - 64px)', // Adjust for navbar height
    marginTop: '64px', // Add space for navbar height
};

const leftContainer = {
    flex: 1,
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
    backgroundColor: '#f0fff0',
};

const titleStyle = {
    fontSize: '32px',
    marginBottom: '20px',
};

const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    width: '80%',
    maxWidth: '400px',
};

const inputLabelStyle = {
    fontSize: '16px',
    marginBottom: '5px',
};

const inputStyle = {
    marginBottom: '10px',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    width: '100%',
};

const inputContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
};

const passwordInputStyle = {
    flex: 1,
    padding: '10px',
    border: 'none',
    outline: 'none',
};

const iconButtonStyle = {
    padding: '10px',
};

const submitButtonStyle = {
    padding: '10px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#4CAF50',
    color: 'white',
    cursor: 'pointer',
    marginTop: '10px',
};

const googleButtonStyle = {
    backgroundColor: '#4285F4',
    color: 'white',
    border: 'none',
    padding: '10px',
    borderRadius: '5px',
    cursor: 'pointer',
    marginBottom: '20px',
    width: '100%',
};

const dividerStyle = {
    textAlign: 'center',
    margin: '10px 0',
    width: '100%',
};

const loginTextStyle = {
    marginBottom: '20px',
};

const loginLinkStyle = {
    color: '#4285F4',
    textDecoration: 'none',
};

const errorStyle = {
    marginTop: '10px',
    color: 'red',
};

const successStyle = {
    marginTop: '10px',
    color: 'green',
};

const phoneContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px',
};

const selectStyle = {
    marginRight: '10px',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    width: '30%',
};

export default Signup;
