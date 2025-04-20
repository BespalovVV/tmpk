import React from 'react';
import MySearch from '../components/UI/search/MySearch';

const Tasks = () => {
  return (
    <div className="tasks-page">
        <MySearch placeholder="Введите номер задачи (СRM)"></MySearch>
    </div>
  );
};

export default Tasks;
