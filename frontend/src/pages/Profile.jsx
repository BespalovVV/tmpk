import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import '../styles/Profile.css';
import InfoBlock from '../components/InfoBlock.jsx';
import MyButton from '../components/UI/button/MyButton.jsx';
import MyInput from '../components/UI/input/MyInput.jsx';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../API/axiosInstance';

const Profile = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [message, setMessage] = useState({ text: '', isError: false });
  const [isLoading, setIsLoading] = useState(false);

  const username = localStorage.getItem("username");
  const email = localStorage.getItem("email");
  const login = localStorage.getItem("login");

  const reset_pass = async (data) => {
    if (data.new_password !== data.confirm_password) {
      setMessage({ text: 'Пароли не совпадают', isError: true });
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post('reset-password', {
        old_password: data.old_password,
        new_password: data.new_password,
        confirm_password: data.confirm_password,
      });

      if (response.data.success) {
        setMessage({ text: 'Пароль успешно изменён', isError: false });
      } else {
        setMessage({ text: response.data.detail || 'Ошибка при смене пароля', isError: true });
      }
    } catch (error) {
      setMessage({
        text: error.response?.data?.detail || 'Произошла ошибка',
        isError: true
      });
    } finally {
      setIsLoading(false);
    }
  };
  const [resetStatus, setResetStatus] = useState({ message: '', isError: false });
  const [isResetting, setIsResetting] = useState(false);

  const handleResetByEmail = async () => {
    const userEmail = localStorage.getItem("email");
    
    if (!userEmail) {
      setResetStatus({ message: 'Email не найден', isError: true });
      return;
    }

    setIsResetting(true);
    setResetStatus({ message: '', isError: false });

    try {
      const response = await api.post('forget-password', { 
        email: userEmail 
      });

      if (response.data.success) {
        setResetStatus({ 
          message: 'Инструкции по сбросу пароля отправлены на вашу почту', 
          isError: false 
        });
      } else {
        setResetStatus({ 
          message: response.data.message || 'Ошибка при запросе сброса пароля', 
          isError: true 
        });
      }
    } catch (error) {
      setResetStatus({ 
        message: error.response?.data?.message || 'Произошла ошибка при отправке запроса', 
        isError: true 
      });
    } finally {
      setIsResetting(false);
    }
  };
  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    navigate('/signin');
  };

  return (
    <div className="profile-page">
      <div className="profile-info">
        <div className='info-blocks'>
          <InfoBlock
            header={username}
            body={
              <div>
                <p>{login}</p>
                <p>{email}</p>
              </div>
            }
          />

          <InfoBlock
            header="Сменить пароль"
            body={
              <form className="registration__inputs" onSubmit={handleSubmit(reset_pass)}>
                <div className="password-input">
                  <MyInput
                    label="Старый пароль"
                    type="password"
                    placeholder="Введите старый пароль"
                    {...register("old_password", { required: 'Обязательное поле' })}
                  />
                  {errors.old_password && <p className="error" style={{textAlign: "center"}}>{errors.old_password.message}</p>}
                </div>

                <div className="password-input">
                <MyInput
                label="Новый пароль"
                type="password"
                placeholder="Придумайте новый пароль"
                {...register("new_password", {
                  required: "Поле обязательно к заполнению",
                  minLength: { value: 8, message: "Пароль должен быть не меньше 8 символов" },
                  maxLength: { value: 64, message: "Пароль не должен превышать 64 символа" },
                  pattern: {value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^\s]{8,}$/,
                  message: "Пароль должен содержать заглавную, строчную букву, цифру и не содержать пробелов",
                },
                })}
                />
                {errors.new_password && (<p className="error" style={{ textAlign: "center" }}>{errors.new_password.message}</p>
              )}
              </div>
                <div className="password-verification-input">
                  <MyInput
                    label="Подтвердите пароль"
                    type="password"
                    placeholder="Повторите пароль"
                    {...register("confirm_password", { required: 'Обязательное поле' })}
                  />
                  {errors.confirm_password && <p className="error" style={{textAlign: "center"}}>{errors.confirm_password.message}</p>}
                </div>

                {message.text && (
                  <p style={{textAlign: "center"}} className={message.isError ? 'error' : 'success'}>
                    {message.text}
                  </p>
                )}

                <div className="buttons">
                  <MyButton
                    className="button-registration primary-button auth"
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Загрузка...' : 'Сменить пароль'}
                  </MyButton>
                </div>
              </form>
            }
          />
          <InfoBlock 
      header="Забыли пароль?" 
      body={
        <div className="buttons">
          <MyButton 
            className="button-registration primary-button auth" 
            onClick={handleResetByEmail}
            disabled={isResetting}
          >
            {isResetting ? 'Отправка...' : 'Сбросить пароль с помощью почты'}
          </MyButton>
          {resetStatus.message && (
            <p className={resetStatus.isError ? 'error-message' : 'success-message'}>
              {resetStatus.message}
            </p>
          )}
        </div>
      }
    />
        </div>

        <div className="buttons main-buttons">
          <MyButton type="button" onClick={handleLogout}>Выйти</MyButton>
        </div>
      </div>
    </div>
  );
};

export default Profile;