import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserSettings = ({ userId }) => {
    const [settings, setSettings] = useState({
        language: 'English',
        twoFactorAuth: false,
        socialMediaLinks: { google: '', apple: '' }
    });

    useEffect(() => {
        axios.get(`/user/${userId}/settings`)
            .then(response => setSettings(response.data))
            .catch(error => console.error("There was an error fetching the settings!", error));
    }, [userId]);

    const handleChange = (e) => {
        const { name, value, checked, type } = e.target;
        setSettings(prevState => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSave = () => {
        axios.put(`/user/${userId}/settings`, settings)
            .then(response => {
                console.log(response.data);
            })
            .catch(error => console.error("There was an error updating the settings!", error));
    };

    const handleDeleteAccount = () => {
        axios.delete(`/user/${userId}`)
            .then(response => {
                console.log(response.data);
                // Redirect or update UI accordingly
            })
            .catch(error => console.error("There was an error deleting the account!", error));
    };

    return (
        <div>
            <h2>User Settings</h2>
            <div>
                <label>
                    Language:
                    <select name="language" value={settings.language} onChange={handleChange}>
                        <option value="English">English</option>
                        <option value="Chinese">Chinese</option>
                        <option value="Korean">Korean</option>
                    </select>
                </label>
            </div>
            <div>
                <label>
                    Two-Factor Authentication:
                    <input
                        type="checkbox"
                        name="twoFactorAuth"
                        checked={settings.twoFactorAuth}
                        onChange={handleChange}
                    />
                </label>
            </div>
            <div>
                <label>
                    Google:
                    <input
                        type="text"
                        name="socialMediaLinks.google"
                        value={settings.socialMediaLinks.google}
                        onChange={handleChange}
                    />
                </label>
            </div>
            <div>
                <label>
                    Apple:
                    <input
                        type="text"
                        name="socialMediaLinks.apple"
                        value={settings.socialMediaLinks.apple}
                        onChange={handleChange}
                    />
                </label>
            </div>
            <button onClick={handleSave}>Save</button>
            <button onClick={handleDeleteAccount}>Delete Account</button>
        </div>
    );
};

export default UserSettings;
