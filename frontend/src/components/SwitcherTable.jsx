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
                <td>{switchName}</td>
                <td>{switchIp}</td>
                <td className='td-list'>
                    <ul className="ports-list">
                        {portNumbers.map((portNumber) => (
                            <li key={portNumber}>{portNumber}</li>
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