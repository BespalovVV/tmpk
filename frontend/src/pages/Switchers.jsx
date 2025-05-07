import React, { useState } from 'react';
import MyButton from '../components/UI/button/MyButton';
import MySearch from '../components/UI/search/MySearch';
import SwitcherTable from '../components/SwitcherTable';
import SwitchService from '../API/SwitchService';
import PortService from '../API/PortService';
import AddressService from '../API/AddressService';

const Switchers = () => {
  const [activeSearch, setActiveSearch] = useState('ip'); 
  const [query, setQuery] = useState('');
  const [switchData, setSwitchData] = useState(null);
  const [error, setError] = useState('');

   const isValidIp = (ip) => {
     const ipRegex = /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/;
     return ipRegex.test(ip);
   };
  
  const handleSearch = async (query) => {
    setError('');
    setSwitchData(null);
  
    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      setError('Введите значение для поиска');
      return;
    }
  
    try {
      if (activeSearch === 'ip') {
        if (!isValidIp(trimmedQuery)) {
          setError('Введите корректный IP-адрес');
          return;
        }
  
        let data;
        try {
          data = await SwitchService.getByIp(trimmedQuery);
        } catch (e) {
          console.error(e);
          setError('Не найден коммутатор по IP-адресу');
          return;
        }
  
        const allPorts = await PortService.getAll();
        const relatedPorts = allPorts.filter(p => p.switch_id === data.id).map(p => p.number);
  
        setSwitchData({
          name_com: data.name_com,
          IP: data.IP,
          ports: relatedPorts,
        });
  
      } else {
        const allAddresses = await AddressService.getAll();
        const normalized = trimmedQuery.toLowerCase().replace(/\s/g, '');
        const foundAddress = allAddresses.find(a =>
          a.address.toLowerCase().replace(/\s/g, '').includes(normalized)
        );
  
        if (!foundAddress) {
          setError('Адрес не найден');
          return;
        }
  
        const name_sw = await SwitchService.getById(foundAddress.com_id);
        if (!name_sw) {
          setError('Коммутатор по этому адресу не найден');
          return;
        }
  
        const allPorts = await PortService.getAll();
        const relatedPorts = allPorts.filter(p => p.switch_id === name_sw.id).map(p => p.number);
  
        setSwitchData({
          name_com: name_sw.name_com,
          IP: name_sw.IP,
          ports: relatedPorts,
        });
      }
  
    } catch (err) {
      console.error(err);
      setError('Ошибка при поиске');
    }
  };
  
  

  return (
    <div className="switchers-page">
      <div className="search-toggle">
        <MyButton
          className={`button-toggle ${activeSearch === 'ip' ? 'button-toggle_active' : ''}`}
          type="button"
          onClick={() => setActiveSearch('ip')}
        >
          Поиск по IP-адресу
        </MyButton>

        <MyButton
          className={`button-toggle ${activeSearch === 'address' ? 'button-toggle_active' : ''}`}
          type="button"
          onClick={() => setActiveSearch('address')}
        >
          Поиск по фактическому адресу
        </MyButton>
      </div>

      <MySearch 
        placeholder={activeSearch === 'ip' ? 'Введите IP-адрес' : 'Введите фактический адрес'}
        value={query}
        onChange={e => setQuery(e.target.value)}
        onSearch={handleSearch}
      />

      {error && <div style={{ color: 'red', marginTop: '1rem' }}>{error}</div>}

      {switchData && (
        <SwitcherTable 
          switchName={switchData.name_com}
          switchIp={switchData.IP}
          portNumbers={switchData.ports}
        />
      )}
    </div>
  );
};

export default Switchers;
