import axios from 'axios';
import { Part } from '../types';
const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

export const getParts = async (): Promise<Part[]> => {
    const token = localStorage.getItem('token'); 
  if (!token) {
    throw new Error('Unauthorized: No token found.');
  }

  const response = await axios.get(`${REACT_APP_API_URL}/weapons/parts`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data; 
};

