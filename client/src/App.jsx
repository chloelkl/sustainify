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

import AccountLayout from './AccountLayout.jsx';
import MainLayout from './MainLayout.jsx';

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
import EventStatisticsAdmin from './pages/events/eventstatisticsadmin.jsx';

// Forum
import Forum from './pages/forum/Forum';
import AddForum from './pages/forum/AddForum';
import UserForum from './pages/forum/UserForum';
import ForumAdmin from './pages/forum/ForumAdmin.jsx';

// Rewards
import Rewards from './pages/rewards/Rewards';
import EditReward from './pages/rewards/EditReward';
import AddReward from './pages/rewards/AddReward';
import DeleteReward from './pages/rewards/DeleteReward';
import UserReward from './pages/rewards/UserReward';
import RewardHistory from './pages/rewards/RewardHistory';
import PointHistory from './pages/rewards/PointHistory';

// Challenges
import DailyChallenge from './pages/challenges/DailyChallenge';
import ManageTask from './pages/challenges/admin/ManageTask';
import TasksStats from './pages/challenges/admin/TasksStats';
import TaskParticipation from './pages/challenges/admin/TaskParticipation';
import PastChallenges from './pages/challenges/user/PastChallenges';


function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider theme={MyTheme}>
          <div style={{ height: '100px', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
          </div>
          <Container style={{padding: 0, maxWidth: '100%'}}>
            <Routes>
              <Route element={<AccountLayout />}>
                {/* Account */}
                <Route path="/account/signup" element={<Signup />} />
                <Route path="/account/login" element={<Login />} />
                <Route path="/account/admin-signup" element={<AdminSignup />} />
                <Route path="/account/user/main" element={<ProtectedRoute roles={['user']}><UserMain /></ProtectedRoute>} />
                <Route path="/account/user/profile" element={<ProtectedRoute roles={['user', 'admin']}><UserProfile /></ProtectedRoute>} />
                <Route path="/account/user/settings" element={<ProtectedRoute roles={['user', 'admin']}><UserSettings /></ProtectedRoute>} />
                <Route path="/account/user/analytics" element={<ProtectedRoute roles={['user', 'admin']}><UserAnalytics /></ProtectedRoute>} />
                <Route path="/account/user/chat" element={<ProtectedRoute roles={['user', 'admin']}><ChatWithFriends /></ProtectedRoute>} />
                <Route path="/account/admin/main" element={<ProtectedRoute roles={['admin']}><AdminMain /></ProtectedRoute>} />
                <Route path="/account/admin/user-management" element={<ProtectedRoute roles={['admin']}><UserManagement /></ProtectedRoute>} />
                <Route path="/account/admin/communication-tools" element={<ProtectedRoute roles={['admin']}><CommunicationTools /></ProtectedRoute>} />
                <Route path="/account/admin/system-overview" element={<SystemOverview />} />
                <Route path="/account/admin/dashboard" element={<ProtectedRoute roles={['admin']}><Dashboard /></ProtectedRoute>} />
              </Route>

              <Route element={<MainLayout />}>
                <Route path="/" element={<Homepage />} />

                {/* Event */}
                
                <Route path="/eventhosting" element={<ProtectedRoute roles= {['user']}><EventHosting /></ProtectedRoute> } />
                <Route path="/eventhostingadmin" element={<ProtectedRoute roles= {['admin']}><EventHostingAdmin /></ProtectedRoute>} />
                <Route path="/postevent" element={<ProtectedRoute roles= {['user']}><PostEvent /></ProtectedRoute> } />
                <Route path="/posteventadmin" element={<ProtectedRoute roles= {['admin']}><PostEventAdmin /></ProtectedRoute>} />
                <Route path={"/edithostingadmin/:id"} element={<ProtectedRoute roles= {['admin']}><EditHostingAdmin /></ProtectedRoute>} />
                <Route path="/createeventadmin" element={<ProtectedRoute roles= {['admin']}><CreateEventAdmin /></ProtectedRoute>} />
                <Route path="/eventoverview" element={<ProtectedRoute roles= {['user']}><EventOverview /></ProtectedRoute>} />
                <Route path="/eventstatisticsadmin" element={<ProtectedRoute roles= {['admin']}><EventStatisticsAdmin /></ProtectedRoute>} />


                {/* Forum */}
                <Route path={"/forum"} element={<ProtectedRoute roles={['user']}><Forum /></ProtectedRoute>} />
                <Route path={"/forum/admin"} element={<ProtectedRoute roles={['admin']}><ForumAdmin/></ProtectedRoute>} />
                <Route path={"/user/:userId/forum/addforum"} element={<AddForum/>} />
                <Route path={"/forum/by/:userId"} element={<ProtectedRoute roles={['user', 'admin']}><UserForum/></ProtectedRoute>} />

                {/* Rewards Page */}
                <Route path={"/rewards/Rewards"} element={<ProtectedRoute roles={['admin']}><Rewards /></ProtectedRoute>} />
                <Route path={"/rewards/AddReward"} element={<ProtectedRoute roles={['admin']}><AddReward /></ProtectedRoute>} />
                <Route path={"/rewards/EditReward/:id"} element={<ProtectedRoute roles={['admin']}><EditReward /></ProtectedRoute>} />
                <Route path={"/rewards/DeleteReward/:id"} element={<ProtectedRoute roles={['admin']}><DeleteReward /></ProtectedRoute>} />
                <Route path={"/userreward/:id"} element={<UserReward />}/>
                <Route path={"/userreward/reward-history/:userId"} element={<RewardHistory />}/>
                <Route path={"/userreward/points-history/:userId"} element={<PointHistory />}/>


                {/* challenges */}
                <Route path={"/challenges"} element={<ProtectedRoute roles={['user', 'admin']}><DailyChallenge /></ProtectedRoute>} />
                <Route path={"/challenges/manage"} element={<ProtectedRoute roles={['admin']}><ManageTask /></ProtectedRoute>} />
                <Route path={"/challenges/statistics"} element={<ProtectedRoute roles={['admin']}><TasksStats /></ProtectedRoute>} />
                <Route path={"/challenges/participation"} element={<ProtectedRoute roles={['admin']}><TaskParticipation /></ProtectedRoute>} />
                <Route path={"/challenges/past"} element={<ProtectedRoute roles={['user']}><PastChallenges /></ProtectedRoute>} />
              </Route>
            </Routes>
          </Container>
          <Chatbot />
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
