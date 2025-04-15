import api from "./axiosInstance";

export default class OffersService {
  static async getAll() {
    const res = await api.get("offers");
    return res.data;
  }

  static async getById(offer_id) {
    const res = await api.get(`/offers/${offer_id}`);
    return res.data;
  }  
}
