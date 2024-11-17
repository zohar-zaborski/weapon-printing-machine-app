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
      // Retrieve the token from localStorage or sessionStorage
      const token = localStorage.getItem("token"); // Assuming you store the token in localStorage
      if (!token) {
        throw new Error("Authentication token is missing. Please log in again.");
      }
  
      // Make the POST request with the token included in the headers
      const response = await axios.post(
        `${API_URL}/customizations/customize`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add the token to the Authorization header
          },
        }
      );
  
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

export const deleteCustomization = async (customizationId: number) => {
    try {
      const token = localStorage.getItem('token'); // Retrieve the token from local storage
      if (!token) {
        throw new Error('Authentication token is missing');
      }
  
      const config = {
        headers: {
          Authorization: `Bearer ${token}`, // Add the token to the Authorization header
        },
      };
  
      await axios.delete(`${API_URL}/customizations/customize/${customizationId}`, config);
    } catch (error) {
      console.error('Failed to delete customization:', error);
      throw error;
    }
  };

