import axios from 'axios';
import { getDefaultStore } from 'jotai';
import { tokenAtom, authAtom } from '../atoms/authAtoms';
import qs from 'qs'; // Install this with `npm install qs` if not already

const API_URL = 'http://127.0.0.1:8000/';

/**
 * Validates a JWT token by decoding it and checking its expiration.
 * @param token - The JWT token to validate.
 * @returns True if the token is valid; otherwise, false.
 */
const isTokenValid = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1])); // Decode the JWT payload
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    return payload.exp > currentTime; // Check if the token is not expired
  } catch (error) {
    console.error('Invalid token:', error);
    return false; // Token is malformed
  }
};

// Get the default Jotai store
const store = getDefaultStore();

/**
 * Registers a new user with the given username, email, and password.
 * @param username - The username for the new user.
 * @param email - The email for the new user.
 * @param password - The password for the new user.
 * @returns A promise resolving with the server response.
 */
const register = async (username: string, email: string, password: string) => {
  console.log('Register Payload:', { username, email, password });

  return axios.post(
    `${API_URL}auth/register`,
    { username, email, password },
    {
      headers: {
        'Content-Type': 'application/json', // Backend expects JSON payload
      },
    }
  ).then(response => {
    console.log('Registration Response:', response.data);
    return response.data;
  }).catch(error => {
    console.error('Registration Error:', error.response?.data || error.message);
    throw error;
  });
};


/**
 * Logs in the user with the given credentials.
 * If the token received is valid, it is stored and authentication state is updated.
 * @param username - The user's username.
 * @param password - The user's password.
 * @returns A promise resolving with the server response.
 */
const login = async (username: string, password: string) => {
  const response = await axios.post(
    `${API_URL}auth/token`,
    qs.stringify({ username, password }), // Use form-urlencoded format
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded', // Backend expects form-encoded data
      },
    }
  );

  const { access_token, token_type } = response.data;

  if (access_token && isTokenValid(access_token)) {
    // Store the valid token and update authentication state
    localStorage.setItem('token', access_token);
    store.set(tokenAtom, access_token);
    store.set(authAtom, true);
  } else {
    // Handle invalid token
    localStorage.removeItem('token');
    store.set(tokenAtom, null);
    store.set(authAtom, false);
    throw new Error('Invalid token received from server.');
  }

  return response.data; // Includes access_token and token_type
};

/**
 * Logs out the user by clearing the token and resetting authentication state.
 */
const logout = () => {
  localStorage.removeItem('token');
  store.set(tokenAtom, null);
  store.set(authAtom, false);
};

/**
 * Fetches a protected resource from the server using the stored token.
 * @param endpoint - The endpoint for the protected resource.
 * @returns A promise resolving with the server response.
 */
const getProtectedResource = async (endpoint: string) => {
  const token = localStorage.getItem('token');
  if (!token || !isTokenValid(token)) {
    throw new Error('Unauthorized: Invalid or expired token.');
  }

  return axios.get(`${API_URL}/${endpoint}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};


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
    register,
    login,
    logout,
    getProtectedResource,
  
  };
  