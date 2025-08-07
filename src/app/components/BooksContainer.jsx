"use client";

import React, { useEffect, useState } from 'react';
import { Box, Typography, MenuItem, Select, Grid, Pagination } from '@mui/material';
import { useSearchParams } from 'next/navigation';
import BookCard from './BookCard';
import { fetchBooks } from '../services/book.service';

const BooksContainer = () => {
  const [books, setBooks] = useState([]);
  const [totalBooks, setTotalBooks] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(24);
  const [sortBy, setSortBy] = useState('relevance');
  const [search, setSearch] = useState('');
  const searchParams = useSearchParams();

  // Fetch books from API
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

  // Sync state with URL parameters
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

  // Fetch books when parameters change
  useEffect(() => {
    getBooks();
  }, [page, limit, sortBy, search]);

  // Update URL when parameters change
  useEffect(() => {
    const params = new URLSearchParams();
    params.set('page', page.toString());
    params.set('limit', limit.toString());
    params.set('sortBy', sortBy);
    if (search) params.set('search', search);

    const newUrl = `/dashboard?${params.toString()}`;
    window.history.replaceState({}, '', newUrl);
  }, [page, limit, sortBy, search]);

  return (
    <Box sx={{ px: 8, mx: 4.5 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: -3 }}>
        <Typography variant="h4" sx={{ marginLeft: 8 }}>
          Books <Typography variant="caption">({totalBooks} Items)</Typography>
        </Typography>
        <Select
          size="small"
          value={sortBy}
          onChange={(e) => {
            setSortBy(e.target.value);
            setPage(1); // Reset to first page on sort change
          }}
          sx={{ width: 200, marginRight: 8 }}
        >
          <MenuItem value="relevance">Sort by relevance</MenuItem>
          <MenuItem value="price_low_to_high">Price: Low to High</MenuItem>
          <MenuItem value="price_high_to_low">Price: High to Low</MenuItem>
          <MenuItem value="newest_arrivals">Newest Arrivals</MenuItem>
        </Select>
      </Box>

      <Grid container spacing={3} sx={{ justifyContent: 'center', mt: 10 }}>
        {books.length > 0 ? (
          books.map((book) => (
            <Grid item xs={12} sm={6} md={3} key={book.id}>
              <BookCard book={book} />
            </Grid>
          ))
        ) : (
          <Typography variant="h6" sx={{ textAlign: 'center', width: '100%' }}>
            No books found.
          </Typography>
        )}
      </Grid>

      {/* Pagination */}
      <Box sx={{ mt: 8, display: 'flex', justifyContent: 'center' }}>
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
        />
      </Box>
    </Box>
  );
};

export default BooksContainer;