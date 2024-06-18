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

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div style={containerStyle}>
            <div style={sectionStyle}>
                <h2>Analytics</h2>
                {analytics.map((item, index) => (
                    <div key={index}>{item.metric}: {item.value}</div>
                ))}
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
                        <li key={index}>
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
                <button onClick={handleGenerateAdminSignupLink}>Generate Link</button>
                {signupLink && (
                    <div>
                        <p>Admin Signup Link: <a href={signupLink} target="_blank" rel="noopener noreferrer">{signupLink}</a></p>
                        <p>OTP: {otp}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const containerStyle = {
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
};

const sectionStyle = {
    marginBottom: '20px',
};

export default SystemOverview;
