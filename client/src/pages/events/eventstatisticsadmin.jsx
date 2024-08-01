// import React, { useEffect, useState } from 'react';
// import './EventStatisticsAdmin.css';
// import axios from 'axios';
// import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
// import { Line } from 'react-chartjs-2';
// // import EventAdminSidebar from '../../components/EventAdminSidebar';

// ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

// const EventStatisticsAdmin = () => {
//     const [chartData, setChartData] = useState({
//         labels: [],
//         datasets: []
//     });
//     const [timeRange, setTimeRange] = useState('12 months');

//     useEffect(() => {
//         fetchData(timeRange);
//     }, [timeRange]);

//     const fetchData = async (range) => {
//         try {
//             const response = await axios.get(`/eventpost/statistics?range=${range}`);
//             const data = Array.isArray(response.data) ? response.data : [];
//             const labels = data.map(item => `Week ${item.week}`);
//             const values = data.map(item => item.count);

//             setChartData({
//                 labels: labels,
//                 datasets: [
//                     {
//                         label: 'Number of Events Hosted',
//                         data: values,
//                         borderColor: 'rgba(75, 192, 192, 1)',
//                         backgroundColor: 'rgba(75, 192, 192, 0.2)',
//                     }
//                 ]
//             });
//         } catch (error) {
//             console.error('Error fetching data', error);
//         }
//     };

//     return (
//         <div className="event-statistics-admin">
//             {/* <EventAdminSidebar /> */}
//             <div className="content">
//                 <h2>Event Statistics</h2>
//                 <div className="controls">
//                     <label htmlFor="timeRange">Select Time Range:</label>
//                     <select id="timeRange" value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
//                         <option value="1 month">Last 1 Month</option>
//                         <option value="3 months">Last 3 Months</option>
//                         <option value="6 months">Last 6 Months</option>
//                         <option value="12 months">Last 12 Months</option>
//                         <option value="2023">2023</option>
//                         <option value="2024">2024</option>
//                         <option value="2025">2025</option>
//                     </select>
//                 </div>
//                 <Line data={chartData} />
//             </div>
//         </div>
//     );
// };

// export default EventStatisticsAdmin;
