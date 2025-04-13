import React from "react";
import "../styles/MainPage.css";
import "../styles/Profile.css";
import InfoBlock from "../components/InfoBlock.jsx"
import MyButton from "../components/UI/button/MyButton.jsx"
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import arrowMore from "../assets/arrow-more.png";

const Profile = () => {
  const navigate = useNavigate();
  const handleProfile = () => {
    navigate('/profile');
  };
  const username = localStorage.getItem("username");
  const { setUser } = useAuth();

  const handleLogout = () => {
    localStorage.removeItem("auth");
    localStorage.removeItem("username");
    localStorage.removeItem("user_role");
    localStorage.removeItem("access_token");
    setUser(null);
    navigate("/signin");
  };
    return (
      <div className='profile-page'>
        <div className='user' onClick={handleProfile}>
        <span className="main-page__username">{username?.split(" ").slice(1).join(" ")}</span>
          <img className="arrow-more" alt="" src={arrowMore} />
        </div>
        <div className='profile-info'>
          <div className='info-blocks'>
            <InfoBlock header='Иванов Иван Иванович' body='worker2022@uni-dubna.ru'></InfoBlock>
            <InfoBlock header='Логин' body='NewWorker22'></InfoBlock>
            <InfoBlock header='Пароль' body='Password1!'></InfoBlock>
          </div>
          <div className='buttons main-buttons'>
            <MyButton type="button" onClick={handleLogout}>Выйти</MyButton>
          </div>
        </div>
      </div>
    );
  };
export default Profile;
