import React from "react";
import "../styles/Card.css";

const Card = ({ topic, fio, address, description, deadline, createdAt }) => {
  return (
    <div className="card">
      <div className="card__header">
        <span className="card__topic">{topic}</span>
        <span className="card__deadline">{deadline}</span>
      </div>
      <div className="card__body">
        <p>{fio}</p>
        <p>{address}</p>
        <p>{description}</p>
      </div>
      <div className="card__footer">{createdAt}</div>
    </div>
  );
};

export default Card;
