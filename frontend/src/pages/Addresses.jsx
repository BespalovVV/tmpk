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

    try {
      const normalized = query.toLowerCase().replace(/\s/g, '');
      const allAddresses = await AddressService.getAll();
      const foundAddress = allAddresses.find(a =>
        a.address.toLowerCase().replace(/\s/g, '').includes(normalized)
      );

      if (!foundAddress) {
        setError('Адрес не найден');
        return;
      }

      const offer = (await OffersService.getAll()).find(o => o.address_id === foundAddress.id);

      if (!offer) {
        setError('Договор по этому адресу не найден');
        return;
      }

      const abon = await AbonentService.getById(offer.abon_id);
      const ports = await PortService.getAll();
      const port = ports.find(p => p.switch_id === foundAddress.com_id);

      const sw = await SwitchService.getById(foundAddress.com_id);

      const serviceIds = await ServiceService.getByIdOf(offer.id);
      const services = [];
      for (let id of serviceIds) {
        const service = await ServiceService.getById(id);
        services.push(service.name_service);
      }

      setData([{
        id: offer.id,
        status: abon.status || 'Статус неизвестен',
        fullName: offer.abon_name,
        address: foundAddress.address,
        phone: formatPhone(offer.phone),
        services: services.length ? services : ['—'],
        switchName: sw.name_com || '—',
        switchIp: sw.IP || '—',
        portNumber: port?.number || '—'
      }]);

    } catch (err) {
      console.error(err);
      setError('Ошибка при поиске адреса');
    }
  };

  return (
    <div className="addresses-page">
      <MySearch placeholder="Введите адрес абонента" onSearch={handleSearch} />
      {error && <div style={{ color: 'red', marginTop: '1rem' }}>{error}</div>}
      <AddressTable data={data} />
    </div>
  );
};

export default Addresses;
