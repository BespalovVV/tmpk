import React, { useEffect, useState } from "react";
import "../styles/MainPage.css";
import Card from "../components/Card";
import { useNavigate } from "react-router-dom";
import arrowMore from "../assets/arrow-more.png";
import TaskService from "../API/TaskService";
import OffersService from "../API/OffersService";
import AddressService from "../API/AddressService";

const MainPage = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const username = localStorage.getItem("username");
  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    const fetchTasksWithDetails = async () => {
      try {
        const data = await TaskService.getAll();
        const filtered = data.filter(task => String(task.assign_to) === userId);

        const tasksWithDetails = await Promise.all(
          filtered.map(async (task) => {
            let fio = "";
            let address = "";

            try {
              const offer = await OffersService.getById(task.offer_id);
              const addr = await AddressService.getById(offer.address_id);

              fio = offer.abon_name;  
              address = addr.address;

            } catch (err) {
              console.warn(`Ошибка при загрузке offer/abonent/address для задачи ID=${task.id}`, err);
            }

            return {
              ...task,
              fio,
              address,
            };
          })
        );

        setTasks(tasksWithDetails);
      } catch (err) {
        console.error("Ошибка при получении задач:", err);
      }
    };

    fetchTasksWithDetails();
  }, [userId]);

  const handleProfile = () => {
    navigate("/profile");
  };

  return (
    <div className="main-page">
      <div className="user" onClick={handleProfile}>
        <span className="main-page__username">
          {username?.split(" ").slice(1).join(" ")}
        </span>
        <img className="arrow-more" alt="" src={arrowMore} />
      </div>

      <div className="main-page__cards">
        {tasks.map((item, idx) => (
          <div className="task-card" key={idx}>
            <Card {...item} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MainPage;
