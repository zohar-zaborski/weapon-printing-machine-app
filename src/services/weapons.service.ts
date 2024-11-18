import axios from 'axios';
const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

export const getWeapons = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Unauthorized: No token found.');
    }
  
    const response = await axios.get(`${REACT_APP_API_URL}/weapons/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  
    return response.data; 
  };
  
  
 
  