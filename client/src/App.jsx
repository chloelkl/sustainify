import './App.css';
import { Container, AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import MyTheme from './themes/MyTheme';
import './fonts/Poppins.css';

// import pages here
import Homepage from './pages/Homepage';
import Navbar from './components/Navbar';

// Challenges
import DailyChallenge from './pages/challenges/DailyChallenge';
import ManageTask from './pages/challenges/ManageTask';
import PastChallenges from './pages/challenges/PastChallenges';


function App() {
  return (
    <Router>
      <ThemeProvider theme={MyTheme}>
        {/* navigation bar */}
        <Navbar />

        <Container>
          <Routes>
            {/* add paths for each page */}
            <Route path={"/"} element={<Homepage />} />
            <Route path={"/homepage"} element={<Homepage />} />

            {/* challenges */}
            <Route path={"/challenges"} element={<DailyChallenge />}/>
            <Route path={"/challenges/manage"} element={<ManageTask />}/>
            <Route path={"/challenges/past"} element={<PastChallenges />} />

          </Routes>
        </Container>
      </ThemeProvider>
    </Router>
  );
}

export default App;
