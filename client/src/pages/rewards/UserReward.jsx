import React, { useState, useEffect } from "react";
import { Button, Box, Typography, Card, CardContent, IconButton, Grid, TextField } from "@mui/material";
import http from '../../http';
import dayjs from 'dayjs';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useParams } from 'react-router-dom';

const styles = {
    container: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '16px', // Adjust spacing as needed
    },
    item: {
        flex: '0 1 calc(20% - 16px)', // Ensure each item takes up 20% width minus the gap
        maxWidth: 'calc(20% - 16px)', // Ensure maximum width of 20% minus the gap
        boxSizing: 'border-box',
    },
};

function UserReward() {
    const [rewardList, setRewardList] = useState([]);
    const expiryTime = dayjs().add(72, 'hour'); // Set expiry time 72 hours from now
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft()); // State to hold remaining time
    const { id } = useParams();

    // Function to calculate time left
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

    // Function to update time left every second
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        http.get('/reward').then((res) => {
            console.log(res.data);
            setRewardList(res.data);
        });
    }, []);


    const [reward, setReward] = useState({
        rewardname: "",
        points: ""
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        http.get(`/reward/${id}`).then((res) => {
            setReward(res.data);
            setLoading(false);
        }).catch((error) => {
            console.error("Error fetching reward data: ", error);
            setLoading(false);
        });
    }, [id]);

    const [open, setOpen] = useState(false);
    const [selectedReward, setSelectedReward] = useState(null); // State for selected reward

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
                <Typography variant="h4" color='green' sx={{ fontWeight: 'bold', fontSize: '80px' }}>1000</Typography>
                <Typography variant="h4" color='black' sx={{ fontWeight: 'bold', fontSize: '25px' }}>Total Points</Typography>
            </Box>
            <Box sx={{ textAlign: 'center', paddingTop: '50px' }}>
                <Typography variant="h4" color='black' sx={{ fontWeight: 'bold', fontSize: '20px' }}>Transaction</Typography>
            </Box>
            <Box sx={{ textAlign: 'center', paddingTop: '50px' }}>
                <Typography variant="h4" color='black' sx={{ fontWeight: 'bold', fontSize: '50px' }}>Rewards</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingLeft: '60px', paddingRight: '90px', paddingTop: '50px', paddingBottom: '20px' }}>
                <Typography variant="h5">Voucher Reset: {timeLeft.hours}:{timeLeft.minutes}:{timeLeft.seconds}</Typography>
            </Box>
            <Box>

                <div style={styles.container}>
                    {rewardList.map((reward, i) => (
                        <div style={styles.item} key={reward.id}>
                            <Card>
                                <Typography variant="h4" sx={{ fontWeight: 'bold', textAlign: 'center', paddingTop: '50px' }}>IMAGE</Typography>
                                <CardContent style={{ textAlign: 'center', paddingTop: '50px', paddingBottom: '30px' }}>
                                    <Typography variant="h6" sx={{ mb: 1 }}>
                                        {reward.rewardname}
                                    </Typography>
                                    <Typography variant="body1" sx={{ mb: 1, color: 'grey' }}>
                                        {reward.points} points
                                    </Typography>
                                    <Button variant="contained" sx={{ mb: 1, color: "black", marginTop: '20px' }} color="secondary" onClick={() => handleOpen(reward)}>
                                        View
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
                        <IconButton color="primary" >
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
