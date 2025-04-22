import Layout from './components/Layout';
import MainLogo from './components/MainLogo';
import MyNavBar from './components/UI/navBar/MyNavBar';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import ChangePassword from './pages/ChangePassword';
import WaitingPassword from './pages/WaitingPassword';
import SignUpSuccess from './pages/SignUpSuccess';
import MainPage from './pages/MainPage';
import Profile from './pages/Profile';
import Abonents from './pages/Abonents';
import Addresses from './pages/Addresses';
import Switchers from './pages/Switchers';
import Tasks from './pages/Tasks';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/signin" />} />
          <Route path="/signin" element={<Layout><MainLogo/><SignIn/></Layout>} />
          <Route path="/signup" element={<Layout><MainLogo/><SignUp/></Layout>} />
          <Route path="/forgotpassword" element={<Layout><MainLogo/><ForgotPassword/></Layout>} />
          <Route path="/signupsuccess" element={<Layout><MainLogo/><SignUpSuccess /></Layout>} />
          <Route path="/changepassword" element={<Layout><MainLogo/><ChangePassword /></Layout>} />
          <Route path="/waitingpassword" element={<Layout><MainLogo/><WaitingPassword /></Layout>} />
          <Route path="/mainpage" element={<PrivateRoute><Layout><MainLogo className="authorized-logo"/><MyNavBar/><MainPage /></Layout></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Layout><MainLogo className="authorized-logo"/><MyNavBar/><Profile /></Layout></PrivateRoute>} />
          <Route path="/abonents" element={<PrivateRoute><Layout><MainLogo className="authorized-logo"/><MyNavBar/><Abonents /></Layout></PrivateRoute>} />
          <Route path="/addresses" element={<PrivateRoute><Layout><MainLogo className="authorized-logo"/><MyNavBar/><Addresses /></Layout></PrivateRoute>} />
          <Route path="/switchers" element={<PrivateRoute><Layout><MainLogo className="authorized-logo"/><MyNavBar/><Switchers /></Layout></PrivateRoute>} />
          <Route path="/tasks" element={<PrivateRoute><Layout><MainLogo className="authorized-logo"/><MyNavBar/><Tasks /></Layout></PrivateRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
