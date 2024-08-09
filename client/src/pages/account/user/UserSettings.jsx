import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import QRCode from 'qrcode.react';

const UserSettings = () => {
    const { user } = useAuth();
    const [settings, setSettings] = useState({
        language: '',
        twoFactorAuth: false,
    });
    const [twoFactorAuthURL, setTwoFactorAuthURL] = useState('');

    const navigate = useNavigate(); 

    const fetchUserSettings = useCallback(async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/user/${user.userID}/settings`);
            setSettings({
                language: response.data.language || '',
                twoFactorAuth: response.data.twoFactorAuth === 'Enabled',
            });
        } catch (error) {
            console.error('Error fetching user settings:', error);
        }
    }, [user.userID]);

    useEffect(() => {
        fetchUserSettings();
    }, [fetchUserSettings]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === "radio" && name === "language") {
            setSettings(prevSettings => ({
                ...prevSettings,
                language: value
            }));
        } else if (type === "checkbox") {
            setSettings(prevSettings => ({
                ...prevSettings,
                [name]: checked
            }));
        }
    };

    const handleSave = async () => {
        try {
            const updatedSettings = {
                language: settings.language,
                twoFactorAuth: settings.twoFactorAuth ? 'Enabled' : 'Not Enabled',
            };

            await axios.put(`${import.meta.env.VITE_API_URL}/user/${user.userID}/settings`, updatedSettings);
            alert('Settings updated successfully!');
        } catch (error) {
            console.error('Error updating user settings:', error);
            alert('Failed to update settings.');
        }
    };

    const handleDeleteAccount = async () => {
        const password = prompt('Please enter your password to confirm account deletion:');
        if (password) {
            try {
                await axios.delete(`${import.meta.env.VITE_API_URL}/user/${user.userID}`, { data: { password } });
                alert('Account deleted successfully.');
                navigate('/account/signup');
            } catch (error) {
                console.error('Error deleting account:', error);
                alert('Failed to delete account.');
            }
        }
    };

    const handleTwoFactorAuth = async () => {
        if (settings.twoFactorAuth) {
          try {
            await axios.put(`${import.meta.env.VITE_API_URL}/user/${user.userID}/2fa/disable`);
            setSettings(prevSettings => ({
              ...prevSettings,
              twoFactorAuth: false,
            }));
            alert('Two-factor authentication disabled successfully!');
          } catch (error) {
            console.error('Error disabling two-factor authentication:', error);
            alert('Failed to disable two-factor authentication.');
          }
        } else {
          try {
            const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/user/${user.userID}/2fa/enable`);
            setTwoFactorAuthURL(data.otpauthURL);
          } catch (error) {
            console.error('Error enabling two-factor authentication:', error);
            alert('Failed to enable two-factor authentication.');
          }
        }
    };
    
    const handleTwoFactorAuthConfirm = async () => {
        const token = prompt('Enter the 2FA token from your authenticator app:');
        if (token) {
            try {
            await axios.post(`${import.meta.env.VITE_API_URL}/user/${user.userID}/2fa/verify`, { token });
            setSettings(prevSettings => ({
                ...prevSettings,
                twoFactorAuth: true,
            }));
            setTwoFactorAuthURL('');
            alert('Two-factor authentication enabled successfully!');
            } catch (error) {
            console.error('Error verifying two-factor authentication:', error);
            alert('Failed to verify two-factor authentication.');
            }
        }
    };

    return (
        <div style={containerStyle}>
            <h2 style={headingStyle}>User Settings</h2>
            <div style={settingsContainerStyle}>
                <div style={sectionStyle}>
                    <h3>Language Preferences</h3>
                    <div style={checkboxContainerStyle}>
                        <label style={checkboxLabelStyle}>
                            <input
                                type="radio"
                                name="language"
                                value="English"
                                checked={settings.language === 'English'}
                                onChange={handleChange}
                            /> English
                        </label>
                        <label style={checkboxLabelStyle}>
                            <input
                                type="radio"
                                name="language"
                                value="Chinese"
                                checked={settings.language === 'Chinese'}
                                onChange={handleChange}
                            /> Chinese
                        </label>
                        <label style={checkboxLabelStyle}>
                            <input
                                type="radio"
                                name="language"
                                value="Korean"
                                checked={settings.language === 'Korean'}
                                onChange={handleChange}
                            /> Korean
                        </label>
                    </div>
                </div>

                <div style={sectionStyle}>
                    <h3>View and Download Data</h3>
                    <button style={viewButtonStyle}>View</button>
                </div>

                <div style={sectionStyle}>
                    <h3>Two-factor Authentication</h3>
                    <button
                    style={settings.twoFactorAuth ? disableButtonStyle : enableButtonStyle}
                    onClick={handleTwoFactorAuth}
                    >
                    {settings.twoFactorAuth ? 'Disable' : 'Enable'}
                    </button>
                    {twoFactorAuthURL && (
                    <div>
                        <QRCode value={twoFactorAuthURL} />
                        <button style={confirmButtonStyle} onClick={handleTwoFactorAuthConfirm}>
                        Confirm
                        </button>
                    </div>
                    )}
                </div>

                <div style={sectionStyle}>
                    <h3>Delete Account</h3>
                    <button style={deleteButtonStyle} onClick={handleDeleteAccount}>Delete</button>
                </div>
            </div>
            <button onClick={handleSave} style={saveButtonStyle}>Save</button>
        </div>
    );
};

// Styles
const containerStyle = {
    padding: '20px',
    backgroundColor: '#f0f0f0',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
};

const headingStyle = {
    marginBottom: '20px',
};

const settingsContainerStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gridGap: '20px',
};

const sectionStyle = {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
};

const checkboxContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
};

const checkboxLabelStyle = {
    marginBottom: '10px',
};

const viewButtonStyle = {
    padding: '10px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#3498db',
    color: 'white',
    cursor: 'pointer',
};

const deleteButtonStyle = {
    padding: '10px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#e74c3c',
    color: 'white',
    cursor: 'pointer',
};

const saveButtonStyle = {
    marginTop: '20px',
    padding: '10px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#4CAF50',
    color: 'white',
    cursor: 'pointer',
};

const enableButtonStyle = {
    padding: '10px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#4CAF50',
    color: 'white',
    cursor: 'pointer',
};
  
const disableButtonStyle = {
    padding: '10px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#e74c3c',
    color: 'white',
    cursor: 'pointer',
};
  
const confirmButtonStyle = {
    padding: '10px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#3498db',
    color: 'white',
    cursor: 'pointer',
    marginTop: '10px',
};

export default UserSettings;
