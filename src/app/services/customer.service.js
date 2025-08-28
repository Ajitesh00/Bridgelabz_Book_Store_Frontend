import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000/api/v1/customer';

/**
 * Adds customer details to the API
 * @async
 * @param {Object} customerData - The customer data to add
 * @param {string} customerData.full_name - The full name of the customer
 * @param {string} customerData.mobile_number - The mobile number of the customer
 * @param {string} customerData.address - The address of the customer
 * @param {string} customerData.city - The city of the customer
 * @param {string} customerData.state - The state of the customer
 * @returns {Promise<Object>} The response data from the API
 * @throws {Error} If the API request fails
 */
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

/**
 * Fetches all customer details from the API
 * @async
 * @returns {Promise<Array>} An array of customer details
 * @throws {Error} If the API request fails
 */
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