import api from "./axiosInstance";

export default class AddressService {
  static async getAll() {
    const res = await api.get("addresses");
    return res.data;
  }

  static async getById(addresses_id) {
    const res = await api.get(`/addresses/${addresses_id}`);
    return res.data;
  }  
}
