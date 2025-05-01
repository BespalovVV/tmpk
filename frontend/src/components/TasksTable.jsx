import '../styles/SearchTables.css'; 

const SubscriberTable = ({ data }) => {
  return (
    <div className="subscriber-table">
      <table>
        <thead>
          <tr>
            <th>ID задачи</th>
            <th>Тема</th>
            <th>Номер договора</th>
            <th>Описание</th>
          </tr>
        </thead>
        <tbody>
          {data.map(sub => (
              <tr className="summary-row">
                <td data-label="Задача">{sub.id}</td>
                <td data-label="Тема">{sub.topic}</td>
                <td data-label="Договор">{sub.contract}</td>
                <td data-label="Описание">{sub.description}</td>
              </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SubscriberTable;
