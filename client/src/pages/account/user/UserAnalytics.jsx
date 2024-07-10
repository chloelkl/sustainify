import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserAnalytics = ({ userId }) => {
    const [analytics, setAnalytics] = useState([]);

    useEffect(() => {
        axios.get(`/user/${userId}/analytics`)
            .then(response => setAnalytics(response.data))
            .catch(error => console.error("There was an error fetching the analytics!", error));
    }, [userId]);

    return (
        <div>
            <h2>User Analytics</h2>
            {/* Render analytics data */}
        </div>
    );
};

export default UserAnalytics;
