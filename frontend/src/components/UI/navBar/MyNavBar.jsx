import React from "react";
import MainLogo from "../../MainLogo.jsx";
import "./MyNavBar.css" ;

export const NavBar = ({children}) => {
  return (
    <div className="menu-header">
        <MainLogo/>

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
  );
};

export default NavBar;