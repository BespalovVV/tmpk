import api from "./axiosInstance";

export default class SwitchService {
  static async getAll() {
    const res = await api.get("switches");
    return res.data;
  }

  static async getByIp(switch_ip) {
    const res = await api.get(`switches/ip/${switch_ip}`);
    return res.data;
  }

  static async getById(switch_id) {
    const res = await api.get(`/switches/${switch_id}`);
    return res.data;
  }  
}
