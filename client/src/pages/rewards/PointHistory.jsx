import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import http from '../../http';
import { Box, Typography, Card, CardContent } from "@mui/material";

const styles = {
    NavigateButton: {
        color: 'black',
        backgroundColor: '#F1FFE8', // Example background color
        border: 'none',
        borderRadius: '4px',
        padding: '8px 16px',
        fontWeight: 'bold',
        fontSize: '40px',
        cursor: 'pointer',
    },
}

function PointHistory() {
    const { user } = useAuth();
    const { userId } = useParams(); // Extract userId from URL parameters
    const navigate = useNavigate();
    const [pointHistory, setPointHistory] = useState({});
    const [error, setError] = useState(null);

    // Example: Log values in your route
    console.log('User ID:', userId);

    const isCurrentUser = user && user.userID === parseInt(userId);

    useEffect(() => {
        http.get(`/userreward/points-history/${user.userID}`)
            .then(response => {
                const pointsData = response.data;
                console.log(pointsData);
                if (Array.isArray(response.data)) {
                    console.log(response.data);
                    setPointHistory(response.data);
                }
            })
            .catch(error => {
                setError(error.message);
            });
    }, [userId]);

    const handleBack = () => {
        navigate(`/userreward/${user.userID}`);
    }

    return (
        <Box sx={{ padding: '50px' }}>
            <button
                onClick={handleBack}
                variant="contained"
                style={styles.NavigateButton}
            >
                &lt;
            </button>
            <Typography variant="h4" color="black" sx={{ fontWeight: 'bold', fontSize: '25px', marginBottom: '20px', marginTop: '20px' }}>
                {isCurrentUser ? 'Your Points History' : 'Points History'}
            </Typography>
            <Typography variant="body1" color="grey" sx={{ marginBottom: '20px' }}>
               This is your points history
            </Typography>
            {Array.isArray(pointHistory) && pointHistory.length > 0 ? (
                pointHistory.map((points, index) => (
                    <Card key={index} sx={{ marginBottom: '20px', padding: '10px' }}>
                        <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="h6" color="textSecondary">
                                Description: {points.description}
                            </Typography>
                            <Typography variant="body1">
                                Points: {points.points}
                            </Typography>
                        </CardContent>
                    </Card>
                ))
            ) : (
                <Typography variant="body1" color="textSecondary">
                    No Points History
                </Typography>
            )}

        </Box>
    );

}

export default PointHistory;
