import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000/api/v1/order';

// Place an order
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

// Fetch all orders
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