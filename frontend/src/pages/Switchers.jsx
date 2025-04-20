import React, { useState } from 'react';
import MyButton from '../components/UI/button/MyButton';
import MySearch from '../components/UI/search/MySearch';
import '../styles/Switchers.css';

const Switchers = () => {
  const [activeSearch, setActiveSearch] = useState('ip'); 

  return (
    <div className="switchers-page">
      <div className="search-toggle">
        <MyButton
          className={`secondary-button button-toggle ${activeSearch === 'ip' ? 'button-toggle_active' : ''}`}
          type="button"
          onClick={() => setActiveSearch('ip')}
        >
          Поиск по IP-адресу
        </MyButton>

        <MyButton
          className={`secondary-button button-toggle ${activeSearch === 'address' ? 'button-toggle_active' : ''}`}
          type="button"
          onClick={() => setActiveSearch('address')}
        >
          Поиск по фактическому адресу
        </MyButton>
      </div>

      {activeSearch === 'ip' && (
        <MySearch placeholder="Введите IP-адрес" />
      )}

      {activeSearch === 'address' && (
        <MySearch placeholder="Введите фактический адрес" />
      )}
    </div>
  );
};

export default Switchers;