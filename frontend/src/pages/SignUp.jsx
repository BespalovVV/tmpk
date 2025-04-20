import React from 'react';
import { useForm } from 'react-hook-form';
import MyButton from '../components/UI/button/MyButton';
import MyInput from '../components/UI/input/MyInput';
import { useNavigate } from 'react-router-dom';
import ItWorkSidebar from '../components/ItWorkSidebar';
import '../styles/Registration.css';
import api from '../API/axiosInstance'

const SignUp = () => {
  const { register, formState: { errors }, handleSubmit, reset, watch } = useForm({
    mode: "onBlur",
  });
  
  const navigate = useNavigate();

  const password = watch("password");

  const onSubmit = async (data) => {
    const fullName = `${data.surname} ${data.name} ${data.patronimic}`.trim();

    const payload = {
      name: fullName,
      login: data.login,
      password: data.password,
      email: data.email,
    };


    try {
      await api.post('users', payload);
      localStorage.setItem("auth", "true");
      navigate('/signupsuccess');
      reset();
    } catch (e) {
        console.error(e.response?.data);
    }
  };

  const handleRedirect = () => {
    navigate('/signin');
  };

  return (
    <div className="registration-page">
      <div className="registration">
        <div className="registration__message">
          <p className="main-message">Регистрация</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="registration__inputs">
          <div className="surname-input">
            <MyInput
              {...register("surname", {
                required: "Поле обязательно к заполнению",
                minLength: { value: 1, message: "Фамилия не может быть пустой" },
                maxLength: { value: 255, message: "Слишком длинная фамилия" },
              })}
              label="Фамилия"
              type="text"
              placeholder="Введите фамилию"
              id="surname"
              name="surname"
            />
          </div>
          {errors?.surname && <p style={{ color: "red" }}>{errors?.surname?.message}</p>}

          <div className="name-input">
            <MyInput
              {...register("name", {
                required: "Поле обязательно к заполнению",
                minLength: { value: 1, message: "Имя не может быть пустым" },
                maxLength: { value: 255, message: "Слишком длинное имя" },
              })}
              label="Имя"
              type="text"
              placeholder="Введите имя"
              id="name"
              name="name"
            />
          </div>
          {errors?.name && <p style={{ color: "red" }}>{errors?.name?.message}</p>}

          <div className="patronimic-input">
            <MyInput
              {...register("patronimic", {
                required: "Поле обязательно к заполнению",
              })}
              label="Отчество"
              type="text"
              placeholder="Введите отчество"
              id="patronimic"
              name="patronimic"
            />
          </div>
          {errors?.patronimic && <p style={{ color: "red" }}>{errors?.patronimic?.message}</p>}

          <div className="email-input">
            <MyInput
              {...register("email", {
                required: "Поле обязательно к заполнению",
                pattern: {
                  value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
                  message: "Некорректный email",
                },
              })}
              label="E-mail"
              type="email"
              placeholder="Введите E-mail"
              id="email"
              name="email"
            />
          </div>
          {errors?.email && <p style={{ color: "red" }}>{errors?.email?.message}</p>}

          <div className="login-input">
            <MyInput
              {...register("login", {
                required: "Поле обязательно к заполнению",
                minLength: { value: 8, message: "Логин должен быть не меньше 8 символов" },
              })}
              label="Логин"
              type="text"
              placeholder="Придумайте логин"
              id="login"
              name="login"
            />
          </div>
          {errors?.login && <p style={{ color: "red" }}>{errors?.login?.message}</p>}

          <div className="password-input">
            <MyInput
              {...register("password", {
                required: "Поле обязательно к заполнению",
                minLength: { value: 8, message: "Пароль должен быть не меньше 8 символов" },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{5,}$/,
                  message: "Пароль должен содержать хотя бы одну заглавную букву, одну строчную и одну цифру",
                },
              })}
              label="Пароль"
              type="password"
              placeholder="Придумайте пароль"
              id="password"
              name="password"
              autoComplete="new-password"
            />
          </div>
          {errors?.password && <p style={{ color: "red" }}>{errors?.password?.message}</p>}

          <div className="password-verification-input">
            <MyInput
              {...register("confirmPassword", {
                required: "Поле обязательно к заполнению",
                validate: (value) => value === password || "Пароли не совпадают",
              })}
              label="Пароль"
              type="password"
              placeholder="Повторите пароль"
              id="confirmPassword"
              name="confirmPassword"
              autoComplete="current-password"
            />
          </div>
          {errors?.confirmPassword && <p style={{ color: "red" }}>{errors?.confirmPassword?.message}</p>}

          <div className="buttons">
            <MyButton className="button-registration primary-button auth" type="submit">Зарегистироваться</MyButton>
          </div>
        </form>

        <div className="to-sign-in">
          <span className="secondary-text">Уже есть аккаунт?</span>
          <MyButton className="button-sign-in secondary-button auth" type="button" onClick={handleRedirect}>Войти</MyButton>
        </div>
      </div>
      <ItWorkSidebar />
    </div>
  );
};

export default SignUp;
