import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000/api/v1/wishlist';

// Add book to wishlist
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

// Fetch wishlist items with book details
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

// Remove item from wishlist (using update endpoint as per backend)
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

// Clear wishlist
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