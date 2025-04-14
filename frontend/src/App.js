import Layout from "./components/Layout";
import MainLogo from "./components/MainLogo";
import MyNavBar from "./components/UI/navBar/MyNavBar";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import SignUpSuccess from './pages/SignUpSuccess';
import MainPage from './pages/MainPage';
import Profile from './pages/Profile';
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from './components/PrivateRoute';

function App() {

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/signin" />} />
          <Route path="/signin" element={<Layout><MainLogo/><SignIn/></Layout>} />
          <Route path="/signup" element={<Layout><MainLogo/><SignUp/></Layout>} />
          <Route path="/signupsuccess" element={<Layout><MainLogo/><SignUpSuccess /></Layout>} />
          <Route path="/mainpage" element={<PrivateRoute><Layout><MyNavBar></MyNavBar><MainPage /></Layout></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Layout><MyNavBar></MyNavBar><Profile /></Layout></PrivateRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
