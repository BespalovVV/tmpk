import React from "react";
import imageTmpkLogo from "../assets/tmpk-logo.png";
import "../styles/Base.css";

export const Base = ({children}) => {
  return (
    <div className="main-wrapper">
      <div className="content">
        <div className="menu-header">
          <div className="menu-header__item headline-tmpk desktop">
            <img className="menu-header__image tmpk-logo" alt="TMPK" src={imageTmpkLogo} />
            <div className="menu-header__text tmpk-text">Телеком МПК</div>
          </div>  

          <div className="menu-header__item">
            <div className="menu-header__text">Информация по абоненту</div>
          </div>

          <div className="menu-header__item">
            <div className="menu-header__text">Информация по адресу</div>
          </div>

          <div className="menu-header__item mobile">
            <div className="menu-header__text">Главная</div>
          </div>

          <div className="menu-header__item">
            <div className="menu-header__text">Информация по коммутатору</div>
          </div>

          <div className="menu-header__item">
            <div className="menu-header__text">Просмотр CRM-задачи из Биллинг 6</div>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Base;