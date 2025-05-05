import React, { useState } from 'react';
import MySearch from '../components/UI/search/MySearch';
import AddressTable from '../components/AddressTable';
import AddressService from '../API/AddressService';
import OffersService from '../API/OffersService';
import AbonentService from '../API/AbonentService';
import PortService from '../API/PortService';
import SwitchService from '../API/SwitchService';
import ServiceService from '../API/ServiceService';
import formatPhone from '../utils/formatPh';

const Addresses = () => {
  const [error, setError] = useState('');
  const [data, setData] = useState([]);

  const handleSearch = async (query) => {
    setError('');
    setData([]);
  
    const trimmed = query.trim();
    if (!trimmed) {
      setError('Введите адрес');
      return;
    }
  
    try {
      const normalized = trimmed.toLowerCase().replace(/\s/g, '');
      const allAddresses = await AddressService.getAll();
      const matchedAddresses = allAddresses.filter(a =>
        a.address.toLowerCase().replace(/\s/g, '').includes(normalized)
      );
  
      if (matchedAddresses.length === 0) {
        setError('Адрес не найден');
        return;
      }
  
      const allOffers = await OffersService.getAll();
      const allPorts = await PortService.getAll();
  
      const results = await Promise.all(
        matchedAddresses.map(async (address) => {
          const offer = allOffers.find(o => o.address_id === address.id);
          if (!offer) return null;
  
          const abon = await AbonentService.getById(offer.abon_id);
          const port = allPorts.find(p => p.switch_id === address.com_id);
          const sw = await SwitchService.getById(address.com_id);
  
          const serviceIds = await ServiceService.getByIdOf(offer.id);
          const services = await Promise.all(
            serviceIds.map(id => ServiceService.getById(id))
          );
          const serviceNames = services.map(s => s.name_service);
  
          return {
            id: offer.id,
            status: abon.status || 'Статус неизвестен',
            fullName: offer.abon_name,
            address: address.address,
            phone: formatPhone(offer.phone),
            services: serviceNames.length ? serviceNames : ['—'],
            switchName: sw.name_com || '—',
            switchIp: sw.IP || '—',
            portNumber: port?.number || '—'
          };
        })
      );
  
      const filteredResults = results.filter(r => r !== null);
      if (filteredResults.length === 0) {
        setError('Договор по найденным адресам не найден');
      } else {
        setData(filteredResults);
      }
  
    } catch (err) {
      console.error(err);
      setError('Ошибка при поиске адреса');
    }
  };
  ы

  return (
    <div className="addresses-page">
      <MySearch placeholder="Введите адрес абонента" onSearch={handleSearch} />
      {error && <div style={{ color: 'red', marginTop: '1rem' }}>{error}</div>}
      <AddressTable data={data} />
    </div>
  );
};

export default Addresses;
