import React, { useState, useCallback, useEffect } from "react";
import { Button, Box, Typography, Card, CardContent, Modal } from "@mui/material";
import axios from 'axios';
import http from '../../http';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import coinImage from '../../assets/coin.png';
import pointImage from '../../assets/reward.png';

const styles = {
    container: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '16px',
        paddingBottom: '50px',
        justifyContent: 'flex-start',
        margin: '0 auto',
        maxWidth: '1300px', // Optional: set a max-width for the container
    },
    item: {
        flex: '0 1 calc(20% - 16px)',
        maxWidth: 'calc(20% - 16px)',
        boxSizing: 'border-box',
        borderRadius: '12px', // Adjust the border radius as needed
        overflow: 'hidden',
        maxWidth: '80%',
    },
    redeemedCard: {
        backgroundColor: '#87AEA6', // Set background to green
        borderRadius: '8px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '305px', // Height of the card
    },
    redeemedText: {
        color: 'white',
        fontSize: '24px',
        fontWeight: 'bold',
    },
    NavigateButton: {
        color: 'black',
        backgroundColor: 'white', // Example background color
        border: 'none',
        borderRadius: '4px',
        padding: '8px 16px',
        fontWeight: 'bold',
        fontSize: '30px',
        cursor: 'pointer',
    },

    ViewReward: {
        color: 'white',
        backgroundColor: '#94C4BB', // Example background color
        border: 'none',
        borderRadius: '4px',
        padding: '4px 12px',
        fontWeight: 'bold',
        fontSize: '15px',
        cursor: 'pointer',
    },

    modalContent: {
        padding: '20px',
        textAlign: 'center',
        backgroundColor: 'white', // Set background to white
        borderRadius: '8px', // Optional: Add rounded corners
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', // Optional: Add shadow for better appearance
        position: 'relative', // Make sure the button is positioned relative to this container
        maxWidth: '800px',
        margin: 'auto',
    },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeButton: {
        position: 'absolute',
        top: '10px',
        left: '10px',
        backgroundColor: 'transparent', // Make the button background transparent
        border: 'none',
        fontSize: '30px',
        cursor: 'pointer',
        color: '#000', // Adjust color as needed
    },
};

