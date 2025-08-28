import axios from 'axios';

const BASE_URL = 'http://localhost:4000/api/v1';

/**
 * Logs in a user with the specified role and input credentials.
 * @param {string} role - The role of the user (e.g., 'admin', 'user').
 * @param {Object} input - The user credentials (e.g., { email, password }).
 * @returns {Promise<Object>} A promise that resolves to the API response.
 * @throws {Error} If the login request fails.
 */
export const loginUser = async (role, input) => {
  try {
    const response = await axios.post(`${BASE_URL}/${role}/login`, input, {
      validateStatus: (status) => status >= 200 && status < 600,
    });
    return response;
  } catch (error) {
    console.error('Login API Error:', error);
    throw error;
  }
};

/**
 * Registers a new user with the specified role and input data.
 * @param {string} role - The role of the user (e.g., 'admin', 'user').
 * @param {Object} input - The user registration data (e.g., { email, password, name }).
 * @returns {Promise<Object>} A promise that resolves to the API response.
 * @throws {Error} If the registration request fails.
 */
export const registerUser = async (role, input) => {
  try {
    const response = await axios.post(`${BASE_URL}/${role}/register`, input, {
      validateStatus: (status) => status >= 200 && status < 600,
    });
    return response;
  } catch (error) {
    console.error('Register API Error:', error);
    throw error;
  }
};