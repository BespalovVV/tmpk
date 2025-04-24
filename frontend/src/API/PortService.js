import api from "./axiosInstance";

export default class PortService {
  static async getAll() {
    const res = await api.get("ports");
    return res.data;
  }

  static async getById(port_id) {
    const res = await api.get(`/ports/${port_id}`);
    return res.data;
  }  
}
