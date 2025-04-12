import React, { useState } from "react";
import Layout from "./components/Layout";
import MainLogo from "./components/MainLogo";
import MyNavBar from "./components/UI/navBar/MyNavBar";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import SignUpSuccess from './pages/SignUpSuccess';
import MainPage from './pages/MainPage';
import Profile from './pages/Profile';
import { AuthContext } from './context';

function App() {
  const [isAuth, setIsAuth] = useState(false);

  return (
    <AuthContext.Provider value={{ isAuth, setIsAuth }}>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/signin" />} />
          <Route path="/signin" element={<Layout><MainLogo/><SignIn /></Layout>} />
          <Route path="/signup" element={<Layout><MainLogo/><SignUp /></Layout>} />
          <Route path="/signupsuccess" element={<Layout><MainLogo/><SignUpSuccess /></Layout>} />
          <Route path="/mainpage" element={<Layout><MyNavBar></MyNavBar><MainPage /></Layout>} />
          <Route path="/profile" element={<Layout><MyNavBar></MyNavBar><Profile /></Layout>} />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
