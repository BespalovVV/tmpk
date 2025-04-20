import React from 'react';
import MainLogo from '../../MainLogo.jsx';
import './MyNavBar.css';
import { useNavigate, useLocation } from 'react-router-dom';
import WavingHandGrey from '../../../assets/waving-hand-grey.png';
import WavingHandBlue from '../../../assets/waving-hand-blue.png';
import MapPinGrey from '../../../assets/map-pin-grey.png';
import MapPinBlue from '../../../assets/map-pin-blue.png';
import HomeGrey from '../../../assets/home-grey.png';
import HomeBlue from '../../../assets/home-blue.png';
import NetworkSwitchGrey from '../../../assets/network-switch-grey.png';
import NetworkSwitchBlue from '../../../assets/network-switch-blue.png';
import NoteGrey from '../../../assets/note-grey.png';
import NoteBlue from '../../../assets/note-blue.png';

export const NavBar = ({children}) => {

    const navigate = useNavigate();
    const location = useLocation();
  
    const isActive = (path) => location.pathname === path;
    
    return (
    <div className="menu-header">
        <MainLogo className="menu-header__item menu__logo"/>

        <div className="menu-header__item abonents-header" onClick={() => navigate('/abonents')}>
            <img className="menu-header__image menu-image" alt="" src={isActive('/abonents') ? WavingHandBlue : WavingHandGrey} />
            <div className={`menu-header__text ${isActive('/abonents') ? "menu-header__text_active" : ""}`}>
                <span className="text-full">Информация по абоненту</span>
                <span className="text-short">Абонент</span>
            </div>
        </div>

        <div className="menu-header__item addresses-header" onClick={() => navigate('/addresses')}>
            <img className="menu-header__image menu-image" alt="" src={isActive('/addresses') ? MapPinBlue : MapPinGrey} />
            <div className={`menu-header__text ${isActive('/addresses') ? "menu-header__text_active" : ""}`}>
                <span className="text-full">Информация по адресу</span>
                <span className="text-short">Адрес</span>
            </div>
        </div>

        <div className="menu-header__item home-header" onClick={() => navigate('/mainpage')}>
            <img className="menu-header__image menu-image" alt="" src={isActive('/mainpage') ? HomeBlue : HomeGrey} />
            <div className={`menu-header__text ${isActive('/mainpage') ? "menu-header__text_active" : ""}`}>
                <span>Главная</span>
            </div>
        </div>

        <div className="menu-header__item switchers-header" onClick={() => navigate('/switchers')}>
            <img className="menu-header__image menu-image" alt="" src={isActive('/switchers') ? NetworkSwitchBlue : NetworkSwitchGrey} />
            <div className={`menu-header__text ${isActive('/switchers') ? "menu-header__text_active" : ""}`}>
                <span className="text-full">Информация по коммутатору</span>
                <span className="text-short">Коммутатор</span>
            </div>
        </div>

        <div className="menu-header__item tasks-header" onClick={() => navigate('/tasks')}>
            <img className="menu-header__image menu-image" alt="" src={isActive('/tasks') ? NoteBlue : NoteGrey} />
            <div className={`menu-header__text ${isActive('/tasks') ? "menu-header__text_active" : ""}`}>
                <span className="text-full">Просмотр CRM-задачи из <span className="not-seperated">Биллинг 6</span></span>
                <span className="text-short">CRM</span>
            </div>
        </div>
    </div>
  );
};

export default NavBar;