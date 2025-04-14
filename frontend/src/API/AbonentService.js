import api from "./axiosInstance";

export default class AbonentService {
  static async getAll() {
    const res = await api.get("abons");
    return res.data;
  }

  static async getByPhone(phone_number) {
    const res = await api.get(`abons/phone/${phone_number}`);
    return res.data;
  }

  static async getById(abon_id) {
    const res = await api.get(`/abons/${abon_id}`);
    return res.data;
  }  
}
