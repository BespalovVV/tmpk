import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import '../styles/Registration.css';
import ItWorkSidebar from '../components/ItWorkSidebar';
import MyButton from '../components/UI/button/MyButton';
import { useNavigate, useParams } from 'react-router-dom';
import MyInput from '../components/UI/input/MyInput';
import api from '../API/axiosInstance';

export const ChangePassword = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({ mode: "onBlur" });

  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();
  const { token } = useParams();
  const newPassword = watch("new_password");

  const onSubmit = async (data) => {
    setServerError("");
    try {
      await api.post(`reset-forget-password/`, {
        secret_token: token,
        new_password: data.new_password,
        confirm_password: data.confirm_password
      });
      navigate('/signin');
    } catch (error) {
      console.error("Ошибка при смене пароля", error);
      if (error.response?.data?.detail) {
        setServerError(error.response.data.detail);
      } else {
        setServerError("Произошла ошибка. Попробуйте позже.");
      }
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
            {...register("new_password", {
            required: "Поле обязательно к заполнению",
            minLength: {
            value: 8,
            message: "Пароль должен быть не меньше 8 символов",
          },
          maxLength: {
            value: 64,
            message: "Пароль не должен превышать 64 символа",
          },
          pattern: {
            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^\s]{8,}$/,
            message: "Пароль должен содержать заглавную, строчную букву, цифру и не содержать пробелов",
          },
        })}
        label="Пароль"
        type="password"
        placeholder="Придумайте пароль"
        autoComplete="new-password"
        />
        {errors?.new_password && (<p style={{ color: "red" }}>{errors.new_password.message}</p>)}
        </div>
          <div className="password-verification-input">
          <MyInput
          {...register("confirm_password", {
            required: "Поле обязательно к заполнению",
            validate: (value) => value === newPassword || "Пароли не совпадают",
          })}
          label="Подтвердите пароль"
          type="password"
          placeholder="Повторите пароль"
          autoComplete="new-password"
          />
            {errors.confirm_password && <p style={{ color: "red" }}>{errors.confirm_password.message}</p>}
          </div>

          {serverError && <p style={{ color: "red" }}>{serverError}</p>}

          <div className="buttons">
            <MyButton className="button-registration primary-button auth" type="submit">
              Сменить пароль
            </MyButton>
          </div>
        </form>
      </div>
      <ItWorkSidebar />
    </div>
  );
};

export default ChangePassword;
