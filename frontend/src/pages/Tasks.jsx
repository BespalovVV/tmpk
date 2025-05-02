import React, { useEffect, useState } from 'react';
import MySearch from '../components/UI/search/MySearch';
import TasksTable from '../components/TasksTable.jsx';
import TaskService from '../API/TaskService';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTasks = async () => {
      setError('');
      setLoading(true);
      try {
        const response = await TaskService.getAll();
        const tasksData = response.map(task => ({
          id: task.id,
          topic: task.topic,
          contract: task.offer_id,
          description: task.description
        }));
        setTasks(tasksData);
        setFilteredTasks(tasksData);
      } catch (error) {
        console.error('Ошибка при загрузке задач:', error);
        setError('Не удалось загрузить задачи. Попробуйте позже.');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleSearch = (query) => {
    setError('');

    if (!query.trim()) {
      setFilteredTasks(tasks);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const filtered = tasks.filter(task =>
      task.id.toString().includes(lowerQuery)
    );

    if (filtered.length === 0) {
      setError('Задача с таким номером не найдена');
    }

    setFilteredTasks(filtered);
  };

  if (loading) return <div>Загрузка...</div>;

  return (
    <div className="tasks-page">
      <MySearch placeholder="Введите номер задачи (CRM)" onSearch={handleSearch} />
      {error && <div style={{ color: 'red', marginTop: '1rem' }}>{error}</div>}
      <TasksTable data={filteredTasks} />
    </div>
  );
};

export default Tasks;
