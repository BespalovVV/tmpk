import React from 'react';
import { useForm } from 'react-hook-form';
import '../styles/Registration.css';
import ItWorkSidebar from '../components/ItWorkSidebar';
import MyButton from '../components/UI/button/MyButton';
import { useNavigate } from 'react-router-dom';
import MyInput from '../components/UI/input/MyInput';
import api from '../API/axiosInstance';

export const ForgotPassword = () => {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate('/signin');
  };

  const onSubmit = async (data) => {
    try {
      await api.post(`forget-password`, data)
      navigate('/waitingpassword');
    } catch (error) {
      console.error("Ошибка при отправке письма", error);
    }
  };

  return (
    <div className="registration-page">
      <div className="registration">
        <div className="registration__message">
          <p className="main-message">Восстановить пароль</p>
          <p className="additional-message secondary-text all-devices-text">Введите почту, указанную при регистрации</p>
        </div>

        <form className="registration__inputs" onSubmit={handleSubmit(onSubmit)}>
          <div className="email-input">
            <MyInput
              id="login_or_email"
              placeholder="Введите email"
              type="text"
              label="Email"
              {...register("email", {
                required: "Поле обязательно к заполнению",
                pattern: {
                  value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
                  message: "Некорректный email",
                },
              })}
            />
          </div>
          <div className="buttons">
            <MyButton className="button-registration primary-button auth" type="submit">Отправить письмо на почту</MyButton>
          </div>
        </form>

        <div className="to-sign-up">
          <span className="secondary-text">Нет аккаунта?</span>
          <MyButton className="button-registration secondary-button auth" type="button" onClick={handleRedirect}>Создать аккаунт</MyButton>
        </div>
      </div>
      <ItWorkSidebar/>
    </div>
  );
};

export default ForgotPassword;
