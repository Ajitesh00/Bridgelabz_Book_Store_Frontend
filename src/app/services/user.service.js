// services/authService.js
import axios from 'axios';

const BASE_URL = 'http://localhost:4000/api/v1';

// Login Service
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

// Register Service
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
