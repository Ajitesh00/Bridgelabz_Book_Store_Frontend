import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000/api/v1/book';

export const fetchBooks = async (page = 1, limit = 8, sortBy = 'relevance', search = '' ) => {
  try {
    console.log(`Fetching books: page=${page}, limit=${limit}, sortBy=${sortBy}, search=${search}`);

    const response = await axios.get('http://localhost:4000/api/v1/book', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      params: {
        page,
        limit,
        sortBy,
        search
      }
    });

    console.log('API response:', response.data);

    return response.data.data;
  } catch (error) {
    // If token is expired, clear it and redirect to login
    if (error.response?.data?.message === 'jwt expired' || error.response?.data?.message === 'jwt malformed') {
      localStorage.removeItem('token');
      window.location.href = '/auth/user'; // On your login route
    }

    console.error('Error fetching books:', error);
    return { books: [], totalRecords: 0 };
  }
};

export const fetchBookById = async (id) => {
  try {
    console.log(`Fetching book with id: ${id}`);

    const response = await axios.get(`${API_BASE_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });

    console.log('Book API response:', response.data);

    return response.data.data.data || null;
  } catch (error) {
    // If token is expired, clear it and redirect to login
    if (error.response?.data?.message === 'jwt expired' || error.response?.data?.message === 'jwt malformed') {
      localStorage.removeItem('token');
      window.location.href = '/auth/user';
    }

    console.error('Error fetching book by ID:', error);
    return null;
  }
};