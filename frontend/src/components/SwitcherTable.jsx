import React from 'react';
import '../styles/SearchTables.css'; 

const SubscriberTable = ({ 
  switchName, switchIp, portNumbers
}) => {
  return (
    <div className="subscriber-table">
        <table>
            <thead>
            <tr>
                <th>Наименование коммутатора</th>
                <th>IP-адрес коммутатора</th>
                <th>Номера портов</th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td data-label="Коммутатор">{switchName}</td>
                <td data-label="IP-адрес">{switchIp}</td>
                <td className="td-list" data-label="Порт">
                    <ul className="ports-list">
                        {portNumbers.map((portNumber) => (
                            <li>{portNumber}</li>
                        ))}
                    </ul>
                </td>
            </tr>
            </tbody>
        </table>
    </div>
  );
};

export default SubscriberTable;