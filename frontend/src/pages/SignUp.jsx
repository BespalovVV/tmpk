import React from 'react';
import { useForm } from 'react-hook-form';
import MyButton from '../components/UI/button/MyButton';
import MyInput from '../components/UI/input/MyInput';
import { useNavigate } from 'react-router-dom';
import ItWorkSidebar from '../components/ItWorkSidebar';
import '../styles/Registration.css';
import api from '../API/axiosInstance';

const SignUp = () => {
  const { register, formState: { errors }, handleSubmit, reset, watch, setError } = useForm({
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
      await api.post('send-confirmation-email', { email: data.email });
      navigate('/confirmation', { state: { email: data.email, login: data.login } });
      reset();
    } catch (e) {
      const status = e.response?.status;
      const message = e.response?.data?.detail || 'Неизвестная ошибка';

      if (status === 400) {
        setError("login", { type: "manual", message: "Логин или почта уже заняты" });
        setError("email", { type: "manual", message: "Логин или почта уже заняты" });
      }
      else {
        console.error(message);
      }
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
          <MyInput
            {...register("surname", {
              required: "Поле обязательно к заполнению",
              maxLength: { value: 255, message: "Слишком длинная фамилия" },
              pattern: {
                value: /^[А-Яа-яЁёA-Za-z -]+$/,
                message: "Недопустимые символы",
              },
            })}
            label="Фамилия"
            placeholder="Введите фамилию"
            type="text"
          />
          {errors?.surname && <p style={{ color: "red" }}>{errors.surname.message}</p>}

          <MyInput
            {...register("name", {
              required: "Поле обязательно к заполнению",
              maxLength: { value: 255, message: "Слишком длинное имя" },
              pattern: {
                value: /^[А-Яа-яЁёA-Za-z -]+$/,
                message: "Недопустимые символы",
              },
            })}
            label="Имя"
            placeholder="Введите имя"
            type="text"
          />
          {errors?.name && <p style={{ color: "red" }}>{errors.name.message}</p>}

          <MyInput
            {...register("patronimic", {
              required: "Поле обязательно к заполнению",
              pattern: {
                value: /^[А-Яа-яЁёA-Za-z -]+$/,
                message: "Недопустимые символы",
              },
            })}
            label="Отчество"
            placeholder="Введите отчество"
            type="text"
          />
          {errors?.patronimic && <p style={{ color: "red" }}>{errors.patronimic.message}</p>}

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
          />
          {errors?.email && <p style={{ color: "red" }}>{errors.email.message}</p>}

          <MyInput
            {...register("login", {
              required: "Поле обязательно к заполнению",
              minLength: { value: 8, message: "Логин должен быть не меньше 8 символов" },
            })}
            label="Логин"
            type="text"
            placeholder="Придумайте логин"
          />
          {errors?.login && <p style={{ color: "red" }}>{errors.login.message}</p>}

          <MyInput
            {...register("password", {
              required: "Поле обязательно к заполнению",
              minLength: { value: 8, message: "Пароль должен быть не меньше 8 символов" },
              maxLength: { value: 64, message: "Пароль не должен превышать 64 символа" },
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^\s]{8,}$/,
                message:
                  "Пароль должен содержать хотя бы одну заглавную, одну строчную букву, одну цифру и не содержать пробелов",
              },
            })}
            label="Пароль"
            type="password"
            placeholder="Придумайте пароль"
            autoComplete="new-password"
          />
          {errors?.password && <p style={{ color: "red" }}>{errors.password.message}</p>}

          <MyInput
            {...register("confirmPassword", {
              required: "Поле обязательно к заполнению",
              validate: value => value === password || "Пароли не совпадают",
            })}
            label="Повторите пароль"
            type="password"
            placeholder="Повторите пароль"
            autoComplete="current-password"
          />
          {errors?.confirmPassword && <p style={{ color: "red" }}>{errors.confirmPassword.message}</p>}

          <div className="buttons">
            <MyButton className="button-registration primary-button auth" type="submit">
              Зарегистрироваться
            </MyButton>
          </div>
        </form>

        <div className="to-sign-in">
          <span className="secondary-text">Уже есть аккаунт?</span>
          <MyButton className="button-sign-in secondary-button auth" onClick={handleRedirect}>
            Войти
          </MyButton>
        </div>
      </div>
      <ItWorkSidebar />
    </div>
  );
};

export default SignUp;
