import React from 'react';
import {  useNavigate } from 'react-router-dom';
import imageTmpkLogo from '../assets/tmpk-logo.png';
import '../styles/MainLogo.css';

export const MainLogo = ({className = "", ...props}) => {
  const navigate = useNavigate();

  const handleRedirect = () => {
    if (!localStorage.getItem("auth")) {
      navigate('/signin');
    }
    else {
      navigate('/mainpage');
    }
  };
  return (
    <div className={`headline-tmpk ${className}`} onClick={handleRedirect}>
      <img className="menu-header__image tmpk-logo" alt="TMPK" src={imageTmpkLogo} />
      <div className="menu-header__text tmpk-text">Телеком МПК</div>
    </div> 
  );
};

export default MainLogo;
