import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext';

const SystemOverview = () => {
    const { user } = useAuth();
    const [adminDetails, setAdminDetails] = useState({
        fullName: '',
        email: '',
        password: '',
        location: '',
        username: '',
        phoneNumber: '',
        countryCode: '',
        id: ''
    });
    const [admins, setAdmins] = useState([]);
    const [signupLink, setSignupLink] = useState('');
    const [otp, setOtp] = useState('');
    const [otpTimer, setOtpTimer] = useState(300);
    const [linkValid, setLinkValid] = useState(true);
    const [backupType, setBackupType] = useState('full');
    const [fileFormat, setFileFormat] = useState('csv');
    const [backupHistory, setBackupHistory] = useState([]);

    useEffect(() => {
        if (user && user.userId) {
            fetchAdminDetails(user.userId);
        }
        fetchAdmins();
        fetchBackupHistory();
    }, [user]);

    const fetchAdminDetails = (id) => {
        axios.get(`${import.meta.env.VITE_API_URL}/admin/${id}`)
            .then(response => {
                setAdminDetails(response.data);
            })
            .catch(error => {
                console.error('Failed to fetch admin details:', error);
            });
    };

    const fetchAdmins = () => {
        axios.get(`${import.meta.env.VITE_API_URL}/admin/list`)
            .then(response => {
                setAdmins(response.data);
            })
            .catch(error => {
                console.error('Failed to fetch admins:', error);
            });
    };

    const fetchBackupHistory = () => {
        axios.get(`${import.meta.env.VITE_API_URL}/admin/backup-history`)
            .then(response => {
                if (Array.isArray(response.data)) {
                    setBackupHistory(response.data);
                } else {
                    throw new Error('Backup history response is not an array.');
                }
            })
            .catch(error => {
                console.error('Failed to fetch backup history:', error);
            });
    };

    const handleDeleteAdmin = (id) => {
        const password = prompt('Enter admin password to confirm deletion');
        axios.post(`${import.meta.env.VITE_API_URL}/admin/delete`, { id, password })
            .then(response => {
                fetchAdmins();
            })
            .catch(error => {
                console.error('Failed to delete admin:', error);
            });
    };

    const handleSaveChanges = () => {
        axios.put(`${import.meta.env.VITE_API_URL}/admin/${adminDetails.id}`, adminDetails)
            .then(response => {
                console.log('Profile updated successfully.');
                fetchAdminDetails(user.userId);
            })
            .catch(error => {
                console.error('Failed to update profile:', error);
            });
    };

    const handleGenerateAdminSignupLink = () => {
        axios.post(`${import.meta.env.VITE_API_URL}/auth/generate-admin-signup`)
            .then(response => {
                setSignupLink(response.data.signupLink);
                setOtp(response.data.otp);
                setOtpTimer(300);
                setLinkValid(true);
            })
            .catch(error => {
                console.error('Failed to generate admin signup link:', error);
            });
    };

    const handleRevokeLink = () => {
        setSignupLink('');
        setOtp('');
        setLinkValid(false);
    };

    const handleBackupNow = () => {
        axios.post(`${import.meta.env.VITE_API_URL}/admin/backup`, { type: backupType, format: fileFormat })
            .then(response => {
                fetchBackupHistory();
            })
            .catch(error => {
                console.error('Failed to create backup:', error);
            });
    };

    const handleDeleteBackup = (id) => {
        axios.delete(`${import.meta.env.VITE_API_URL}/admin/backup/${id}`)
            .then(response => {
                fetchBackupHistory();
            })
            .catch(error => {
                console.error('Failed to delete backup:', error);
            });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAdminDetails(prevDetails => ({
            ...prevDetails,
            [name]: value
        }));
    };

    return (
        <div style={containerStyle}>
            <div style={leftContainerStyle}>
                <div style={sectionStyle}>
                    <h2>Edit Profile</h2>
                    <div style={editProfileContainerStyle}>
                        <div style={editProfileLeftStyle}>
                            <label>Full name:</label>
                            <input
                                type="text"
                                name="fullName"
                                value={adminDetails.fullName}
                                onChange={handleInputChange}
                                style={inputStyle}
                            />
                            <label>Email address:</label>
                            <input
                                type="email"
                                name="email"
                                value={adminDetails.email}
                                onChange={handleInputChange}
                                style={inputStyle}
                            />
                            <label>Password:</label>
                            <input
                                type="password"
                                name="password"
                                value={adminDetails.password}
                                onChange={handleInputChange}
                                style={inputStyle}
                            />
                            <label>Location:</label>
                            <input
                                type="text"
                                name="location"
                                value={adminDetails.location}
                                onChange={handleInputChange}
                                style={inputStyle}
                            />
                            <label>Username:</label>
                            <input
                                type="text"
                                name="username"
                                value={adminDetails.username}
                                onChange={handleInputChange}
                                style={inputStyle}
                            />
                            <label>Phone Number:</label>
                            <input
                                type="text"
                                name="phoneNumber"
                                value={adminDetails.phoneNumber}
                                onChange={handleInputChange}
                                style={inputStyle}
                            />
                            <label>Country Code:</label>
                            <input
                                type="text"
                                name="countryCode"
                                value={adminDetails.countryCode}
                                onChange={handleInputChange}
                                style={inputStyle}
                            />
                        </div>
                        <div style={editProfileRightStyle}>
                            <div style={buttonsContainerStyle}>
                                <button onClick={handleSaveChanges} style={saveButtonStyle}>Save changes</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div style={sectionStyle}>
                    <h2>Admins List</h2>
                    {admins.map((admin) => (
                        <div key={admin.id} style={adminItemStyle}>
                            <strong>Username:</strong> {admin.username} <br />
                            <strong>Status:</strong> {admin.status || 'Active'}
                            <button onClick={() => handleDeleteAdmin(admin.id)}>Delete</button>
                        </div>
                    ))}
                </div>
            </div>
            <div style={rightContainerStyle}>
                <div style={sectionStyle}>
                    <h2>Generate Admin Signup Link</h2>
                    <button onClick={handleGenerateAdminSignupLink}>Generate Link</button>
                    {signupLink && linkValid && (
                        <div>
                            <p>Admin Signup Link: <a href={signupLink} target="_blank" rel="noopener noreferrer">{signupLink}</a></p>
                            <p>OTP: {otp}</p>
                            <p>OTP valid for: {otpTimer} seconds</p>
                        </div>
                    )}
                    {signupLink && (
                        <button onClick={handleRevokeLink}>Revoke Link</button>
                    )}
                </div>
                <div style={sectionStyle}>
                    <h2>Backup History</h2>
                    <label>
                        Backup Type:
                        <select value={backupType} onChange={(e) => setBackupType(e.target.value)}>
                            <option value="full">Full</option>
                            <option value="analytics">Analytics</option>
                            <option value="users">Users</option>
                            <option value="admin">Admin</option>
                        </select>
                    </label>
                    <label>
                        File Format:
                        <select value={fileFormat} onChange={(e) => setFileFormat(e.target.value)}>
                            <option value="csv">CSV</option>
                            <option value="pdf">PDF</option>
                        </select>
                    </label>
                    <button onClick={handleBackupNow}>Backup Now</button>
                    <ul>
                        {backupHistory.map((backup, index) => (
                            <li key={index} style={backupItemStyle}>
                                <strong>Name:</strong> {backup.name} <br />
                                <strong>Date:</strong> {backup.date} <br />
                                <strong>Type:</strong> {backup.type}
                                <button onClick={() => handleDeleteBackup(backup.id)}>Delete</button>
                            </li>
                        ))}
                    </ul>
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
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    gap: '20px'
};

const leftContainerStyle = {
    flex: 2,
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
};

const rightContainerStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
};

const sectionStyle = {
    backgroundColor: '#ffffff',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 0 5px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
};

const editProfileContainerStyle = {
    display: 'flex',
    gap: '20px'
};

const editProfileLeftStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
};

const editProfileRightStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
};

const inputStyle = {
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc'
};

const pointsContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
};

const buttonsContainerStyle = {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '20px'
};

const saveButtonStyle = {
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '10px',
    borderRadius: '5px',
    border: 'none',
    cursor: 'pointer'
};

const adminItemStyle = {
    backgroundColor: '#f9f9f9',
    padding: '10px',
    borderRadius: '5px',
    marginBottom: '10px',
    display: 'flex',
    flexDirection: 'column',
    gap: '5px'
};

const backupItemStyle = {
    backgroundColor: '#f9f9f9',
    padding: '10px',
    borderRadius: '5px',
    marginBottom: '10px',
    display: 'flex',
    flexDirection: 'column',
    gap: '5px'
};

export default SystemOverview;
