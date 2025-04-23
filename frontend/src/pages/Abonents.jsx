import React from 'react';
import MySearch from '../components/UI/search/MySearch';
import SubscriberTable from '../components/SubscriberTable.jsx'

const Abonents = () => {
  return (
    <div className="abonents-page">
      <MySearch placeholder="Введите ID договора IP или MAC-address"></MySearch>
      <SubscriberTable
        id="1"
        status="Подключён"
        fullName="Иванов Иван Иванович"
        address={"г.Дубна, ул.Энтузиастов, 19/1, кв.18"}
        phone="+7(999)999-99-99"
        services={["Максимальный+HD", "Интернет"]}
        switchName="TL"
        switchIp="000.000.0.0"
        portNumber="0"
      />
    </div>
  );
};

export default Abonents;