// src/services/customization.service.ts
import axios from 'axios';

const REACT_APP_API_URL = process.env.REACT_APP_API_URL;


export const getCustomizations = async () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Unauthorized: No token found.');

  const response = await axios.get(`${REACT_APP_API_URL}/customizations/customize`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data;
};


export const createCustomization = async (payload: {
  weapon_id: number;
  parts: number[];
}) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication token is missing. Please log in again.");
    }

    const response = await axios.post(
      `${REACT_APP_API_URL}/customizations/customize`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Failed to create customization:", error);
    throw error;
  }
};

export const printCustomization = async (customizationId: number) => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Unauthorized: No token found.');

  const response = await axios.post(
    `${REACT_APP_API_URL}/print_jobs/print?customization_id=${customizationId}`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return response.data;
};

export const deleteCustomization = async (customizationId: number) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication token is missing');
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    await axios.delete(`${REACT_APP_API_URL}/customizations/customize/${customizationId}`, config);
  } catch (error) {
    console.error('Failed to delete customization:', error);
    throw error;
  }
};

