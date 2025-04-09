import axios from "axios";
import Endpoint from "./Endpoints";

export default class UserService{
    static async getAll(){
        const response = await axios.get('http://127.0.0.1:8000/api/v1/users')
        return response.data
    }
}