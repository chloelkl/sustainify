import './App.css';
import { Container, AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import MyTheme from './themes/MyTheme';
import './fonts/Poppins.css';

// import pages here
import Homepage from './pages/Homepage';
import Navbar from './components/Navbar';

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

          </Routes>
        </Container>
      </ThemeProvider>
    </Router>
  );
}

export default App;
