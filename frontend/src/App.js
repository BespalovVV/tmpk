import React, { useState } from "react";
import Base from "./components/Base";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import SignUpSuccess from './pages/SignUpSuccess';
import MainPage from './pages/MainPage';
import { AuthContext } from './context'; // <-- добавь это

function App() {
  const [isAuth, setIsAuth] = useState(false); // <-- состояние авторизации

  return (
    <AuthContext.Provider value={{ isAuth, setIsAuth }}>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/signin" />} />
          <Route path="/signin" element={<Base><SignIn /></Base>} />
          <Route path="/signup" element={<Base><SignUp /></Base>} />
          <Route path="/signupsuccess" element={<Base><SignUpSuccess /></Base>} />
          <Route path="/mainpage" element={<Base><MainPage /></Base>} />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
