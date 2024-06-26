import './App.css';
import { Container, AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import MyTheme from './themes/MyTheme';
import './fonts/Poppins.css';

// import pages here
import Homepage from './pages/Homepage';
import Navbar from './components/Navbar';
import EventHosting from './pages/events/eventhosting';
import EventHostingAdmin from './pages/events/eventhostingadmin';
import PostEvent from './pages/events/postevent';
import PostEventAdmin from './pages/events/posteventadmin';
import EditHostingAdmin from './pages/events/edithostingadmin';
import CreateEventAdmin from './pages/events/createeventadmin';
import EventOverview from './pages/events/eventoverview';


function App() {
  return (
    <Router>
      <ThemeProvider theme={MyTheme}>
        {/* navigation bar */}
        <Navbar />

        <Container>
          <Routes>
            {/* add paths for each page */}
            <Route path="/" element={<Homepage />} />
            <Route path="/homepage" element={<Homepage />} />
            <Route path="/eventhosting" element={<EventHosting />} /> 
            <Route path="/eventhostingadmin" element={<EventHostingAdmin />} />
            <Route path="/postevent" element={<PostEvent />} />
            <Route path="/posteventadmin" element={<PostEventAdmin />} />
            <Route path={"/edithostingadmin/:id"} element={<EditHostingAdmin />} />
            <Route path="/createeventadmin" element={<CreateEventAdmin />} />
            <Route path="/eventoverview" element={<EventOverview />} />



          </Routes>
        </Container>
      </ThemeProvider>
    </Router>
  );
}

export default App;
