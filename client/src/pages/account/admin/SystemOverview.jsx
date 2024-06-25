import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SystemOverview = () => {
    const [analytics, setAnalytics] = useState([]);
    const [backupHistory, setBackupHistory] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchAnalytics();
        fetchBackupHistory();
    }, []);

    const fetchAnalytics = () => {
        axios.get('http://localhost:5000/admin/analytics')
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
        axios.get('http://localhost:5000/admin/backup-history')
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
        axios.post('http://localhost:5000/admin/backup')
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
        axios.delete(`http://localhost:5000/admin/backup/${id}`)
            .then(response => {
                console.log(response.data);
                fetchBackupHistory();
            })
            .catch(error => {
                console.error("There was an error deleting the backup!", error);
                setError('Failed to delete backup.');
            });
    };

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <div>
                <h2>System Analytics</h2>
                {analytics.map((item, index) => (
                    <div key={index}>{item.metric}: {item.value}</div>
                ))}
            </div>
            <div>
                <h2>Backup History</h2>
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
        </div>
    );
};

export default SystemOverview;