function UserReward() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [rewardList, setRewardList] = useState([]);
    const [rewardPoints, setRewardPoints] = useState({ pointsEarned: 0 });
    const [selectedReward, setSelectedReward] = useState(null); // State to manage the selected reward
    const [open, setOpen] = useState(false); // State to manage modal visibility

    const fetchRewardPoints = useCallback(async () => {
        if (!user) {
            console.error('User not available.');
            return;
        }

        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/user/${user.userID}/rewards`);
            setRewardPoints({ pointsEarned: response.data });
        } catch (error) {
            console.error('Error fetching reward points:', error);
        }
    }, [user]);

    const fetchRewards = useCallback(async () => {
        try {
            const allRewardsResponse = await http.get(`${import.meta.env.VITE_API_URL}/reward`);
            const allRewards = allRewardsResponse.data;
            console.log(allRewardsResponse.data)

            const userRedeemedResponse = await http.get(`${import.meta.env.VITE_API_URL}/userreward/reward-history/${user.userID}`);
            const redeemedRewardIds = userRedeemedResponse.data.map(reward => reward.rewardId);

            // Combine rewards and redeemed status
            const rewardsWithRedeemedStatus = allRewards.map(reward => ({
                ...reward,
                redeemed: redeemedRewardIds.includes(reward.id) // Set redeemed status
            }));

            setRewardList(rewardsWithRedeemedStatus);
            console.log(allRewards);
        } catch (error) {
            console.error('Error fetching rewards:', error);
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            fetchRewardPoints();
            fetchRewards(); // Fetch rewards when component loads
        }
    }, [fetchRewardPoints, fetchRewards, user]);

    const handleViewDetails = (reward) => {
        setSelectedReward(reward);
        setOpen(true);
    };

    const handleCloseModal = () => {
        setOpen(false);
        setSelectedReward(null);
    };

    const redeemReward = async () => {
        if (!selectedReward) return;

        // Check if user has enough points
        if (selectedReward.points > rewardPoints.pointsEarned) {
            alert('Insufficient points to redeem this reward.');
            return;
        }
        const confirmRedemption = window.confirm(`Are you sure you want to redeem the reward: ${selectedReward.rewardname}?`);

        if (!confirmRedemption) {
            return; // User chose to cancel the redemption
        }

        const payload = { userId: user.userID, rewardId: selectedReward.id };

        try {
            const response = await http.post(`${import.meta.env.VITE_API_URL}/userreward/Redeemed`, payload);
            setRewardPoints({ pointsEarned: response.data.pointsEarned });
            await fetchRewards(); // Re-fetch rewards after redeeming
            alert('Reward redeemed successfully!');
            handleCloseModal(); // Close the modal after redeeming
        } catch (error) {
            if (error.response && error.response.status === 400) {
                alert('You have already redeemed this reward.');
            } else {
                console.error('Error redeeming reward:', error.response ? error.response.data : error.message);
                alert('There was an error redeeming the reward. Please try again later.');
            }
        }
    };

    const handleClickRewards = () => {
        navigate(`/userreward/reward-history/${user.userID}`);
    };

    const handleClickPoints = () => {
        navigate(`/userreward/points-history/${user.userID}`);
    };

    return (
        <>
            <Box sx={{ textAlign: 'center', paddingTop: '50px' }}>
                <Typography variant="h4" color='green' sx={{ fontWeight: 'bold', fontSize: '80px' }}>
                    {rewardPoints.pointsEarned}
                </Typography>
                <Typography variant="h4" color='black' sx={{ fontWeight: 'bold', fontSize: '25px', marginBottom: '50px' }}>
                    Total Points
                </Typography>
            </Box>

            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    maxWidth: '1200px',
                    margin: '0 auto',
                    padding: '0 16px', 
                    boxSizing: 'border-box' 
                }}
            >
                {/* Transaction History Box */}
                <Box
                    sx={{
                        textAlign: 'center',
                        flex: 1, 
                        maxWidth: 'calc(50% - 16px)', 
                        height: '100px', 
                        bgcolor: 'white', 
                        borderRadius: '8px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        padding: '0 16px', 
                        marginRight: '16px' 
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <img src={coinImage} alt="Coin" style={{ height: '60px', width: 'auto', marginRight: '16px' }} />
                        <Typography variant="h4" color='black' sx={{ fontWeight: 'bold', fontSize: '25px' }}>
                            Transaction History
                        </Typography>
                    </Box>
                    <button
                        onClick={handleClickRewards}
                        variant="contained"
                        style={styles.NavigateButton}
                    >
                        &gt;
                    </button>
                </Box>

                {/* Points History Box */}
                <Box
                    sx={{
                        textAlign: 'center',
                        flex: 1, 
                        maxWidth: 'calc(50% - 16px)', 
                        height: '100px', 
                        bgcolor: 'white',
                        borderRadius: '8px', 
                        display: 'flex',
                        alignItems: 'center', 
                        justifyContent: 'space-between', 
                        padding: '0 16px',
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <img src={pointImage} alt="Coin" style={{ height: '60px', width: 'auto', marginRight: '16px' }} />
                        <Typography variant="h4" color='black' sx={{ fontWeight: 'bold', fontSize: '25px' }}>
                            Points History
                        </Typography>
                    </Box>
                    <button
                        onClick={handleClickPoints}
                        variant="contained"
                        style={styles.NavigateButton}
                    >
                        &gt;
                    </button>
                </Box>
            </Box>

            <Box sx={{ textAlign: 'center', paddingTop: '50px' }}>
                <Typography variant="h4" color='black' sx={{ fontWeight: 'bold', fontSize: '50px' }}>
                    Rewards
                </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '20px', paddingBottom: '20px', color: 'grey'}}>
                <Typography variant="h6">Voucher Reset Every 7 Days </Typography>
            </Box>
            <Box>
                <div style={styles.container}>
                    {rewardList.map((reward) => {
                        const isRedeemed = reward.redeemed; // Check if reward is redeemed
                        console.log(`Reward ID: ${reward.id}, Redeemed: ${isRedeemed}`);
                        return (
                            <div style={styles.item} key={reward.id}>
                                <Card style={isRedeemed ? styles.redeemedCard : {}}> {/* Apply style conditionally */}
                                    {isRedeemed ? (
                                        <Typography style={styles.redeemedText}>
                                            <div style = {{ margin: 'auto', textAlign: 'center'}}>
                                                CLAIMED
                                            </div>
                                            <div style={{ textAlign: 'center', fontSize: '20px', paddingTop: '20px' }}> {/* Center text */}
                                                {reward.rewardname}
                                            </div>
                                        </Typography>
                                    ) : (
                                        <CardContent style={{ textAlign: 'center', paddingTop: '20px', paddingBottom: '30px' }}>
                                            {reward.rewardImage && (
                                                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px', marginBottom: '20px', marginTop: '20px' }}>
                                                    <img
                                                        alt="reward"
                                                        src={`${import.meta.env.VITE_API_URL}/${reward.rewardImage}`}
                                                        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                                                    />
                                                </Box>
                                            )}
                                            <Typography variant="h6" sx={{ mb: 1 }}>
                                                {reward.rewardname}
                                            </Typography>
                                            <Typography variant="body1" sx={{ mb: 1, color: 'grey', paddingBottom: '23px' }}>
                                                {reward.points} points
                                            </Typography>
                                            <Button
                                                onClick={() => handleViewDetails(reward)}
                                                variant="contained"
                                                color = "secondary"
                                                style={styles.ViewReward}
                                                disabled={isRedeemed} // Disable if redeemed
                                            >
                                                {isRedeemed ? 'Redeemed' : 'View'}
                                            </Button>
                                        </CardContent>
                                    )}
                                </Card>
                            </div>
                        );
                    })}
                </div>
            </Box>

            {/* Modal for displaying reward details */}
            <Modal
                open={open}
                onClose={handleCloseModal}
                sx={styles.modal}
            >
                <Box sx={styles.modalContent}>
                    <button onClick={handleCloseModal} style={styles.closeButton}>
                        &lt;
                    </button>
                    {selectedReward && (
                        <>
                            {selectedReward.rewardImage && (
                                <img
                                    alt="reward"
                                    src={`${import.meta.env.VITE_API_URL}/${selectedReward.rewardImage}`}
                                    style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain', marginBottom: '20px', marginTop: '40px' }}
                                />
                            )}
                            <Typography variant="h4" sx={{ mb: 2 }}>
                                {selectedReward.rewardname}
                            </Typography>

                            <Typography variant="body1" sx={{ mb: 2 }}>
                                {selectedReward.points} points
                            </Typography>
                            <Typography variant="h6" sx={{ mb: 2, color: 'grey', paddingLeft: '50px', paddingRight: '50px', paddingBottom: '20px' }}>
                                Enjoy {selectedReward.rewardname} at any store in Singapore. <br/> Only Valid at stores in Singapore
                            </Typography>
                            <Button
                                onClick={redeemReward}
                                variant="contained"
                                color="secondary"
                                style={styles.ViewReward}
                                disabled={selectedReward.redeemed || rewardPoints.pointsEarned < selectedReward.points} // Disable if already redeemed or insufficient points
                                sx = {{ marginBottom: '30px' }}
                            >
                                {selectedReward.redeemed ? 'Redeemed' : 'Redeem'}
                            </Button>
                        </>
                    )}
                </Box>
            </Modal>
        </>
    );
}

export default UserReward;
