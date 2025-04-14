import React from "react";
import "../styles/Card.css";
import {formatDateTime, formatDate} from "../utils/dateUtil";


const Card = ({ topic, fio, address, description, date_to, date_creation }) => {
  
  return (
    <div className="card">
      <div className="card__header">
        <span className="card__topic">{topic}</span>
        <span className="card__deadline">{formatDateTime(date_to)}</span>
      </div>
      <div className="card__body">
        <p>{fio}</p>
        <p>{address}</p>
        <p>{description}</p>
      </div>
      <div className="card__footer">{formatDate(date_creation)}</div>
    </div>
  );
};

export default Card;
