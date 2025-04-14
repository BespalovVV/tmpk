import api from "./axiosInstance";

export default class TaskService {
  static async getAll() {
    const res = await api.get("tasks");
    return res.data;
  }

  static async getById(task_id) {
    const res = await api.get(`/tasks/${task_id}`);
    return res.data;
  }  
}
