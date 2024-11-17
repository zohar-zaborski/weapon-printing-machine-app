import axios from 'axios';
const API_URL = 'http://127.0.0.1:8000/';



/**
 * Fetches the list of weapons from the backend.
 * @returns A promise resolving to the weapons data.
 */
export const getWeapons = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Unauthorized: No token found.');
    }
  
    const response = await axios.get(`${API_URL}weapons/weapons`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  
    return response.data; // The array of weapons
  };
  
  
  export const getWeaponById = async (weaponId: number) => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Unauthorized: No token found.');
  
    const response = await axios.get(`http://127.0.0.1:8000/weapons/${weaponId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  
    return response.data;
  };
  export default {
    getWeaponById,
    getWeapons, // Export the new method
  };
  