import React, { useState } from 'react';
import SearchInput from '../components/UI/search/MySearch';
import SubscriberTable from '../components/SubscriberTable.jsx';
import OffersService from '../API/OffersService';
import SwitchService from '../API/SwitchService';
import AddressService from '../API/AddressService';
import AbonentService from '../API/AbonentService';
import PortService from '../API/PortService.js';
import Offers_sService from '../API/Offers_sService.js';
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
        const services = await Offers_sService.getAll()
        const service = services.find((p) => p)

        setSubscriber({
          id: data.id,
          status: port.status_link || 'Статус неизвестен',
          fullName: data.abon_name,
          address: address.address,
          phone: formatPhone(data.phone),
          services: data.services || ['-'],
          switchName: switches.name_com || '—',
          switchIp: switches.IP || '—',
          portNumber: port.number || '—',
        });
      } else if (/^\d{1,3}(\.\d{1,3}){3}$/.test(query)) {
        const sw = await SwitchService.getByIp(query);
        console.log(sw)
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
  
        const ports = await PortService.getAll();
        const port = ports.find((p) => p.switch_id === sw.id);
  
  
        setSubscriber({
          id: offer.id,
          status: port?.status_link || 'Статус неизвестен',
          fullName: offer.abon_name,
          address: address.address,
          phone: formatPhone(offer.phone),
          services:  ['—'],
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
