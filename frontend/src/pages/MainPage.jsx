import React from 'react';
import '../styles/MainPage.css';
import Card from '../components/Card';
import { useNavigate } from 'react-router-dom';
import arrowMore from '../assets/arrow-more.png';

const MOCK_DATA = [
  {
    topic: "Тема",
    fio: "Иванов Иван Иванович",
    address: "г.Дубна, ул.Энтузиастов, 19/1, кв.18",
    description: "Описание",
    deadline: "12.12.2012 12:00",
    createdAt: "11.11.2011"
  },
];

const MainPage = () => {
  const navigate = useNavigate();
  const handleProfile = () => {
    navigate('/profile');
  };
  const username = localStorage.getItem("username");
  return (
    <div className="main-page">
        <div className="user" onClick={handleProfile}> 
          <span className="main-page__username">{username?.split(" ").slice(1).join(" ")}</span>
          <img className="arrow-more" alt="" src={arrowMore} />
        </div>

      <div className="main-page__cards">
        {MOCK_DATA.map((item, idx) => (
          <Card key={idx} {...item} />
        ))}
      </div>
    </div>
  );
};

export default MainPage;
