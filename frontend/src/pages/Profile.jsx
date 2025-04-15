import React from 'react';
import '../styles/MainPage.css';
import '../styles/Profile.css';
import InfoBlock from '../components/InfoBlock.jsx';
import MyButton from '../components/UI/button/MyButton.jsx';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import arrowMore from '../assets/arrow-more.png';

const Profile = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  const email = localStorage.getItem("email")
  const login = localStorage.getItem("login")
  
  const { setUser } = useAuth();


  const handleProfile = () => {
    navigate('/profile');
  };
  const handleLogout = () => {
    localStorage.removeItem("auth");
    localStorage.removeItem("username");
    localStorage.removeItem("user_role");
    localStorage.removeItem("access_token");
    localStorage.removeItem("email");
    localStorage.removeItem("login");
    setUser(null);
    navigate('/signin');
  };
    return (
      <div className="profile-page">
        <div className="user" onClick={handleProfile}>
        <span className="main-page__username">{username?.split(" ").slice(1).join(" ")}</span>
          <img className="arrow-more" alt="" src={arrowMore} />
        </div>
        <div className='profile-info'>
          <div className='info-blocks'>
            <InfoBlock header={username?.split(" ").join(" ")} body={email}></InfoBlock>
            <InfoBlock header='Логин' body={login}></InfoBlock>
            <InfoBlock header='Пароль' body='Не безопасно хранить пароль в localStorage, я ХЗ. Идите подальше с такими предложениями'></InfoBlock>
          </div>
          <div className="buttons main-buttons">
            <MyButton type="button" onClick={handleLogout}>Выйти</MyButton>
          </div>
        </div>
      </div>
    );
  };
export default Profile;
