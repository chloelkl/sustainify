import React, { useState, useEffect } from "react";
import theme from '../../../themes/MyTheme.js'
import Chart from "chart.js/auto";
import { Line } from "react-chartjs-2";
import { styled } from '@mui/system';
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Button, Box, TextField, Typography } from "@mui/material";

const SelectDate = styled(DatePicker)({
  width: '30%',
  margin: '2vh 0',
  '& .MuiInputBase-root': {
    height: '50px',
    '& input': {
      height: '50px',
      fontSize: '.8rem'
    }
  },
  '& .MuiSvgIcon-root': {
    fontSize: '1rem',
    margin: '-5px'
  }
});
const Response = styled(Typography)(({ type }) => ({
  fontSize: '.7rem',
  fontWeight: 'bold',
  width: '100%',
  textAlign: 'center',
  height: '3vh',
  color: type === 'success' ? theme.palette.primary.main : theme.palette.error.main
}));

const ParticipationChart = () => {
  const [challenges, setChallenges] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [startDate, setStartDate] = useState(dayjs().subtract(7, "day"));
  const [endDate, setEndDate] = useState(dayjs());
  const [responseMessage, setResponseMessage] = useState('');
  const [responseType, setResponseType] = useState('');

  useEffect(() => {
    fetchCompletedChallenges();
  }, []);

  const fetchCompletedChallenges = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/challenge/getAllCompleted`);
      const result = await response.json();
      setChallenges(result);
    } catch (error) {
      console.error("Error fetching challenges:", error);
      setResponseMessage("Failed to fetch challenges.");
      setResponseType("fail")
    }
  };

  const handleGenerate = () => {
    if (endDate.isBefore(startDate)) {
      setResponseMessage("End date cannot be before start date.");
      setResponseType("fail")
    } else {
      const filtered = challenges.filter(chal =>
      dayjs(chal.completedAt).isBetween(startDate, endDate, null, "[]")
    );

    // Group by date
    const groupedData = filtered.reduce((acc, chal) => {
      const date = dayjs(chal.completedAt).format("YYYY-MM-DD");
      if (!acc[date]) {
        acc[date] = 0;
      }
      acc[date]++;
      return acc;
    }, {});

    // Create the data in the required format for chart.js
    const chartData = [];
    let currentDate = dayjs(startDate);
    while (currentDate.isBefore(endDate) || currentDate.isSame(endDate)) {
      const dateStr = currentDate.format("YYYY-MM-DD");
      chartData.push({
        date: dateStr,
        count: groupedData[dateStr] || 0,
      });
      currentDate = currentDate.add(1, "day");
    }

    setFilteredData(chartData);
    setResponseMessage("Successfully generated.");
    setResponseType("success");
    }
    
  };

  const data = {
    labels: filteredData.map(chal => dayjs(chal.date).format("DD MMM YYYY")),
    datasets: [
      {
        label: "Completed Challenges by Users",
        backgroundColor: "rgb(255, 99, 132)",
        borderColor: "rgb(255, 99, 132)",
        data: filteredData.map(chal => chal.count),
      },
    ],
  };

  // Calculate the maximum value for the y-axis and round up to the nearest multiple of 5
  const maxValue = Math.max(...filteredData.map(chal => chal.count), 0);
  const maxYAxis = Math.floor(maxValue / 5) + 5;

  const options = {
    scales: {
      y: {
        min: 0,
        max: maxYAxis, // Set the max value of y-axis
        ticks: {
          stepSize: 1,
          
        },
      },
    },
  };

  return (
    <Box>
      <Line data={data} options={options} />
      <Box display="flex" justifyContent="space-around" alignItems="center" mb={2} width="60%" margin="auto">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <SelectDate
            label="Start Date"
            value={startDate}
            onChange={(newValue) => setStartDate(newValue)}
            renderInput={(params) => <TextField {...params} />}
            maxDate={dayjs()}
          />
          <SelectDate
            label="End Date"
            value={endDate}
            onChange={(newValue) => setEndDate(newValue)}
            renderInput={(params) => <TextField {...params} />}
            maxDate={dayjs()}
          />
        </LocalizationProvider>
        <Button variant="contained" onClick={handleGenerate}>
          Generate
        </Button>
      </Box>
      {<Response type={responseType}>{responseMessage}</Response>}
    </Box>
  );
};

export default ParticipationChart;
