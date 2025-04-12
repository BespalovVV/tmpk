import React from "react";
import "../styles/MainPage.css";
import "../styles/Profile.css";
import InfoBlock from "../components/InfoBlock.jsx"
import { useNavigate } from "react-router-dom";
import arrowMore from "../assets/arrow-more.png";

const Profile = () => {
  const navigate = useNavigate();
  const handleProfile = () => {
    navigate('/profile');
  };
    return (
      <div className='profile-page'>
        <div className='user' onClick={handleProfile}>
          <span className="main-page__username">Иван Иванович</span>
          <img className="arrow-more" alt="" src={arrowMore} />
        </div>
        <div className='info-blocks'>
          <InfoBlock header='Иванов Иван Иванович' body='worker2022@uni-dubna.ru'></InfoBlock>
          <InfoBlock header='Логин' body='NewWorker22'></InfoBlock>
          <InfoBlock header='Пароль' body='Password1!'></InfoBlock>
        </div>
      </div>
    );
  };
export default Profile;
