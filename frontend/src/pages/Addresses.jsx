import React from 'react';
import MySearch from '../components/UI/search/MySearch';
import AddressTable from '../components/AddressTable.jsx'

const Addresses = () => {

  const sampleData = [{
    id: "1",
    status: "Подключён",
    fullName: "Иванов Иван Иванович",
    address: "г.Дубна,ул.Энтузиастов, 19/1,кв.18",
    phone: "+7(999)999-99-99",
    services: ["Максимальный+HD", "Интернет"],
    switchName: "TL",
    switchIp: "000.000.0.0",
    portNumber: "0"
  },
  {
    id: "2",
    status: "Подключён",
    fullName: "Иванов Иван Иванович",
    address: "г.Дубна,ул.Энтузиастов, 19/1, кв.18",
    phone: "+7(999)999-99-99",
    services: ["Максимальный+HD", "Интернет"],
    switchName: "TL",
    switchIp: "000.000.0.0",
    portNumber: "0"
  },
  {
    id: "3",
    status: "Подключён",
    fullName: "Иванов Иван Иванович",
    address: "г.Дубна,ул.Энтузиастов, 19/1,кв.18",
    phone: "+7(999)999-99-99",
    services: ["Максимальный+HD", "Интернет"],
    switchName: "TL",
    switchIp: "000.000.0.0",
    portNumber: "0"
  }];

  return (
    <div className="addresses-page">
        <MySearch placeholder="Введите адрес абонента"></MySearch>
        <AddressTable data={sampleData} />
    </div>
  );
};

export default Addresses;
