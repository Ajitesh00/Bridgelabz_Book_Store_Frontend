import React from 'react';
import Header from '../components/Header';
import BooksContainer from '../components/BooksContainer';
import { Box } from '@mui/material';

export default function Dashboard() {
  return (
    <>
      <Header />
      <Box
        sx={{
          p: 4, // Padding on all sides (top, bottom, left, right)
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <Box sx={{ maxWidth: '1400px', width: '100%' }}>
          <BooksContainer />
        </Box>
      </Box>
    </>
  );
}
