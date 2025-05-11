import React, { useState } from 'react';
import SearchInput from '../components/UI/search/MySearch';
import SubscriberTable from '../components/SubscriberTable.jsx';
import OffersService from '../API/OffersService';
import SwitchService from '../API/SwitchService';
import AddressService from '../API/AddressService';
import AbonentService from '../API/AbonentService';
import PortService from '../API/PortService.js';
import ServiceService from '../API/ServiceService.js';
import formatPhone from '../utils/formatPh.js'

const Abonents = () => {
  const [subscriber, setSubscriber] = useState(null);
  const [error, setError] = useState('');

  const handleSearch = async (query) => {
    setError('');
    setSubscriber(null);

    try {
      if (/^\d+$/.test(query)) {
        const data = await OffersService.getById(query);
        const address = await AddressService.getById(data.address_id)
        const abon = await AbonentService.getById(data.abon_id)
        const switches = await SwitchService.getById(address.com_id)
        const ports = await PortService.getAll()
        const port = ports.find((p) => p.switch_id === address.com_id)
        const servicesIds = await ServiceService.getByIdOf(data.id)
        const services = [];
        for (let id of servicesIds) {
          const service = await ServiceService.getById(id);
          services.push(service.name_service);
        }

        setSubscriber({
          id: data.id,
          status: abon.status || 'Статус неизвестен',
          fullName: data.abon_name,
          address: address.address,
          phone: formatPhone(data.phone),
          services: services.length ? services : ['—'],
          switchName: switches.name_com || '—',
          switchIp: switches.IP || '—',
          portNumber: port.number || '—',
        });
      } else if (/^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/.test(query)) {
        const sw = await SwitchService.getByIp(query);
        const allAddresses = await AddressService.getAll();
        const address = allAddresses.find(a => a.com_id === sw.id);
        if (!address) {
          setError('Нет адресов, подключённых к этому коммутатору');
          return;
        }
  
        const allOffers = await OffersService.getAll();
        const offer = allOffers.find(o => o.address_id === address.id);
  
        if (!offer) {
          setError('Не найден договор по IP-адресу');
          return;
        }
        const abon = await AbonentService.getById(offer.abon_id);
        const servicesIds = await ServiceService.getByIdOf(offer.id)
        const services = [];
        for (let id of servicesIds) {
          const service = await ServiceService.getById(id);
          services.push(service.name_service);
        }
  
        const ports = await PortService.getAll();
        const port = ports.find((p) => p.switch_id === sw.id);
  
  
        setSubscriber({
          id: offer.id,
          status: abon.status || 'Статус неизвестен',
          fullName: offer.abon_name,
          address: address.address,
          phone: formatPhone(offer.phone),
          services: services.length ? services : ['—'],
          switchName: sw.name_com || '—',
          switchIp: sw.IP || '—',
          portNumber: port?.number || '—',
        });
      } else {
        setError('Введите корректный ID или IP-адрес');
      }
    } catch (err) {
      setError('Данные не найдены');
    }
  };

  return (
    <div className="abonents-page">
      <SearchInput placeholder="Введите ID договора или IP-адрес" onSearch={handleSearch} />
      {error && <div style={{ color: 'red', marginTop: '1rem' }}>{error}</div>}
      {subscriber && <SubscriberTable {...subscriber} />}
    </div>
  );
};

export default Abonents;
