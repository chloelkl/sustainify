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

// Account 
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

// Events
import EventHosting from './pages/events/eventhosting';
import EventHostingAdmin from './pages/events/eventhostingadmin';
import PostEvent from './pages/events/postevent';
import PostEventAdmin from './pages/events/posteventadmin';
import EditHostingAdmin from './pages/events/edithostingadmin';
import CreateEventAdmin from './pages/events/createeventadmin';
import EventOverview from './pages/events/eventoverview';

// Forum
import Forum from './pages/forum/Forum';
import AddForum from './pages/forum/AddForum';
import UserForum from './pages/forum/UserForum';

// Rewards
import Rewards from './pages/rewards/Rewards';
import EditReward from './pages/rewards/EditReward';
import AddReward from './pages/rewards/AddReward';
import DeleteReward from './pages/rewards/DeleteReward';
import UserReward from './pages/rewards/UserReward';

// Challenges
import DailyChallenge from './pages/challenges/DailyChallenge';
import ManageTask from './pages/challenges/ManageTask';
import PastChallenges from './pages/challenges/PastChallenges';


function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider theme={MyTheme}>
          <div style={{ height: '100px', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
          </div>
          <Container>
            <Routes>
              <Route path="/" element={<Homepage />} />

              {/* Account */}
              <Route path="/account/signup" element={<Signup />} />
              <Route path="/account/login" element={<Login />} />
              <Route path="/account/admin-signup" element={<AdminSignup />} />
              <Route path="/account/user/main" element={<ProtectedRoute><UserMain /></ProtectedRoute>} />
              <Route path="/account/user/profile" element={<ProtectedRoute roles={['user', 'admin']}><UserProfile /></ProtectedRoute>} />
              <Route path="/account/user/settings" element={<ProtectedRoute roles={['user', 'admin']}><UserSettings /></ProtectedRoute>} />
              <Route path="/account/user/analytics" element={<ProtectedRoute roles={['user', 'admin']}><UserAnalytics /></ProtectedRoute>} />
              <Route path="/account/user/chat" element={<ProtectedRoute roles={['user', 'admin']}><ChatWithFriends /></ProtectedRoute>} />
              <Route path="/account/admin/main" element={<ProtectedRoute roles={['admin']}><AdminMain /></ProtectedRoute>} />
              <Route path="/account/admin/user-management" element={<ProtectedRoute roles={['admin']}><UserManagement /></ProtectedRoute>} />
              <Route path="/account/admin/communication-tools" element={<ProtectedRoute roles={['admin']}><CommunicationTools /></ProtectedRoute>} />
              <Route path="/account/admin/system-overview" element={<ProtectedRoute roles={['admin']}><SystemOverview /></ProtectedRoute>} />
              <Route path="/account/admin/dashboard" element={<ProtectedRoute roles={['admin']}><Dashboard /></ProtectedRoute>} />

              {/* Event */}
              <Route path="/eventhosting" element={<EventHosting />} />
              <Route path="/eventhostingadmin" element={<EventHostingAdmin />} />
              <Route path="/postevent" element={<PostEvent />} />
              <Route path="/posteventadmin" element={<PostEventAdmin />} />
              <Route path={"/edithostingadmin/:id"} element={<EditHostingAdmin />} />
              <Route path="/createeventadmin" element={<CreateEventAdmin />} />
              <Route path="/eventoverview" element={<EventOverview />} />

              {/* Forum */}
              <Route path={"/forum"} element={<Forum />} />
              <Route path={"/user/:userId/forum/addforum"} element={<AddForum />} />
              <Route path={"/user/:userId/forum"} element={<UserForum />} />

              {/* Rewards Page */}
              <Route path={"/rewards/Rewards"} element={<Rewards />} />
              <Route path={"/rewards/AddReward"} element={<AddReward />} />
              <Route path={"/rewards/EditReward/:id"} element={<EditReward />} />
              <Route path={"/rewards/DeleteReward/:id"} element={<DeleteReward />} />
              <Route path={"/rewards/UserReward"} element={<UserReward />} />

              {/* challenges */}
            <Route path={"/challenges"} element={<DailyChallenge />}/>
            <Route path={"/challenges/manage"} element={<ManageTask />}/>
            <Route path={"/challenges/past"} element={<PastChallenges />} />
            </Routes>
          </Container>
          <Chatbot />
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
