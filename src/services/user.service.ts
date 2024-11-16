import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://127.0.0.1:8000';

const getProtectedResource = () => {
  return axios.get(`${API_URL}/dashboard`, { headers: authHeader() });
};

export default {
  getProtectedResource,
};
