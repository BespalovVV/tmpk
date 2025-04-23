import React from 'react';
import { useForm } from 'react-hook-form';
import '../styles/MainPage.css';
import '../styles/Profile.css';
import InfoBlock from '../components/InfoBlock.jsx';
import MyButton from '../components/UI/button/MyButton.jsx';
import MyInput from '../components/UI/input/MyInput.jsx';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import arrowMore from '../assets/arrow-more.png';

const Profile = () => {
  const { handleSubmit } = useForm();
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
    localStorage.removeItem("user");
    localStorage.removeItem("user_id");
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
        <InfoBlock 
          header={username?.split(" ").join(" ")} 
          body={
            <div>
              <p>{login}</p>
              <p>{email}</p>
            </div>
          }>
        </InfoBlock>
        <InfoBlock 
          header="Сменить пароль"
          body={
            <form className="registration__inputs" onSubmit={handleSubmit()}>
              <div className="password-input">
                <MyInput
                  label="Старый пароль"
                  type="password"
                  placeholder="Введите старый пароль"
                  id="oldPassword"
                  name="password"
                  autoComplete="new-password"
                />
              </div>

              <div className="password-input">
                <MyInput
                  label="Пароль"
                  type="password"
                  placeholder="Придумайте новый пароль"
                  id="password"
                  name="password"
                  autoComplete="new-password"
                />
              </div>

              <div className="password-verification-input">
                <MyInput
                  label="Пароль"
                  type="password"
                  placeholder="Повторите пароль"
                  id="confirmPassword"
                  name="confirmPassword"
                  autoComplete="current-password"
                />
              </div>
                
              <div className="buttons">
                <MyButton className="button-registration primary-button auth" type="submit">Сменить пароль</MyButton>
              </div>
            </form>
          }>
        </InfoBlock>
        <InfoBlock 
          header="Забыли пароль?" 
          body={
            <div className="buttons">
              <MyButton className="button-registration primary-button auth" type="submit">Сбросить пароль с помощью почты</MyButton>
            </div>
          }>
        </InfoBlock>
      </div>
      <div className="buttons main-buttons">
        <MyButton type="button" onClick={handleLogout}>Выйти</MyButton>
      </div>
    </div>
  </div>
  );
};
export default Profile;
