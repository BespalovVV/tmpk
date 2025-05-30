import React, { useState } from 'react';
import '../styles/SearchTables.css'; 
import MyButton from './UI/button/MyButton';

const SubscriberTable = ({ data }) => {
  const [selectedId, setSelectedId] = useState(null);

  const toggleRow = (id) => {
    setSelectedId(selectedId === id ? null : id);
  };

  return (
    <div className="subscriber-table">
      <table>
        <thead>
          <tr>
            <th>ID договора</th>
            <th>ФИО</th>
            <th>Адрес</th>
          </tr>
        </thead>
        <tbody>
          {data.map(sub => (
            <React.Fragment key={sub.id}>
              <tr onClick={() => toggleRow(sub.id)} className={`summary-row ${selectedId === sub.id ? 'no-border' : ''}`}>
                <td data-label="Договор">{sub.id}</td>
                <td data-label="ФИО">{sub.fullName}</td>
                <td className="address-column" data-label="Адрес">{sub.address}</td>
              </tr>
              {selectedId === sub.id && (
                <tr className="details-row">
                  <td colSpan="100%">
                    <table className="details-table">
                      <thead>
                      <tr>
                        <th>Статус</th>
                        <th>Телефон</th>
                        <th>Подключенные услуги</th>
                        <th>Наименование коммутатора</th>
                        <th>IP-адрес коммутатора</th>
                        <th>Номер порта</th>
                      </tr>
                      </thead>

                      <tbody>
                      <tr>
                        <td data-label="Статус">{sub.status}</td>
                        <td data-label="Телефон">{sub.phone}</td>
                        <td className="td-list" data-label="Услуги">
                          <ul className="services-list">
                            {sub.services.map((service, index) => (
                              <li key={index}>{service}</li>
                            ))}
                          </ul>
                        </td>
                        <td data-label="Коммутатор">{sub.switchName}</td>
                        <td data-label="IP-адрес">{sub.switchIp}</td>
                        <td data-label="Порт">{sub.portNumber}</td>
                      </tr>
                      <tr className="buttons-row">
                        <td colSpan="6">
                          <div className="buttons options-buttons action-buttons" colSpan="100%">
                            <MyButton className="primary-button" type="button">Ethernet</MyButton>
                            <MyButton className="primary-button" type="button">Получить ссылки на задачи по абоненту в Битрикс24</MyButton>
                            <MyButton className="primary-button" type="button">Оплата СБП</MyButton>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SubscriberTable;
