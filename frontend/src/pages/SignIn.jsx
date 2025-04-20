import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import ItWorkSidebar from '../components/ItWorkSidebar';
import MyInput from '../components/UI/input/MyInput';
import MyButton from '../components/UI/button/MyButton';
import '../styles/Registration.css';
import { AuthContext } from '../context/AuthContext';
import api from '../API/axiosInstance';
import UserService from '../API/UserService'

const SignIn = () => {
  const {setUser} = useContext(AuthContext);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  const {register, handleSubmit,formState: { errors }} = useForm({ mode: "onBlur" });


  const login = async (data) => {
    const payload = {login_or_email: data.login_or_email,password: data.password}
    
    try {
      const response = await api.post("auth", payload);
      if (response.status === 200) {
        const accessToken = response.data.access_token;
        localStorage.setItem("access_token", accessToken);
  
        const decoded = JSON.parse(atob(accessToken.split('.')[1]));
        const userRole = decoded?.user_role || "unknown_user";
        const userId = decoded?.user_id;
        const userData = await UserService.getById(userId);
        const fullName = userData?.name || "Пользователь";
  
        localStorage.setItem("auth", "true");
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("username", fullName);
        localStorage.setItem("user_role", userRole);
        localStorage.setItem("user_id", userId);
        localStorage.setItem("email", userData?.email);
        localStorage.setItem("login", userData?.login);
  
        setUser({ name: fullName, role: userRole });
        navigate('/mainpage');
      }      
    } catch (error) {
      console.error(error.response?.data || error);
      setErrorMessage("Неверный логин или пароль!");
    }
  };
  
  

  const handleRedirect = () => {
    navigate('/signup');
  };

  return (
    <div className="registration-page">
      <div className="registration">
        <div className="registration__message">
          <p className="main-message">С возвращением <br></br>к команде ТМПК!</p>
          <p className="additional-message secondary-text ">Работа может быть в удовольствие</p>
        </div>

        {errorMessage && <p style={{ color: "red", marginBottom: "1rem" }}>{errorMessage}</p>}

        <form className="registration__inputs" onSubmit={handleSubmit(login)}>
          <div className="email-input">
            <MyInput
              id="login_or_email"
              placeholder="Введите email или логин"
              type="text"
              label="Email или логин"
              {...register("login_or_email", {
                required: "Поле обязательно для заполнения",
              })}
            />
            {errors.login_or_email && (
              <p className="error-message">{errors.login_or_email.message}</p>
            )}
          </div>

          <div className="password-input">
            <MyInput
              id="password"
              placeholder="Введите пароль"
              type="password"
              label="Пароль"
              {...register("password", {
                required: "Пароль обязателен",
                minLength: {
                  value: 8,
                  message: "Минимум 8 символов",
                },
              })}
            />
            {errors.password && (
              <p className="error-message">{errors.password.message}</p>
            )}
          </div>

          <div className="additionally">
            <div className="remember-me">
              <input type="checkbox" id="remember-me__input" />
              <label htmlFor="remember-me__input">Запомнить меня</label>
            </div>
            <div className="forgot-password">Забыли пароль?</div>
          </div>

          <div className="buttons">
            <MyButton className="button-registration primary-button auth" type="submit">Войти</MyButton>
          </div>
        </form>

        <div className="to-sign-up">
          <span className="secondary-text">Нет аккаунта?</span>
          <MyButton className="button-registration secondary-button auth" type="button" onClick={handleRedirect}>Создать аккаунт</MyButton>
        </div>
      </div>
      <ItWorkSidebar />
    </div>
  );
};

export default SignIn;