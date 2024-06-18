import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SystemOverview = () => {
    const [analytics, setAnalytics] = useState([]);
    const [backupHistory, setBackupHistory] = useState([]);
    const [error, setError] = useState(null);
    const [signupLink, setSignupLink] = useState('');
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
                setError('Failed to fetch analytics.');
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
                setError('Failed to fetch backup history.');
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
                setError('Failed to create backup.');
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
                setError('Failed to delete backup.');
            });
    };

    const handleGenerateAdminSignupLink = () => {
        axios.post('http://localhost:3000/admin/generate-admin-signup')
            .then(response => {
                setSignupLink(response.data.signupLink);
                setOtp(response.data.otp);
            })
            .catch(error => {
                console.error("There was an error generating the admin signup link!", error);
                setError('Failed to generate admin signup link.');
            });
    };

    return (
        <div style={container}>
            <div style={analyticsSection}>
                <h2>Analytics</h2>
                <div style={chartContainer}>
                    {/* Replace this with actual chart component */}
                    <div style={chartPlaceholder}>Chart Placeholder</div>
                </div>
            </div>

            <div style={backupSection}>
                <h2>Backup</h2>
                <div style={backupOptions}>
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
                    <button onClick={handleBackupNow} style={buttonStyle}>Backup Now</button>
                </div>

                <div style={backupHistoryContainer}>
                    <h2>Backup History</h2>
                    {backupHistory.map((backup, index) => (
                        <div key={index} style={backupItem}>
                            <span><strong>Name:</strong> {backup.name}</span>
                            <span><strong>Date:</strong> {backup.date}</span>
                            <span><strong>Type:</strong> {backup.type}</span>
                            <button onClick={() => handleDeleteBackup(backup.id)} style={deleteButton}>Delete</button>
                        </div>
                    ))}
                </div>

                <div style={adminSignup}>
                    <h2>Create new Admin Account</h2>
                    <button onClick={handleGenerateAdminSignupLink} style={buttonStyle}>Generate Link</button>
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

const container = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
};

const analyticsSection = {
    backgroundColor: '#eef',
    padding: '20px',
    borderRadius: '10px',
    width: '100%',
    maxWidth: '600px',
};

const chartContainer = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '200px',
};

const chartPlaceholder = {
    width: '100%',
    height: '100%',
    backgroundColor: '#ddd',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '10px',
};

const backupSection = {
    backgroundColor: '#eef',
    padding: '20px',
    borderRadius: '10px',
    width: '100%',
    maxWidth: '600px',
};

const backupOptions = {
    marginTop: '20px',
};

const backupHistoryContainer = {
    marginTop: '20px',
};

const backupItem = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px',
    borderBottom: '1px solid #ccc',
};

const buttonStyle = {
    padding: '10px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#4CAF50',
    color: 'white',
    cursor: 'pointer',
};

const deleteButton = {
    backgroundColor: '#ff4d4d',
    color: 'white',
    border: 'none',
    padding: '5px 10px',
    borderRadius: '5px',
    cursor: 'pointer',
};

const adminSignup = {
    marginTop: '20px',
};

export default SystemOverview;
