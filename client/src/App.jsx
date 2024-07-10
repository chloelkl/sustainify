import './App.css';
import { Container, AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import MyTheme from './themes/MyTheme';
import './fonts/Poppins.css';

// import pages here
import Homepage from './pages/Homepage';
import Navbar from './components/Navbar';
import Rewards from './pages/rewards/Rewards';
import EditReward from './pages/rewards/EditReward';
import AddReward from './pages/rewards/AddReward';
import DeleteReward from './pages/rewards/DeleteReward';
import UserReward from './pages/rewards/UserReward';

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
            
            {/* Rewards Page */}
            <Route path={"/rewards/Rewards"} element={<Rewards />} />  
            <Route path={"/rewards/AddReward"} element={<AddReward />} />
            <Route path={"/rewards/EditReward/:id"} element={<EditReward />} />
            <Route path={"/rewards/DeleteReward/:id"} element={<DeleteReward />} />
            <Route path={"/rewards/UserReward"} element={<UserReward />} />
          </Routes>
        </Container>
      </ThemeProvider>
    </Router>
  );
}

export default App;
