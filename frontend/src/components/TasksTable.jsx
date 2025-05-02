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
              <tr key={sub.id} className="summary-row">
                <td>{sub.id}</td>
                <td>{sub.topic}</td>
                <td>{sub.contract}</td>
                <td>{sub.description}</td>
              </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SubscriberTable;
