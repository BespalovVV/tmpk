import React from "react";
import "../styles/MainPage.css";
import Card from "./Card";
import arrowMore from "../assets/arrow-more.png";

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
  return (
    <div className="main-page">
        <div className='user'>
            <span className="main-page__username">Иван Иванович</span>
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
