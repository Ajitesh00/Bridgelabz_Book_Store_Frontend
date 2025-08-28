import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000/api/v1/order';

/**
 * Places a new order via the API
 * @async
 * @returns {Promise<Object>} The response data from the API containing order details
 * @throws {Error} If the API request fails
 */
export const placeOrder = async () => {
  try {
    const response = await axios.post(
      API_BASE_URL,
      {},
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
    console.error('Error placing order:', error);
    throw error;
  }
};

/**
 * Fetches all orders from the API
 * @async
 * @returns {Promise<Array>} An array of order details
 * @throws {Error} If the API request fails
 */
export const getOrders = async () => {
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
    console.error('Error fetching orders:', error);
    return [];
  }
};