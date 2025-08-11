import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000/api/v1/cart';

// Add book to cart with quantity 1
export const addToCart = async (bookId) => {
  try {
    const response = await axios.post(
      API_BASE_URL,
      { book_id: bookId, quantity: 1 },
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
    console.error('Error adding to cart:', error);
    throw error;
  }
};

// Fetch cart items with book details
export const getCart = async () => {
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
    console.error('Error fetching cart:', error);
    return [];
  }
};

// Update cart item quantity
export const updateCart = async (cartItemId, body) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${cartItemId}`, body, {
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
    console.error('Error updating cart:', error);
    throw error;
  }
};

// Remove item from cart
export const removeFromCart = async (cartItemId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/${cartItemId}`, {
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
    console.error('Error removing from cart:', error);
    throw error;
  }
};