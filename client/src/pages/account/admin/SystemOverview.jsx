import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SystemOverview = () => {
    const [analytics, setAnalytics] = useState([]);
    const [backupHistory, setBackupHistory] = useState([]);
    const [analyticsError, setAnalyticsError] = useState(null);
    const [backupHistoryError, setBackupHistoryError] = useState(null);
    const [signupLink, setSignupLink] = useState('');
    const [signupLinkError, setSignupLinkError] = useState(null);
    const [otp, setOtp] = useState('');
    const [backupType, setBackupType] = useState('full');
    const [fileFormat, setFileFormat] = useState('csv');

    useEffect(() => {
        fetchAnalytics();
        fetchBackupHistory();
    }, []);

    const fetchAnalytics = () => {
        axios.get('http://localhost:3000/admin/analytics')
            .then(response => {
                console.log('Analytics response:', response.data);
                if (Array.isArray(response.data)) {
                    setAnalytics(response.data);
                } else {
                    throw new Error('Analytics response is not an array.');
                }
            })
            .catch(error => {
                console.error("There was an error fetching the analytics!", error);
                setAnalyticsError('Failed to fetch analytics.');
            });
    };

    const fetchBackupHistory = () => {
        axios.get('http://localhost:3000/admin/backup-history')
            .then(response => {
                console.log('Backup history response:', response.data);
                if (Array.isArray(response.data)) {
                    setBackupHistory(response.data);
                } else {
                    throw new Error('Backup history is not an array.');
                }
            })
            .catch(error => {
                console.error("There was an error fetching the backup history!", error);
                setBackupHistoryError('Failed to fetch backup history.');
            });
    };

    const handleBackupNow = () => {
        axios.post('http://localhost:3000/admin/backup', {
            type: backupType,
            format: fileFormat
        })
            .then(response => {
                console.log(response.data);
                fetchBackupHistory();
            })
            .catch(error => {
                console.error("There was an error creating the backup!", error);
                setBackupHistoryError('Failed to create backup.');
            });
    };

    const handleDeleteBackup = (id) => {
        axios.delete(`http://localhost:3000/admin/backup/${id}`)
            .then(response => {
                console.log(response.data);
                fetchBackupHistory();
            })
            .catch(error => {
                console.error("There was an error deleting the backup!", error);
                setBackupHistoryError('Failed to delete backup.');
            });
    };

    const handleGenerateAdminSignupLink = () => {
        setSignupLinkError(null); // Clear previous errors
        axios.post('http://localhost:3000/admin/generate-admin-signup')
            .then(response => {
                setSignupLink(response.data.signupLink);
                setOtp(response.data.otp);
            })
            .catch(error => {
                console.error("There was an error generating the admin signup link!", error);
                setSignupLinkError('Failed to generate admin signup link.');
            });
    };

    return (
        <div style={containerStyle}>
            <div style={leftContainerStyle}>
                <div style={sectionStyle}>
                    <h2>Analytics</h2>
                    {analyticsError && <div style={errorStyle}>{analyticsError}</div>}
                    {analytics.length > 0 ? (
                        <div> {/* Use chart library or custom code to display analytics as shown in the image */}</div>
                    ) : (
                        <p>No analytics data available.</p>
                    )}
                </div>
            </div>
            <div style={rightContainerStyle}>
                <div style={sectionStyle}>
                    <h2>Backup History</h2>
                    {backupHistoryError && <div style={errorStyle}>{backupHistoryError}</div>}
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
                <div style={sectionStyle}>
                    <h2>Generate Admin Signup Link</h2>
                    {signupLinkError && <div style={errorStyle}>{signupLinkError}</div>}
                    <button onClick={handleGenerateAdminSignupLink}>Generate Link</button>
                    {signupLink && (
                        <div>
                            <p>Admin Signup Link: <a href={signupLink} target="_blank" rel="noopener noreferrer">{signupLink}</a></p>
                            <p>OTP: {otp}</p>
                        </div>
                    )}
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

const errorStyle = {
    color: 'red',
    marginBottom: '10px',
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
