import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000/api/v1/customer';

// Add customer details
export const addCustomer = async (customerData) => {
  try {
    const response = await axios.post(
      API_BASE_URL,
      customerData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
    return response.data.data;
  } catch (error) {
    if (error.response?.data?.message === 'jwt expired' || error.response?.data?.message === 'jwt malformed') {
      localStorage.removeItem('token');
      window.location.href = '/auth/user';
    }
    console.error('Error adding customer details:', error);
    throw error;
  }
};

// Fetch customer details
export const getCustomers = async () => {
  try {
    const response = await axios.get(API_BASE_URL, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data.data;
  } catch (error) {
    if (error.response?.data?.message === 'jwt expired' || error.response?.data?.message === 'jwt malformed') {
      localStorage.removeItem('token');
      window.location.href = '/auth/user';
    }
    console.error('Error fetching customer details:', error);
    return [];
  }
};