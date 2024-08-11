import React, { useState, useEffect } from "react";
import theme from "../../themes/MyTheme.js";
import Chart from "chart.js/auto";
import Masonry from "react-responsive-masonry";
import { Line } from "react-chartjs-2";
import { styled } from "@mui/system";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Button, Box, TextField, Typography } from "@mui/material";
import http from "../../http";
import { useAuth } from "../../context/AuthContext";
import ForumCard from "./ForumCard";
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';

const SelectDate = styled(DatePicker)({
  width: "30%",
  margin: "2vh 0",
  "& .MuiInputBase-root": {
    height: "50px",
    "& input": {
      height: "50px",
      fontSize: ".8rem",
    },
  },
  "& .MuiSvgIcon-root": {
    fontSize: "1rem",
    margin: "-5px",
  },
});
const Response = styled(Typography)(({ type }) => ({
  fontSize: ".7rem",
  fontWeight: "bold",
  width: "100%",
  textAlign: "center",
  height: "3vh",
  color:
    type === "success" ? theme.palette.primary.main : theme.palette.error.main,
}));

const ForumAdmin = () => {
  const { authToken } = useAuth();
  const [forums, setForums] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [filteredForums, setFilteredForums] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [startDate, setStartDate] = useState(dayjs().subtract(7, "day"));
  const [endDate, setEndDate] = useState(dayjs());
  const [responseMessage, setResponseMessage] = useState("");
  const [responseType, setResponseType] = useState("");

  useEffect(() => {
    getForums();
  }, []);

  const getForums = () => {
    http
      .get("/forum", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
      .then((res) => {
        if (Array.isArray(res.data)) {
          setForums(res.data);
          console.log("Fetched Forums:", res.data);
        } else {
          setForums([]);
          console.error("Expected array but received:", res.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching forums:", error);
      });
  };

  const handleGenerate = () => {
    if (endDate.isBefore(startDate)) {
      setResponseMessage("End date cannot be before start date.");
      setResponseType("fail");
    } else {
      const filtered = forums.filter((item) =>
        dayjs(item.createdAt).isBetween(startDate, endDate, null, "[]")
      );

      // Group by date
      const groupedData = filtered.reduce((acc, item) => {
        const date = dayjs(item.createdAt).format("YYYY-MM-DD");
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
      setFilteredForums(filtered);
      setResponseMessage("Successfully Generated");
      setResponseType("success");
      console.log(chartData);
    }
  };

  const filterForumsByDate = (date) => {
    const filtered = forums.filter((item) =>
      dayjs(item.createdAt).isSame(date, "day")
    );
    setFilteredForums(filtered);
  };

  const data = {
    labels: filteredData.map((item) => dayjs(item.date).format("DD MMM YYYY")),
    datasets: [
      {
        label: "Created Forums",
        backgroundColor: "rgb(255, 99, 132)",
        borderColor: "rgb(255, 99, 132)",
        data: filteredData.map((item) => item.count),
      },
    ],
  };

  // Calculate the maximum value for the y-axis and round up to the nearest multiple of 5
  const maxValue = Math.max(...filteredData.map((item) => item.count), 0);
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

  const handleCardClick = (item) => {
    setSelectedItem(item);
  };

  return (
    <>
      <Box sx={{ marginTop: "3rem" }}>
        <Line data={data} options={options} />
        <Box
          display="flex"
          justifyContent="space-around"
          alignItems="center"
          mb={2}
          width="60%"
          margin="auto"
        >
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
      <Box sx={{ marginTop: "2rem", marginBottom: "2rem" }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <SelectDate
            label="Select Date"
            value={selectedDate}
            onChange={(newValue) => {
              setSelectedDate(newValue);
              filterForumsByDate(newValue);
            }}
            renderInput={(params) => <TextField {...params} />}
            maxDate={dayjs()}
          />
        </LocalizationProvider>
      </Box>
      {filteredForums.length > 0 && (
      <Box sx={{ marginBottom: "3rem" }}>
        <Masonry columnsCount={4} gutter="10px">
          {filteredForums.map((item) => (
            <ForumCard key={item.id} item={item} />
          ))}
        </Masonry>
      </Box>
    )}
    <Box sx={{ marginBottom: "3rem" }}>
      <Box><SentimentVeryDissatisfiedIcon/></Box>
        <Typography>No Forums Created.</Typography>
      </Box>
    </>
  );
};

export default ForumAdmin;
