import React from 'react';
import { useForm } from 'react-hook-form';
import '../styles/Registration.css';
import ItWorkSidebar from '../components/ItWorkSidebar';
import MyButton from '../components/UI/button/MyButton';
import { useNavigate } from 'react-router-dom';
import MyInput from '../components/UI/input/MyInput';

export const ChangePassword = () => {
  const { handleSubmit } = useForm();
  const navigate = useNavigate();
  
  const onSubmit = async (data) => {
    try {
      navigate('/signin');
    } catch (error) {
      console.error("Ошибка при сбросе пароля", error);
    }
  };

  return (
    <div className="registration-page">
      <div className="registration">
        <div className="registration__message">
            <p className="additional-message secondary-text all-devices-text">Смените пароль</p>
        </div>

        <form className="registration__inputs" onSubmit={handleSubmit(onSubmit)}>
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
      </div>
      <ItWorkSidebar/>
    </div>
  );
};

export default ChangePassword;
