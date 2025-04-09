import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context";
import axios from "axios";
import Endpoint from "../API/Endpoints";
import ItWorkSidebar from "../components/ItWorkSidebar";
import MyInput from "../components/UI/input/MyInput";
import MyButton from "../components/UI/button/MyButton";
import "../styles/SignIn.css";

const SignIn = () => {
  const { setIsAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onBlur" });

  const login = async (data) => {
    const URL = `${Endpoint.HOST}auth`;

    const payload = {
      login_or_email: data.login_or_email,
      password: data.password,
    };

    try {
      const response = await axios.post(URL, payload);

      if (response.status === 200) {
        setIsAuth(true);
        localStorage.setItem("auth", "true");
        navigate("/mainpage");
      } else {
        throw new Error("Ошибка авторизации");
      }
    } catch (error) {
      console.error(error.response?.data || error);
      setIsAuth(false);
      setErrorMessage("Неверный логин или пароль!");
    }
  };

  return (
    <div className="sign-in-page">
      <div className="sign-in">
        <div className="sign-in__message">
          <p className="main-message">С возвращением к команде ТМПК!</p>
          <p className="additional-message">Работа может быть в удовольствие</p>
        </div>

        {errorMessage && <p style={{ color: "red", marginBottom: "1rem" }}>{errorMessage}</p>}

        <form className="sign-in__inputs" onSubmit={handleSubmit(login)}>
          <div className="email-input">
            <label className="label" htmlFor="login_or_email">Email или логин</label>
            <MyInput
              id="login_or_email"
              placeholder="Введите email или логин"
              type="text"
              {...register("login_or_email", {
                required: "Поле обязательно для заполнения",
              })}
            />
            {errors.login_or_email && (
              <p className="error-message">{errors.login_or_email.message}</p>
            )}
          </div>

          <div className="password-input">
            <label className="label" htmlFor="password">Пароль</label>
            <MyInput
              id="password"
              placeholder="Введите пароль"
              type="password"
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
            <MyButton className="button-sign-in" type="submit">Войти</MyButton>
          </div>
        </form>

        <div className="to-sign-up">
          <p>Нет аккаунта?</p>
          <button>
            <Link to="/signup" className="to-sign-up__link">
              Создать аккаунт
            </Link>
          </button>
        </div>
      </div>
      <ItWorkSidebar />
    </div>
  );
};

export default SignIn;
