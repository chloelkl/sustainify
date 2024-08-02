import React, { useEffect, useState } from 'react';
import './EventStatisticsAdmin.css';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { Button, TextField, Typography, Box } from '@mui/material';
import EventStatisticsAdminSidebar from '../../components/EventStatisticsAdminSidebar';
import { styled } from '@mui/system';
import theme from '../../themes/MyTheme.js'

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

const SelectDate = styled(DatePicker)({
  width: '30%',
  margin: '2vh 0',
  '& .MuiInputBase-root': {
    height: '50px',
    '& input': {
      height: '50px',
      fontSize: '.8rem',
    },
  },
  '& .MuiSvgIcon-root': {
    fontSize: '1rem',
    margin: '-5px',
  },
});

const Response = styled(Typography)(({ type }) => ({
  fontSize: '.7rem',
  fontWeight: 'bold',
  width: '100%',
  textAlign: 'center',
  height: '3vh',
  color: type === 'success' ? theme.palette.primary.main : theme.palette.error.main,
}));

const EventStatisticsAdmin = () => {
  const [events, setEvents] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [startDate, setStartDate] = useState(dayjs().subtract(1, 'month'));
  const [endDate, setEndDate] = useState(dayjs());
  const [responseMessage, setResponseMessage] = useState('');
  const [responseType, setResponseType] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/eventpost`);
      const result = await response.json();
      setEvents(result);
    } catch (error) {
      console.error('Error fetching events:', error);
      setResponseMessage('Failed to fetch events.');
      setResponseType('fail');
    }
  };

  const handleGenerate = () => {
    if (endDate.isBefore(startDate)) {
      setResponseMessage('End date cannot be before start date.');
      setResponseType('fail');
    } else {
      const filtered = events.filter(event =>
        dayjs(event.createdAt).isBetween(startDate, endDate, null, '[]')
      );

      // Group by date
      const groupedData = filtered.reduce((acc, event) => {
        const date = dayjs(event.createdAt).format('YYYY-MM-DD');
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
        const dateStr = currentDate.format('YYYY-MM-DD');
        chartData.push({
          date: dateStr,
          count: groupedData[dateStr] || 0,
        });
        currentDate = currentDate.add(1, 'day');
      }

      setFilteredData(chartData);
      setResponseMessage('Successfully generated.');
      setResponseType('success');
    }
  };

  const data = {
    labels: filteredData.map(event => dayjs(event.date).format('DD MMM YYYY')),
    datasets: [
      {
        label: 'Number of Events Posted',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgba(255, 99, 132, 1)',
        data: filteredData.map(event => event.count),
        fill: true,
        tension: 0.4,
      },
    ],
  };

  // Calculate the maximum value for the y-axis and round up to the nearest multiple of 5
  const maxValue = Math.max(...filteredData.map(event => event.count), 0);
  const maxYAxis = Math.ceil(maxValue / 5) * 5;

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
    <Box className="event-statistics-admin">
      <EventStatisticsAdminSidebar />
      <Box className="content">
        <Box className="chart-container">
          <Line data={data} options={options} />
        </Box>
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
    </Box>
  );
};

export default EventStatisticsAdmin;
