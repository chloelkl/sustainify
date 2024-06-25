import './App.css';
import { Container, AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import MyTheme from './themes/MyTheme';
import './fonts/Poppins.css';

// import pages here
import Homepage from './pages/Homepage';
import Navbar from './components/Navbar';
import Forum from './pages/forum/Forum';
import AddForum from './pages/forum/AddForum';
import UserForum from './pages/forum/UserForum';

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
            <Route path={"/forum"} element={<Forum />} />
            <Route path={"/user/:userId/forum/addforum"} element={<AddForum />} />
            <Route path={"/user/:userId/forum"} element={<UserForum />} />

          </Routes>
        </Container>
      </ThemeProvider>
    </Router>
  );
}

export default App;
