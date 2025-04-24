import React from 'react';
import '../styles/SearchTables.css'; 
import MyButton from './UI/button/MyButton';

const SubscriberTable = ({ 
  id, status, fullName, address, phone, services,
  switchName, switchIp, portNumber 
}) => {
  return (
    <div className="subscriber-table">
      <table>
        <thead>
          <tr>
            <th>ID договора</th>
            <th>Статус</th>
            <th>ФИО</th>
            <th>Адрес</th>
            <th>Телефон</th>
            <th>Подключенные услуги</th>
            <th>Наименование коммутатора</th>
            <th>IP-адрес коммутатора</th>
            <th>Номер порта</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{id}</td>
            <td>{status}</td>
            <td>{fullName}</td>
            <td className="address-column">{address}</td>
            <td>{phone}</td>
            <td className='td-list'>
              <ul className="services-list">
                {services.map((service, index) => (
                  <li key={index}>{service}</li>
                ))}
              </ul>
            </td>
            <td>{switchName}</td>
            <td>{switchIp}</td>
            <td>{portNumber}</td>
          </tr>
        </tbody>
      </table>

      <div className="options-buttons">
        <MyButton className="primary-button" type="button">Ethernet</MyButton>
        <MyButton className="primary-button" type="button">Получить ссылки на задачи по абоненту в Битрикс24</MyButton>
        <MyButton className="primary-button" type="button">Оплата СБП</MyButton>
      </div>
    </div>
  );
};

export default SubscriberTable;