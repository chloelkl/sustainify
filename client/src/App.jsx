import './App.css';
import { Container } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import MyTheme from './themes/MyTheme';
import './fonts/Poppins.css';

// import pages here
import Homepage from './pages/Homepage';
import Navbar from './components/Navbar';
import UserProfile from './pages/account/user/UserProfile';
import UserManagement from './pages/account/admin/UserManagement';
import CommunicationTools from './pages/account/admin/CommunicationTools';
import SystemOverview from './pages/account/admin/SystemOverview';
import UserSettings from './pages/account/user/UserSettings';
import UserAnalytics from './pages/account/user/UserAnalytics';
import ChatWithFriends from './pages/account/user/ChatWithFriends';
import UserMain from './pages/account/user/UserMain';
import AdminMain from './pages/account/admin/AdminMain';
import Dashboard from './pages/account/admin/Dashboard';
import Chatbot from './components/Chatbot';

function App() {
  return (
    <Router>
      <ThemeProvider theme={MyTheme}>
        <Navbar />
        <Container>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/homepage" element={<Homepage />} />
            <Route path="/account/user/main" element={<UserMain />} />
            <Route path="/account/user/profile" element={<UserProfile userId={1} />} />
            <Route path="/account/user/settings" element={<UserSettings userId={1} />} />
            <Route path="/account/user/analytics" element={<UserAnalytics userId={1} />} />
            <Route path="/account/user/chat" element={<ChatWithFriends userId={1} />} />
            <Route path="/account/admin/main" element={<AdminMain />} />
            <Route path="/account/admin/user-management" element={<UserManagement />} />
            <Route path="/account/admin/communication-tools" element={<CommunicationTools />} />
            <Route path="/account/admin/system-overview" element={<SystemOverview />} />
            <Route path="/account/admin/dashboard" element={<Dashboard />} />
          </Routes>
        </Container>
        <Chatbot />
      </ThemeProvider>
    </Router>
  );
}

export default App;
