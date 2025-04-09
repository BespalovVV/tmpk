import React from "react";
import "../styles/SignUp.css";
import { Link } from "react-router-dom";
import ItWorkSidebar from "../components/ItWorkSidebar";

export const SignUpSuccess = () => {
  return (
    <div className='sign-up-page'>
        <div className="sign-up">
            <div className="sign-up__message">
                <p className="main-message">Спасибо за регистрацию</p>
                <p className='additional-message'>Пожалуйста, дождитесь подтверждения аккаунта. Обычно это занимает не более 24 часов</p>
            </div>

            <div className="to-sign-in">
                <p>Уже есть аккаунт?</p>
                <button><Link to="/signin" className="to-sign-in__link">Войти</Link></button>
            </div>
        </div>
        <ItWorkSidebar/>
    </div>
  );
};

export default SignUpSuccess;
