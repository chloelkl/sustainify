import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserSettings = ({ userId }) => {
    const [settings, setSettings] = useState({
        languages: ['English'],
        twoFactorAuthEnabled: false,
        linkedSocialMediaAccounts: { google: '', apple: '' }
    });

    useEffect(() => {
        axios.get(`/user/${userId}/settings`)
            .then(response => setSettings(response.data))
            .catch(error => console.error("There was an error fetching the settings!", error));
    }, [userId]);

    const handleChange = (e) => {
        const { name, value, checked, type } = e.target;
        if (name.startsWith('socialMediaLinks.')) {
            const [_, key] = name.split('.');
            setSettings(prevState => ({
                ...prevState,
                linkedSocialMediaAccounts: {
                    ...prevState.linkedSocialMediaAccounts,
                    [key]: value
                }
            }));
        } else if (name === 'languages') {
            const selectedLanguages = Array.from(
                e.target.selectedOptions,
                option => option.value
            );
            setSettings(prevState => ({
                ...prevState,
                languages: selectedLanguages
            }));
        } else {
            setSettings(prevState => ({
                ...prevState,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
    };

    const handleSave = () => {
        axios.put(`/user/${userId}/settings`, settings)
            .then(response => {
                console.log(response.data);
            })
            .catch(error => console.error("There was an error updating the settings!", error));
    };

    return (
        <div style={containerStyle}>
            <div style={leftContainerStyle}>
                <h2>User Settings</h2>
                <div style={formStyle}>
                    <label>Language Preferences:</label>
                    <select
                        name="languages"
                        multiple
                        value={settings.languages}
                        onChange={handleChange}
                    >
                        <option value="English">English</option>
                        <option value="Chinese">Chinese</option>
                        <option value="Korean">Korean</option>
                    </select>
                    <label>Two-Factor Authentication:</label>
                    <input
                        type="checkbox"
                        name="twoFactorAuthEnabled"
                        checked={settings.twoFactorAuthEnabled}
                        onChange={handleChange}
                    />
                    <label>Google:</label>
                    <input
                        type="text"
                        name="socialMediaLinks.google"
                        value={settings.linkedSocialMediaAccounts.google}
                        onChange={handleChange}
                    />
                    <label>Apple:</label>
                    <input
                        type="text"
                        name="socialMediaLinks.apple"
                        value={settings.linkedSocialMediaAccounts.apple}
                        onChange={handleChange}
                    />
                </div>
                <div style={buttonContainerStyle}>
                    <button onClick={handleSave}>Save</button>
                    <button onClick={() => handleDeleteAccount(userId)}>Delete Account</button>
                </div>
            </div>
        </div>
    );
};

const containerStyle = {
    display: 'flex',
    padding: '20px',
    backgroundColor: '#f0f0f0',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)'
};

const leftContainerStyle = {
    flex: 2,
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    padding: '20px',
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    boxShadow: '0 0 5px rgba(0,0,0,0.1)'
};

const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
};

const buttonContainerStyle = {
    display: 'flex',
    gap: '10px'
};

export default UserSettings;
