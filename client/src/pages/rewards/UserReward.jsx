import React, { useState, useCallback, useEffect } from "react";
import { Button, Box, Typography, Card, CardContent, IconButton, Dialog, DialogActions } from "@mui/material";
import http from '../../http';
import axios from 'axios';
import dayjs from 'dayjs';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const styles = {
    container: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '16px',
    },
    item: {
        flex: '0 1 calc(20% - 16px)',
        maxWidth: 'calc(20% - 16px)',
        boxSizing: 'border-box',
    },
};

function UserReward() {
    const { user } = useAuth();
    const [rewardList, setRewardList] = useState([]);
    const [expiryTime, setExpiryTime] = useState(dayjs().add(72, 'hour'));
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
    const { id } = useParams();
    const [rewardPoints, setRewardPoints] = useState({ pointsEarned: 0 });

    function calculateTimeLeft() {
        const now = dayjs();
        const diffSeconds = expiryTime.diff(now, 'second');
        if (diffSeconds <= 0) {
            return { hours: 0, minutes: 0, seconds: 0 };
        }
        const hours = Math.floor(diffSeconds / (60 * 60));
        const minutes = Math.floor((diffSeconds % (60 * 60)) / 60);
        const seconds = diffSeconds % 60;
        return { hours, minutes, seconds };
    }

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);
        return () => clearInterval(timer);
    }, [expiryTime]);

    const fetchRewardPoints = useCallback(async () => {
        if (!user) {
            console.error('User not available.');
            return;
        }
    
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/user/${user.userID}/rewards`);
            console.log(response);
            setRewardPoints({ pointsEarned: response.data });
        } catch (error) {
            console.error('Error fetching reward points:', error);
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            fetchRewardPoints();
        }
    }, [fetchRewardPoints, user]);

    useEffect(() => {
        http.get('/reward')
            .then((res) => setRewardList(res.data))
            .catch((error) => console.error("Error fetching reward list: ", error));
    }, []);

    const redeemReward = async (reward) => {
        const confirmRedemption = window.confirm(`Are you sure you want to redeem the reward: ${reward.rewardname}?`);
    
        if (!confirmRedemption) {
            return; // User chose to cancel the redemption
        }
    
        const payload = { userId: user.userID, rewardId: reward.id };
    
        try {
            const response = await http.post('/userreward/Redeemed', payload);
            console.log(response.data);
    
            // Update the reward points state with the latest points
            setRewardPoints({ pointsEarned: response.data.pointsEarned });
    
            alert('Reward redeemed successfully!'); // Notify user of successful redemption
    
        } catch (error) {
            if (error.response && error.response.status === 400) {
                // Handle specific error for already redeemed rewards
                alert('You have already redeemed this reward.');
            } else {
                // Handle other errors
                console.error('Error redeeming reward:', error.response ? error.response.data : error.message);
                alert('There was an error redeeming the reward. Please try again later.');
            }
        }
    };
    

    const [open, setOpen] = useState(false);
    const [selectedReward, setSelectedReward] = useState(null);

    const handleOpen = (reward) => {
        setSelectedReward(reward);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <Box sx={{ textAlign: 'center', paddingTop: '50px' }}>
                <Typography variant="h4" color='green' sx={{ fontWeight: 'bold', fontSize: '80px' }}>
                    {rewardPoints.pointsEarned}
                </Typography>
                <Typography variant="h4" color='black' sx={{ fontWeight: 'bold', fontSize: '25px' }}>
                    Total Points
                </Typography>
            </Box>
            <Box sx={{ textAlign: 'center', paddingTop: '50px' }}>
                <Typography variant="h4" color='black' sx={{ fontWeight: 'bold', fontSize: '20px' }}>
                    Transaction
                </Typography>
            </Box>
            <Box sx={{ textAlign: 'center', paddingTop: '50px' }}>
                <Typography variant="h4" color='black' sx={{ fontWeight: 'bold', fontSize: '50px' }}>
                    Rewards
                </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingLeft: '60px', paddingRight: '90px', paddingTop: '50px', paddingBottom: '20px' }}>
                <Typography variant="h5">Voucher Reset: {timeLeft.hours}:{timeLeft.minutes}:{timeLeft.seconds}</Typography>
            </Box>
            <Box>
                <div style={styles.container}>
                    {rewardList.map((reward) => (
                        <div style={styles.item} key={reward.id}>
                            <Card>
                                <CardContent style={{ textAlign: 'center', paddingTop: '50px', paddingBottom: '30px' }}>
                                    {reward.rewardImage && (
                                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px', marginBottom: '40px', marginTop: '20px' }}>
                                            <img
                                                alt="reward"
                                                src={`${import.meta.env.VITE_FILE_BASE_URL}${reward.rewardImage}`}
                                                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                                            />
                                        </Box>
                                    )}
                                    <Typography variant="h6" sx={{ mb: 1 }}>
                                        {reward.rewardname}
                                    </Typography>
                                    <Typography variant="body1" sx={{ mb: 1, color: 'grey' }}>
                                        {reward.points} points
                                    </Typography>
                                    <Button variant="contained" sx={{ mb: 1, color: "black", marginTop: '20px' }} color="secondary" onClick={() => handleOpen(reward)}>
                                        View
                                    </Button>
                                    <Button variant="contained" sx={{ mb: 1, color: "black", marginTop: '20px' }} color="secondary" onClick={() => redeemReward(reward)}>
                                        Redeem
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    ))}
                </div>
            </Box>
            <Dialog open={open} onClose={handleClose}>
                <DialogActions>
                    <Button onClick={handleClose} style={{ marginRight: 'auto' }}>
                        <IconButton color="primary">
                            <ArrowBackIosIcon />
                        </IconButton>
                    </Button>
                </DialogActions>
                {selectedReward && (
                    <Card>
                        <Typography variant="h4" sx={{ fontWeight: 'bold', textAlign: 'center', paddingTop: '50px' }}>IMAGE</Typography>
                        <CardContent style={{ textAlign: 'center', paddingTop: '50px', paddingBottom: '30px' }}>
                            <Typography variant="h6" sx={{ mb: 1 }}>
                                {selectedReward.rewardname}
                            </Typography>
                            <Typography variant="body1" sx={{ mb: 1, color: 'grey' }}>
                                {selectedReward.points} points
                            </Typography>
                        </CardContent>
                    </Card>
                )}
            </Dialog>
        </>
    );
}
export default UserReward;