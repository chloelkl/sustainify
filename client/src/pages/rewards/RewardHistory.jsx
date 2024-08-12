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



function RewardHistory() {
    const { user } = useAuth();
    const { userId } = useParams(); // Extract userId from URL parameters
    const navigate = useNavigate();
    const [rewardHistory, setRewardHistory] = useState({});
    const [error, setError] = useState(null);

    // Example: Log values in your route
    console.log('User ID:', userId);


    const isCurrentUser = user && user.userID === parseInt(userId);

    useEffect(() => {
        http.get(`/userreward/reward-history/${user.userID}`)
            .then(response => {
                const rewardsData = response.data;
                console.log(rewardsData);
                if (Array.isArray(response.data)) {
                    console.log(response.data);
                    setRewardHistory(response.data);
                }
            })
            .catch(error => {
                setError(error.message);
            });
    }, [userId]);

    const handleBack = () => {
        navigate(`/userreward/${user.userID}`);
    }

    if (error) return <Typography>Error: {error}</Typography>;

    return (
        <Box sx={{ padding: '50px' }}>
            <button
                onClick={handleBack}
                variant="contained"
                style={styles.NavigateButton}
            >
                &lt;
            </button>
            <Typography variant="h4" color="black" sx={{ fontWeight: 'bold', fontSize: '25px', marginBottom: '20px' }}>
                {isCurrentUser ? 'Your Reward History' : 'Reward History'}
            </Typography>
            <Typography variant="body1" color="grey" sx={{ marginBottom: '20px' }}>
                Note that 7 days after your redeemed date, the voucher will expire.
            </Typography>
            {Array.isArray(rewardHistory) && rewardHistory.length > 0 ? (
                rewardHistory.map((reward, index) => {
                    // Format the date inside the map function
                    const date = new Date(reward.redeemedAt);

                    const formattedDate = date.toLocaleDateString('en-US', {
                        year: '2-digit',
                        month: '2-digit',
                        day: '2-digit',
                    });

                    return (
                        <Card key={index} sx={{ marginBottom: '20px', padding: '10px' }}>
                            <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="h6" color="textSecondary">
                                    Reward Name: {reward.rewardname} <br />
                                    Points: {reward.points}
                                </Typography>
                                <Typography variant="body1">
                                    Code: {reward.redemptionCode} <br />
                                    Redeemed At: {formattedDate}
                                </Typography>
                            </CardContent>
                        </Card>
                    );
                })
            ) : (
                <Typography variant="body1">No rewards redeemed yet.</Typography>
            )}

        </Box>
    );

}

export default RewardHistory;
