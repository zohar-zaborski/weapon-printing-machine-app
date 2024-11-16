import axios from 'axios';
import { tokenAtom } from '../atoms/authAtoms';
import { getDefaultStore } from 'jotai';
import { Part } from '../types';

const API_URL = 'http://127.0.0.1:8000/weapons/parts'; // Base API URL for parts
const store = getDefaultStore();

/**
 * Fetch all parts from the backend.
 * @returns A promise resolving to an array of parts.
 */
export const getParts = async (): Promise<Part[]> => {
    const token = localStorage.getItem('token'); // Retrieve token from state
  if (!token) {
    throw new Error('Unauthorized: No token found.');
  }

  const response = await axios.get('http://127.0.0.1:8000/weapons/parts', {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data; // Return the fetched parts
};

