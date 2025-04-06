import React from "react";
/*import UsersList from "./components/Users/UsersList";
import DivWrapper from "./components/Registration";*/
import Base from "./components/Base";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import SignUpSuccess from './components/SignUpSuccess';
import MainPage from './components/MainPage';

function App() {
  return (
    /*<div>
      <h1>Приложение</h1>
      <UsersList/>
    </div>*/
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/signin" />} />
        <Route path="/signin" element={<Base><SignIn /></Base>} />
        <Route path="/signup" element={<Base><SignUp /></Base>} />
        <Route path="/signupsuccess" element={<Base><SignUpSuccess /></Base>} />
        <Route path="/mainpage" element={<Base><MainPage /></Base>} />
      </Routes>
    </Router>
  );
}

export default App;
