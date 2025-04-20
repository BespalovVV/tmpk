import React from 'react';
import MySearch from '../components/UI/search/MySearch';

const Abonents = () => {
  return (
    <div className="abonents-page">
        <MySearch placeholder="Введите ID договора IP или MAC-address"></MySearch>
    </div>
  );
};

export default Abonents;
