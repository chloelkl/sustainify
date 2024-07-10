import './App.css';
import { Container } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import MyTheme from './themes/MyTheme';
import './fonts/Poppins.css';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

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
import Signup from './pages/account/main/Signup';
import AdminSignup from './pages/account/main/AdminSignup';
import Login from './pages/account/main/Login';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider theme={MyTheme}>
          <div style={{ height: '0vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
          </div>
          <Container>
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/account/signup" element={<Signup />} />
              <Route path="/account/login" element={<Login />} />
              <Route path="/account/admin-signup" element={<AdminSignup />} />
              <Route path="/account/user/main" element={<ProtectedRoute><UserMain /></ProtectedRoute>} />
              <Route path="/account/user/profile" element={<ProtectedRoute><UserProfile userId={1} /></ProtectedRoute>} />
              <Route path="/account/user/settings" element={<ProtectedRoute><UserSettings userId={1} /></ProtectedRoute>} />
              <Route path="/account/user/analytics" element={<ProtectedRoute><UserAnalytics userId={1} /></ProtectedRoute>} />
              <Route path="/account/user/chat" element={<ProtectedRoute><ChatWithFriends userId={1} /></ProtectedRoute>} />
              <Route path="/account/admin/main" element={<ProtectedRoute><AdminMain /></ProtectedRoute>} />
              <Route path="/account/admin/user-management" element={<ProtectedRoute><UserManagement /></ProtectedRoute>} />
              <Route path="/account/admin/communication-tools" element={<ProtectedRoute><CommunicationTools /></ProtectedRoute>} />
              <Route path="/account/admin/system-overview" element={<ProtectedRoute><SystemOverview /></ProtectedRoute>} />
              <Route path="/account/admin/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            </Routes>
          </Container>
          <Chatbot />
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
