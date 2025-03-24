import React, { useEffect, useState } from "react";
import UserService from "../../API/UserService";

const UsersList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await UserService.getAll();
        setUsers(data);
      } catch (error) {
        console.error("Ошибка:", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div>
      <h2>Список пользователей</h2>
      {users.length > 0 ? (
        <ul>
          {users.map(user => (
            <li key={user.id}>{user.name} ({user.login}) ({user.email})</li>
          ))}
        </ul>
      ) : (
        <p>Нет данных</p>
      )}
    </div>
  );
};

export default UsersList;
