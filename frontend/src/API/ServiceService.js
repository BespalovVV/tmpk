import api from "./axiosInstance";

export default class ServiceService {
  static async getAll() {
    const res = await api.get("services");
    return res.data;
  }

  static async getById(services_id) {
    const res = await api.get(`/services/${services_id}`);
    return res.data;
  }
  static async getByIdOf(offer_id) {
    const res = await api.get(`/services-for-offer/${offer_id}`);
    return res.data;
  }
}
