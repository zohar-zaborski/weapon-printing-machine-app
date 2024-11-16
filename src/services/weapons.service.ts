import axios from 'axios';
import { getDefaultStore } from 'jotai';
import { tokenAtom, authAtom } from '../atoms/authAtoms';
import qs from 'qs'; // Install this with `npm install qs` if not already

const API_URL = 'http://127.0.0.1:8000/';



/**
 * Fetches the list of weapons from the backend.
 * @returns A promise resolving to the weapons data.
 */
const getWeapons = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Unauthorized: No token found.');
    }
  
    const response = await axios.get(`${API_URL}weapons/weapons`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  
    return response.data; // The array of weapons
  };
  
  export default {
    
    getWeapons, // Export the new method
  };
  