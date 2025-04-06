import React from "react";
import "../styles/SignUp.css";
import { Link } from "react-router-dom";
import ItWorkSidebar from "./ItWorkSidebar";

export const SignUp = () => {
  return (
    <div className='sign-up-page'>
        <div className="sign-up">
            <div className="sign-up__message">
                <p className="main-message">Регистрация</p>
            </div>

            <form className="sign-up__inputs">
                <div className="lastname-input">
                    <label className="label" htmlFor="input-lastname">Фамилия</label>
                    <input
                    className="lastname"
                    id="input-lastname"
                    placeholder="Введите фамилию"
                    type="text"
                    />
                </div>

                <div className="name-input">
                    <label className="label" htmlFor="input-name">Имя</label>
                    <input
                    className="name"
                    id="input-name"
                    placeholder="Введите имя"
                    type="text"
                    />
                </div>

                <div className="patronimic-input">
                    <label className="label" htmlFor="input-patronimic">Отчество</label>
                    <input
                    className="patronimic"
                    id="input-patronimic"
                    placeholder="Введите отчество"
                    type="text"
                    />
                </div>

                <div className="email-input">
                    <label className="label" htmlFor="input-email">Email</label>
                    <input
                    className="email"
                    id="input-email"
                    placeholder="Придумайте email"
                    type="email"
                    />
                </div>

                <div className="login-input">
                    <label className="label" htmlFor="input-login">Логин</label>
                    <input
                    className="login"
                    id="input-login"
                    placeholder="Придумайте логин"
                    type="text"
                    />
                </div>

                <div className="password-input">
                    <label className="label" htmlFor="input-password">Пароль</label>
                    <input
                    className="password"
                    id="input-password"
                    placeholder="Придумайте пароль"
                    type="text"
                    />
                </div>
                
                <div className="password-input">
                    <label className="label" htmlFor="input-password-confirm">Пароль</label>
                    <input
                    className="password"
                    id="input-password-confirm"
                    placeholder="Повторите пароль"
                    type="text"
                    />
                </div>
                <button type="submit" className="sign-up__submit"> Зарегистрироваться</button>
            </form>

            <div className="to-sign-in">
                <p>Уже есть аккаунт?</p>
                <button><Link to="/signin" className="to-sign-in__link">Войти</Link></button>
            </div>
        </div>
        <ItWorkSidebar/>
    </div>
  );
};

export default SignUp;
