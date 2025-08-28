import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000/api/v1/cart';

/**
 * Adds a book to the cart with a default quantity of 1
 * @async
 * @param {string} bookId - The ID of the book to add to the cart
 * @returns {Promise<Object>} The response data from the API
 * @throws {Error} If the API request fails
 */
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

/**
 * Fetches all cart items with book details
 * @async
 * @returns {Promise<Array>} An array of cart items
 * @throws {Error} If the API request fails
 */
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

/**
 * Updates the quantity of a cart item
 * @async
 * @param {string} cartItemId - The ID of the cart item to update
 * @param {Object} body - The request body containing the new quantity
 * @returns {Promise<Object>} The updated cart item data
 * @throws {Error} If the API request fails
 */
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

/**
 * Removes an item from the cart
 * @async
 * @param {string} cartItemId - The ID of the cart item to remove
 * @returns {Promise<Object>} The response data from the API
 * @throws {Error} If the API request fails
 */
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