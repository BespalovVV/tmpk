import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import MyButton from "../components/UI/button/MyButton";
import MyInput from "../components/UI/input/MyInput";
import { Link } from "react-router-dom";
import "../styles/SignUp.css";
import ItWorkSidebar from "../components/ItWorkSidebar";
import Endpoint from "../API/Endpoints";

const SignUp = () => {
  const { register, formState: { errors, isValid }, handleSubmit, reset, watch } = useForm({
    mode: "onBlur",
  });

  const password = watch("password");

  const onSubmit = async (data) => {
    const fullName = `${data.surname} ${data.name} ${data.patronimic}`.trim();

    const payload = {
      name: fullName,
      login: data.login,
      password: data.password,
      email: data.email,
    };

    const URL = `${Endpoint.HOST}users`;

    try {
      await axios.post(URL, payload);
      reset();
    } catch (e) {
        console.error(e.response?.data);
    }
  };

  return (
    <div className="sign-up-page">
      <div className="sign-up">
        <div className="sign-up__message">
          <p className="main-message">Регистрация</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="sign-up__inputs">
          <label>
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
          </label>
          {errors?.surname && <p style={{ color: "red" }}>{errors?.surname?.message}</p>}

          <label>
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
          </label>
          {errors?.name && <p style={{ color: "red" }}>{errors?.name?.message}</p>}

          <label>
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
          </label>
          {errors?.patronimic && <p style={{ color: "red" }}>{errors?.patronimic?.message}</p>}

          <label>
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
          </label>
          {errors?.email && <p style={{ color: "red" }}>{errors?.email?.message}</p>}

          <label>
            <MyInput
              {...register("login", {
                required: "Поле обязательно к заполнению",
                minLength: { value: 8, message: "Логин должен быть не меньше 8 символов" },
              })}
              label="Логин"
              type="text"
              placeholder="Введите логин"
              id="login"
              name="login"
            />
          </label>
          {errors?.login && <p style={{ color: "red" }}>{errors?.login?.message}</p>}

          <label>
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
              placeholder="Введите пароль"
              id="password"
              name="password"
              autoComplete="new-password"
            />
          </label>
          {errors?.password && <p style={{ color: "red" }}>{errors?.password?.message}</p>}

          <label>
            <MyInput
              {...register("confirmPassword", {
                required: "Поле обязательно к заполнению",
                validate: (value) => value === password || "Пароли не совпадают",
              })}
              label="Подтверждение пароля"
              type="password"
              placeholder="Подтвердите пароль"
              id="confirmPassword"
              name="confirmPassword"
              autoComplete="current-password"
            />
          </label>
          {errors?.confirmPassword && <p style={{ color: "red" }}>{errors?.confirmPassword?.message}</p>}

          <MyButton type="submit" disabled={!isValid}>
            Зарегистрироваться
          </MyButton>
        </form>

        <div className="to-sign-in">
          <p>Уже есть аккаунт?</p>
          <button>
            <Link to="/signin" className="to-sign-in__link">Войти</Link>
          </button>
        </div>
      </div>
      <ItWorkSidebar />
    </div>
  );
};

export default SignUp;
