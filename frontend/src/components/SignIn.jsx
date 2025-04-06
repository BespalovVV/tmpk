import React from "react";
import "../styles/SignIn.css";
import { Link } from "react-router-dom";
import ItWorkSidebar from "./ItWorkSidebar";

export const SignIn = () => {
  return (
    <div className='sign-in-page'>
      <div className='sign-in'>
        <div className="sign-in__message">
          <p className="main-message">С возвращением к команде ТМПК!</p>
          <p className="additional-message">Работа может быть в удовольствие</p>
        </div>   

        <form className="sign-in__inputs">
          <div className="email-input">
            <label className="label" htmlFor="input-email">Email</label>
            <input
              className="email"
              id="input-email"
              placeholder="Введите email или логин"
              type="email"
            />
          </div>

          <div className="password-input">
            <label className="label" htmlFor="input-password">Пароль</label>
            <input
              className="password"
              id="input-password"
              placeholder="Введите пароль"
              type="text"
            />
          </div>

          <div className="additionally">
            <div className="remember-me">
              <input type='checkbox' id='remember-me__input'></input>
              <label for="remember-me__input">Запомнить меня</label>
            </div>

            <div className="forgot-password">Забыли пароль?</div>
          </div>

          <div className="buttons">
            <div className="button-sign-in">Войти</div>
          </div> 
        </form>  

        <div className="to-sign-up">
          <p>Нет аккаунта?</p>
          <button><Link to="/signup" className='to-sign-up__link'>Создать аккаунт</Link></button>
          </div>
      </div>
      <ItWorkSidebar/>
    </div>
  );
};

export default SignIn;