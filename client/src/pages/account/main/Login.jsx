import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useAuth } from '../../../context/AuthContext';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState([]);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([]);

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, formData);
            const { token, role, id } = response.data;
            login(token, { role, id });
            navigate(role === 'admin' ? '/account/admin/main' : '/account/user/main');
        } catch (error) {
            setErrors(error.response ? error.response.data.errors : [{ msg: 'Invalid credentials' }]);
        }
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div style={container}>
            <div style={leftContainer}>
                <img src="/src/assets/DBrand_Wallpaper.jpg" alt="Login" style={imageStyle} />
            </div>
            <div style={rightContainer}>
                <h2 style={titleStyle}>Login</h2>
                <button style={googleButtonStyle}>Continue with Google</button>
                <div style={dividerStyle}>or</div>
                <p style={loginTextStyle}>Don't have an account yet? <a href="/account/signup" style={loginLinkStyle}>Sign up here!</a></p>
                <form onSubmit={handleSubmit} style={formStyle}>
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
                    <button type="submit" style={submitButtonStyle}>Login</button>
                </form>
                {errors.length > 0 && (
                    <div style={errorStyle}>
                        {errors.map((error, index) => <p key={index}>{error.msg}</p>)}
                    </div>
                )}
            </div>
        </div>
    );
};

const container = {
    display: 'flex',
    height: 'calc(100vh - 64px)',
    marginTop: '64px',
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
    width: '100%',
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

export default Login;
