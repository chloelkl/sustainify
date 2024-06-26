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
    const [otpTimer, setOtpTimer] = useState(60); // Timer for OTP
    const [backupType, setBackupType] = useState('full');
    const [fileFormat, setFileFormat] = useState('csv');
    const [linkValid, setLinkValid] = useState(true);

    useEffect(() => {
        fetchAnalytics();
        fetchBackupHistory();
        const otpInterval = setInterval(handleGenerateAdminSignupLink, 300000); // Refresh OTP every 60 seconds

        return () => clearInterval(otpInterval); // Cleanup on component unmount
    }, []);

    useEffect(() => {
        if (otpTimer > 0) {
            const timer = setTimeout(() => setOtpTimer(otpTimer - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [otpTimer]);

    const fetchAnalytics = () => {
        axios.get(`${import.meta.env.VITE_API_URL}/admin/analytics`)
            .then(response => {
                if (Array.isArray(response.data)) {
                    setAnalytics(response.data);
                } else {
                    throw new Error('Analytics response is not an array.');
                }
            })
            .catch(error => {
                setAnalyticsError('Failed to fetch analytics.');
            });
    };

    const fetchBackupHistory = () => {
        axios.get(`${import.meta.env.VITE_API_URL}/admin/backup-history`)
            .then(response => {
                if (Array.isArray(response.data)) {
                    setBackupHistory(response.data);
                } else {
                    throw new Error('Backup history is not an array.');
                }
            })
            .catch(error => {
                setBackupHistoryError('Failed to fetch backup history.');
            });
    };

    const handleBackupNow = () => {
        axios.post(`${import.meta.env.VITE_API_URL}/admin/backup`, {
            type: backupType,
            format: fileFormat
        })
            .then(response => {
                fetchBackupHistory();
            })
            .catch(error => {
                setBackupHistoryError('Failed to create backup.');
            });
    };

    const handleDeleteBackup = (id) => {
        axios.delete(`${import.meta.env.VITE_API_URL}/admin/backup/${id}`)
            .then(response => {
                fetchBackupHistory();
            })
            .catch(error => {
                setBackupHistoryError('Failed to delete backup.');
            });
    };

    const handleGenerateAdminSignupLink = () => {
        setSignupLinkError(null);
        axios.post(`${import.meta.env.VITE_API_URL}/admin/generate-admin-signup`)
            .then(response => {
                setSignupLink(response.data.signupLink);
                setOtp(response.data.otp);
                setOtpTimer(300);
                setLinkValid(true);
            })
            .catch(error => {
                setSignupLinkError('Failed to generate admin signup link.');
            });
    };

    const handleRevokeLink = () => {
        setSignupLink('');
        setOtp('');
        setLinkValid(false); // Invalidate the link
    };

    return (
        <div style={containerStyle}>
            <div style={leftContainerStyle}>
                <div style={sectionStyle}>
                    <h2>Analytics</h2>
                    {analyticsError && <div style={errorStyle}>{analyticsError}</div>}
                    {analytics.length > 0 ? (
                        <div>{/* Use chart library or custom code to display analytics as shown in the image */}</div>
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
                    {signupLink && linkValid && (
                        <div>
                            <p>Admin Signup Link: <a href={signupLink} target="_blank" rel="noopener noreferrer">{new URL(signupLink).pathname + new URL(signupLink).search}</a></p>
                            <p>OTP: {otp}</p>
                            <p>OTP valid for: {otpTimer} seconds</p>
                        </div>
                    )}
                    {signupLink && (
                        <button onClick={handleRevokeLink}>Revoke Link</button>
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
