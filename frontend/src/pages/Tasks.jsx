import React from 'react';
import MySearch from '../components/UI/search/MySearch';
import TasksTable from '../components/TasksTable.jsx';

const Tasks = () => {

  const sampleData = [{
    id: "1",
    topic: "Роутер",
    contract: "2",
    description: "Настройка роутера"
  },
  {
    id: "2",
    topic: "Роутер",
    contract: "7",
    description: "Замена роутера"
  },
  {
    id: "3",
    topic: "Маршрутизатор",
    contract: "1",
    description: ""
  }];

  return (
    <div className="tasks-page">
      <MySearch placeholder="Введите номер задачи (СRM)"></MySearch>
      <TasksTable data={sampleData}/>
    </div>
  );
};

export default Tasks;
