"use client";

import React, { useEffect, useState } from 'react';
import { Box, Typography, MenuItem, Select, Grid, Pagination } from '@mui/material';
import { useSearchParams } from 'next/navigation';
import BookCard from './BookCard';
import { fetchBooks } from '../services/book.service';
// Import the external CSS file
import './BooksContainer.css';

/**
 * BooksContainer component to display a paginated and sortable list of books
 * @returns {JSX.Element} The rendered BooksContainer component
 */
const BooksContainer = () => {
  const [books, setBooks] = useState([]);
  const [totalBooks, setTotalBooks] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(24);
  const [sortBy, setSortBy] = useState('relevance');
  const [search, setSearch] = useState('');
  const searchParams = useSearchParams();

  /**
   * Fetches books from the API based on pagination, sorting, and search parameters
   * @async
   * @returns {Promise<void>}
   */
  const getBooks = async () => {
    try {
      const result = await fetchBooks(page, limit, sortBy, search);
      setBooks(result.books || []);
      setTotalBooks(result.totalRecords || 0);
    } catch (error) {
      console.error('Failed to fetch books:', error);
      setBooks([]);
      setTotalBooks(0);
    }
  };

  /**
   * Syncs state with URL parameters on component mount or when searchParams change
   * @returns {void}
   */
  useEffect(() => {
    const pageParam = parseInt(searchParams.get('page')) || 1;
    const limitParam = parseInt(searchParams.get('limit')) || 24;
    const sortParam = searchParams.get('sortBy') || 'relevance';
    const searchParam = searchParams.get('search') || '';

    setPage(pageParam);
    setLimit(limitParam);
    setSortBy(sortParam);
    setSearch(searchParam);
  }, [searchParams]);

  /**
   * Fetches books when pagination, limit, sort, or search parameters change
   * @returns {void}
   */
  useEffect(() => {
    getBooks();
  }, [page, limit, sortBy, search]);

  /**
   * Updates the URL with current pagination, limit, sort, and search parameters
   * @returns {void}
   */
  useEffect(() => {
    const params = new URLSearchParams();
    params.set('page', page.toString());
    params.set('limit', limit.toString());
    params.set('sortBy', sortBy);
    if (search) params.set('search', search);

    const newUrl = `/dashboard?${params.toString()}`;
    window.history.replaceState({}, '', newUrl);
  }, [page, limit, sortBy, search]);

  /**
   * Handles changing the number of books displayed per page
   * @param {Object} e - The event object
   * @returns {void}
   */
  const handleLimitChange = (e) => {
    const newLimit = parseInt(e.target.value);
    setLimit(newLimit);
    setPage(1); // Reset to first page on limit change
  };

  return (
    <Box sx={{ px: 8, mx: 4.5 }} className="books-container">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: -3 }} className="books-header">
        <Typography variant="h4" sx={{ marginLeft: 8 }} className="books-title">
          Books <Typography variant="caption" className="books-total">({totalBooks} Items)</Typography>
        </Typography>
        <Select
          size="small"
          value={sortBy}
          onChange={(e) => {
            setSortBy(e.target.value);
            setPage(1); // Reset to first page on sort change
          }}
          sx={{ width: 200, marginRight: 8 }}
          className="books-sort"
        >
          <MenuItem value="relevance">Sort by relevance</MenuItem>
          <MenuItem value="price_low_to_high">Price: Low to High</MenuItem>
          <MenuItem value="price_high_to_low">Price: High to Low</MenuItem>
          <MenuItem value="newest_arrivals">Newest Arrivals</MenuItem>
        </Select>
      </Box>

      <Grid container spacing={3} sx={{ justifyContent: 'center', mt: 10 }} className="books-grid">
        {books.length > 0 ? (
          books.map((book) => (
            <Grid item xs={12} sm={6} md={3} key={book.id} className="books-grid-item">
              <BookCard book={book} />
            </Grid>
          ))
        ) : (
          <Typography variant="h6" sx={{ textAlign: 'center', width: '100%' }} className="books-no-results">
            No books found.
          </Typography>
        )}
      </Grid>

      {/* Pagination */}
      <Box sx={{ mt: 8, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2 }} className="books-pagination">
        <Pagination
          count={Math.ceil(totalBooks / limit)}
          page={page}
          onChange={(e, value) => setPage(value)}
          shape="rounded"
          color="primary"
          sx={{
            '& .Mui-selected': {
              backgroundColor: '#8B0000 !important',
              color: '#fff',
            },
          }}
          className="books-pagination-control"
        />
        <Select
          size="small"
          value={limit}
          color="#8B0000"
          onChange={handleLimitChange}
          sx={{ width: 100, marginLeft: 2 }}
          className="books-limit"
        >
          <MenuItem value={4}>4</MenuItem>
          <MenuItem value={8}>8</MenuItem>
          <MenuItem value={16}>16</MenuItem>
          <MenuItem value={24}>24</MenuItem>
          <MenuItem value={32}>32</MenuItem>
          <MenuItem value={48}>48</MenuItem>
        </Select>
      </Box>
    </Box>
  );
};

export default BooksContainer;