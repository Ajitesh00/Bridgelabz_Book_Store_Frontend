import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000/api/v1/wishlist';

/**
 * Adds a book to the user's wishlist.
 * @param {string} bookId - The ID of the book to add to the wishlist.
 * @returns {Promise<Object>} A promise that resolves to the API response data.
 * @throws {Error} If the request fails or the token is invalid/expired.
 */
export const addToWishlist = async (bookId) => {
  try {
    const response = await axios.post(
      API_BASE_URL,
      { book_id: bookId },
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
    console.error('Error adding to wishlist:', error);
    throw error;
  }
};

/**
 * Fetches the user's wishlist with book details.
 * @returns {Promise<Array>} A promise that resolves to an array of wishlist items or an empty array if the request fails.
 * @throws {Error} If the token is invalid/expired (redirects to login).
 */
export const getWishlist = async () => {
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
    console.error('Error fetching wishlist:', error);
    return [];
  }
};

/**
 * Removes an item from the user's wishlist.
 * @param {string} wishlistItemId - The ID of the wishlist item to remove.
 * @returns {Promise<Object>} A promise that resolves to the API response data.
 * @throws {Error} If the request fails or the token is invalid/expired.
 */
export const removeFromWishlist = async (wishlistItemId) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${wishlistItemId}`, {}, {
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
    console.error('Error removing from wishlist:', error);
    throw error;
  }
};

/**
 * Clears all items from the user's wishlist.
 * @returns {Promise<Object>} A promise that resolves to the API response data.
 * @throws {Error} If the request fails or the token is invalid/expired.
 */
export const clearWishlist = async () => {
  try {
    const response = await axios.delete(API_BASE_URL, {
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
    console.error('Error clearing wishlist:', error);
    throw error;
  }
};