import React from 'react';
import '../styles/Registration.css';
import '../styles/SignUpSuccess.css';
import ItWorkSidebar from '../components/ItWorkSidebar';
import MyButton from '../components/UI/button/MyButton';
import { useNavigate } from 'react-router-dom';

export const SignUpSuccess = () => {
  const navigate = useNavigate();
  const handleRedirect = () => {
    navigate('/signin');
  };
  return (
    <div className="registration-page">
      <div className="registration">
        <div className="registration__message">
          <p className="main-message">Спасибо за регистрацию</p>
          <p className="additional-message secondary-text all-devices-text">Пожалуйста, дождитесь подтверждения аккаунта. Обычно это занимает не более 24 часов</p>
        </div>

        <div className="to-sign-in to-sign-in-left">
          <span className="secondary-text">Уже есть аккаунт?</span>
          <MyButton className="button-sign-in secondary-button auth" type="button" onClick={handleRedirect}>Войти</MyButton>
        </div>
      </div>
      <ItWorkSidebar/>
    </div>
  );
};

export default SignUpSuccess;
