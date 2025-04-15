import api from './axiosInstance';

export default class UserService {
  static async getAll() {
    const res = await api.get("users");
    return res.data;
  }

  static async getByLogin(login) {
    const res = await api.get(`users/login/${login}`);
    return res.data;
  }

  static async getByEmail(email) {
    const res = await api.get(`users/email/${email}`);
    return res.data;
  }

  static async getById(id) {
    const res = await api.get(`/users/${id}`);
    return res.data;
  }  
}
