import React, { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import dayjs from 'dayjs';

function RewardPage() {
  const expiryTime = dayjs().add(72, 'hour'); // Set expiry time 72 hours from now
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft()); // State to hold remaining time
  const [coupons, setCoupons] = useState([]); // State to hold generated coupons

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

  // Function to handle adding a new coupon
  const addCoupon = () => {
    const newCoupon = {
      code: generateCouponCode(), // Generate coupon code (you can customize this function)
      timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss') // Timestamp when coupon was generated
    };
    setCoupons([...coupons, newCoupon]); // Add new coupon to state

    // Navigate to add-coupon page
    history.push('/add-coupon');
  };

  // Function to generate a sample coupon code (customize as per your requirements)
  const generateCouponCode = () => {
    return Math.random().toString(36).substr(2, 8).toUpperCase(); // Example of generating random alphanumeric code
  };

  // Function to update time left every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <Box sx={{ textAlign: 'center', paddingTop: '100px' }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>Management</Typography>
      </Box>

      <Box>
        <Typography>Voucher Reset: {timeLeft.hours}:{timeLeft.minutes}:{timeLeft.seconds}</Typography>
      </Box>

      <Box sx={{ marginTop: '20px' }}>
        <Button variant="contained" color="primary" onClick={addCoupon}>Generate Coupon</Button>
      </Box>

      <Box sx={{ marginTop: '20px' }}>
        {coupons.map((coupon, index) => (
          <Box key={index} sx={{ border: '1px solid #ccc', padding: '10px', marginTop: '10px' }}>
            <Typography variant="body1">Coupon Code: {coupon.code}</Typography>
            <Typography variant="body2">Generated at: {coupon.timestamp}</Typography>
          </Box>
        ))}
      </Box>
    </>
  );
}

export default RewardPage;
