// src/services/customization.service.ts
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000';

/**
 * Fetch all customizations.
 */
export const getCustomizations = async () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Unauthorized: No token found.');

  const response = await axios.get(`${API_URL}/customizations/customize`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data;
};

/**
 * Create a new customization.
 */
export const createCustomization = async (payload: {
    weapon_id: number;
    parts: number[];
  }) => {
    try {
      const response = await axios.post("/customization/customize", payload);
      return response.data; // Assuming the API returns the created customization
    } catch (error) {
      console.error("Failed to create customization:", error);
      throw error;
    }
  };

/**
 * Send a customization to the printer.
 */
export const printCustomization = async (customizationId: number) => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Unauthorized: No token found.');

  const response = await axios.post(
    `${API_URL}/print_jobs/print?customization_id=${customizationId}`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return response.data;
};


