import React from 'react';
import { useForm } from 'react-hook-form';
import '../styles/Registration.css';
import ItWorkSidebar from '../components/ItWorkSidebar';
import MyButton from '../components/UI/button/MyButton';
import { useNavigate, useParams } from 'react-router-dom';
import MyInput from '../components/UI/input/MyInput';
import api from '../API/axiosInstance';

export const ChangePassword = () => {
  const { register,  handleSubmit } = useForm();
  const navigate = useNavigate();
  const { token } = useParams();
  
  const onSubmit = async (data) => {
    try {
      await api.post(`reset-forget-password/`, {"secret_token": token, "new_password": data.new_password, "confirm_password": data.confirm_password})
      navigate('/signin');
    } catch (error) {
      console.error("Ошибка при смене пароля", error);
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
              {...register("new_password", {
                required: 'Обязательное поле',
                minLength: {
                  value: 8,
                  message: 'Минимум 8 символов'
                }
              })}
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
              {...register("confirm_password", {
                required: 'Обязательное поле',
                minLength: {
                  value: 8,
                  message: 'Минимум 8 символов'
                }
              })}
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
